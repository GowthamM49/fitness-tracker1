import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  TrendingUp as ProgressIcon,
  CalendarToday as DateIcon,
  Timer as DurationIcon,
  FitnessCenter as ExerciseIcon
} from '@mui/icons-material';
import { workoutsService } from '../../services/workoutsService';

const WorkoutHistory = ({ onWorkoutDeleted }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all'); // all, week, month
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    setError('');
    try {
      // Try to load from backend first
      try {
        const data = await workoutsService.list();
        setWorkouts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (backendError) {
        console.warn('Backend unavailable, loading from localStorage:', backendError);
        
        // Fallback to localStorage
        const localWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        setWorkouts(localWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date)));
        
        if (localWorkouts.length === 0) {
          setError('No workouts found. Backend is currently unavailable.');
        }
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
      setError('Failed to load workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      try {
        // Try to delete from backend first
        await workoutsService.remove(workoutId);
      } catch (backendError) {
        console.warn('Backend unavailable, deleting from localStorage:', backendError);
        
        // Fallback to localStorage
        const localWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const updatedWorkouts = localWorkouts.filter(w => w._id !== workoutId);
        localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      }
      
      setWorkouts(prev => prev.filter(w => w._id !== workoutId));
      
      if (onWorkoutDeleted) {
        onWorkoutDeleted(workoutId);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('Failed to delete workout. Please try again.');
    }
  };

  const getFilteredWorkouts = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'week':
        return workouts.filter(w => new Date(w.date) >= oneWeekAgo);
      case 'month':
        return workouts.filter(w => new Date(w.date) >= oneMonthAgo);
      default:
        return workouts;
    }
  };

  const getWorkoutStats = () => {
    const filteredWorkouts = getFilteredWorkouts();
    
    if (filteredWorkouts.length === 0) return null;

    const totalWorkouts = filteredWorkouts.length;
    const totalDuration = filteredWorkouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
    const totalExercises = filteredWorkouts.reduce((sum, w) => sum + w.totalExercises, 0);
    const totalSets = filteredWorkouts.reduce((sum, w) => sum + w.totalSets, 0);
    const totalReps = filteredWorkouts.reduce((sum, w) => sum + w.totalReps, 0);
    const totalCalories = filteredWorkouts.reduce((sum, w) => sum + w.estimatedCalories, 0);

    return {
      totalWorkouts,
      totalDuration,
      totalExercises,
      totalSets,
      totalReps,
      totalCalories,
      avgDuration: Math.round(totalDuration / totalWorkouts),
      avgExercises: Math.round(totalExercises / totalWorkouts)
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWorkoutIcon = (workoutName) => {
    const name = workoutName.toLowerCase();
    if (name.includes('upper') || name.includes('chest') || name.includes('arm')) return '💪';
    if (name.includes('lower') || name.includes('leg')) return '🦵';
    if (name.includes('full') || name.includes('body')) return '🏋️';
    if (name.includes('cardio') || name.includes('run')) return '🏃';
    return '🏋️';
  };

  const stats = getWorkoutStats();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Workout History
        </Typography>
        
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All Time
          </Button>
          <Button
            size="small"
            variant={filter === 'week' ? 'contained' : 'outlined'}
            onClick={() => setFilter('week')}
          >
            This Week
          </Button>
          <Button
            size="small"
            variant={filter === 'month' ? 'contained' : 'outlined'}
            onClick={() => setFilter('month')}
          >
            This Month
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading workouts...
          </Typography>
        </Box>
      )}

      {!loading && stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalWorkouts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Workouts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {stats.avgDuration} min
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Duration
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success">
                  {stats.totalExercises}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Exercises
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning">
                  {stats.totalCalories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Est. Calories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {workouts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <ExerciseIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No workouts logged yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by logging your first workout above!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {getFilteredWorkouts().map((workout) => (
            <Card key={workout._id} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      <Typography component="div" variant="h6">
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{getWorkoutIcon(workout.name)}</span>
                          <Typography variant="h6">
                            {workout.name}
                          </Typography>
                          <Chip 
                            label={formatDate(workout.date)} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </Typography>
                    }
                    secondary={
                      <Typography component="div" variant="body2" color="text.secondary">
                        <Box sx={{ mt: 1 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <DurationIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {workout.duration} minutes
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <ExerciseIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {workout.totalExercises} exercises
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <ProgressIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {workout.totalSets} sets × {workout.totalReps} reps
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <ProgressIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  ~{workout.estimatedCalories} calories
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                          
                          {workout.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              "{workout.notes}"
                            </Typography>
                          )}
                        </Box>
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => {
                          setSelectedWorkout(workout);
                          setShowDetails(true);
                        }}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteWorkout(workout._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Workout Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <span>{selectedWorkout && getWorkoutIcon(selectedWorkout.name)}</span>
            {selectedWorkout?.name}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedWorkout && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedWorkout.date)}
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {selectedWorkout.duration} minutes
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Exercises
                  </Typography>
                  <Typography variant="body1">
                    {selectedWorkout.totalExercises}
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estimated Calories
                  </Typography>
                  <Typography variant="body1">
                    ~{selectedWorkout.estimatedCalories} kcal
                  </Typography>
                </Grid>
              </Grid>
              
              {selectedWorkout.notes && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedWorkout.notes}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Exercises
              </Typography>
              
              <List dense>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <ListItem key={exercise.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{getWorkoutIcon(exercise.name)}</span>
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
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutHistory;
