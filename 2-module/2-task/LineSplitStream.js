const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.incomplete = '';
  }

  _transform(chunk, encoding, next) {
    const lines = (this.incomplete + chunk.toString()).split(os.EOL);
    this.incomplete = lines.pop();
    lines.forEach(line => this.push(line));

    next();
  }

  _flush(done) {
    this.push(this.incomplete);

    done();
  }
}

module.exports = LineSplitStream;
