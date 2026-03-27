const { ProgressEntry } = require('../models/Progress');

// Get all progress entries for the logged-in user
const getAllProgress = async (req, res) => {
  try {
    const progress = await ProgressEntry.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get progress entry by ID
const getProgressById = async (req, res) => {
  try {
    const progress = await ProgressEntry.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create progress entry
const createProgress = async (req, res) => {
  try {
    const { weight, bodyFat, muscleMass, notes } = req.body;

    const progress = new ProgressEntry({
      userId: req.user.userId,
      weight,
      bodyFat,
      muscleMass,
      notes
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    console.error('Create progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update progress entry
const updateProgress = async (req, res) => {
  try {
    const { weight, bodyFat, muscleMass, notes } = req.body;

    const progress = await ProgressEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { weight, bodyFat, muscleMass, notes },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete progress entry
const deleteProgress = async (req, res) => {
  try {
    const progress = await ProgressEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress
};
