// Helper functions for the application

// Generate random string
const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Calculate BMI
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Calculate BMR (Basal Metabolic Rate)
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// Calculate calories burned during workout
const calculateCaloriesBurned = (weight, duration, intensity) => {
  const baseCaloriesPerMinute = (weight * 0.0175) * intensity;
  return Math.round(baseCaloriesPerMinute * duration);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: [
      password.length < minLength && 'Password must be at least 6 characters long',
      !hasUpperCase && 'Password must contain at least one uppercase letter',
      !hasLowerCase && 'Password must contain at least one lowercase letter',
      !hasNumbers && 'Password must contain at least one number'
    ].filter(Boolean)
  };
};

// Calculate workout intensity based on heart rate
const calculateIntensity = (heartRate, age) => {
  const maxHeartRate = 220 - age;
  const percentage = (heartRate / maxHeartRate) * 100;
  
  if (percentage < 60) return 1; // Light
  if (percentage < 70) return 2; // Moderate
  if (percentage < 85) return 3; // Vigorous
  return 4; // Very vigorous
};

// Generate workout recommendations
const generateWorkoutRecommendations = (fitnessGoal, experienceLevel) => {
  const recommendations = {
    weight_loss: {
      beginner: ['Cardio', 'Bodyweight exercises', 'Walking', 'Swimming'],
      intermediate: ['HIIT', 'Strength training', 'Cycling', 'Running'],
      advanced: ['CrossFit', 'Sprint intervals', 'Heavy lifting', 'Circuit training']
    },
    muscle_gain: {
      beginner: ['Basic strength training', 'Push-ups', 'Squats', 'Lunges'],
      intermediate: ['Weight training', 'Compound movements', 'Progressive overload'],
      advanced: ['Powerlifting', 'Olympic lifts', 'Advanced techniques', 'Periodization']
    },
    endurance: {
      beginner: ['Walking', 'Light jogging', 'Swimming', 'Cycling'],
      intermediate: ['Running', 'Cycling', 'Rowing', 'Elliptical'],
      advanced: ['Marathon training', 'Triathlon', 'Ultra-endurance', 'Interval training']
    }
  };
  
  return recommendations[fitnessGoal]?.[experienceLevel] || [];
};

module.exports = {
  generateRandomString,
  calculateBMI,
  calculateBMR,
  calculateCaloriesBurned,
  formatDate,
  isValidEmail,
  validatePassword,
  calculateIntensity,
  generateWorkoutRecommendations
};
