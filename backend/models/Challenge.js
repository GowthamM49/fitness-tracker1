const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  participants: { type: Number, default: 0 },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);


