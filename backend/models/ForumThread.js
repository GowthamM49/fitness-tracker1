const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const forumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  replies: [replySchema]
}, { timestamps: true });

module.exports = mongoose.model('ForumThread', forumThreadSchema);


