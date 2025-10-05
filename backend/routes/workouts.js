const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// Get all workouts for a user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create workout
router.post('/', auth, async (req, res) => {
  try {
    const { name, date, duration, exercises, notes } = req.body;
    
    const workout = new Workout({
      userId: req.user.id,
      name,
      date: date || new Date(),
      duration,
      exercises,
      notes
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workout by id
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.id });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, date, duration, exercises, notes } = req.body;
    
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, date, duration, exercises, notes },
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 