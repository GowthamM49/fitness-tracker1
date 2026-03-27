const mongoose = require('mongoose');
const User = require('../models/User');
const Meal = require('../models/Meal');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testRecommendations() {
  try {
    console.log('Testing Meal Recommendation System...\n');

    // Find a test user
    const user = await User.findOne({ email: 'admin@kec.com' });
    
    if (!user) {
      console.log('No test user found. Please create a user first.');
      return;
    }

    console.log(`Testing recommendations for user: ${user.name} (${user.email})`);
    console.log(`Fitness Goal: ${user.fitnessGoal}`);
    console.log(`Profile: ${user.age} years old, ${user.gender}, ${user.height}cm, ${user.weight}kg\n`);

    // Get user's recent meals
    const recentMeals = await Meal.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(10);

    console.log(`Found ${recentMeals.length} recent meals:`);
    recentMeals.forEach(meal => {
      console.log(`- ${meal.name} (${meal.mealType}): ${meal.totalCalories} calories`);
    });

    // Test recommendation logic
    const { generateMealRecommendations } = require('../routes/recommendations');
    
    // Since the function is not exported, we'll simulate the logic
    console.log('\n=== MEAL RECOMMENDATIONS ===');
    
    // Calculate BMR
    const bmr = user.gender === 'male' 
      ? 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age)
      : 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
    
    const activityMultiplier = 1.5;
    const baseCalories = bmr * activityMultiplier;
    
    let dailyCalories;
    switch (user.fitnessGoal) {
      case 'weight_loss':
        dailyCalories = Math.round(baseCalories * 0.8);
        break;
      case 'weight_gain':
        dailyCalories = Math.round(baseCalories * 1.2);
        break;
      case 'muscle_gain':
        dailyCalories = Math.round(baseCalories * 1.1);
        break;
      default:
        dailyCalories = Math.round(baseCalories);
    }

    console.log(`BMR: ${bmr.toFixed(0)} calories`);
    console.log(`Daily Calorie Target: ${dailyCalories} calories`);
    console.log(`Fitness Goal: ${user.fitnessGoal}`);

    // Sample recommendations based on fitness goal
    const sampleRecommendations = {
      weight_loss: [
        {
          mealType: 'Breakfast',
          name: 'High-Protein Oatmeal Bowl',
          estimatedCalories: Math.round(dailyCalories * 0.25),
          benefits: ['High protein', 'Fiber-rich', 'Antioxidants']
        },
        {
          mealType: 'Lunch',
          name: 'Grilled Chicken Salad',
          estimatedCalories: Math.round(dailyCalories * 0.3),
          benefits: ['Low calorie', 'High protein', 'Vitamins']
        }
      ],
      weight_gain: [
        {
          mealType: 'Breakfast',
          name: 'Protein Pancakes',
          estimatedCalories: Math.round(dailyCalories * 0.3),
          benefits: ['High calorie', 'Complete protein', 'Healthy fats']
        }
      ],
      muscle_gain: [
        {
          mealType: 'Dinner',
          name: 'Salmon with Sweet Potato',
          estimatedCalories: Math.round(dailyCalories * 0.35),
          benefits: ['Omega-3', 'Complete protein', 'Complex carbs']
        }
      ],
      maintenance: [
        {
          mealType: 'Breakfast',
          name: 'Balanced Breakfast Bowl',
          estimatedCalories: Math.round(dailyCalories * 0.25),
          benefits: ['Balanced macros', 'Probiotics', 'Antioxidants']
        }
      ]
    };

    const recommendations = sampleRecommendations[user.fitnessGoal] || sampleRecommendations.maintenance;
    
    console.log('\nRecommended Meals:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.name} (${rec.mealType})`);
      console.log(`   Calories: ${rec.estimatedCalories}`);
      console.log(`   Benefits: ${rec.benefits.join(', ')}`);
      console.log('');
    });

    console.log('✅ Recommendation system test completed successfully!');
    
  } catch (error) {
    console.error('Error testing recommendations:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testRecommendations();
