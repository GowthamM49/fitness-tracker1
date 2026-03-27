const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chat, suggest } = require('../controllers/coachController');

router.post('/chat', auth, chat);
router.post('/suggest', auth, suggest);

// Debug: check which AI providers are configured (no auth needed)
router.get('/status', (req, res) => {
  res.json({
    openai: Boolean(process.env.OPENAI_API_KEY),
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    nodeEnv: process.env.NODE_ENV
  });
});

module.exports = router;
