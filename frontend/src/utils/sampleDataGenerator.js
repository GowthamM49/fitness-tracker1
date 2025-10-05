// Sample Data Generator for Fitness Tracker
// This utility generates realistic sample data for demonstration purposes

export const generateSampleUserData = (userProfile = {}) => {
  const {
    name = "Gowthammm",
    age = 25,
    gender = "male",
    height = 175, // cm
    weight = 70, // kg
    activityLevel = "moderately_active",
    goal = "weight_loss",
    weeklyChange = 0.5
  } = userProfile;

  // Calculate target weight (assuming weight loss goal)
  const targetWeight = goal === "weight_loss" ? weight - 5 : weight + 5;

  // Generate realistic workout data
  const workoutsThisWeek = Math.floor(Math.random() * 4) + 3; // 3-6 workouts
  const totalWorkouts = Math.floor(Math.random() * 50) + 20; // 20-70 total workouts

  // Generate calorie data
  const caloriesToday = Math.floor(Math.random() * 500) + 1500; // 1500-2000 calories
  const streakDays = Math.floor(Math.random() * 30) + 5; // 5-35 day streak

  // Generate weight entries for the last 30 days
  const weightEntries = generateWeightEntries(weight, 30);

  // Generate workout history
  const workoutHistory = generateWorkoutHistory(totalWorkouts);

  // Generate meal history
  const mealHistory = generateMealHistory(7); // Last 7 days

  return {
    // User profile data
    name,
    age: age.toString(),
    gender,
    height: height.toString(),
    weight: weight.toString(),
    activityLevel,
    goal,
    weeklyChange: weeklyChange.toString(),
    targetWeight: targetWeight.toString(),
    
    // Activity data
    workoutsThisWeek: workoutsThisWeek.toString(),
    totalWorkouts: totalWorkouts.toString(),
    caloriesToday: caloriesToday.toString(),
    streakDays: streakDays.toString(),

    // Historical data
    weightEntries,
    workoutHistory,
    mealHistory,

    // Timestamps
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  };
};

// Generate realistic weight entries over time
const generateWeightEntries = (startingWeight, days) => {
  const entries = [];
  let currentWeight = startingWeight;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Small random variation in weight (±0.5kg)
    const variation = (Math.random() - 0.5) * 1;
    currentWeight = Math.max(65, Math.min(75, currentWeight + variation));
    
    entries.push({
      id: `weight_${i}`,
      date: date.toISOString().split('T')[0],
      weight: Math.round(currentWeight * 10) / 10,
      notes: i % 7 === 0 ? "Weekly weigh-in" : ""
    });
  }
  
  return entries;
};

// Generate workout history
const generateWorkoutHistory = (totalWorkouts) => {
  const workouts = [];
  const workoutTypes = [
    "Strength Training",
    "Cardio",
    "HIIT",
    "Yoga",
    "Running",
    "Swimming",
    "Cycling"
  ];
  
  for (let i = 0; i < totalWorkouts; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    
    workouts.push({
      id: `workout_${i}`,
      date: date.toISOString().split('T')[0],
      type: workoutType,
      duration: duration,
      caloriesBurned: Math.floor(duration * 8 + Math.random() * 200),
      exercises: generateExercises(workoutType)
    });
  }
  
  return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Generate exercises for each workout
const generateExercises = (workoutType) => {
  const exerciseMap = {
    "Strength Training": [
      { name: "Bench Press", sets: 3, reps: 10, weight: 60 },
      { name: "Squats", sets: 3, reps: 12, weight: 80 },
      { name: "Deadlifts", sets: 3, reps: 8, weight: 100 }
    ],
    "Cardio": [
      { name: "Treadmill Running", sets: 1, reps: 30, weight: 0 },
      { name: "Elliptical", sets: 1, reps: 20, weight: 0 }
    ],
    "HIIT": [
      { name: "Burpees", sets: 4, reps: 15, weight: 0 },
      { name: "Mountain Climbers", sets: 4, reps: 20, weight: 0 },
      { name: "Jump Squats", sets: 4, reps: 12, weight: 0 }
    ],
    "Yoga": [
      { name: "Sun Salutation", sets: 3, reps: 1, weight: 0 },
      { name: "Warrior Poses", sets: 2, reps: 1, weight: 0 }
    ],
    "Running": [
      { name: "5K Run", sets: 1, reps: 1, weight: 0 }
    ],
    "Swimming": [
      { name: "Freestyle", sets: 4, reps: 25, weight: 0 },
      { name: "Backstroke", sets: 2, reps: 20, weight: 0 }
    ],
    "Cycling": [
      { name: "Stationary Bike", sets: 1, reps: 45, weight: 0 }
    ]
  };
  
  return exerciseMap[workoutType] || exerciseMap["Strength Training"];
};

// Generate meal history
const generateMealHistory = (days) => {
  const meals = [];
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
  const foodItems = [
    { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
    { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "Brown Rice", calories: 112, protein: 2.6, carbs: 22, fat: 0.9 },
    { name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
    { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0 },
    { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14 },
    { name: "Salmon", calories: 206, protein: 22, carbs: 0, fat: 12 },
    { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
    { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11 }
  ];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    mealTypes.forEach(mealType => {
      if (Math.random() > 0.2) { // 80% chance of having each meal
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 food items
        const selectedFoods = [];
        
        for (let j = 0; j < numItems; j++) {
          const food = foodItems[Math.floor(Math.random() * foodItems.length)];
          const quantity = Math.random() * 2 + 0.5; // 0.5-2.5 servings
          
          selectedFoods.push({
            name: food.name,
            quantity: quantity,
            calories: Math.round(food.calories * quantity),
            protein: Math.round(food.protein * quantity * 10) / 10,
            carbs: Math.round(food.carbs * quantity * 10) / 10,
            fat: Math.round(food.fat * quantity * 10) / 10
          });
        }
        
        const totalCalories = selectedFoods.reduce((sum, item) => sum + item.calories, 0);
        const totalProtein = selectedFoods.reduce((sum, item) => sum + item.protein, 0);
        const totalCarbs = selectedFoods.reduce((sum, item) => sum + item.carbs, 0);
        const totalFat = selectedFoods.reduce((sum, item) => sum + item.fat, 0);
        
        meals.push({
          id: `meal_${i}_${mealType}`,
          date: date.toISOString().split('T')[0],
          mealType: mealType,
          foodItems: selectedFoods,
          totalCalories: Math.round(totalCalories),
          totalProtein: Math.round(totalProtein * 10) / 10,
          totalCarbs: Math.round(totalCarbs * 10) / 10,
          totalFat: Math.round(totalFat * 10) / 10
        });
      }
    });
  }
  
  return meals.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Initialize sample data in localStorage
export const initializeSampleData = (userProfile = {}) => {
  const sampleData = generateSampleUserData(userProfile);
  
  // Save user profile data
  localStorage.setItem('fitnessTrackerData', JSON.stringify({
    name: sampleData.name,
    age: sampleData.age,
    gender: sampleData.gender,
    height: sampleData.height,
    weight: sampleData.weight,
    activityLevel: sampleData.activityLevel,
    goal: sampleData.goal,
    weeklyChange: sampleData.weeklyChange,
    targetWeight: sampleData.targetWeight,
    workoutsThisWeek: sampleData.workoutsThisWeek,
    totalWorkouts: sampleData.totalWorkouts,
    caloriesToday: sampleData.caloriesToday,
    streakDays: sampleData.streakDays
  }));
  
  // Save historical data
  localStorage.setItem('weightEntries', JSON.stringify(sampleData.weightEntries));
  localStorage.setItem('workouts', JSON.stringify(sampleData.workoutHistory));
  localStorage.setItem('meals', JSON.stringify(sampleData.mealHistory));
  
  console.log('Sample data initialized successfully!');
  return sampleData;
};

// Check if data exists, if not initialize sample data
export const ensureDataExists = (userProfile = {}) => {
  const existingData = localStorage.getItem('fitnessTrackerData');
  if (!existingData || existingData === '{}') {
    return initializeSampleData(userProfile);
  }
  return JSON.parse(existingData);
};
