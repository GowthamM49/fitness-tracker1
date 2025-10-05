const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

// Get all meals for a user
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create meal
router.post('/', auth, async (req, res) => {
  try {
    const { name, mealType, date, foodItems, notes } = req.body;
    
    const meal = new Meal({
      userId: req.user.id,
      name,
      mealType,
      date: date || new Date(),
      foodItems,
      notes
    });

    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get meal by id
router.get('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update meal
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, mealType, date, foodItems, notes } = req.body;
    
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, mealType, date, foodItems, notes },
      { new: true, runValidators: true }
    );

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete meal
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 