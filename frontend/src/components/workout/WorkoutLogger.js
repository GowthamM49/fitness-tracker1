import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  FitnessCenter as ExerciseIcon
} from '@mui/icons-material';
import { workoutsService } from '../../services/workoutsService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WorkoutLogger = ({ onWorkoutSaved }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [workoutData, setWorkoutData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: ''
  });

  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: ''
  });

  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const exerciseLibrary = [
    'Bench Press', 'Squats', 'Deadlifts', 'Pull-ups', 'Push-ups',
    'Overhead Press', 'Barbell Rows', 'Lunges', 'Planks', 'Burpees',
    'Mountain Climbers', 'Jump Squats', 'Dumbbell Curls', 'Tricep Dips',
    'Leg Press', 'Lat Pulldowns', 'Chest Flyes', 'Shoulder Press',
    'Bicep Curls', 'Tricep Extensions', 'Leg Extensions', 'Leg Curls'
  ];

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) {
      return;
    }

    const newExercise = {
      ...currentExercise,
      id: Date.now(),
      sets: parseInt(currentExercise.sets),
      reps: parseInt(currentExercise.reps),
      weight: currentExercise.weight ? parseFloat(currentExercise.weight) : 0,
      restTime: currentExercise.restTime ? parseInt(currentExercise.restTime) : 0
    };

    setExercises(prev => [...prev, newExercise]);
    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      restTime: ''
    });
    setShowExerciseForm(false);
  };

  const removeExercise = (exerciseId) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const saveWorkout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!workoutData.name || exercises.length === 0) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const workout = {
        name: workoutData.name === 'Custom' ? workoutData.customName : workoutData.name,
        date: workoutData.date,
        duration: parseInt(workoutData.duration),
        exercises: exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime
        })),
        notes: workoutData.notes,
        caloriesBurned: calculateWorkoutCalories(exercises, workoutData.duration)
      };

      let savedWorkout;
      
      try {
        // Try to save to backend first
        savedWorkout = await workoutsService.create(workout);
        setSuccess('Workout saved successfully to database!');
      } catch (backendError) {
        console.warn('Backend unavailable, saving to localStorage:', backendError);
        
        // Fallback to localStorage
        const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        savedWorkout = {
          _id: workoutId,
          ...workout,
          type: workoutData.name, // For compatibility with analytics
          createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const existingWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        existingWorkouts.unshift(savedWorkout);
        localStorage.setItem('workouts', JSON.stringify(existingWorkouts));
        
        setSuccess('Workout saved locally! (Backend unavailable)');
      }

      // Reset form
      setWorkoutData({
        name: '',
        customName: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: ''
      });
      setExercises([]);

      // Notify parent component
      if (onWorkoutSaved) {
        onWorkoutSaved(savedWorkout);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      if (error.response?.status === 401) {
        setError('Please log in to save workouts.');
        navigate('/login');
      } else {
        setError('Failed to save workout. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const calculateWorkoutCalories = (exerciseList, duration) => {
    // Simple calorie calculation based on exercise intensity and duration
    const baseCaloriesPerMinute = 8; // Moderate intensity
    const durationMinutes = parseInt(duration) || 30;
    return Math.round(baseCaloriesPerMinute * durationMinutes);
  };

  const getExerciseIcon = (exerciseName) => {
    const name = exerciseName.toLowerCase();
    if (name.includes('press') || name.includes('push')) return '💪';
    if (name.includes('squat') || name.includes('leg')) return '🦵';
    if (name.includes('pull') || name.includes('row')) return '🏋️';
    if (name.includes('cardio') || name.includes('run')) return '🏃';
    return '🏋️';
  };

  return (
    <Card>
      <CardContent>
        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Please <strong>log in</strong> to save your workouts to the database.
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </Alert>
        )}

        
        <Typography variant="h6" gutterBottom>
          Log New Workout
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Workout Name</InputLabel>
              <Select
                name="name"
                value={workoutData.name}
                onChange={handleWorkoutChange}
                label="Workout Name"
              >
                <MenuItem value="Upper Body">Upper Body</MenuItem>
                <MenuItem value="Lower Body">Lower Body</MenuItem>
                <MenuItem value="Full Body">Full Body</MenuItem>
                <MenuItem value="Cardio">Cardio</MenuItem>
                <MenuItem value="HIIT">HIIT</MenuItem>
                <MenuItem value="Yoga">Yoga</MenuItem>
                <MenuItem value="Strength Training">Strength Training</MenuItem>
                <MenuItem value="Push Day">Push Day</MenuItem>
                <MenuItem value="Pull Day">Pull Day</MenuItem>
                <MenuItem value="Leg Day">Leg Day</MenuItem>
                <MenuItem value="Core Workout">Core Workout</MenuItem>
                <MenuItem value="Arms & Shoulders">Arms & Shoulders</MenuItem>
                <MenuItem value="Back & Biceps">Back & Biceps</MenuItem>
                <MenuItem value="Chest & Triceps">Chest & Triceps</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Custom workout name input - only show when "Custom" is selected */}
          {workoutData.name === 'Custom' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Custom Workout Name"
                name="customName"
                value={workoutData.customName || ''}
                onChange={handleWorkoutChange}
                placeholder="Enter your custom workout name"
              />
            </Grid>
          )}
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={workoutData.date}
              onChange={handleWorkoutChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={workoutData.duration}
              onChange={handleWorkoutChange}
              inputProps={{ min: 1, max: 300 }}
            />
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={workoutData.notes}
              onChange={handleWorkoutChange}
              multiline
              rows={2}
              placeholder="How did you feel? Any notes about the workout?"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Exercises ({exercises.length})
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowExerciseForm(true)}
          >
            Add Exercise
          </Button>
        </Box>

        {showExerciseForm && (
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Exercise
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Exercise</InputLabel>
                  <Select
                    name="name"
                    value={currentExercise.name}
                    onChange={handleExerciseChange}
                    label="Exercise"
                  >
                    {exerciseLibrary.map((exercise) => (
                      <MenuItem key={exercise} value={exercise}>
                        {exercise}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Sets"
                  name="sets"
                  type="number"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Reps"
                  name="reps"
                  type="number"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={currentExercise.weight}
                  onChange={handleExerciseChange}
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={addExercise}
                disabled={!currentExercise.name || !currentExercise.sets || !currentExercise.reps}
              >
                Add Exercise
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowExerciseForm(false)}
              >
                Cancel
              </Button>
            </Box>
          </Card>
        )}

        {exercises.length > 0 && (
          <List>
            {exercises.map((exercise, index) => (
              <ListItem key={exercise.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <span>{getExerciseIcon(exercise.name)}</span>
                      <Typography variant="subtitle1">
                        {exercise.name}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography component="div" variant="body2" color="text.secondary">
                      <Box>
                        <Chip 
                          label={`${exercise.sets} sets × ${exercise.reps} reps`} 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        {exercise.weight > 0 && (
                          <Chip 
                            label={`${exercise.weight} kg`} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                        )}
                        {exercise.restTime > 0 && (
                          <Chip 
                            label={`${exercise.restTime}s rest`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeExercise(exercise.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        {exercises.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Workout Summary:</strong> {exercises.length} exercises, 
                {exercises.reduce((sum, ex) => sum + ex.sets, 0)} total sets, 
                {exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0)} total reps
              </Typography>
            </Alert>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveWorkout}
                disabled={!workoutData.name || isSaving}
                size="large"
              >
                {isSaving ? 'Saving...' : 'Save Workout'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutLogger;
