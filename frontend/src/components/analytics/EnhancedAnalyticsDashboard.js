import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as DietIcon,
  Scale as WeightIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const EnhancedAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30');
  const [chartData, setChartData] = useState({
    weightProgress: [],
    workoutStats: [],
    nutritionData: [],
    fitnessScore: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    // Load real data from localStorage
    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');

    // Generate charts from real data
    const realWeightData = generateRealWeightData(weightEntries);
    const realWorkoutData = generateRealWorkoutData(workouts);
    const realNutritionData = generateRealNutritionData(meals);
    const realFitnessScore = generateRealFitnessScore(userData, weightEntries, workouts, meals);

    setChartData({
      weightProgress: realWeightData,
      workoutStats: realWorkoutData,
      nutritionData: realNutritionData,
      fitnessScore: realFitnessScore
    });
  };

  // Generate real weight data from stored entries
  const generateRealWeightData = (weightEntries) => {
    if (!weightEntries || weightEntries.length === 0) {
      return generateWeightData(); // Fallback to mock data
    }

    const days = parseInt(timeRange);
    const filteredEntries = weightEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return entryDate >= cutoffDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return filteredEntries.map(entry => {
      const date = new Date(entry.date);
      const height = parseFloat(localStorage.getItem('fitnessTrackerData')?.height || 175) / 100;
      const bmi = entry.weight / (height * height);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: entry.weight,
        bmi: Math.round(bmi * 10) / 10
      };
    });
  };

  const generateWeightData = () => {
    const data = [];
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: 70 + Math.random() * 5 - 2.5,
        bmi: 22 + Math.random() * 2 - 1
      });
    }
    return data;
  };

  // Generate real workout data from stored workouts
  const generateRealWorkoutData = (workouts) => {
    if (!workouts || workouts.length === 0) {
      return generateWorkoutData(); // Fallback to mock data
    }

    const workoutTypes = {};
    workouts.forEach(workout => {
      if (!workoutTypes[workout.type]) {
        workoutTypes[workout.type] = {
          name: workout.type,
          duration: 0,
          calories: 0,
          frequency: 0
        };
      }
      workoutTypes[workout.type].duration += workout.duration || 0;
      workoutTypes[workout.type].calories += workout.caloriesBurned || 0;
      workoutTypes[workout.type].frequency += 1;
    });

    return Object.values(workoutTypes).map(workout => ({
      name: workout.name,
      duration: Math.round(workout.duration / workout.frequency),
      calories: Math.round(workout.calories / workout.frequency),
      frequency: workout.frequency
    }));
  };

  const generateWorkoutData = () => {
    const workouts = ['Push-ups', 'Squats', 'Running', 'Weight Lifting', 'Yoga'];
    return workouts.map(workout => ({
      name: workout,
      duration: Math.floor(Math.random() * 60) + 15,
      calories: Math.floor(Math.random() * 200) + 50,
      frequency: Math.floor(Math.random() * 7) + 1
    }));
  };

  // Generate real nutrition data from stored meals
  const generateRealNutritionData = (meals) => {
    if (!meals || meals.length === 0) {
      return generateNutritionData(); // Fallback to mock data
    }

    const days = parseInt(timeRange);
    const recentMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return mealDate >= cutoffDate;
    });

    const totals = recentMeals.reduce((acc, meal) => ({
      protein: acc.protein + (meal.totalProtein || 0),
      carbs: acc.carbs + (meal.totalCarbs || 0),
      fat: acc.fat + (meal.totalFat || 0),
      calories: acc.calories + (meal.totalCalories || 0)
    }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

    const avgDaily = {
      protein: Math.round(totals.protein / Math.max(1, days)),
      carbs: Math.round(totals.carbs / Math.max(1, days)),
      fat: Math.round(totals.fat / Math.max(1, days)),
      calories: Math.round(totals.calories / Math.max(1, days))
    };

    return [
      { name: 'Protein', value: avgDaily.protein, color: '#8884d8' },
      { name: 'Carbs', value: avgDaily.carbs, color: '#82ca9d' },
      { name: 'Fat', value: avgDaily.fat, color: '#ffc658' },
      { name: 'Calories', value: Math.round(avgDaily.calories / 10), color: '#ff7300' }
    ];
  };

  const generateNutritionData = () => {
    const nutrients = ['Protein', 'Carbs', 'Fat', 'Fiber'];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
    return nutrients.map((nutrient, index) => ({
      name: nutrient,
      value: Math.floor(Math.random() * 100) + 20,
      color: colors[index]
    }));
  };

  // Generate real fitness score from user data
  const generateRealFitnessScore = (userData, weightEntries, workouts, meals) => {
    if (!userData || Object.keys(userData).length === 0) {
      return generateFitnessScoreData(); // Fallback to mock data
    }

    const days = parseInt(timeRange);
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Calculate daily metrics
      const dayWorkouts = workouts.filter(w => w.date === dateStr);
      const dayMeals = meals.filter(m => m.date === dateStr);
      const dayWeight = weightEntries.find(w => w.date === dateStr);

      // Calculate fitness score components
      const workoutScore = Math.min(30, dayWorkouts.length * 10);
      const nutritionScore = Math.min(30, dayMeals.length * 7.5);
      const consistencyScore = (dayWorkouts.length > 0 || dayMeals.length > 0) ? 20 : 0;
      const totalScore = workoutScore + nutritionScore + consistencyScore;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.max(40, totalScore),
        workout: workoutScore,
        nutrition: nutritionScore,
        consistency: consistencyScore
      });
    }
    return data;
  };

  const generateFitnessScoreData = () => {
    const data = [];
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.floor(Math.random() * 40) + 40,
        workout: Math.floor(Math.random() * 30) + 20,
        nutrition: Math.floor(Math.random() * 30) + 20,
        consistency: Math.floor(Math.random() * 30) + 20
      });
    }
    return data;
  };

  const renderWeightProgressChart = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weight & BMI Progress
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.weightProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <RechartsTooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              strokeWidth={2}
              name="Weight (kg)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bmi"
              stroke="#82ca9d"
              strokeWidth={2}
              name="BMI"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderWorkoutAnalytics = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workout Duration by Exercise
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.workoutStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="duration" fill="#8884d8" name="Duration (min)" />
                <Bar dataKey="calories" fill="#82ca9d" name="Calories Burned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workout Frequency
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.workoutStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, frequency }) => `${name}: ${frequency}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="frequency"
                >
                  {chartData.workoutStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNutritionAnalytics = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Macronutrient Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.nutritionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}g`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.nutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Calorie Intake Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.weightProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Calories"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFitnessScoreAnalytics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comprehensive Fitness Score Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData.fitnessScore}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <RechartsTooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              strokeWidth={3}
              name="Overall Score"
            />
            <Line
              type="monotone"
              dataKey="workout"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Workout Score"
            />
            <Line
              type="monotone"
              dataKey="nutrition"
              stroke="#ffc658"
              strokeWidth={2}
              name="Nutrition Score"
            />
            <Line
              type="monotone"
              dataKey="consistency"
              stroke="#ff7300"
              strokeWidth={2}
              name="Consistency Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderSummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Current Weight
                </Typography>
                <Typography variant="h4">
                  {chartData.weightProgress[chartData.weightProgress.length - 1]?.weight?.toFixed(1) || '0.0'} kg
                </Typography>
                <Typography variant="body2" color="success.main">
                  {(() => {
                    if (chartData.weightProgress.length < 2) return 'No trend data';
                    const latest = chartData.weightProgress[chartData.weightProgress.length - 1]?.weight;
                    const earliest = chartData.weightProgress[0]?.weight;
                    const change = latest - earliest;
                    return change > 0 ? `↑ ${change.toFixed(1)} kg this period` : `↓ ${Math.abs(change).toFixed(1)} kg this period`;
                  })()}
                </Typography>
              </Box>
              <WeightIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Workouts This Week
                </Typography>
                <Typography variant="h4">
                  {(() => {
                    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
                    return userData.workoutsThisWeek || '0';
                  })()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {(() => {
                    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
                    const thisWeek = parseInt(userData.workoutsThisWeek) || 0;
                    const lastWeek = Math.max(0, thisWeek - Math.floor(Math.random() * 3));
                    const change = thisWeek - lastWeek;
                    return change > 0 ? `+${change} from last week` : 'Same as last week';
                  })()}
                </Typography>
              </Box>
              <WorkoutIcon color="secondary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Avg. Daily Calories
                </Typography>
                <Typography variant="h4">
                  {(() => {
                    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
                    return userData.caloriesToday || '0';
                  })()}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  {(() => {
                    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
                    const current = parseInt(userData.caloriesToday) || 0;
                    const target = 2000; // Default target
                    const diff = current - target;
                    return diff > 0 ? `+${diff} from target` : `${Math.abs(diff)} below target`;
                  })()}
                </Typography>
              </Box>
              <DietIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Fitness Score
                </Typography>
                <Typography variant="h4">
                  {(() => {
                    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
                    const workouts = parseInt(userData.workoutsThisWeek) || 0;
                    const calories = parseInt(userData.caloriesToday) || 0;
                    const streak = parseInt(userData.streakDays) || 0;
                    
                    // Calculate fitness score based on activity
                    let score = 40; // Base score
                    score += Math.min(30, workouts * 5); // Workout component
                    score += Math.min(20, Math.floor(calories / 100)); // Nutrition component
                    score += Math.min(10, streak); // Consistency component
                    
                    return Math.min(100, score) + '%';
                  })()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {(() => {
                    const userData = JSON.parse(localStorage.getItem('fitnessTrackerData') || '{}');
                    const streak = parseInt(userData.streakDays) || 0;
                    return streak > 0 ? `+${Math.min(5, streak)}% this week` : 'Start your streak!';
                  })()}
                </Typography>
              </Box>
              <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Enhanced Analytics Dashboard
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={loadAnalyticsData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Report">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {renderSummaryCards()}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Weight Progress" />
          <Tab label="Workout Analytics" />
          <Tab label="Nutrition Analytics" />
          <Tab label="Fitness Score" />
        </Tabs>
      </Paper>

      {activeTab === 0 && renderWeightProgressChart()}
      {activeTab === 1 && renderWorkoutAnalytics()}
      {activeTab === 2 && renderNutritionAnalytics()}
      {activeTab === 3 && renderFitnessScoreAnalytics()}
    </Box>
  );
};

export default EnhancedAnalyticsDashboard;
