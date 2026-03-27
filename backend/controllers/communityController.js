const Challenge = require('../models/Challenge');
const ForumThread = require('../models/ForumThread');

// Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('createdBy', 'name email')
      .populate('participants', 'name email')
      .sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create challenge
const createChallenge = async (req, res) => {
  try {
    const { title, description, startDate, endDate, target, reward } = req.body;

    const challenge = new Challenge({
      createdBy: req.user.userId,
      title,
      description,
      startDate,
      endDate,
      target,
      reward,
      participants: [req.user.userId]
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Join challenge
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const alreadyJoined = challenge.participants.some(
      (p) => p.toString() === req.user.userId.toString()
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push(req.user.userId);
    await challenge.save();

    res.json({ message: 'Successfully joined challenge' });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all forum threads
const getAllForumThreads = async (req, res) => {
  try {
    const threads = await ForumThread.find()
      .populate('author', 'name email')
      .populate('replies.author', 'name email')
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    console.error('Get forum threads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create forum thread
const createForumThread = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const thread = new ForumThread({
      author: req.user.userId,
      title,
      content,
      category
    });

    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    console.error('Create forum thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add reply to thread
const addReply = async (req, res) => {
  try {
    const { content } = req.body;

    const thread = await ForumThread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    thread.replies.push({
      author: req.user.userId,
      content
    });

    await thread.save();
    res.json(thread);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllChallenges,
  createChallenge,
  joinChallenge,
  getAllForumThreads,
  createForumThread,
  addReply
};
