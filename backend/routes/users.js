const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    fitnessGoal: user.fitnessGoal,
    points: user.points
  });
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, email, age, gender, height, weight, fitnessGoal } = req.body || {};
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (age !== undefined) updates.age = age;
  if (gender !== undefined) updates.gender = gender;
  if (height !== undefined) updates.height = height;
  if (weight !== undefined) updates.weight = weight;
  if (fitnessGoal !== undefined) updates.fitnessGoal = fitnessGoal;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    fitnessGoal: user.fitnessGoal,
    points: user.points
  });
});

module.exports = router;