const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

// Get personalized meal recommendations for a user
router.get('/meals', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's recent meals to understand preferences
    const recentMeals = await Meal.find({ userId })
      .sort({ date: -1 })
      .limit(10);

    // Calculate user's nutritional needs based on profile
    const recommendations = generateMealRecommendations(user, recentMeals);
    
    res.json({
      success: true,
      recommendations,
      userProfile: {
        fitnessGoal: user.fitnessGoal,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight
      }
    });
  } catch (error) {
    console.error('Error generating meal recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations for specific meal type
router.get('/meals/:mealType', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealType } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recentMeals = await Meal.find({ userId })
      .sort({ date: -1 })
      .limit(10);

    const recommendations = generateMealRecommendations(user, recentMeals, mealType);
    
    res.json({
      success: true,
      mealType,
      recommendations
    });
  } catch (error) {
    console.error('Error generating meal recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a custom meal recommendation
router.post('/meals/custom', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealData } = req.body;
    
    // Validate required fields
    if (!mealData.name || !mealData.mealType || !mealData.foodItems || mealData.foodItems.length === 0) {
      return res.status(400).json({ message: 'Missing required meal data' });
    }

    // Create a new meal entry
    const customMeal = new Meal({
      userId,
      name: mealData.name,
      mealType: mealData.mealType,
      foodItems: mealData.foodItems,
      notes: mealData.notes || '',
      date: new Date()
    });

    await customMeal.save();

    res.json({
      success: true,
      message: 'Custom meal saved successfully',
      meal: customMeal
    });
  } catch (error) {
    console.error('Error saving custom meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's custom meals
router.get('/meals/custom', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealType } = req.query;
    
    let query = { userId };
    if (mealType) {
      query.mealType = mealType;
    }

    const customMeals = await Meal.find(query)
      .sort({ date: -1 })
      .limit(20);

    res.json({
      success: true,
      customMeals
    });
  } catch (error) {
    console.error('Error fetching custom meals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a meal recommendation
router.post('/meals/:mealId/rate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // For now, we'll store ratings in a simple way
    // In a production app, you'd want a separate ratings collection
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Add rating to meal notes or create a separate rating system
    const ratingData = {
      userId,
      rating,
      feedback: feedback || '',
      date: new Date()
    };

    // Store rating in meal notes (simple implementation)
    if (!meal.notes) {
      meal.notes = '';
    }
    meal.notes += `\nRating: ${rating}/5 - ${feedback || 'No feedback'}`;
    await meal.save();

    res.json({
      success: true,
      message: 'Rating saved successfully'
    });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate meal recommendations
function generateMealRecommendations(user, recentMeals, specificMealType = null) {
  const recommendations = [];
  
  // Calculate BMR and daily calorie needs
  const bmr = calculateBMR(user);
  const dailyCalories = calculateDailyCalories(bmr, user.fitnessGoal);
  
  // Get user's food preferences from recent meals
  const foodPreferences = analyzeFoodPreferences(recentMeals);
  
  // Define meal templates based on fitness goals
  const mealTemplates = getMealTemplates(user.fitnessGoal, dailyCalories);
  
  // Filter by meal type if specified
  const templatesToUse = specificMealType 
    ? mealTemplates.filter(template => template.mealType.toLowerCase() === specificMealType.toLowerCase())
    : mealTemplates;
  
  // Generate recommendations
  templatesToUse.forEach(template => {
    const recommendation = {
      mealType: template.mealType,
      name: template.name,
      description: template.description,
      estimatedCalories: template.estimatedCalories,
      foodItems: template.foodItems.map(item => ({
        ...item,
        // Adjust quantities based on user preferences
        quantity: adjustQuantityForUser(item, user, foodPreferences)
      })),
      nutrition: calculateNutrition(template.foodItems),
      benefits: template.benefits,
      difficulty: template.difficulty,
      prepTime: template.prepTime,
      tags: template.tags
    };
    
    recommendations.push(recommendation);
  });
  
  return recommendations;
}

// Calculate Basal Metabolic Rate
function calculateBMR(user) {
  if (user.gender === 'male') {
    return 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
  } else {
    return 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
  }
}

// Calculate daily calorie needs based on fitness goal
function calculateDailyCalories(bmr, fitnessGoal) {
  const activityMultiplier = 1.5; // Moderate activity level
  const baseCalories = bmr * activityMultiplier;
  
  switch (fitnessGoal) {
    case 'weight_loss':
      return Math.round(baseCalories * 0.8); // 20% deficit
    case 'weight_gain':
      return Math.round(baseCalories * 1.2); // 20% surplus
    case 'muscle_gain':
      return Math.round(baseCalories * 1.1); // 10% surplus
    case 'maintenance':
    default:
      return Math.round(baseCalories);
  }
}

// Analyze user's food preferences from recent meals
function analyzeFoodPreferences(recentMeals) {
  const preferences = {
    commonFoods: {},
    mealTypes: {},
    avgCalories: 0,
    avgProtein: 0
  };
  
  if (recentMeals.length === 0) {
    return preferences;
  }
  
  let totalCalories = 0;
  let totalProtein = 0;
  
  recentMeals.forEach(meal => {
    totalCalories += meal.totalCalories;
    totalProtein += meal.totalProtein;
    
    // Track meal types
    preferences.mealTypes[meal.mealType] = (preferences.mealTypes[meal.mealType] || 0) + 1;
    
    // Track common foods
    meal.foodItems.forEach(food => {
      preferences.commonFoods[food.name] = (preferences.commonFoods[food.name] || 0) + 1;
    });
  });
  
  preferences.avgCalories = totalCalories / recentMeals.length;
  preferences.avgProtein = totalProtein / recentMeals.length;
  
  return preferences;
}

// Get meal templates based on fitness goals
function getMealTemplates(fitnessGoal, dailyCalories) {
  const templates = {
    weight_loss: [
      {
        mealType: 'Breakfast',
        name: 'High-Protein Oatmeal Bowl',
        description: 'Nutritious oatmeal with protein powder and berries',
        estimatedCalories: Math.round(dailyCalories * 0.25),
        foodItems: [
          { name: 'Oatmeal', quantity: 50, unit: 'g', calories: 170, protein: 6, carbs: 30, fat: 3 },
          { name: 'Protein Powder', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 2, fat: 1 },
          { name: 'Blueberries', quantity: 50, unit: 'g', calories: 25, protein: 0.3, carbs: 6, fat: 0.1 },
          { name: 'Almonds', quantity: 10, unit: 'g', calories: 58, protein: 2, carbs: 2, fat: 5 }
        ],
        benefits: ['High protein', 'Fiber-rich', 'Antioxidants'],
        difficulty: 'Easy',
        prepTime: '5 minutes',
        tags: ['high-protein', 'fiber', 'antioxidants']
      },
      {
        mealType: 'Breakfast',
        name: 'Green Smoothie Bowl',
        description: 'Nutrient-dense smoothie bowl with spinach and fruits',
        estimatedCalories: Math.round(dailyCalories * 0.2),
        foodItems: [
          { name: 'Spinach', quantity: 50, unit: 'g', calories: 12, protein: 1.5, carbs: 2, fat: 0.2 },
          { name: 'Banana', quantity: 1, unit: 'piece', calories: 89, protein: 1, carbs: 23, fat: 0.3 },
          { name: 'Greek Yogurt', quantity: 100, unit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
          { name: 'Chia Seeds', quantity: 15, unit: 'g', calories: 73, protein: 2.5, carbs: 6, fat: 4.5 },
          { name: 'Almond Milk', quantity: 100, unit: 'ml', calories: 15, protein: 0.5, carbs: 1, fat: 1 }
        ],
        benefits: ['Low calorie', 'High fiber', 'Vitamins', 'Minerals'],
        difficulty: 'Easy',
        prepTime: '5 minutes',
        tags: ['low-calorie', 'fiber', 'vitamins', 'smoothie']
      },
      {
        mealType: 'Lunch',
        name: 'Grilled Chicken Salad',
        description: 'Lean protein with mixed greens and vegetables',
        estimatedCalories: Math.round(dailyCalories * 0.3),
        foodItems: [
          { name: 'Chicken Breast', quantity: 120, unit: 'g', calories: 198, protein: 37, carbs: 0, fat: 4 },
          { name: 'Mixed Greens', quantity: 100, unit: 'g', calories: 20, protein: 2, carbs: 4, fat: 0.3 },
          { name: 'Cucumber', quantity: 50, unit: 'g', calories: 8, protein: 0.3, carbs: 2, fat: 0.1 },
          { name: 'Tomato', quantity: 50, unit: 'g', calories: 9, protein: 0.4, carbs: 2, fat: 0.1 },
          { name: 'Olive Oil', quantity: 5, unit: 'ml', calories: 40, protein: 0, carbs: 0, fat: 4.5 }
        ],
        benefits: ['Low calorie', 'High protein', 'Vitamins'],
        difficulty: 'Easy',
        prepTime: '10 minutes',
        tags: ['low-calorie', 'high-protein', 'vitamins']
      },
      {
        mealType: 'Lunch',
        name: 'Quinoa Buddha Bowl',
        description: 'Nutrient-packed bowl with quinoa, vegetables, and lean protein',
        estimatedCalories: Math.round(dailyCalories * 0.25),
        foodItems: [
          { name: 'Quinoa', quantity: 80, unit: 'g', calories: 96, protein: 3.5, carbs: 18, fat: 1.5 },
          { name: 'Grilled Tofu', quantity: 100, unit: 'g', calories: 76, protein: 8, carbs: 2, fat: 4.5 },
          { name: 'Avocado', quantity: 50, unit: 'g', calories: 80, protein: 1, carbs: 4, fat: 7.5 },
          { name: 'Carrots', quantity: 50, unit: 'g', calories: 20, protein: 0.5, carbs: 5, fat: 0.1 },
          { name: 'Lemon Dressing', quantity: 10, unit: 'ml', calories: 30, protein: 0, carbs: 1, fat: 3 }
        ],
        benefits: ['Complete protein', 'Healthy fats', 'Fiber', 'Vitamins'],
        difficulty: 'Medium',
        prepTime: '20 minutes',
        tags: ['complete-protein', 'healthy-fats', 'fiber', 'vegan']
      },
      {
        mealType: 'Dinner',
        name: 'Baked Cod with Vegetables',
        description: 'Light and healthy fish with roasted vegetables',
        estimatedCalories: Math.round(dailyCalories * 0.3),
        foodItems: [
          { name: 'Cod Fillet', quantity: 150, unit: 'g', calories: 135, protein: 30, carbs: 0, fat: 1.5 },
          { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, protein: 3, carbs: 7, fat: 0.4 },
          { name: 'Asparagus', quantity: 80, unit: 'g', calories: 16, protein: 2, carbs: 3, fat: 0.2 },
          { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
          { name: 'Olive Oil', quantity: 8, unit: 'ml', calories: 64, protein: 0, carbs: 0, fat: 7.2 }
        ],
        benefits: ['Lean protein', 'Omega-3', 'Vitamins', 'Minerals'],
        difficulty: 'Easy',
        prepTime: '30 minutes',
        tags: ['lean-protein', 'omega-3', 'vitamins', 'low-calorie']
      },
      {
        mealType: 'Snack',
        name: 'Greek Yogurt Parfait',
        description: 'Protein-rich snack with berries and nuts',
        estimatedCalories: Math.round(dailyCalories * 0.1),
        foodItems: [
          { name: 'Greek Yogurt', quantity: 150, unit: 'g', calories: 89, protein: 15, carbs: 5, fat: 0.6 },
          { name: 'Strawberries', quantity: 50, unit: 'g', calories: 16, protein: 0.3, carbs: 4, fat: 0.1 },
          { name: 'Walnuts', quantity: 10, unit: 'g', calories: 65, protein: 1.5, carbs: 1, fat: 6.5 },
          { name: 'Honey', quantity: 5, unit: 'ml', calories: 15, protein: 0, carbs: 4, fat: 0 }
        ],
        benefits: ['High protein', 'Antioxidants', 'Healthy fats'],
        difficulty: 'Easy',
        prepTime: '2 minutes',
        tags: ['high-protein', 'antioxidants', 'healthy-fats', 'quick']
      }
    ],
    weight_gain: [
      {
        mealType: 'Breakfast',
        name: 'Protein Pancakes',
        description: 'High-calorie pancakes with protein and healthy fats',
        estimatedCalories: Math.round(dailyCalories * 0.3),
        foodItems: [
          { name: 'Whole Wheat Flour', quantity: 60, unit: 'g', calories: 200, protein: 8, carbs: 42, fat: 1 },
          { name: 'Eggs', quantity: 2, unit: 'piece', calories: 140, protein: 12, carbs: 1, fat: 10 },
          { name: 'Banana', quantity: 1, unit: 'piece', calories: 89, protein: 1, carbs: 23, fat: 0.3 },
          { name: 'Peanut Butter', quantity: 20, unit: 'g', calories: 118, protein: 5, carbs: 4, fat: 10 },
          { name: 'Honey', quantity: 15, unit: 'ml', calories: 45, protein: 0, carbs: 12, fat: 0 }
        ],
        benefits: ['High calorie', 'Complete protein', 'Healthy fats'],
        difficulty: 'Medium',
        prepTime: '15 minutes',
        tags: ['high-calorie', 'protein', 'healthy-fats']
      },
      {
        mealType: 'Breakfast',
        name: 'Loaded Avocado Toast',
        description: 'Creamy avocado toast with eggs and seeds',
        estimatedCalories: Math.round(dailyCalories * 0.25),
        foodItems: [
          { name: 'Whole Grain Bread', quantity: 2, unit: 'slice', calories: 160, protein: 8, carbs: 28, fat: 2 },
          { name: 'Avocado', quantity: 1, unit: 'piece', calories: 160, protein: 2, carbs: 8, fat: 15 },
          { name: 'Eggs', quantity: 2, unit: 'piece', calories: 140, protein: 12, carbs: 1, fat: 10 },
          { name: 'Chia Seeds', quantity: 10, unit: 'g', calories: 49, protein: 1.7, carbs: 4, fat: 3 },
          { name: 'Olive Oil', quantity: 5, unit: 'ml', calories: 40, protein: 0, carbs: 0, fat: 4.5 }
        ],
        benefits: ['Healthy fats', 'Complete protein', 'Fiber', 'Vitamins'],
        difficulty: 'Easy',
        prepTime: '10 minutes',
        tags: ['healthy-fats', 'complete-protein', 'fiber', 'vitamins']
      },
      {
        mealType: 'Lunch',
        name: 'Beef and Rice Bowl',
        description: 'High-calorie bowl with lean beef and brown rice',
        estimatedCalories: Math.round(dailyCalories * 0.35),
        foodItems: [
          { name: 'Lean Beef', quantity: 150, unit: 'g', calories: 250, protein: 45, carbs: 0, fat: 6 },
          { name: 'Brown Rice', quantity: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
          { name: 'Broccoli', quantity: 80, unit: 'g', calories: 27, protein: 2.4, carbs: 5.6, fat: 0.3 },
          { name: 'Olive Oil', quantity: 10, unit: 'ml', calories: 80, protein: 0, carbs: 0, fat: 9 },
          { name: 'Sesame Seeds', quantity: 5, unit: 'g', calories: 29, protein: 1, carbs: 1, fat: 2.5 }
        ],
        benefits: ['High protein', 'Iron', 'Complex carbs', 'Vitamins'],
        difficulty: 'Medium',
        prepTime: '25 minutes',
        tags: ['high-protein', 'iron', 'complex-carbs', 'vitamins']
      },
      {
        mealType: 'Dinner',
        name: 'Creamy Pasta with Chicken',
        description: 'Comforting pasta dish with chicken and vegetables',
        estimatedCalories: Math.round(dailyCalories * 0.4),
        foodItems: [
          { name: 'Whole Wheat Pasta', quantity: 100, unit: 'g', calories: 350, protein: 14, carbs: 71, fat: 2 },
          { name: 'Chicken Breast', quantity: 120, unit: 'g', calories: 198, protein: 37, carbs: 0, fat: 4 },
          { name: 'Heavy Cream', quantity: 50, unit: 'ml', calories: 172, protein: 1, carbs: 1, fat: 18 },
          { name: 'Mushrooms', quantity: 80, unit: 'g', calories: 20, protein: 3, carbs: 4, fat: 0.3 },
          { name: 'Parmesan Cheese', quantity: 20, unit: 'g', calories: 84, protein: 7, carbs: 0.7, fat: 5.5 }
        ],
        benefits: ['High calorie', 'Complete protein', 'Comfort food'],
        difficulty: 'Medium',
        prepTime: '30 minutes',
        tags: ['high-calorie', 'complete-protein', 'comfort-food']
      },
      {
        mealType: 'Snack',
        name: 'Nut Butter Energy Balls',
        description: 'High-calorie energy balls with nuts and dates',
        estimatedCalories: Math.round(dailyCalories * 0.15),
        foodItems: [
          { name: 'Almonds', quantity: 30, unit: 'g', calories: 174, protein: 6.3, carbs: 6.6, fat: 15 },
          { name: 'Dates', quantity: 40, unit: 'g', calories: 113, protein: 1, carbs: 30, fat: 0.2 },
          { name: 'Peanut Butter', quantity: 15, unit: 'g', calories: 89, protein: 3.8, carbs: 3, fat: 7.5 },
          { name: 'Coconut Oil', quantity: 5, unit: 'ml', calories: 40, protein: 0, carbs: 0, fat: 4.5 }
        ],
        benefits: ['High calorie', 'Healthy fats', 'Natural sugars', 'Protein'],
        difficulty: 'Easy',
        prepTime: '10 minutes',
        tags: ['high-calorie', 'healthy-fats', 'natural-sugars', 'protein']
      }
    ],
    muscle_gain: [
      {
        mealType: 'Breakfast',
        name: 'Power Protein Smoothie',
        description: 'High-protein smoothie for muscle building',
        estimatedCalories: Math.round(dailyCalories * 0.25),
        foodItems: [
          { name: 'Protein Powder', quantity: 40, unit: 'g', calories: 160, protein: 32, carbs: 3, fat: 1.5 },
          { name: 'Banana', quantity: 1, unit: 'piece', calories: 89, protein: 1, carbs: 23, fat: 0.3 },
          { name: 'Oats', quantity: 40, unit: 'g', calories: 150, protein: 5, carbs: 27, fat: 3 },
          { name: 'Almond Butter', quantity: 20, unit: 'g', calories: 118, protein: 4, carbs: 4, fat: 10 },
          { name: 'Milk', quantity: 200, unit: 'ml', calories: 100, protein: 6.6, carbs: 9.6, fat: 3.2 }
        ],
        benefits: ['High protein', 'Complete amino acids', 'Complex carbs'],
        difficulty: 'Easy',
        prepTime: '5 minutes',
        tags: ['high-protein', 'complete-amino-acids', 'complex-carbs']
      },
      {
        mealType: 'Lunch',
        name: 'Turkey and Quinoa Bowl',
        description: 'Lean protein with complex carbs for muscle recovery',
        estimatedCalories: Math.round(dailyCalories * 0.3),
        foodItems: [
          { name: 'Ground Turkey', quantity: 120, unit: 'g', calories: 200, protein: 35, carbs: 0, fat: 6 },
          { name: 'Quinoa', quantity: 80, unit: 'g', calories: 96, protein: 3.5, carbs: 18, fat: 1.5 },
          { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
          { name: 'Broccoli', quantity: 80, unit: 'g', calories: 27, protein: 2.4, carbs: 5.6, fat: 0.3 },
          { name: 'Olive Oil', quantity: 8, unit: 'ml', calories: 64, protein: 0, carbs: 0, fat: 7.2 }
        ],
        benefits: ['Lean protein', 'Complete amino acids', 'Complex carbs', 'Vitamins'],
        difficulty: 'Medium',
        prepTime: '25 minutes',
        tags: ['lean-protein', 'complete-amino-acids', 'complex-carbs', 'vitamins']
      },
      {
        mealType: 'Dinner',
        name: 'Salmon with Sweet Potato',
        description: 'Lean protein with complex carbs for muscle recovery',
        estimatedCalories: Math.round(dailyCalories * 0.35),
        foodItems: [
          { name: 'Salmon Fillet', quantity: 150, unit: 'g', calories: 312, protein: 37, carbs: 0, fat: 18 },
          { name: 'Sweet Potato', quantity: 200, unit: 'g', calories: 172, protein: 3, carbs: 40, fat: 0.2 },
          { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, protein: 3, carbs: 7, fat: 0.4 },
          { name: 'Olive Oil', quantity: 10, unit: 'ml', calories: 80, protein: 0, carbs: 0, fat: 9 }
        ],
        benefits: ['Omega-3', 'Complete protein', 'Complex carbs'],
        difficulty: 'Medium',
        prepTime: '25 minutes',
        tags: ['omega-3', 'complete-protein', 'complex-carbs']
      },
      {
        mealType: 'Dinner',
        name: 'Beef Stir Fry with Rice',
        description: 'High-protein stir fry with lean beef and vegetables',
        estimatedCalories: Math.round(dailyCalories * 0.3),
        foodItems: [
          { name: 'Lean Beef Strips', quantity: 120, unit: 'g', calories: 200, protein: 36, carbs: 0, fat: 4.8 },
          { name: 'Brown Rice', quantity: 80, unit: 'g', calories: 89, protein: 2.1, carbs: 18.4, fat: 0.7 },
          { name: 'Bell Peppers', quantity: 100, unit: 'g', calories: 25, protein: 1, carbs: 6, fat: 0.2 },
          { name: 'Snow Peas', quantity: 60, unit: 'g', calories: 20, protein: 1.5, carbs: 3.6, fat: 0.1 },
          { name: 'Sesame Oil', quantity: 8, unit: 'ml', calories: 64, protein: 0, carbs: 0, fat: 7.2 }
        ],
        benefits: ['High protein', 'Iron', 'Vitamins', 'Fiber'],
        difficulty: 'Medium',
        prepTime: '20 minutes',
        tags: ['high-protein', 'iron', 'vitamins', 'fiber']
      },
      {
        mealType: 'Snack',
        name: 'Cottage Cheese with Berries',
        description: 'Casein protein snack for muscle recovery',
        estimatedCalories: Math.round(dailyCalories * 0.1),
        foodItems: [
          { name: 'Cottage Cheese', quantity: 150, unit: 'g', calories: 120, protein: 20, carbs: 6, fat: 1.5 },
          { name: 'Blueberries', quantity: 50, unit: 'g', calories: 25, protein: 0.3, carbs: 6, fat: 0.1 },
          { name: 'Almonds', quantity: 10, unit: 'g', calories: 58, protein: 2, carbs: 2, fat: 5 },
          { name: 'Honey', quantity: 5, unit: 'ml', calories: 15, protein: 0, carbs: 4, fat: 0 }
        ],
        benefits: ['Casein protein', 'Antioxidants', 'Slow release protein'],
        difficulty: 'Easy',
        prepTime: '2 minutes',
        tags: ['casein-protein', 'antioxidants', 'slow-release-protein']
      }
    ],
    maintenance: [
      {
        mealType: 'Breakfast',
        name: 'Balanced Breakfast Bowl',
        description: 'Well-rounded breakfast with all macronutrients',
        estimatedCalories: Math.round(dailyCalories * 0.25),
        foodItems: [
          { name: 'Greek Yogurt', quantity: 150, unit: 'g', calories: 89, protein: 15, carbs: 5, fat: 0.6 },
          { name: 'Granola', quantity: 30, unit: 'g', calories: 120, protein: 3, carbs: 18, fat: 4 },
          { name: 'Strawberries', quantity: 50, unit: 'g', calories: 16, protein: 0.3, carbs: 4, fat: 0.1 },
          { name: 'Walnuts', quantity: 15, unit: 'g', calories: 98, protein: 2, carbs: 2, fat: 10 }
        ],
        benefits: ['Balanced macros', 'Probiotics', 'Antioxidants'],
        difficulty: 'Easy',
        prepTime: '3 minutes',
        tags: ['balanced', 'probiotics', 'antioxidants']
      },
      {
        mealType: 'Breakfast',
        name: 'Veggie Omelette',
        description: 'Protein-rich omelette with vegetables',
        estimatedCalories: Math.round(dailyCalories * 0.2),
        foodItems: [
          { name: 'Eggs', quantity: 3, unit: 'piece', calories: 210, protein: 18, carbs: 1.5, fat: 15 },
          { name: 'Spinach', quantity: 30, unit: 'g', calories: 7, protein: 0.9, carbs: 1.2, fat: 0.1 },
          { name: 'Tomatoes', quantity: 50, unit: 'g', calories: 9, protein: 0.4, carbs: 2, fat: 0.1 },
          { name: 'Mushrooms', quantity: 40, unit: 'g', calories: 10, protein: 1.5, carbs: 2, fat: 0.2 },
          { name: 'Cheese', quantity: 20, unit: 'g', calories: 80, protein: 5, carbs: 0.6, fat: 6.4 }
        ],
        benefits: ['Complete protein', 'Vitamins', 'Minerals', 'Low carb'],
        difficulty: 'Easy',
        prepTime: '10 minutes',
        tags: ['complete-protein', 'vitamins', 'minerals', 'low-carb']
      },
      {
        mealType: 'Lunch',
        name: 'Mediterranean Wrap',
        description: 'Balanced wrap with lean protein and vegetables',
        estimatedCalories: Math.round(dailyCalories * 0.3),
        foodItems: [
          { name: 'Whole Wheat Tortilla', quantity: 1, unit: 'piece', calories: 120, protein: 4, carbs: 20, fat: 2 },
          { name: 'Grilled Chicken', quantity: 100, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
          { name: 'Hummus', quantity: 30, unit: 'g', calories: 50, protein: 2, carbs: 4, fat: 3 },
          { name: 'Cucumber', quantity: 50, unit: 'g', calories: 8, protein: 0.3, carbs: 2, fat: 0.1 },
          { name: 'Tomatoes', quantity: 50, unit: 'g', calories: 9, protein: 0.4, carbs: 2, fat: 0.1 }
        ],
        benefits: ['Balanced macros', 'Fiber', 'Vitamins', 'Healthy fats'],
        difficulty: 'Easy',
        prepTime: '10 minutes',
        tags: ['balanced', 'fiber', 'vitamins', 'healthy-fats']
      },
      {
        mealType: 'Dinner',
        name: 'Baked Chicken with Roasted Vegetables',
        description: 'Simple and healthy dinner with lean protein',
        estimatedCalories: Math.round(dailyCalories * 0.35),
        foodItems: [
          { name: 'Chicken Breast', quantity: 120, unit: 'g', calories: 198, protein: 37, carbs: 0, fat: 4 },
          { name: 'Carrots', quantity: 80, unit: 'g', calories: 32, protein: 0.8, carbs: 8, fat: 0.2 },
          { name: 'Broccoli', quantity: 80, unit: 'g', calories: 27, protein: 2.4, carbs: 5.6, fat: 0.3 },
          { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
          { name: 'Olive Oil', quantity: 8, unit: 'ml', calories: 64, protein: 0, carbs: 0, fat: 7.2 }
        ],
        benefits: ['Lean protein', 'Vitamins', 'Minerals', 'Fiber'],
        difficulty: 'Easy',
        prepTime: '35 minutes',
        tags: ['lean-protein', 'vitamins', 'minerals', 'fiber']
      },
      {
        mealType: 'Snack',
        name: 'Apple with Almond Butter',
        description: 'Simple and satisfying snack',
        estimatedCalories: Math.round(dailyCalories * 0.1),
        foodItems: [
          { name: 'Apple', quantity: 1, unit: 'piece', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
          { name: 'Almond Butter', quantity: 15, unit: 'g', calories: 89, protein: 3, carbs: 3, fat: 7.5 }
        ],
        benefits: ['Fiber', 'Healthy fats', 'Natural sugars', 'Vitamins'],
        difficulty: 'Easy',
        prepTime: '1 minute',
        tags: ['fiber', 'healthy-fats', 'natural-sugars', 'vitamins']
      }
    ]
  };
  
  return templates[fitnessGoal] || templates.maintenance;
}

// Adjust food quantities based on user preferences
function adjustQuantityForUser(foodItem, user, preferences) {
  let adjustedQuantity = foodItem.quantity;
  
  // Adjust based on user's common foods
  if (preferences.commonFoods[foodItem.name]) {
    adjustedQuantity *= 1.1; // Slightly increase for preferred foods
  }
  
  // Adjust based on user's size
  if (user.weight > 80) {
    adjustedQuantity *= 1.1;
  } else if (user.weight < 60) {
    adjustedQuantity *= 0.9;
  }
  
  return Math.round(adjustedQuantity);
}

// Calculate total nutrition for a meal
function calculateNutrition(foodItems) {
  return foodItems.reduce((total, item) => ({
    calories: total.calories + item.calories,
    protein: total.protein + item.protein,
    carbs: total.carbs + item.carbs,
    fat: total.fat + item.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

module.exports = router;
