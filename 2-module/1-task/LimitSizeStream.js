const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.counter = 0;
  }

  _transform(chunk, encoding, callback) {
    if ((this.counter += chunk.length) > this.limit) {
      callback(new LimitExceededError());
    }

    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
