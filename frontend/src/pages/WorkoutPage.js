import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import { FitnessCenter as WorkoutIcon, Edit as LogIcon, History as HistoryIcon, ViewList as TemplatesIcon } from '@mui/icons-material';
import HeroHeader from '../components/layout/HeroHeader';
import WorkoutLogger from '../components/workout/WorkoutLogger';
import WorkoutHistory from '../components/workout/WorkoutHistory';
import WorkoutTemplates from '../components/workout/WorkoutTemplates';

const WorkoutPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(savedWorkouts);
  };

  const handleWorkoutSaved = (newWorkout) => {
    setWorkouts(prev => [newWorkout, ...prev]);
    showNotification(`Workout "${newWorkout.name}" saved successfully!`, 'success');
  };

  const handleWorkoutDeleted = (workoutId) => {
    showNotification('Workout deleted successfully!', 'info');
  };

  const handleTemplateSelected = (template) => {
    showNotification(`Template "${template.name}" selected! You can now customize it in the workout logger.`, 'info');
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

  return (
    <Box>
      <HeroHeader
        icon={<WorkoutIcon fontSize="large" />}
        title="Workout & Exercise"
        subtitle="Track your workouts, log exercises, and monitor your fitness progress"
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="workout tabs" textColor="primary" indicatorColor="primary">
          <Tab icon={<LogIcon />} iconPosition="start" label="Log Workout" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Workout History" />
          <Tab icon={<TemplatesIcon />} iconPosition="start" label="Templates" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Log your workout:</strong> Add exercises, track sets and reps, and save your progress. 
              You can also select from workout templates below to get started quickly.
            </Typography>
          </Alert>
          
          <WorkoutLogger onWorkoutSaved={handleWorkoutSaved} />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>View your progress:</strong> See all your logged workouts, track your fitness journey, 
              and analyze your performance over time.
            </Typography>
          </Alert>
          
          <WorkoutHistory onWorkoutDeleted={handleWorkoutDeleted} />
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Choose a template:</strong> Select from pre-built workout routines designed for different 
              fitness levels and goals. Customize them to match your preferences.
            </Typography>
          </Alert>
          
          <WorkoutTemplates onTemplateSelected={handleTemplateSelected} />
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

export default WorkoutPage; 