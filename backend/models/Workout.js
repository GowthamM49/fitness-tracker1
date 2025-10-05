const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 },
  restTime: { type: Number, default: 0 },
  notes: String
});

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
  exercises: [exerciseSchema],
  notes: String,
  totalExercises: { type: Number, default: 0 },
  totalSets: { type: Number, default: 0 },
  totalReps: { type: Number, default: 0 },
  estimatedCalories: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate totals before saving
workoutSchema.pre('save', function(next) {
  this.totalExercises = this.exercises.length;
  this.totalSets = this.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  this.totalReps = this.exercises.reduce((sum, exercise) => sum + (exercise.sets * exercise.reps), 0);
  // Rough calorie estimation (can be improved)
  this.estimatedCalories = Math.round(this.duration * 8 + this.totalSets * 5);
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);
