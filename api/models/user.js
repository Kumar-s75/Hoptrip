// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    photo: {type: String},
    refreshToken: {type: String},
    lastLogin: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: true},
    preferences: {
      currency: {type: String, default: 'USD'},
      timezone: {type: String, default: 'UTC'},
      notifications: {
        email: {type: Boolean, default: true},
        push: {type: Boolean, default: true},
      }
    }
  },
  {timestamps: true},
);

module.exports = mongoose.model('User', userSchema);
