import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  Box as MuiBox
} from '@mui/material';
import {
  LocalFireDepartment as CalorieIcon,
  Restaurant as ProteinIcon,
  Grain as CarbIcon,
  OilBarrel as FatIcon,
  TrendingUp as ProgressIcon,
  TrendingDown as DeficitIcon,
  Restaurant
} from '@mui/icons-material';

const NutritionDashboard = ({ dailyCalorieTarget = 2000, dailyProteinTarget = 150, dailyCarbTarget = 250, dailyFatTarget = 67 }) => {
  const [todayMeals, setTodayMeals] = useState([]);
  const [todayNutrition, setTodayNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    loadTodayMeals();
  }, []);

  const loadTodayMeals = () => {
    const savedMeals = JSON.parse(localStorage.getItem('meals') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todayMealsData = savedMeals.filter(meal => meal.date === today);
    
    setTodayMeals(todayMealsData);
    
    // Calculate total nutrition for today
    const totalNutrition = todayMealsData.reduce((acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setTodayNutrition(totalNutrition);
  };

  const getCalorieProgress = () => {
    const percentage = (todayNutrition.calories / dailyCalorieTarget) * 100;
    return Math.min(percentage, 100);
  };

  const getMacroProgress = (current, target) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100);
  };

  const getCalorieStatus = () => {
    const difference = todayNutrition.calories - dailyCalorieTarget;
    if (difference > 0) {
      return { status: 'Over Target', color: 'error', icon: <DeficitIcon /> };
    } else if (difference < -200) {
      return { status: 'Under Target', color: 'warning', icon: <DeficitIcon /> };
    } else {
      return { status: 'On Target', color: 'success', icon: <ProgressIcon /> };
    }
  };

  const getMacroStatus = (current, target, macroName) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) {
      return { status: 'Balanced', color: 'success' };
    } else if (percentage < 90) {
      return { status: 'Low', color: 'warning' };
    } else {
      return { status: 'High', color: 'error' };
    }
  };

  const getRemainingCalories = () => {
    return Math.max(0, dailyCalorieTarget - todayNutrition.calories);
  };

  const getMealTypeBreakdown = () => {
    const breakdown = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
    todayMeals.forEach(meal => {
      breakdown[meal.mealType] += meal.totalCalories;
    });
    return breakdown;
  };

  const mealBreakdown = getMealTypeBreakdown();
  const calorieStatus = getCalorieStatus();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Today's Nutrition Overview
      </Typography>
      
      {/* Main Calorie Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <CalorieIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h3" color="primary">
                {todayNutrition.calories}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                / {dailyCalorieTarget} calories
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip 
                label={calorieStatus.status} 
                color={calorieStatus.color}
                icon={calorieStatus.icon}
                size="large"
              />
            </Box>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={getCalorieProgress()} 
            sx={{ height: 12, borderRadius: 6, mb: 2 }}
            color={calorieStatus.color === 'success' ? 'success' : 'primary'}
          />
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Remaining: {getRemainingCalories()} calories
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Progress: {getCalorieProgress().toFixed(1)}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Macronutrients Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ProteinIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success">
                {todayNutrition.protein}g
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Protein
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getMacroProgress(todayNutrition.protein, dailyProteinTarget)} 
                color="success"
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Chip 
                label={getMacroStatus(todayNutrition.protein, dailyProteinTarget, 'protein').status}
                color={getMacroStatus(todayNutrition.protein, dailyProteinTarget, 'protein').color}
                size="small"
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Target: {dailyProteinTarget}g
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CarbIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info">
                {todayNutrition.carbs}g
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Carbohydrates
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getMacroProgress(todayNutrition.carbs, dailyCarbTarget)} 
                color="info"
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Chip 
                label={getMacroStatus(todayNutrition.carbs, dailyCarbTarget, 'carbs').status}
                color={getMacroStatus(todayNutrition.carbs, dailyCarbTarget, 'carbs').color}
                size="small"
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Target: {dailyCarbTarget}g
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FatIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning">
                {todayNutrition.fat}g
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fat
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getMacroProgress(todayNutrition.fat, dailyFatTarget)} 
                color="warning"
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Chip 
                label={getMacroStatus(todayNutrition.fat, dailyFatTarget, 'fat').status}
                color={getMacroStatus(todayNutrition.fat, dailyFatTarget, 'fat').color}
                size="small"
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Target: {dailyFatTarget}g
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Restaurant color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="secondary">
                {todayMeals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Meals Today
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {todayMeals.length === 0 ? 'No meals logged yet' : 'Keep it up!'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Meal Type Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Meal Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {mealBreakdown.breakfast}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Breakfast
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box textAlign="center">
                <Typography variant="h6" color="success">
                  {mealBreakdown.lunch}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lunch
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box textAlign="center">
                <Typography variant="h6" color="secondary">
                  {mealBreakdown.dinner}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dinner
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box textAlign="center">
                <Typography variant="h6" color="warning">
                  {mealBreakdown.snack}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Snacks
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Nutrition Recommendations
          </Typography>
          
          {todayMeals.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Start your day right!</strong> Log your first meal to begin tracking your nutrition.
              </Typography>
            </Alert>
          ) : (
            <Box>
              {getRemainingCalories() > 200 && (
                <Alert severity="info" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>You have {getRemainingCalories()} calories remaining.</strong> Consider adding a healthy snack or adjusting your meal portions.
                  </Typography>
                </Alert>
              )}
              
              {todayNutrition.protein < dailyProteinTarget * 0.8 && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Protein intake is low.</strong> Consider adding lean protein sources like chicken, fish, eggs, or legumes.
                  </Typography>
                </Alert>
              )}
              
              {todayNutrition.carbs < dailyCarbTarget * 0.8 && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Carbohydrate intake is low.</strong> Add whole grains, fruits, or vegetables for energy.
                  </Typography>
                </Alert>
              )}
              
              {todayNutrition.fat > dailyFatTarget * 1.2 && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Fat intake is high.</strong> Consider reducing high-fat foods and choosing leaner options.
                  </Typography>
                </Alert>
              )}
              
              {getCalorieProgress() >= 100 && (
                <Alert severity="success">
                  <Typography variant="body2">
                    <strong>Great job!</strong> You've reached your daily calorie target. Remember to stay hydrated and get adequate rest.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NutritionDashboard;
