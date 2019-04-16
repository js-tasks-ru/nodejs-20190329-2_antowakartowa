const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathItems = url.parse(req.url).pathname.split('/');
  const filepath = path.join(__dirname, 'files', pathItems.slice(-1)[0]);

  let errorCode = req.method !== 'GET' && 500 || pathItems.length > 2 && 400 || false;

  const resErrorMessages = {
    400: 'Invalid Path',
    404: 'File Not Found',
    500: 'Not Implemented',
  };

  const handleError = (code) => {
    res.statusCode = code;
    res.end(resErrorMessages[code]);
  };

  if (errorCode) {
    handleError(errorCode);
  } else {
    const fileStream = fs.createReadStream(filepath);
    fileStream
      .on('error', (error) => {
        errorCode = error.code === 'ENOENT' ? 404 : 500;
        handleError(errorCode);
      })
      .pipe(res);
  }
});

module.exports = server;
