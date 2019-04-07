const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    ({ limit: this.limit } = options);
    this.counter = 0;
  }

  _transform(chunk, encoding, callback) {
    const error = (this.counter += chunk.length) > this.limit
      ? new LimitExceededError()
      : null;

    callback(error, error ? null : chunk);
  }
}

module.exports = LimitSizeStream;
