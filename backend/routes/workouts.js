const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController');

// Get all workouts
router.get('/', auth, getAllWorkouts);

// Get workout by ID
router.get('/:id', auth, getWorkoutById);

// Create workout
router.post('/', auth, createWorkout);

// Update workout
router.put('/:id', auth, updateWorkout);

// Delete workout
router.delete('/:id', auth, deleteWorkout);

module.exports = router;