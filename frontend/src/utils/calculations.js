// Fitness calculation utilities for user input

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in meters
 * @returns {object} BMI value and category
 */
export const calculateBMI = (weight, height) => {
  if (weight <= 0 || height <= 0) {
    return { bmi: 0, category: 'Invalid', color: 'error' };
  }
  
  const bmi = weight / (height * height);
  
  let category, color;
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'warning';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
    color = 'success';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'warning';
  } else {
    category = 'Obese';
    color = 'error';
  }
  
  return { bmi: bmi.toFixed(1), category, color };
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (weight <= 0 || height <= 0 || age <= 0) {
    return 0;
  }
  
  let bmr;
  if (gender.toLowerCase() === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  
  return Math.round(bmr);
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - BMR value
 * @param {string} activityLevel - Activity level description
 * @returns {number} TDEE in calories
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    'sedentary': 1.2,        // Little or no exercise
    'light': 1.375,          // Light exercise 1-3 days/week
    'moderate': 1.55,        // Moderate exercise 3-5 days/week
    'active': 1.725,         // Hard exercise 6-7 days/week
    'very_active': 1.9       // Very hard exercise, physical job
  };
  
  const multiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Calculate weight loss/gain calorie target
 * @param {number} tdee - TDEE value
 * @param {string} goal - 'lose', 'maintain', or 'gain'
 * @param {number} weeklyChange - Weekly weight change goal in kg
 * @returns {object} Calorie target and weekly change
 */
export const calculateCalorieTarget = (tdee, goal, weeklyChange = 0.5) => {
  let targetCalories;
  
  switch (goal.toLowerCase()) {
    case 'lose':
      // 1 kg = 7700 calories, so weeklyChange kg = weeklyChange * 7700 calories
      const weeklyDeficit = weeklyChange * 7700;
      const dailyDeficit = weeklyDeficit / 7;
      targetCalories = tdee - dailyDeficit;
      break;
    case 'gain':
      const weeklySurplus = weeklyChange * 7700;
      const dailySurplus = weeklySurplus / 7;
      targetCalories = tdee + dailySurplus;
      break;
    default: // maintain
      targetCalories = tdee;
      weeklyChange = 0;
  }
  
  return {
    targetCalories: Math.round(targetCalories),
    weeklyChange: weeklyChange,
    goal: goal
  };
};

/**
 * Calculate protein needs based on weight and activity
 * @param {number} weight - Weight in kg
 * @param {string} activityLevel - Activity level
 * @returns {object} Protein needs in grams and calories
 */
export const calculateProteinNeeds = (weight, activityLevel) => {
  let proteinPerKg;
  
  switch (activityLevel.toLowerCase()) {
    case 'sedentary':
      proteinPerKg = 0.8;
      break;
    case 'light':
      proteinPerKg = 1.0;
      break;
    case 'moderate':
      proteinPerKg = 1.2;
      break;
    case 'active':
      proteinPerKg = 1.4;
      break;
    case 'very_active':
      proteinPerKg = 1.6;
      break;
    default:
      proteinPerKg = 1.0;
  }
  
  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinCalories = proteinGrams * 4; // 4 calories per gram of protein
  
  return { proteinGrams, proteinCalories };
};

/**
 * Calculate workout calories burned
 * @param {string} activity - Type of activity
 * @param {number} duration - Duration in minutes
 * @param {number} weight - Weight in kg
 * @returns {number} Calories burned
 */
export const calculateWorkoutCalories = (activity, duration, weight) => {
  const activityMETs = {
    'walking': 3.5,
    'jogging': 7.0,
    'running': 11.5,
    'cycling': 8.0,
    'swimming': 6.0,
    'weightlifting': 3.0,
    'yoga': 2.5,
    'pilates': 3.0,
    'dancing': 4.5,
    'basketball': 8.0,
    'soccer': 7.0,
    'tennis': 6.0
  };
  
  const met = activityMETs[activity.toLowerCase()] || 3.0;
  const caloriesBurned = (met * weight * duration) / 60;
  
  return Math.round(caloriesBurned);
};

/**
 * Calculate progress percentage
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {string} type - 'weight_loss', 'weight_gain', or 'calorie'
 * @returns {object} Progress percentage and status
 */
export const calculateProgress = (current, target, type = 'weight_loss') => {
  if (target === 0) return { percentage: 0, status: 'No target set' };
  
  let percentage, status;
  
  switch (type) {
    case 'weight_loss':
      // For weight loss, we want current to be less than target
      if (current <= target) {
        percentage = 100;
        status = 'Goal achieved!';
      } else {
        percentage = Math.max(0, Math.min(100, ((current - target) / (current - target + 1)) * 100));
        status = 'In progress';
      }
      break;
    case 'weight_gain':
      // For weight gain, we want current to be more than target
      if (current >= target) {
        percentage = 100;
        status = 'Goal achieved!';
      } else {
        percentage = Math.max(0, Math.min(100, (current / target) * 100));
        status = 'In progress';
      }
      break;
    case 'calorie':
      // For calories, we want current to be close to target
      percentage = Math.max(0, Math.min(100, (current / target) * 100));
      if (percentage >= 90 && percentage <= 110) {
        status = 'On target';
      } else if (percentage < 90) {
        status = 'Under target';
      } else {
        status = 'Over target';
      }
      break;
    default:
      percentage = 0;
      status = 'Unknown type';
  }
  
  return { percentage: Math.round(percentage), status };
};

/**
 * Calculate ideal weight range based on height and gender
 * @param {number} height - Height in cm
 * @param {string} gender - 'male' or 'female'
 * @returns {object} Min and max ideal weight in kg
 */
export const calculateIdealWeightRange = (height, gender) => {
  if (height <= 0) return { min: 0, max: 0 };
  
  const heightM = height / 100;
  
  // Using BMI range 18.5-24.9 for healthy weight
  const minWeight = 18.5 * heightM * heightM;
  const maxWeight = 24.9 * heightM * heightM;
  
  return {
    min: Math.round(minWeight),
    max: Math.round(maxWeight),
    height: heightM
  };
};

export default {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateProteinNeeds,
  calculateWorkoutCalories,
  calculateProgress,
  calculateIdealWeightRange
};
