module.exports = {
  mongodb: {
    uri: 'mongodb://localhost/chat_app',
  },
  password: {
    iterations: 10,
    keyLength: 128,
    digest: 'sha512',
    saltLength: 8,
  },
};
