import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as NutritionIcon,
  Scale as WeightIcon,
  LocalFireDepartment as CalorieIcon
} from '@mui/icons-material';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    workouts: [],
    meals: [],
    weightEntries: [],
    userData: null
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');

    setAnalytics({ workouts, meals, weightEntries, userData });
  };

  const getWorkoutAnalytics = () => {
    if (analytics.workouts.length === 0) return null;

    const totalWorkouts = analytics.workouts.length;
    const totalDuration = analytics.workouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
    const totalExercises = analytics.workouts.reduce((sum, w) => sum + w.totalExercises, 0);
    const totalSets = analytics.workouts.reduce((sum, w) => sum + w.totalSets, 0);
    const totalReps = analytics.workouts.reduce((sum, w) => sum + w.totalReps, 0);
    const totalCalories = analytics.workouts.reduce((sum, w) => sum + w.estimatedCalories, 0);

    // Weekly trends
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekWorkouts = analytics.workouts.filter(w => new Date(w.date) >= oneWeekAgo);
    const lastWeekWorkouts = analytics.workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      return workoutDate >= twoWeeksAgo && workoutDate < oneWeekAgo;
    });

    const weeklyChange = thisWeekWorkouts.length - lastWeekWorkouts.length;
    const weeklyTrend = weeklyChange > 0 ? 'increasing' : weeklyChange < 0 ? 'decreasing' : 'stable';

    return {
      totalWorkouts,
      totalDuration,
      totalExercises,
      totalSets,
      totalReps,
      totalCalories,
      avgDuration: Math.round(totalDuration / totalWorkouts),
      avgExercises: Math.round(totalExercises / totalWorkouts),
      weeklyChange,
      weeklyTrend,
      thisWeekCount: thisWeekWorkouts.length,
      lastWeekCount: lastWeekWorkouts.length
    };
  };

  const getNutritionAnalytics = () => {
    if (analytics.meals.length === 0) return null;

    const totalMeals = analytics.meals.length;
    const totalCalories = analytics.meals.reduce((sum, m) => sum + m.totalCalories, 0);
    const totalProtein = analytics.meals.reduce((sum, m) => sum + m.totalProtein, 0);
    const totalCarbs = analytics.meals.reduce((sum, m) => sum + m.totalCarbs, 0);
    const totalFat = analytics.meals.reduce((sum, m) => sum + m.totalFat, 0);

    // Daily averages
    const uniqueDays = [...new Set(analytics.meals.map(m => m.date))];
    const avgCaloriesPerDay = Math.round(totalCalories / uniqueDays.length);
    const avgProteinPerDay = Math.round(totalProtein / uniqueDays.length);
    const avgCarbsPerDay = Math.round(totalCarbs / uniqueDays.length);
    const avgFatPerDay = Math.round(totalFat / uniqueDays.length);

    // Meal type distribution
    const mealTypes = analytics.meals.reduce((acc, meal) => {
      acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
      return acc;
    }, {});

    return {
      totalMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      avgCaloriesPerDay,
      avgProteinPerDay,
      avgCarbsPerDay,
      avgFatPerDay,
      mealTypes,
      daysTracked: uniqueDays.length
    };
  };

  const getWeightAnalytics = () => {
    if (analytics.weightEntries.length < 2) return null;

    const sortedEntries = [...analytics.weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedEntries[0].weight;
    const currentWeight = sortedEntries[sortedEntries.length - 1].weight;
    const targetWeight = analytics.userData?.targetWeight || 70;

    const totalChange = currentWeight - firstWeight;
    const changeFromTarget = currentWeight - targetWeight;
    const progressToTarget = ((firstWeight - currentWeight) / (firstWeight - targetWeight)) * 100;

    // Weekly rate
    const daysTracked = Math.ceil((new Date(sortedEntries[sortedEntries.length - 1].date) - new Date(sortedEntries[0].date)) / (1000 * 60 * 60 * 24));
    const weeklyRate = (totalChange / daysTracked) * 7;

    return {
      firstWeight,
      currentWeight,
      targetWeight,
      totalChange,
      changeFromTarget,
      progressToTarget: Math.max(0, Math.min(100, progressToTarget)),
      weeklyRate,
      entriesCount: analytics.weightEntries.length,
      daysTracked
    };
  };

  const getOverallFitnessScore = () => {
    let score = 0;
    let maxScore = 0;

    // Workout consistency (30 points)
    if (analytics.workouts.length > 0) {
      const workoutScore = Math.min(30, analytics.workouts.length * 2);
      score += workoutScore;
      maxScore += 30;
    }

    // Nutrition tracking (25 points)
    if (analytics.meals.length > 0) {
      const nutritionScore = Math.min(25, analytics.meals.length * 1.5);
      score += nutritionScore;
      maxScore += 25;
    }

    // Weight tracking (20 points)
    if (analytics.weightEntries.length > 0) {
      const weightScore = Math.min(20, analytics.weightEntries.length * 1.5);
      score += weightScore;
      maxScore += 20;
    }

    // Goal progress (25 points)
    const weightAnalytics = getWeightAnalytics();
    if (weightAnalytics) {
      const goalScore = Math.min(25, weightAnalytics.progressToTarget * 0.25);
      score += goalScore;
      maxScore += 25;
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  };

  const getInsights = () => {
    const insights = [];
    const workoutAnalytics = getWorkoutAnalytics();
    const nutritionAnalytics = getNutritionAnalytics();
    const weightAnalytics = getWeightAnalytics();

    if (workoutAnalytics) {
      if (workoutAnalytics.weeklyTrend === 'increasing') {
        insights.push({
          type: 'success',
          icon: <TrendingUpIcon />,
          message: `Great job! You've increased your workout frequency by ${Math.abs(workoutAnalytics.weeklyChange)} workouts this week.`
        });
      } else if (workoutAnalytics.weeklyTrend === 'decreasing') {
        insights.push({
          type: 'warning',
          icon: <TrendingDownIcon />,
          message: `Your workout frequency decreased by ${Math.abs(workoutAnalytics.weeklyChange)} workouts this week. Consider adding more workouts.`
        });
      }

      if (workoutAnalytics.avgDuration < 30) {
        insights.push({
          type: 'info',
          icon: <InfoIcon />,
          message: `Your average workout duration is ${workoutAnalytics.avgDuration} minutes. Consider extending workouts for better results.`
        });
      }
    }

    if (nutritionAnalytics) {
      if (nutritionAnalytics.avgCaloriesPerDay < 1500) {
        insights.push({
          type: 'warning',
          icon: <WarningIcon />,
          message: `Your average daily calorie intake (${nutritionAnalytics.avgCaloriesPerDay}) seems low. Ensure you're meeting your nutritional needs.`
        });
      }

      if (nutritionAnalytics.avgProteinPerDay < 80) {
        insights.push({
          type: 'info',
          icon: <InfoIcon />,
          message: `Consider increasing protein intake. Current average: ${nutritionAnalytics.avgProteinPerDay}g/day.`
        });
      }
    }

    if (weightAnalytics) {
      if (weightAnalytics.progressToTarget >= 100) {
        insights.push({
          type: 'success',
          icon: <CheckCircleIcon />,
          message: `Congratulations! You've reached your target weight goal.`
        });
      } else if (weightAnalytics.progressToTarget >= 75) {
        insights.push({
          type: 'success',
          icon: <TrendingUpIcon />,
          message: `You're ${weightAnalytics.progressToTarget.toFixed(1)}% to your weight goal. Keep up the great work!`
        });
      }

      if (Math.abs(weightAnalytics.weeklyRate) > 1) {
        insights.push({
          type: 'warning',
          icon: <WarningIcon />,
          message: `Your weight is changing at ${Math.abs(weightAnalytics.weeklyRate).toFixed(1)} kg/week. This rate is quite fast - consider consulting a professional.`
        });
      }
    }

    return insights;
  };

  const workoutAnalytics = getWorkoutAnalytics();
  const nutritionAnalytics = getNutritionAnalytics();
  const weightAnalytics = getWeightAnalytics();
  const fitnessScore = getOverallFitnessScore();
  const insights = getInsights();

  return (
    <Box>
      {/* Overall Fitness Score */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box textAlign="center">
          <Typography variant="h1" fontWeight="bold" gutterBottom sx={{ fontSize: '4rem' }}>
            {fitnessScore}%
          </Typography>
          <Typography variant="h4" sx={{ opacity: 0.9, mb: 2 }}>
            Overall Fitness Score
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
            Based on workout consistency, nutrition tracking, weight progress, and goal achievement
          </Typography>
        </Box>
      </Paper>

      {/* Workout Analytics */}
      {workoutAnalytics && (
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <WorkoutIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={600}>🏋️ Workout Analytics</Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {workoutAnalytics.totalWorkouts}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Workouts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {workoutAnalytics.avgDuration} min
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Avg Duration
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {workoutAnalytics.thisWeekCount}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    This Week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {workoutAnalytics.totalExercises}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Exercises
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {workoutAnalytics.weeklyChange !== 0 && (
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`${workoutAnalytics.weeklyTrend === 'increasing' ? '+' : ''}${workoutAnalytics.weeklyChange} workouts this week`}
                color={workoutAnalytics.weeklyTrend === 'increasing' ? 'success' : 'warning'}
                icon={workoutAnalytics.weeklyTrend === 'increasing' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                size="large"
                sx={{ fontSize: '1rem', py: 1 }}
              />
            </Box>
          )}
        </Paper>
      )}

      {/* Nutrition Analytics */}
      {nutritionAnalytics && (
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <NutritionIcon color="success" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={600}>🍎 Nutrition Analytics</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {nutritionAnalytics.totalMeals}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Meals
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {nutritionAnalytics.avgCaloriesPerDay}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Avg Calories/Day
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {nutritionAnalytics.avgProteinPerDay}g
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Avg Protein/Day
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {nutritionAnalytics.daysTracked}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Days Tracked
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Weight Analytics */}
      {weightAnalytics && (
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <WeightIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={600}>⚖️ Weight Progress Analytics</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {weightAnalytics.currentWeight}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Current Weight (kg)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {weightAnalytics.targetWeight}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Target Weight (kg)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: weightAnalytics.totalChange > 0 
                  ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
                  : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {weightAnalytics.totalChange > 0 ? '+' : ''}{weightAnalytics.totalChange.toFixed(1)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Change (kg)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {weightAnalytics.progressToTarget.toFixed(1)}%
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Goal Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            💡 Personalized Insights
          </Typography>
          
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            {insights.map((insight, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {insight.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={insight.message}
                    primaryTypographyProps={{ 
                      variant: 'body1',
                      color: insight.type === 'success' ? 'success.main' : 
                             insight.type === 'warning' ? 'warning.main' : 'text.primary',
                      fontWeight: 500
                    }}
                  />
                </ListItem>
                {index < insights.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {insights.length === 0 && (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            📊 Start Tracking Your Progress!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Log workouts, meals, and weight entries to get personalized insights and analytics.
          </Typography>
          <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto', borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> The more data you provide, the better insights and recommendations you'll receive.
            </Typography>
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;
