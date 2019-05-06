const mongoose = require('mongoose');
// const config = require('config');
const config = require('./../config/default');
const get = require('lodash/get');
const crypto = require('crypto');
const connection = require('../libs/connection');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email.',
      },
    ],
    unique: 'Такой email уже существует',
  },
  displayName: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует',
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
}, {
  timestamps: true,
});

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      get(config, 'password.iterations'),
      get(config, 'password.keyLength'),
      get(config, 'password.digest'),
      // config.get('password.iterations'),
      // config.get('password.keyLength'),
      // config.get('password.digest'),
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      }
    );
  });
}

userSchema.methods.setPassword = async function setPassword(password) {
  // this.salt = crypto.randomBytes(config.get('password.saltLength')).toString('hex');
  this.salt = crypto.randomBytes(get(config, 'password.saltLength')).toString('hex');
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function(password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

module.exports = connection.model('User', userSchema);
