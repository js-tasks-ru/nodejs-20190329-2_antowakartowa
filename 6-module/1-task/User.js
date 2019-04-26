const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'Email is required',
    unique: 'This Email already exists',
    match: '/^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/',
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: 'Display name is required',
    index: true,
    trim: true,
  },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
