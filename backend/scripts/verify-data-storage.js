const mongoose = require('mongoose');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const { ProgressEntry, Goal } = require('../models/Progress');
const Challenge = require('../models/Challenge');
const ForumThread = require('../models/ForumThread');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

async function verifyDataStorage() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n📊 DATABASE VERIFICATION REPORT');
    console.log('=' .repeat(50));

    // Check collections and data
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 Collections found: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Verify each model
    await verifyUsers();
    await verifyWorkouts();
    await verifyMeals();
    await verifyProgress();
    await verifyChallenges();
    await verifyForums();

    console.log('\n✅ DATABASE VERIFICATION COMPLETE');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

async function verifyUsers() {
  console.log('\n👥 USER DATA VERIFICATION:');
  try {
    const userCount = await User.countDocuments();
    console.log(`   Total users: ${userCount}`);

    if (userCount > 0) {
      const sampleUser = await User.findOne().select('-password');
      console.log(`   Sample user: ${sampleUser.name} (${sampleUser.email})`);
      console.log(`   Role: ${sampleUser.role}`);
      console.log(`   Points: ${sampleUser.points}`);
      console.log(`   Created: ${sampleUser.createdAt}`);
    }

    // Check for admin users
    const adminCount = await User.countDocuments({ role: 'admin' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    const studentCount = await User.countDocuments({ role: 'student' });
    
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Faculty users: ${facultyCount}`);
    console.log(`   Student users: ${studentCount}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function verifyWorkouts() {
  console.log('\n💪 WORKOUT DATA VERIFICATION:');
  try {
    const workoutCount = await Workout.countDocuments();
    console.log(`   Total workouts: ${workoutCount}`);

    if (workoutCount > 0) {
      const sampleWorkout = await Workout.findOne().populate('userId', 'name');
      console.log(`   Sample workout: ${sampleWorkout.name}`);
      console.log(`   User: ${sampleWorkout.userId?.name || 'Unknown'}`);
      console.log(`   Duration: ${sampleWorkout.duration} minutes`);
      console.log(`   Exercises: ${sampleWorkout.exercises.length}`);
      console.log(`   Estimated calories: ${sampleWorkout.estimatedCalories}`);
    }

    // Workout statistics
    const totalExercises = await Workout.aggregate([
      { $group: { _id: null, total: { $sum: '$totalExercises' } } }
    ]);
    console.log(`   Total exercises logged: ${totalExercises[0]?.total || 0}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function verifyMeals() {
  console.log('\n🍎 MEAL DATA VERIFICATION:');
  try {
    const mealCount = await Meal.countDocuments();
    console.log(`   Total meals: ${mealCount}`);

    if (mealCount > 0) {
      const sampleMeal = await Meal.findOne().populate('userId', 'name');
      console.log(`   Sample meal: ${sampleMeal.name}`);
      console.log(`   User: ${sampleMeal.userId?.name || 'Unknown'}`);
      console.log(`   Type: ${sampleMeal.mealType}`);
      console.log(`   Total calories: ${sampleMeal.totalCalories}`);
      console.log(`   Food items: ${sampleMeal.foodItems.length}`);
    }

    // Meal statistics
    const totalCalories = await Meal.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCalories' } } }
    ]);
    console.log(`   Total calories logged: ${totalCalories[0]?.total || 0}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function verifyProgress() {
  console.log('\n📈 PROGRESS DATA VERIFICATION:');
  try {
    const progressCount = await ProgressEntry.countDocuments();
    const goalCount = await Goal.countDocuments();
    
    console.log(`   Total progress entries: ${progressCount}`);
    console.log(`   Total goals: ${goalCount}`);

    if (progressCount > 0) {
      const sampleProgress = await ProgressEntry.findOne().populate('userId', 'name');
      console.log(`   Sample progress: ${sampleProgress.weight} kg`);
      console.log(`   User: ${sampleProgress.userId?.name || 'Unknown'}`);
      console.log(`   Date: ${sampleProgress.date}`);
    }

    if (goalCount > 0) {
      const sampleGoal = await Goal.findOne().populate('userId', 'name');
      console.log(`   Sample goal: ${sampleGoal.title}`);
      console.log(`   Type: ${sampleGoal.type}`);
      console.log(`   Target: ${sampleGoal.target} ${sampleGoal.unit}`);
      console.log(`   Status: ${sampleGoal.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function verifyChallenges() {
  console.log('\n🏆 CHALLENGE DATA VERIFICATION:');
  try {
    const challengeCount = await Challenge.countDocuments();
    console.log(`   Total challenges: ${challengeCount}`);

    if (challengeCount > 0) {
      const sampleChallenge = await Challenge.findOne();
      console.log(`   Sample challenge: ${sampleChallenge.title}`);
      console.log(`   Participants: ${sampleChallenge.participants}`);
      console.log(`   Comments: ${sampleChallenge.comments.length}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function verifyForums() {
  console.log('\n💬 FORUM DATA VERIFICATION:');
  try {
    const forumCount = await ForumThread.countDocuments();
    console.log(`   Total forum threads: ${forumCount}`);

    if (forumCount > 0) {
      const sampleForum = await ForumThread.findOne();
      console.log(`   Sample thread: ${sampleForum.title}`);
      console.log(`   Author: ${sampleForum.author}`);
      console.log(`   Replies: ${sampleForum.replies.length}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

// Run verification
verifyDataStorage();
