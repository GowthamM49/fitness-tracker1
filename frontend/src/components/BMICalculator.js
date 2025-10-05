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
  LinearProgress
} from '@mui/material';
import { calculateBMI, calculateIdealWeightRange } from '../utils/calculations';

const BMICalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: ''
  });
  
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // Convert cm to meters
    const age = parseInt(formData.age);
    
    // Calculate BMI
    const bmiResult = calculateBMI(weight, height);
    
    // Calculate ideal weight range
    const idealWeight = calculateIdealWeightRange(parseFloat(formData.height), formData.gender);
    
    // Calculate progress towards ideal weight
    const currentBMI = parseFloat(bmiResult.bmi);
    let progressPercentage = 0;
    let progressStatus = '';
    
    if (currentBMI < 18.5) {
      // Underweight - progress towards normal weight
      progressPercentage = Math.min(100, (currentBMI / 18.5) * 100);
      progressStatus = 'Progress towards healthy weight';
    } else if (currentBMI >= 18.5 && currentBMI <= 24.9) {
      // Normal weight
      progressPercentage = 100;
      progressStatus = 'Maintaining healthy weight';
    } else {
      // Overweight - progress towards normal weight
      const excessBMI = currentBMI - 24.9;
      const maxExcess = 30 - 24.9; // From normal to obese threshold
      progressPercentage = Math.max(0, 100 - (excessBMI / maxExcess) * 100);
      progressStatus = 'Progress towards healthy weight';
    }
    
    setResults({
      bmi: bmiResult,
      idealWeight,
      progress: {
        percentage: Math.round(progressPercentage),
        status: progressStatus
      },
      recommendations: getRecommendations(bmiResult.bmi, weight, idealWeight)
    });
  };

  const getRecommendations = (bmi, currentWeight, idealWeight) => {
    const recommendations = [];
    
    if (bmi < 18.5) {
      recommendations.push('Consider increasing caloric intake');
      recommendations.push('Focus on strength training to build muscle');
      recommendations.push('Eat protein-rich foods');
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      recommendations.push('Maintain current healthy lifestyle');
      recommendations.push('Continue regular exercise routine');
      recommendations.push('Monitor weight regularly');
    } else if (bmi >= 25 && bmi < 30) {
      recommendations.push('Reduce caloric intake');
      recommendations.push('Increase physical activity');
      recommendations.push('Focus on cardiovascular exercises');
    } else {
      recommendations.push('Consult with healthcare professional');
      recommendations.push('Create structured weight loss plan');
      recommendations.push('Monitor progress regularly');
    }
    
    return recommendations;
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return 'warning';
    if (bmi >= 18.5 && bmi < 25) return 'success';
    if (bmi >= 25 && bmi < 30) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        BMI Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Calculate your Body Mass Index and get personalized recommendations
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enter Your Details
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
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  fullWidth
                  size="large"
                >
                  Calculate BMI
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
                  Your Results
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" color={getBMIColor(results.bmi.bmi)} gutterBottom>
                    {results.bmi.bmi}
                  </Typography>
                  <Chip 
                    label={results.bmi.category} 
                    color={results.bmi.color}
                    size="large"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Progress to Healthy Weight
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={results.progress.percentage} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {results.progress.percentage}% - {results.progress.status}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Ideal Weight Range
                  </Typography>
                  <Typography variant="body1">
                    {results.idealWeight.min} - {results.idealWeight.max} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on your height of {results.idealWeight.height} m
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations
                  </Typography>
                  {results.recommendations.map((rec, index) => (
                    <Alert key={index} severity="info" sx={{ mb: 1 }}>
                      {rec}
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BMICalculator;
