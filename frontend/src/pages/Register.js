import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
  Fade,
  Zoom
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  FitnessCenter as FitnessIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Cake as AgeIcon,
  Wc as GenderIcon,
  Flag as GoalIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'General Fitness',
    'Endurance Training',
    'Strength Training'
  ];

  const steps = ['Personal Info', 'Account Details', 'Fitness Profile', 'Review & Create'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 13 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age (13-100)';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (isNaN(formData.height) || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Please enter a valid height (100-250 cm)';
    }
    
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(formData.weight) || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Please enter a valid weight (30-300 kg)';
    }
    
    if (!formData.fitnessGoal) {
      newErrors.fitnessGoal = 'Fitness goal is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={handleChange}
                  error={!!errors.age}
                  helperText={errors.age}
                  InputProps={{
                    startAdornment: <AgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!!errors.gender}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange}
                    startAdornment={<GenderIcon sx={{ mr: 1, color: 'primary.main' }} />}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Fade>
        );
      
      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      
      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="height"
                  label="Height (cm)"
                  type="number"
                  id="height"
                  value={formData.height}
                  onChange={handleChange}
                  error={!!errors.height}
                  helperText={errors.height}
                  InputProps={{
                    startAdornment: <HeightIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  InputProps={{
                    startAdornment: <WeightIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required error={!!errors.fitnessGoal}>
                  <InputLabel id="fitness-goal-label">Fitness Goal</InputLabel>
                  <Select
                    labelId="fitness-goal-label"
                    id="fitnessGoal"
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    label="Fitness Goal"
                    onChange={handleChange}
                    startAdornment={<GoalIcon sx={{ mr: 1, color: 'primary.main' }} />}
                  >
                    {fitnessGoals.map((goal) => (
                      <MenuItem key={goal} value={goal}>
                        {goal}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Fade>
        );
      
      case 3:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                Review Your Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{formData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                      <FitnessIcon />
                    </Avatar>
                    <Typography variant="h6">{formData.gender}</Typography>
                    <Typography variant="body2" color="text.secondary">Age: {formData.age}</Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">{formData.height} cm</Typography>
                    <Typography variant="body2" color="text.secondary">Height</Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">{formData.weight} kg</Typography>
                    <Typography variant="body2" color="text.secondary">Weight</Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Chip 
                      label={formData.fitnessGoal} 
                      color="primary" 
                      icon={<GoalIcon />}
                      sx={{ fontSize: '1rem', py: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Fitness Goal
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Zoom in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              
              <FitnessIcon sx={{ fontSize: 60, mb: 2, position: 'relative', zIndex: 1 }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ position: 'relative', zIndex: 1, fontWeight: 'bold' }}>
                Join KEC Fitness Tracker
              </Typography>
              <Typography variant="h6" sx={{ position: 'relative', zIndex: 1, opacity: 0.9 }}>
                Create your account and start your fitness journey
              </Typography>
            </Box>

            {/* Stepper */}
            <Box sx={{ p: 3, pb: 0 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>
                {renderStepContent(activeStep)}
                
                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ minWidth: 120 }}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        minWidth: 160,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                        }
                      }}
                      endIcon={loading ? <CircularProgress size={20} /> : <ArrowIcon />}
                    >
                      {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        minWidth: 120,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                        }
                      }}
                      endIcon={<ArrowIcon />}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ p: 3, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#0ea5e9', 
                    textDecoration: 'none', 
                    fontWeight: 'bold' 
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default Register; 