import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as DietIcon,
  People as CommunityIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { 
  calculateBMI, 
  calculateBMR, 
  calculateTDEE, 
  calculateCalorieTarget,
  calculateProgress 
} from '../utils/calculations';
import { ensureDataExists, initializeSampleData } from '../utils/sampleDataGenerator';

const Dashboard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  
  // User input state
  const [userInputs, setUserInputs] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    goal: '',
    weeklyChange: '',
    targetWeight: '',
    workoutsThisWeek: '',
    totalWorkouts: '',
    caloriesToday: '',
    streakDays: ''
  });

  // Calculated results state
  const [calculatedStats, setCalculatedStats] = useState({
    currentWeight: 0,
    targetWeight: 0,
    workoutsThisWeek: 0,
    totalWorkouts: 0,
    caloriesToday: 0,
    targetCalories: 0,
    streakDays: 0,
    bmi: 0,
    bmr: 0,
    tdee: 0
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('fitnessTrackerData');
    if (savedData && savedData !== '{}') {
      const parsedData = JSON.parse(savedData);
      setUserInputs(prev => ({ ...prev, ...parsedData }));
      calculateAllStats({ ...parsedData });
    } else {
      // Initialize with sample data if no data exists
      const sampleData = ensureDataExists({ name: user?.name || 'Gowthammm' });
      setUserInputs(prev => ({ ...prev, ...sampleData }));
      calculateAllStats({ ...sampleData });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateAllStats = (inputs) => {
    if (!inputs.weight || !inputs.height || !inputs.age) return;

    const weight = parseFloat(inputs.weight);
    const height = parseFloat(inputs.height) / 100; // Convert cm to meters
    const age = parseInt(inputs.age);
    const targetWeight = parseFloat(inputs.targetWeight) || weight;

    // Calculate BMI
    const bmiResult = calculateBMI(weight, height);
    
    // Calculate BMR and TDEE
    const bmr = calculateBMR(weight, parseFloat(inputs.height), age, inputs.gender);
    const tdee = calculateTDEE(bmr, inputs.activityLevel);
    
    // Calculate calorie target based on goal
    const calorieTarget = calculateCalorieTarget(tdee, inputs.goal, parseFloat(inputs.weeklyChange));
    
    // Calculate weight progress
    const weightProgress = calculateProgress(weight, targetWeight, 'weight_loss');
    
    // Calculate calorie progress
    const calorieProgress = calculateProgress(
      parseFloat(inputs.caloriesToday), 
      calorieTarget.targetCalories, 
      'calorie'
    );

    setCalculatedStats({
      currentWeight: weight,
      targetWeight: targetWeight,
      workoutsThisWeek: parseInt(inputs.workoutsThisWeek) || 0,
      totalWorkouts: parseInt(inputs.totalWorkouts) || 0,
      caloriesToday: parseFloat(inputs.caloriesToday) || 0,
      targetCalories: calorieTarget.targetCalories,
      streakDays: parseInt(inputs.streakDays) || 0,
      bmi: parseFloat(bmiResult.bmi),
      bmr: bmr,
      tdee: tdee,
      weightProgress: weightProgress,
      calorieProgress: calorieProgress
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    calculateAllStats(userInputs);
    
    // Save to localStorage
    localStorage.setItem('fitnessTrackerData', JSON.stringify(userInputs));
    
    setIsEditing(false);
    setShowInputDialog(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowInputDialog(false);
    
    // Reload saved data
    const savedData = localStorage.getItem('fitnessTrackerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserInputs(prev => ({ ...prev, ...parsedData }));
    }
  };

  const handleGenerateSampleData = () => {
    const sampleData = initializeSampleData({ name: user?.name || 'Gowthammm' });
    setUserInputs(prev => ({ ...prev, ...sampleData }));
    calculateAllStats({ ...userInputs, ...sampleData });
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return 'warning';
    if (bmi < 25) return 'success';
    if (bmi < 30) return 'warning';
    return 'error';
  };

  const getActivityLevelLabel = (level) => {
    const labels = {
      'sedentary': 'Sedentary',
      'light': 'Light',
      'moderate': 'Moderate',
      'active': 'Active',
      'very_active': 'Very Active'
    };
    return labels[level] || level;
  };

  const getGoalLabel = (goal) => {
    const labels = {
      'lose': 'Lose Weight',
      'maintain': 'Maintain Weight',
      'gain': 'Gain Weight'
    };
    return labels[goal] || goal;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'User'}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Here's your fitness overview for today
      </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateSampleData}
          >
            Generate Sample Data
          </Button>
          <Button
            variant="outlined"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => setShowInputDialog(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Data'}
          </Button>
        </Box>
      </Box>

      {/* Input Dialog */}
      <Dialog 
        open={showInputDialog} 
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Update Your Fitness Data
          <Typography variant="body2" color="text.secondary">
            Enter your current measurements and goals to get personalized calculations
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Current Weight (kg)"
                name="weight"
                type="number"
                value={userInputs.weight}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Target Weight (kg)"
                name="targetWeight"
                type="number"
                value={userInputs.targetWeight}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                value={userInputs.height}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={userInputs.age}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 120 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={userInputs.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Activity Level</InputLabel>
                <Select
                  name="activityLevel"
                  value={userInputs.activityLevel}
                  onChange={handleInputChange}
                  label="Activity Level"
                >
                  <MenuItem value="sedentary">Sedentary (Little exercise)</MenuItem>
                  <MenuItem value="light">Light (1-3 days/week)</MenuItem>
                  <MenuItem value="moderate">Moderate (3-5 days/week)</MenuItem>
                  <MenuItem value="active">Active (6-7 days/week)</MenuItem>
                  <MenuItem value="very_active">Very Active (Hard exercise)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Goal</InputLabel>
                <Select
                  name="goal"
                  value={userInputs.goal}
                  onChange={handleInputChange}
                  label="Goal"
                >
                  <MenuItem value="lose">Lose Weight</MenuItem>
                  <MenuItem value="maintain">Maintain Weight</MenuItem>
                  <MenuItem value="gain">Gain Weight</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Weekly Change (kg)"
                name="weeklyChange"
                type="number"
                value={userInputs.weeklyChange}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.1 }}
                disabled={userInputs.goal === 'maintain'}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Workouts This Week"
                name="workoutsThisWeek"
                type="number"
                value={userInputs.workoutsThisWeek}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Total Workouts"
                name="totalWorkouts"
                type="number"
                value={userInputs.totalWorkouts}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Calories Today"
                name="caloriesToday"
                type="number"
                value={userInputs.caloriesToday}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Current Streak (days)"
                name="streakDays"
                type="number"
                value={userInputs.streakDays}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
          
          {calculatedStats.bmi > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Preview:</strong> Your calculated BMI is {calculatedStats.bmi.toFixed(1)} 
                ({getBMICategory(calculatedStats.bmi)}). Daily calorie target: {calculatedStats.targetCalories} kcal.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
            Save & Calculate
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {/* Weight Progress Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card className="card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Weight Progress</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {calculatedStats.currentWeight > 0 ? `${calculatedStats.currentWeight} kg` : '-- kg'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Target: {calculatedStats.targetWeight > 0 ? `${calculatedStats.targetWeight} kg` : '-- kg'}
              </Typography>
              {calculatedStats.weightProgress && (
                <>
              <LinearProgress 
                variant="determinate" 
                    value={calculatedStats.weightProgress.percentage} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                    {calculatedStats.weightProgress.percentage}% - {calculatedStats.weightProgress.status}
              </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Workout Stats Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card className="card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <WorkoutIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Workouts</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {calculatedStats.workoutsThisWeek > 0 ? calculatedStats.workoutsThisWeek : '--'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                This week
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total: {calculatedStats.totalWorkouts > 0 ? calculatedStats.totalWorkouts : '--'} workouts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Calories Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card className="card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DietIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Calories</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {calculatedStats.caloriesToday > 0 ? calculatedStats.caloriesToday : '--'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Target: {calculatedStats.targetCalories > 0 ? `${calculatedStats.targetCalories} kcal` : '-- kcal'}
              </Typography>
              {calculatedStats.calorieProgress && (
                <>
              <LinearProgress 
                variant="determinate" 
                    value={calculatedStats.calorieProgress.percentage} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                    {calculatedStats.calorieProgress.percentage}% - {calculatedStats.calorieProgress.status}
              </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* BMI Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card className="card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CommunityIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">BMI</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {calculatedStats.bmi > 0 ? calculatedStats.bmi.toFixed(1) : '--'}
              </Typography>
              {calculatedStats.bmi > 0 && (
              <Chip 
                  label={getBMICategory(calculatedStats.bmi)} 
                  color={getBMIColor(calculatedStats.bmi)} 
                size="small" 
                sx={{ mb: 1 }}
              />
              )}
              <Typography variant="caption" color="text.secondary">
                Healthy range: 18.5 - 24.9
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Streak Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Current Streak</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {calculatedStats.streakDays > 0 ? `${calculatedStats.streakDays} days` : '-- days'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep up the great work! 🔥
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <WorkoutIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">Log Workout</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <DietIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">Log Meal</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info Cards */}
      {calculatedStats.bmr > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  BMR (Basal Metabolic Rate)
                </Typography>
                <Typography variant="h4" color="primary">
                  {calculatedStats.bmr} kcal/day
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calories your body needs at rest
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  TDEE (Total Daily Energy)
                </Typography>
                <Typography variant="h4" color="secondary">
                  {calculatedStats.tdee} kcal/day
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getActivityLevelLabel(userInputs.activityLevel)} activity level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Goal
                </Typography>
                <Typography variant="h4" color="success">
                  {getGoalLabel(userInputs.goal)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInputs.goal !== 'maintain' && `Target: ${userInputs.weeklyChange} kg/week`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 