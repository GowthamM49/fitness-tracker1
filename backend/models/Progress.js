const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
  bodyFat: { type: Number },
  muscleMass: { type: Number },
  notes: String
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    required: true,
    // Align enum with frontend options
    enum: ['weight', 'workout', 'streak', 'nutrition']
  },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  unit: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    default: 'In Progress',
    enum: ['In Progress', 'Completed', 'Overdue']
  }
}, { timestamps: true });

module.exports = {
  ProgressEntry: mongoose.model('ProgressEntry', progressEntrySchema),
  Goal: mongoose.model('Goal', goalSchema)
};
