const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  fitnessGoal: String,
  points: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


