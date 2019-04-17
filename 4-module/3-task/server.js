const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathItems = url.parse(req.url).pathname.split('/');
  const filepath = path.join(__dirname, 'files', pathItems.slice(-1)[0]);

  let errorCode = req.method !== 'DELETE' && 501 ||
    pathItems.length > 2 && 400 ||
    false;

  const messages = {
    400: 'Invalid path',
    404: 'File doesn\'t exists',
    500: 'Server error',
    501: 'Not implemented',
    200: 'File deleted',
  };

  const responde = (code) => {
    res.statusCode = code;
    res.setHeader('Connection', 'close');
    res.end(messages[code]);
  };

  if (errorCode) {
    responde(errorCode);
  } else {
    fs.unlink(filepath, (error) => {
      if (error) {
        errorCode = error.code === 'ENOENT' ? 404 : 500;
        responde(errorCode);
      } else {
        responde(200);
      }
    });
  }
});

module.exports = server;
