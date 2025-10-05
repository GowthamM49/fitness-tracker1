# Meal Recommendation System

## Overview

The Meal Recommendation System provides personalized meal suggestions based on user profiles, fitness goals, and dietary preferences. This AI-powered feature analyzes user data to recommend meals that align with their nutritional needs and health objectives.

## Features

### 🎯 Personalized Recommendations
- **Fitness Goal-Based**: Recommendations tailored to weight loss, weight gain, muscle gain, or maintenance
- **Profile Analysis**: Considers age, gender, height, weight, and activity level
- **Preference Learning**: Learns from user's meal history and food preferences

### 🍽️ Comprehensive Meal Data
- **Detailed Nutrition**: Complete macronutrient breakdown (calories, protein, carbs, fat)
- **Ingredient Lists**: Full ingredient lists with quantities and units
- **Preparation Info**: Difficulty level, prep time, and cooking instructions
- **Health Benefits**: Highlighted nutritional benefits of each meal

### 📱 User-Friendly Interface
- **Tabbed Navigation**: Easy switching between meal types (Breakfast, Lunch, Dinner, Snacks)
- **Visual Cards**: Attractive meal cards with nutrition highlights
- **One-Click Selection**: Direct integration with meal logging system
- **Real-time Updates**: Dynamic recommendations based on user activity

## Technical Implementation

### Backend Architecture

#### API Endpoints
```
GET /api/recommendations/meals
- Returns personalized meal recommendations for the authenticated user
- Considers user profile, fitness goals, and meal history

GET /api/recommendations/meals/:mealType
- Returns recommendations for specific meal type (breakfast, lunch, dinner, snack)
- Filtered by meal type for targeted suggestions
```

#### Recommendation Algorithm

1. **User Profile Analysis**
   - Calculates Basal Metabolic Rate (BMR) using Harris-Benedict equation
   - Determines daily calorie needs based on fitness goals
   - Analyzes user's recent meal history for preferences

2. **Meal Template System**
   - Pre-defined meal templates for each fitness goal
   - Adjustable quantities based on user profile
   - Nutritional optimization for specific objectives

3. **Personalization Engine**
   - Learns from user's food preferences
   - Adjusts recommendations based on meal history
   - Considers user's body composition and goals

### Frontend Components

#### MealRecommendations Component
- **Location**: `src/components/diet/MealRecommendations.js`
- **Features**:
  - Tabbed interface for meal types
  - Responsive grid layout
  - Interactive meal cards
  - Nutrition breakdown display
  - One-click meal selection

#### Integration with MealLogger
- **Seamless Workflow**: Selected recommendations automatically populate meal logging form
- **Smart Pre-filling**: Meal name, type, and ingredients are pre-filled
- **Easy Customization**: Users can modify recommended meals before saving

## Usage Guide

### For Users

1. **Access Recommendations**
   - Navigate to "Diet & Nutrition" page
   - Click on "Meal Recommendations" tab
   - View personalized suggestions based on your profile

2. **Browse by Meal Type**
   - Use tabs to filter by Breakfast, Lunch, Dinner, or Snacks
   - Each tab shows relevant recommendations for that meal type

3. **Select a Meal**
   - Click "Use This Meal" button on any recommendation
   - Automatically switches to "Log Meal" tab with pre-filled data
   - Modify ingredients or quantities as needed
   - Save the meal to your history

4. **Understand Nutrition**
   - View complete macronutrient breakdown
   - See health benefits and preparation details
   - Check difficulty level and prep time

### For Developers

#### Adding New Meal Templates

1. **Update Backend Templates**
   ```javascript
   // In backend/routes/recommendations.js
   const templates = {
     weight_loss: [
       {
         mealType: 'Breakfast',
         name: 'Your New Meal',
         description: 'Meal description',
         estimatedCalories: 400,
         foodItems: [
           { name: 'Ingredient', quantity: 100, unit: 'g', calories: 200, protein: 10, carbs: 20, fat: 5 }
         ],
         benefits: ['Benefit 1', 'Benefit 2'],
         difficulty: 'Easy',
         prepTime: '10 minutes',
         tags: ['tag1', 'tag2']
       }
     ]
   };
   ```

2. **Test Recommendations**
   ```bash
   # Run the test script
   node backend/scripts/test-recommendations.js
   ```

#### Customizing Recommendation Logic

1. **Modify BMR Calculation**
   ```javascript
   function calculateBMR(user) {
     // Custom BMR calculation logic
   }
   ```

2. **Adjust Calorie Targets**
   ```javascript
   function calculateDailyCalories(bmr, fitnessGoal) {
     // Custom calorie calculation based on goals
   }
   ```

3. **Enhance Preference Analysis**
   ```javascript
   function analyzeFoodPreferences(recentMeals) {
     // Custom preference analysis logic
   }
   ```

## API Documentation

### Get All Recommendations
```http
GET /api/recommendations/meals
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "mealType": "Breakfast",
      "name": "High-Protein Oatmeal Bowl",
      "description": "Nutritious oatmeal with protein powder and berries",
      "estimatedCalories": 500,
      "foodItems": [...],
      "nutrition": {
        "calories": 500,
        "protein": 25,
        "carbs": 60,
        "fat": 15
      },
      "benefits": ["High protein", "Fiber-rich"],
      "difficulty": "Easy",
      "prepTime": "5 minutes",
      "tags": ["high-protein", "fiber"]
    }
  ],
  "userProfile": {
    "fitnessGoal": "weight_loss",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70
  }
}
```

### Get Recommendations by Meal Type
```http
GET /api/recommendations/meals/breakfast
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "mealType": "breakfast",
  "recommendations": [...]
}
```

## Configuration

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
PORT=5000
```

### Dependencies
- **Backend**: Express.js, Mongoose, JWT authentication
- **Frontend**: React, Material-UI, Axios
- **Database**: MongoDB with user and meal collections

## Testing

### Manual Testing
1. **Create Test User**
   ```bash
   node backend/scripts/create-admin-user.js
   ```

2. **Test Recommendations**
   ```bash
   node backend/scripts/test-recommendations.js
   ```

3. **Frontend Testing**
   - Login to the application
   - Navigate to Diet & Nutrition → Meal Recommendations
   - Test different meal types and user profiles

### Automated Testing
```bash
# Run backend tests
npm test

# Run frontend tests
npm run test
```

## Future Enhancements

### Planned Features
- **Machine Learning Integration**: Advanced ML algorithms for better recommendations
- **Seasonal Recommendations**: Weather and season-based meal suggestions
- **Allergy Management**: Filter recommendations based on dietary restrictions
- **Social Features**: Share and rate recommended meals
- **Meal Planning**: Weekly meal planning with recommendations
- **Shopping Lists**: Auto-generate shopping lists from selected meals

### Performance Optimizations
- **Caching**: Cache recommendations for better performance
- **Lazy Loading**: Load recommendations on demand
- **Database Indexing**: Optimize database queries for faster responses

## Troubleshooting

### Common Issues

1. **No Recommendations Showing**
   - Check if user profile is complete
   - Verify user authentication
   - Check backend API connectivity

2. **Recommendations Not Personalized**
   - Ensure user has logged meals
   - Verify fitness goal is set
   - Check user profile completeness

3. **API Errors**
   - Verify MongoDB connection
   - Check authentication middleware
   - Review server logs for errors

### Debug Mode
```javascript
// Enable debug logging
console.log('User profile:', user);
console.log('Recent meals:', recentMeals);
console.log('Generated recommendations:', recommendations);
```

## Support

For technical support or feature requests:
- Check the main README.md for setup instructions
- Review the API documentation
- Test with the provided test scripts
- Check MongoDB connection and user authentication

---

**Note**: This recommendation system is designed to provide general guidance and should not replace professional dietary advice. Users should consult with healthcare professionals for specific nutritional needs.
