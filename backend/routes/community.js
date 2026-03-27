const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllChallenges,
  createChallenge,
  joinChallenge,
  getAllForumThreads,
  createForumThread,
  addReply
} = require('../controllers/communityController');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Challenge routes
router.get('/challenges', auth, getAllChallenges);
router.post('/challenges', auth, createChallenge);
router.post('/challenges/:id/join', auth, joinChallenge);

// Challenge comments
router.get('/challenges/:id/comments', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge.comments || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/challenges/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    challenge.comments.push({ userId: req.user.userId, text });
    await challenge.save();
    res.status(201).json(challenge.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name points role')
      .sort({ points: -1 })
      .limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forum routes — support both /forum and /forums paths
router.get('/forum', auth, getAllForumThreads);
router.post('/forum', auth, createForumThread);
router.post('/forum/:id/reply', auth, addReply);

router.get('/forums', auth, getAllForumThreads);
router.post('/forums', auth, createForumThread);
router.get('/forums/:id', auth, async (req, res) => {
  try {
    const ForumThread = require('../models/ForumThread');
    const thread = await ForumThread.findById(req.params.id)
      .populate('author', 'name email')
      .populate('replies.author', 'name email');
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/forums/:id/replies', auth, addReply);

module.exports = router;
