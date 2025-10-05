const express = require('express');
const router = express.Router();
const { ProgressEntry, Goal } = require('../models/Progress');
const auth = require('../middleware/auth');

// Get all progress entries for a user
router.get('/entries', auth, async (req, res) => {
  try {
    const entries = await ProgressEntry.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching progress entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create progress entry
router.post('/entries', auth, async (req, res) => {
  try {
    const { date, weight, bodyFat, muscleMass, notes } = req.body;
    
    const entry = new ProgressEntry({
      userId: req.user.id,
      date: date || new Date(),
      weight,
      bodyFat,
      muscleMass,
      notes
    });

    const savedEntry = await entry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Error creating progress entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all goals for a user
router.get('/goals', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create goal
router.post('/goals', auth, async (req, res) => {
  try {
    const { title, description, type, target, current, unit, deadline } = req.body;
    
    const goal = new Goal({
      userId: req.user.id,
      title,
      description,
      type,
      target,
      current: current || 0,
      unit,
      deadline
    });

    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update goal
router.put('/goals/:id', auth, async (req, res) => {
  try {
    const { title, description, type, target, current, unit, deadline, status } = req.body;
    
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, type, target, current, unit, deadline, status },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete goal
router.delete('/goals/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 