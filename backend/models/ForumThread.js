const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const forumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  category: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies: [replySchema]
}, { timestamps: true });

module.exports = mongoose.model('ForumThread', forumThreadSchema);


