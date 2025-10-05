import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  LocalFireDepartment,
  FitnessCenter,
  Restaurant,
  TrendingUp,
  TrendingDown,
  CheckCircle
} from '@mui/icons-material';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateCalorieTarget, 
  calculateProteinNeeds 
} from '../utils/calculations';

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    goal: '',
    weeklyChange: ''
  });
  
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (Little or no exercise)' },
    { value: 'light', label: 'Light (Exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (Exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (Exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (Hard exercise, physical job)' }
  ];

  const goals = [
    { value: 'lose', label: 'Lose Weight', icon: <TrendingDown /> },
    { value: 'maintain', label: 'Maintain Weight', icon: <CheckCircle /> },
    { value: 'gain', label: 'Gain Weight', icon: <TrendingUp /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    if (!formData.height || formData.height <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    
    if (!formData.age || formData.age <= 0) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (formData.goal === 'lose' && parseFloat(formData.weeklyChange) <= 0) {
      newErrors.weeklyChange = 'Weekly weight loss should be positive';
    }
    
    if (formData.goal === 'gain' && parseFloat(formData.weeklyChange) <= 0) {
      newErrors.weeklyChange = 'Weekly weight gain should be positive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    const weeklyChange = parseFloat(formData.weeklyChange);
    
    // Calculate BMR
    const bmr = calculateBMR(weight, height, age, formData.gender);
    
    // Calculate TDEE
    const tdee = calculateTDEE(bmr, formData.activityLevel);
    
    // Calculate calorie target based on goal
    const calorieTarget = calculateCalorieTarget(tdee, formData.goal, weeklyChange);
    
    // Calculate protein needs
    const proteinNeeds = calculateProteinNeeds(weight, formData.activityLevel);
    
    // Calculate macronutrient breakdown
    const proteinCalories = proteinNeeds.proteinCalories;
    const fatCalories = calorieTarget.targetCalories * 0.25; // 25% from fat
    const carbCalories = calorieTarget.targetCalories - proteinCalories - fatCalories;
    
    setResults({
      bmr,
      tdee,
      calorieTarget,
      proteinNeeds,
      macros: {
        protein: {
          grams: proteinNeeds.proteinGrams,
          calories: proteinCalories,
          percentage: Math.round((proteinCalories / calorieTarget.targetCalories) * 100)
        },
        fat: {
          grams: Math.round(fatCalories / 9), // 9 calories per gram of fat
          calories: Math.round(fatCalories),
          percentage: 25
        },
        carbs: {
          grams: Math.round(carbCalories / 4), // 4 calories per gram of carbs
          calories: Math.round(carbCalories),
          percentage: Math.round((carbCalories / calorieTarget.targetCalories) * 100)
        }
      }
    });
  };

  const getGoalColor = (goal) => {
    switch (goal) {
      case 'lose': return 'success';
      case 'maintain': return 'info';
      case 'gain': return 'warning';
      default: return 'primary';
    }
  };

  const getWeeklyChangeText = () => {
    if (formData.goal === 'lose') {
      return `Lose ${formData.weeklyChange} kg per week`;
    } else if (formData.goal === 'gain') {
      return `Gain ${formData.weeklyChange} kg per week`;
    }
    return 'Maintain current weight';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Calorie Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Calculate your daily calorie needs and macronutrient breakdown
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    error={!!errors.weight}
                    helperText={errors.weight}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    error={!!errors.height}
                    helperText={errors.height}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    error={!!errors.age}
                    helperText={errors.age}
                    inputProps={{ min: 0, max: 120 }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </TextField>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    select
                    label="Activity Level"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    SelectProps={{ native: true }}
                  >
                    {activityLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    SelectProps={{ native: true }}
                  >
                    {goals.map((goal) => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Weekly Change (kg)"
                    name="weeklyChange"
                    type="number"
                    value={formData.weeklyChange}
                    onChange={handleInputChange}
                    error={!!errors.weeklyChange}
                    helperText={errors.weeklyChange}
                    inputProps={{ min: 0, step: 0.1 }}
                    disabled={formData.goal === 'maintain'}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  fullWidth
                  size="large"
                  startIcon={<LocalFireDepartment />}
                >
                  Calculate Calories
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          {results && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Daily Calorie Plan
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {results.calorieTarget.targetCalories}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    calories per day
                  </Typography>
                  <Chip 
                    label={getWeeklyChangeText()} 
                    color={getGoalColor(formData.goal)}
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 4 }}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main">
                        {results.macros.protein.grams}g
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Protein ({results.macros.protein.percentage}%)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="warning.main">
                        {results.macros.fat.grams}g
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fat ({results.macros.fat.percentage}%)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="info.main">
                        {results.macros.carbs.grams}g
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Carbs ({results.macros.carbs.percentage}%)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LocalFireDepartment color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="BMR (Basal Metabolic Rate)"
                      secondary={`${results.bmr} calories/day`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FitnessCenter color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="TDEE (Total Daily Energy Expenditure)"
                      secondary={`${results.tdee} calories/day`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Restaurant color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Protein Needs"
                      secondary={`${results.proteinNeeds.proteinGrams}g (${results.proteinNeeds.proteinCalories} calories)`}
                    />
                  </ListItem>
                </List>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> These calculations are estimates. Adjust based on your progress and consult with a healthcare professional for personalized advice.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalorieCalculator;
