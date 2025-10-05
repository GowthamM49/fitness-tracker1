const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const ForumThread = require('../models/ForumThread');

// Challenges
router.get('/challenges', async (req, res) => {
  const items = await Challenge.find().sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.post('/challenges', authenticate, async (req, res) => {
  const { title, description } = req.body || {};
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const challenge = await Challenge.create({ title, description: description || '' });
  res.status(201).json(challenge);
});

router.get('/challenges/:id', async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).lean();
  if (!challenge) return res.status(404).json({ message: 'Not found' });
  res.json(challenge);
});

router.post('/challenges/:id/join', authenticate, async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ message: 'Not found' });
  challenge.participants += 1;
  await challenge.save();
  await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
  res.json({ message: 'Joined', challengeId: challenge.id, participants: challenge.participants });
});

// Challenge comments
router.get('/challenges/:id/comments', async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).lean();
  if (!challenge) return res.status(404).json({ message: 'Not found' });
  res.json({ items: challenge.comments || [] });
});

router.post('/challenges/:id/comments', authenticate, async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ message: 'Not found' });
  const user = await User.findById(req.user.id).lean();
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ message: 'Text is required' });
  const comment = { userId: req.user.id, userName: user?.name || 'User', text, createdAt: new Date() };
  challenge.comments.unshift(comment);
  await challenge.save();
  res.status(201).json(comment);
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  const users = await User.find({}, 'name points').sort({ points: -1 }).limit(50).lean();
  const items = users.map(u => ({ id: u._id, name: u.name, points: u.points || 0 }));
  res.json({ items });
});

// Forums
router.get('/forums', async (req, res) => {
  const items = await ForumThread.find().sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.post('/forums', authenticate, async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const user = await User.findById(req.user.id).lean();
  const thread = await ForumThread.create({ title, author: user?.name || 'User', replies: [] });
  res.status(201).json(thread);
});

router.get('/forums/:id', async (req, res) => {
  const thread = await ForumThread.findById(req.params.id).lean();
  if (!thread) return res.status(404).json({ message: 'Not found' });
  res.json(thread);
});

router.post('/forums/:id/replies', authenticate, async (req, res) => {
  const thread = await ForumThread.findById(req.params.id);
  if (!thread) return res.status(404).json({ message: 'Not found' });
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ message: 'Text is required' });
  const user = await User.findById(req.user.id).lean();
  const reply = { author: user?.name || 'User', text, createdAt: new Date() };
  thread.replies.push(reply);
  await thread.save();
  res.status(201).json(reply);
});

// Friends
router.get('/friends', async (req, res) => {
  // Placeholder: return top users by points as suggested friends
  const users = await User.find({}, 'name points').sort({ points: -1 }).limit(10).lean();
  const items = users.map(u => ({ id: u._id, name: u.name, status: 'suggested' }));
  res.json({ items });
});

module.exports = router;