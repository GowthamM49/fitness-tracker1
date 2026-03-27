const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllProgress, getProgressById, createProgress, updateProgress, deleteProgress } = require('../controllers/progressController');
const { Goal } = require('../models/Progress');

// Progress entry routes
router.get('/entries', auth, getAllProgress);
router.get('/entries/:id', auth, getProgressById);
router.post('/entries', auth, createProgress);
router.put('/entries/:id', auth, updateProgress);
router.delete('/entries/:id', auth, deleteProgress);

// Keep legacy routes for backward compatibility
router.get('/', auth, getAllProgress);
router.get('/:id', auth, getProgressById);
router.post('/', auth, createProgress);
router.put('/:id', auth, updateProgress);
router.delete('/:id', auth, deleteProgress);

// Goals routes
router.get('/goals', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/goals', auth, async (req, res) => {
  try {
    const { title, description, type, target, current, unit, deadline } = req.body;
    const goal = new Goal({
      userId: req.user.userId,
      title, description, type, target, current, unit, deadline
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/goals/:id', auth, async (req, res) => {
  try {
    const { title, description, type, target, current, unit, deadline, status } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, type, target, current, unit, deadline, status },
      { new: true }
    );
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/goals/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
