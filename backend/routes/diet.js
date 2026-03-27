const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllMeals, getMealById, createMeal, updateMeal, deleteMeal } = require('../controllers/mealController');

// Get all meals
router.get('/', auth, getAllMeals);

// Get meal by ID
router.get('/:id', auth, getMealById);

// Create meal
router.post('/', auth, createMeal);

// Update meal
router.put('/:id', auth, updateMeal);

// Delete meal
router.delete('/:id', auth, deleteMeal);

module.exports = router;