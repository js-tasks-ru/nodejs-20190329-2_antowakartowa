const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: (value) => /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/g.test(value),
        message: () => 'Invalid email',
      },
    ],
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
