const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathItems = url.parse(req.url).pathname.split('/');
  const filepath = path.join(__dirname, 'files', pathItems.slice(-1)[0]);

  let errorCode = req.method !== 'POST' && 501 ||
    pathItems.length > 2 && 400 ||
    req.headers['content-length'] > 1e6 && 413 ||
    false;

  const messages = {
    400: 'Invalid path',
    409: 'File already exists',
    413: 'File is too large',
    500: 'Server error',
    501: 'Not implemented',
    201: 'File uploaded succesfully',
  };

  const responde = (code) => {
    res.statusCode = code;
    res.setHeader('Connection', 'close');
    res.end(messages[code]);
  };

  const deleteFile = (path) => {
    fs.unlink(path, () => {});
  };

  const handleLimitError = ({code}) => {
    errorCode = code === 'LIMIT_EXCEEDED' ? 413 : 500;
    responde(errorCode);
    deleteFile(filepath);
  };

  const handleWriteError = ({code}) => {
    errorCode = code === 'EEXIST' ? 409 : 500;
    responde(errorCode);
    if (errorCode === 500) deleteFile(filepath);
  };

  if (errorCode) {
    responde(errorCode);
  } else {
    const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
    const limitStream = new LimitSizeStream({limit: 1048576});

    req
      .pipe(limitStream)
      .on('error', handleLimitError)
      .pipe(writeStream)
      .on('error', handleWriteError)
      .on('close', () => responde(201));

    res.on('close', () => {
      if (!res.finished) deleteFile(filepath);
    });
  }
});

module.exports = server;
