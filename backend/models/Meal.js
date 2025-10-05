const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 }
});

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  mealType: { 
    type: String, 
    required: true, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] 
  },
  date: { type: Date, default: Date.now },
  foodItems: [foodItemSchema],
  notes: String,
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  totalQuantity: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate totals before saving
mealSchema.pre('save', function(next) {
  this.totalCalories = this.foodItems.reduce((sum, food) => sum + food.calories, 0);
  this.totalProtein = this.foodItems.reduce((sum, food) => sum + food.protein, 0);
  this.totalCarbs = this.foodItems.reduce((sum, food) => sum + food.carbs, 0);
  this.totalFat = this.foodItems.reduce((sum, food) => sum + food.fat, 0);
  this.totalQuantity = this.foodItems.reduce((sum, food) => sum + food.quantity, 0);
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
