const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const { ProgressEntry, Goal } = require('../models/Progress');
const Challenge = require('../models/Challenge');
const ForumThread = require('../models/ForumThread');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

async function seedSampleData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🌱 SEEDING SAMPLE DATA');
    console.log('=' .repeat(50));

    // Clear existing data (optional - remove this in production)
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Meal.deleteMany({});
    await ProgressEntry.deleteMany({});
    await Goal.deleteMany({});
    await Challenge.deleteMany({});
    await ForumThread.deleteMany({});

    // Create sample users
    await createSampleUsers();
    
    // Create sample data for each user
    const users = await User.find();
    for (const user of users) {
      await createSampleWorkouts(user);
      await createSampleMeals(user);
      await createSampleProgress(user);
      await createSampleGoals(user);
    }

    // Create sample challenges and forums
    await createSampleChallenges();
    await createSampleForums();

    console.log('\n✅ SAMPLE DATA SEEDING COMPLETE');
    console.log('=' .repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Workouts: ${await Workout.countDocuments()}`);
    console.log(`   Meals: ${await Meal.countDocuments()}`);
    console.log(`   Progress entries: ${await ProgressEntry.countDocuments()}`);
    console.log(`   Goals: ${await Goal.countDocuments()}`);
    console.log(`   Challenges: ${await Challenge.countDocuments()}`);
    console.log(`   Forum threads: ${await ForumThread.countDocuments()}`);

    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@kec.edu / admin123');
    console.log('   Faculty: faculty@kec.edu / faculty123');
    console.log('   Student: student@kec.edu / student123');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

async function createSampleUsers() {
  console.log('\n👥 Creating sample users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@kec.edu',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      age: 35,
      gender: 'male',
      height: 175,
      weight: 75,
      fitnessGoal: 'maintain',
      points: 2500,
      isActive: true
    },
    {
      name: 'Dr. Sarah Wilson',
      email: 'faculty@kec.edu',
      password: await bcrypt.hash('faculty123', 10),
      role: 'faculty',
      age: 42,
      gender: 'female',
      height: 165,
      weight: 60,
      fitnessGoal: 'lose',
      points: 1800,
      isActive: true
    },
    {
      name: 'Alex Johnson',
      email: 'student@kec.edu',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
      age: 20,
      gender: 'male',
      height: 180,
      weight: 70,
      fitnessGoal: 'gain',
      points: 1200,
      isActive: true
    },
    {
      name: 'Emma Davis',
      email: 'emma@kec.edu',
      password: hashedPassword,
      role: 'student',
      age: 19,
      gender: 'female',
      height: 160,
      weight: 55,
      fitnessGoal: 'maintain',
      points: 950,
      isActive: true
    },
    {
      name: 'Mike Chen',
      email: 'mike@kec.edu',
      password: hashedPassword,
      role: 'student',
      age: 21,
      gender: 'male',
      height: 175,
      weight: 80,
      fitnessGoal: 'lose',
      points: 750,
      isActive: true
    }
  ];

  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    console.log(`   ✅ Created user: ${user.name} (${user.role})`);
  }
}

async function createSampleWorkouts(user) {
  console.log(`\n💪 Creating workouts for ${user.name}...`);
  
  const workoutTypes = [
    { name: 'Morning Cardio', duration: 30, exercises: ['Running', 'Jumping Jacks', 'Burpees'] },
    { name: 'Strength Training', duration: 45, exercises: ['Push-ups', 'Squats', 'Lunges', 'Planks'] },
    { name: 'HIIT Workout', duration: 25, exercises: ['Mountain Climbers', 'High Knees', 'Push-ups'] },
    { name: 'Yoga Session', duration: 40, exercises: ['Downward Dog', 'Warrior Pose', 'Tree Pose'] }
  ];

  for (let i = 0; i < 8; i++) {
    const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    const exercises = workoutType.exercises.map(exerciseName => ({
      name: exerciseName,
      sets: Math.floor(Math.random() * 3) + 1,
      reps: Math.floor(Math.random() * 15) + 5,
      weight: Math.floor(Math.random() * 20) + 5,
      restTime: Math.floor(Math.random() * 60) + 30
    }));

    const workout = new Workout({
      userId: user._id,
      name: workoutType.name,
      date: date,
      duration: workoutType.duration,
      exercises: exercises,
      notes: `Great workout session on ${date.toLocaleDateString()}`
    });

    await workout.save();
  }
  console.log(`   ✅ Created 8 workouts`);
}

async function createSampleMeals(user) {
  console.log(`\n🍎 Creating meals for ${user.name}...`);
  
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const foodItems = [
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
    { name: 'Broccoli', calories: 55, protein: 4.3, carbs: 11, fat: 0.6 },
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4 },
    { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14 }
  ];

  for (let i = 0; i < 15; i++) {
    const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    const selectedFoods = foodItems.slice(0, Math.floor(Math.random() * 3) + 1);
    const mealFoodItems = selectedFoods.map(food => ({
      ...food,
      quantity: Math.floor(Math.random() * 200) + 50,
      unit: 'g'
    }));

    const meal = new Meal({
      userId: user._id,
      name: `${mealType} - ${selectedFoods[0].name}`,
      mealType: mealType,
      date: date,
      foodItems: mealFoodItems,
      notes: `Healthy ${mealType.toLowerCase()} meal`
    });

    await meal.save();
  }
  console.log(`   ✅ Created 15 meals`);
}

async function createSampleProgress(user) {
  console.log(`\n📈 Creating progress entries for ${user.name}...`);
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 3));

    const baseWeight = user.weight;
    const weightVariation = (Math.random() - 0.5) * 2; // ±1kg variation

    const progress = new ProgressEntry({
      userId: user._id,
      date: date,
      weight: Math.round((baseWeight + weightVariation) * 10) / 10,
      bodyFat: Math.round((Math.random() * 10 + 15) * 10) / 10, // 15-25%
      muscleMass: Math.round((Math.random() * 5 + 30) * 10) / 10, // 30-35kg
      notes: `Progress check on ${date.toLocaleDateString()}`
    });

    await progress.save();
  }
  console.log(`   ✅ Created 10 progress entries`);
}

async function createSampleGoals(user) {
  console.log(`\n🎯 Creating goals for ${user.name}...`);
  
  const goalTypes = [
    { type: 'weight', title: 'Weight Loss Goal', target: user.weight - 5, unit: 'kg' },
    { type: 'workout', title: 'Workout Consistency', target: 30, unit: 'workouts' },
    { type: 'streak', title: 'Exercise Streak', target: 21, unit: 'days' },
    { type: 'nutrition', title: 'Calorie Tracking', target: 30, unit: 'days' }
  ];

  for (const goalType of goalTypes.slice(0, 2)) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 90);

    const goal = new Goal({
      userId: user._id,
      title: goalType.title,
      description: `Achieve ${goalType.target} ${goalType.unit} by ${deadline.toLocaleDateString()}`,
      type: goalType.type,
      target: goalType.target,
      current: Math.floor(Math.random() * goalType.target * 0.5),
      unit: goalType.unit,
      deadline: deadline,
      status: 'In Progress'
    });

    await goal.save();
  }
  console.log(`   ✅ Created 2 goals`);
}

async function createSampleChallenges() {
  console.log('\n🏆 Creating sample challenges...');
  
  const challenges = [
    {
      title: '30-Day Push-up Challenge',
      description: 'Complete 100 push-ups every day for 30 days',
      participants: 45,
      comments: [
        { userId: null, userName: 'Alex Johnson', text: 'Great challenge! Day 5 completed! 💪' },
        { userId: null, userName: 'Emma Davis', text: 'This is tougher than I thought but I\'m loving it!' },
        { userId: null, userName: 'Mike Chen', text: 'Keep it up everyone! We got this! 🔥' }
      ]
    },
    {
      title: 'Healthy Eating Streak',
      description: 'Log meals and stay within calorie goals for 21 days',
      participants: 32,
      comments: [
        { userId: null, userName: 'Dr. Sarah Wilson', text: 'Excellent nutrition tracking everyone!' },
        { userId: null, userName: 'Emma Davis', text: 'Meal prep is key to success! 🥗' }
      ]
    },
    {
      title: 'Weight Loss Warriors',
      description: 'Lose 5kg in 60 days with healthy lifestyle changes',
      participants: 28,
      comments: [
        { userId: null, userName: 'Mike Chen', text: 'Slow and steady wins the race!' },
        { userId: null, userName: 'Alex Johnson', text: 'Consistency is everything! 💯' }
      ]
    }
  ];

  for (const challengeData of challenges) {
    const challenge = new Challenge(challengeData);
    await challenge.save();
    console.log(`   ✅ Created challenge: ${challenge.title}`);
  }
}

async function createSampleForums() {
  console.log('\n💬 Creating sample forum threads...');
  
  const forums = [
    {
      title: 'Best workout routines for beginners?',
      author: 'Newbie123',
      replies: [
        { author: 'FitnessExpert', text: 'Start with bodyweight exercises like push-ups and squats!' },
        { author: 'GymRat', text: 'Don\'t forget to include cardio for overall health.' },
        { author: 'YogaMaster', text: 'Yoga is great for flexibility and stress relief.' }
      ]
    },
    {
      title: 'Meal prep ideas for busy students',
      author: 'BusyStudent',
      replies: [
        { author: 'ChefPro', text: 'Batch cook on Sundays and store in containers!' },
        { author: 'HealthNut', text: 'Quinoa bowls with veggies are my go-to!' }
      ]
    },
    {
      title: 'How to stay motivated during weight loss plateau?',
      author: 'FitnessJourney',
      replies: [
        { author: 'MotivationGuru', text: 'Focus on non-scale victories like energy levels!' },
        { author: 'PlateauBreaker', text: 'Try changing your workout routine completely.' },
        { author: 'SuccessStory', text: 'I hit a 2-month plateau but kept going and finally broke through!' }
      ]
    }
  ];

  for (const forumData of forums) {
    const forum = new ForumThread(forumData);
    await forum.save();
    console.log(`   ✅ Created forum thread: ${forum.title}`);
  }
}

// Run seeding
seedSampleData();
