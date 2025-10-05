const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');

// Get all users for admin panel
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate User Progress Reports
router.get('/reports/user-progress', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, userId, role } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (userId) filter.userId = userId;
    if (role) filter.userRole = role;
    
    // Get user progress data
    const progressData = await Progress.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });
    
    // Calculate statistics
    const stats = {
      totalUsers: await User.countDocuments({ role: role || { $exists: true } }),
      totalProgressEntries: progressData.length,
      averageWeight: progressData.reduce((sum, p) => sum + (p.weight || 0), 0) / progressData.length || 0,
      totalWeightLoss: progressData.length > 0 ? 
        Math.max(0, progressData[progressData.length - 1].weight - progressData[0].weight) : 0
    };
    
    res.json({
      data: progressData,
      statistics: stats,
      generatedAt: new Date(),
      reportType: 'User Progress Report'
    });
  } catch (error) {
    console.error('Error generating user progress report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate Workout Statistics Reports
router.get('/reports/workout-stats', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (userId) filter.userId = userId;
    
    const workouts = await Workout.find(filter)
      .populate('userId', 'name email role')
      .sort({ date: -1 });
    
    // Calculate workout statistics
    const stats = {
      totalWorkouts: workouts.length,
      totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      averageDuration: workouts.length > 0 ? 
        workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length : 0,
      uniqueUsers: new Set(workouts.map(w => w.userId._id)).size,
      mostPopularExercise: getMostPopularExercise(workouts)
    };
    
    res.json({
      data: workouts,
      statistics: stats,
      generatedAt: new Date(),
      reportType: 'Workout Statistics Report'
    });
  } catch (error) {
    console.error('Error generating workout stats report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate Diet Reports
router.get('/reports/diet-analytics', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (userId) filter.userId = userId;
    
    const meals = await Meal.find(filter)
      .populate('userId', 'name email role')
      .sort({ date: -1 });
    
    // Calculate diet statistics
    const stats = {
      totalMeals: meals.length,
      totalCalories: meals.reduce((sum, m) => sum + (m.calories || 0), 0),
      averageCalories: meals.length > 0 ? 
        meals.reduce((sum, m) => sum + (m.calories || 0), 0) / meals.length : 0,
      totalProtein: meals.reduce((sum, m) => sum + (m.protein || 0), 0),
      totalCarbs: meals.reduce((sum, m) => sum + (m.carbs || 0), 0),
      totalFat: meals.reduce((sum, m) => sum + (m.fat || 0), 0)
    };
    
    res.json({
      data: meals,
      statistics: stats,
      generatedAt: new Date(),
      reportType: 'Diet Analytics Report'
    });
  } catch (error) {
    console.error('Error generating diet analytics report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate Community Participation Reports
router.get('/reports/community-stats', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const challenges = await Challenge.find(filter)
      .populate('participants.userId', 'name email role')
      .sort({ createdAt: -1 });
    
    // Calculate community statistics
    const stats = {
      totalChallenges: challenges.length,
      activeChallenges: challenges.filter(c => c.status === 'active').length,
      totalParticipants: challenges.reduce((sum, c) => sum + c.participants.length, 0),
      averageParticipation: challenges.length > 0 ? 
        challenges.reduce((sum, c) => sum + c.participants.length, 0) / challenges.length : 0
    };
    
    res.json({
      data: challenges,
      statistics: stats,
      generatedAt: new Date(),
      reportType: 'Community Participation Report'
    });
  } catch (error) {
    console.error('Error generating community stats report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// System Overview Dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalWorkouts = await Workout.countDocuments();
    const totalMeals = await Meal.countDocuments();
    const totalProgressEntries = await Progress.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    
    // Recent activity
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentWorkouts = await Workout.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      overview: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalAdmins,
        totalWorkouts,
        totalMeals,
        totalProgressEntries,
        totalChallenges
      },
      recentActivity: {
        recentUsers,
        recentWorkouts
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to find most popular exercise
function getMostPopularExercise(workouts) {
  const exerciseCount = {};
  workouts.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    }
  });
  
  return Object.keys(exerciseCount).reduce((a, b) => 
    exerciseCount[a] > exerciseCount[b] ? a : b, 'None'
  );
}

module.exports = router;
