import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import { Restaurant as DietIcon, Fastfood as LogIcon, PieChart as DashboardIcon, History as HistoryIcon, Star as RecommendIcon } from '@mui/icons-material';
import HeroHeader from '../components/layout/HeroHeader';
import MealLogger from '../components/diet/MealLogger';
import NutritionDashboard from '../components/diet/NutritionDashboard';
import MealHistory from '../components/diet/MealHistory';
import MealRecommendations from '../components/diet/MealRecommendations';

const DietPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRecommendedMeal, setSelectedRecommendedMeal] = useState(null);


  const handleMealSaved = (newMeal) => {
    showNotification(`Meal "${newMeal.name}" saved successfully!`, 'success');
    setSelectedRecommendedMeal(null); // Clear selected meal after saving
  };

  const handleMealSelect = (recommendedMeal) => {
    setSelectedRecommendedMeal(recommendedMeal);
    setActiveTab(0); // Switch to Log Meal tab
    showNotification(`Selected "${recommendedMeal.name}" - ready to log!`, 'info');
  };

  const handleMealDeleted = (mealId) => {
    showNotification('Meal deleted successfully!', 'info');
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get user's calorie target from dashboard data
  const getUserCalorieTarget = () => {
    const savedData = localStorage.getItem('fitnessTrackerData');
    if (savedData) {
      const userData = JSON.parse(savedData);
      // If user has calculated their TDEE, use that, otherwise return null
      return userData.targetCalories || null;
    }
    return null;
  };

  const dailyCalorieTarget = getUserCalorieTarget();
  const dailyProteinTarget = dailyCalorieTarget ? Math.round(dailyCalorieTarget * 0.3 / 4) : 0; // 30% of calories from protein
  const dailyCarbTarget = dailyCalorieTarget ? Math.round(dailyCalorieTarget * 0.45 / 4) : 0; // 45% of calories from carbs
  const dailyFatTarget = dailyCalorieTarget ? Math.round(dailyCalorieTarget * 0.25 / 9) : 0; // 25% of calories from fat

  return (
    <Box>
      <HeroHeader
        icon={<DietIcon fontSize="large" />}
        title="Diet & Nutrition"
        subtitle="Log daily meals, track calories, and maintain a balanced diet"
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="diet tabs" textColor="primary" indicatorColor="primary">
          <Tab icon={<LogIcon />} iconPosition="start" label="Log Meal" />
          <Tab icon={<RecommendIcon />} iconPosition="start" label="Meal Recommendations" />
          <Tab icon={<DashboardIcon />} iconPosition="start" label="Nutrition Dashboard" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Meal History" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Log your meal:</strong> Add food items, track nutrition, and save your meals. 
              Your daily calorie target is {dailyCalorieTarget} calories.
            </Typography>
          </Alert>
          
          <MealLogger 
            onMealSaved={handleMealSaved} 
            dailyCalorieTarget={dailyCalorieTarget}
            recommendedMeal={selectedRecommendedMeal}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Get personalized recommendations:</strong> AI-powered meal suggestions based on your fitness goals, 
              dietary preferences, and nutritional needs.
            </Typography>
          </Alert>
          
          <MealRecommendations onMealSelect={handleMealSelect} />
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Monitor your nutrition:</strong> Track your daily calorie intake, macronutrient balance, 
              and get personalized recommendations based on your targets.
            </Typography>
          </Alert>
          
          <NutritionDashboard 
            dailyCalorieTarget={dailyCalorieTarget}
            dailyProteinTarget={dailyProteinTarget}
            dailyCarbTarget={dailyCarbTarget}
            dailyFatTarget={dailyFatTarget}
          />
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>View your progress:</strong> See all your logged meals, track your nutrition journey, 
              and analyze your eating patterns over time.
            </Typography>
          </Alert>
          
          <MealHistory onMealDeleted={handleMealDeleted} />
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DietPage; 