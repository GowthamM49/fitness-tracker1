import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert
} from '@mui/material';
import {
  FitnessCenter as ExerciseIcon,
  Timer as DurationIcon,
  TrendingUp as DifficultyIcon,
  PlayArrow as StartIcon,
  Info as InfoIcon,
  FitnessCenter
} from '@mui/icons-material';

const WorkoutTemplates = ({ onTemplateSelected }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);

  const workoutTemplates = [
    {
      id: 1,
      name: 'Full Body Beginner',
      difficulty: 'Beginner',
      duration: '45-60 min',
      focus: 'Full Body',
      description: 'Complete full body workout for beginners focusing on form and building strength foundation.',
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: 12, rest: '60s' },
        { name: 'Push-ups (Modified)', sets: 3, reps: 8, rest: '60s' },
        { name: 'Assisted Pull-ups', sets: 3, reps: 5, rest: '90s' },
        { name: 'Planks', sets: 3, reps: '30s hold', rest: '60s' },
        { name: 'Walking Lunges', sets: 3, reps: '10 each leg', rest: '60s' },
        { name: 'Dumbbell Rows', sets: 3, reps: 10, rest: '60s' }
      ],
      tips: [
        'Focus on proper form over weight',
        'Take full rest periods between sets',
        'Modify exercises as needed for your fitness level'
      ]
    },
    {
      id: 2,
      name: 'Upper Body Strength',
      difficulty: 'Intermediate',
      duration: '50-65 min',
      focus: 'Upper Body',
      description: 'Target chest, back, shoulders, and arms with compound and isolation movements.',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8, rest: '90s' },
        { name: 'Barbell Rows', sets: 4, reps: 10, rest: '90s' },
        { name: 'Overhead Press', sets: 3, reps: 8, rest: '90s' },
        { name: 'Pull-ups', sets: 3, reps: 'Max reps', rest: '120s' },
        { name: 'Dumbbell Flyes', sets: 3, reps: 12, rest: '60s' },
        { name: 'Bicep Curls', sets: 3, reps: 12, rest: '60s' },
        { name: 'Tricep Dips', sets: 3, reps: 10, rest: '60s' }
      ],
      tips: [
        'Warm up properly before heavy lifts',
        'Maintain good form throughout',
        'Progressive overload for strength gains'
      ]
    },
    {
      id: 3,
      name: 'Lower Body Power',
      difficulty: 'Intermediate',
      duration: '55-70 min',
      focus: 'Lower Body',
      description: 'Build leg strength and power with compound movements and plyometrics.',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: 6, rest: '120s' },
        { name: 'Romanian Deadlifts', sets: 4, reps: 8, rest: '120s' },
        { name: 'Leg Press', sets: 3, reps: 10, rest: '90s' },
        { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '90s' },
        { name: 'Jump Squats', sets: 3, reps: 15, rest: '60s' },
        { name: 'Calf Raises', sets: 4, reps: 20, rest: '45s' }
      ],
      tips: [
        'Focus on explosive movements for power',
        'Maintain proper knee alignment',
        'Include dynamic stretching warm-up'
      ]
    },
    {
      id: 4,
      name: 'Cardio HIIT',
      difficulty: 'Advanced',
      duration: '30-40 min',
      focus: 'Cardiovascular',
      description: 'High-intensity interval training to boost cardiovascular fitness and burn calories.',
      exercises: [
        { name: 'Burpees', sets: 4, reps: '30s work, 30s rest', rest: '60s' },
        { name: 'Mountain Climbers', sets: 4, reps: '45s work, 15s rest', rest: '60s' },
        { name: 'Jump Rope', sets: 4, reps: '60s work, 30s rest', rest: '60s' },
        { name: 'High Knees', sets: 4, reps: '30s work, 30s rest', rest: '60s' },
        { name: 'Plank Jacks', sets: 4, reps: '45s work, 15s rest', rest: '60s' },
        { name: 'Sprint Intervals', sets: 4, reps: '30s sprint, 90s walk', rest: '120s' }
      ],
      tips: [
        'Maintain high intensity during work periods',
        'Stay hydrated throughout the workout',
        'Listen to your body and adjust intensity'
      ]
    },
    {
      id: 5,
      name: 'Core & Stability',
      difficulty: 'Beginner',
      duration: '25-35 min',
      focus: 'Core',
      description: 'Strengthen your core and improve stability with controlled movements.',
      exercises: [
        { name: 'Planks', sets: 3, reps: '45s hold', rest: '60s' },
        { name: 'Dead Bug', sets: 3, reps: '20 each side', rest: '45s' },
        { name: 'Bird Dog', sets: 3, reps: '15 each side', rest: '45s' },
        { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: '45s' },
        { name: 'Hollow Hold', sets: 3, reps: '30s hold', rest: '60s' },
        { name: 'Side Planks', sets: 3, reps: '30s each side', rest: '60s' }
      ],
      tips: [
        'Focus on controlled movements',
        'Engage core throughout each exercise',
        'Breathe steadily during holds'
      ]
    },
    {
      id: 6,
      name: 'Yoga Flow',
      difficulty: 'Beginner',
      duration: '40-50 min',
      focus: 'Flexibility & Balance',
      description: 'Gentle yoga sequence to improve flexibility, balance, and mindfulness.',
      exercises: [
        { name: 'Sun Salutation A', sets: 3, reps: 'Flow sequence', rest: '30s' },
        { name: 'Warrior Poses', sets: 3, reps: 'Hold each pose 30s', rest: '15s' },
        { name: 'Tree Pose', sets: 2, reps: 'Hold 45s each side', rest: '30s' },
        { name: 'Downward Dog', sets: 3, reps: 'Hold 60s', rest: '30s' },
        { name: 'Child\'s Pose', sets: 2, reps: 'Hold 90s', rest: '60s' },
        { name: 'Savasana', sets: 1, reps: 'Hold 5 min', rest: 'N/A' }
      ],
      tips: [
        'Focus on breath and movement',
        'Modify poses as needed',
        'End with relaxation and meditation'
      ]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getFocusColor = (focus) => {
    const colors = {
      'Full Body': 'primary',
      'Upper Body': 'secondary',
      'Lower Body': 'success',
      'Cardiovascular': 'error',
      'Core': 'warning',
      'Flexibility & Balance': 'info'
    };
    return colors[focus] || 'default';
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };

  const startWorkout = () => {
    if (onTemplateSelected && selectedTemplate) {
      onTemplateSelected(selectedTemplate);
      setShowTemplateDetails(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Workout Templates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose from pre-built workout routines or use them as inspiration for your own workouts
      </Typography>

      <Grid container spacing={3}>
        {workoutTemplates.map((template) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={template.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <InfoIcon color="action" fontSize="small" />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Box display="flex" gap={1} sx={{ mb: 2 }}>
                  <Chip 
                    label={template.difficulty} 
                    color={getDifficultyColor(template.difficulty)}
                    size="small"
                  />
                  <Chip 
                    label={template.focus} 
                    color={getFocusColor(template.focus)}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <DurationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {template.duration}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <ExerciseIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {template.exercises.length} exercises
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<StartIcon />}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Template Details Dialog */}
      <Dialog
        open={showTemplateDetails}
        onClose={() => setShowTemplateDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <FitnessCenter color="primary" />
            {selectedTemplate?.name}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Box display="flex" gap={1} sx={{ mb: 2 }}>
                <Chip 
                  label={selectedTemplate.difficulty} 
                  color={getDifficultyColor(selectedTemplate.difficulty)}
                />
                <Chip 
                  label={selectedTemplate.focus} 
                  color={getFocusColor(selectedTemplate.focus)}
                  variant="outlined"
                />
                <Chip 
                  label={selectedTemplate.duration}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedTemplate.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Workout Plan
              </Typography>

              <List dense>
                {selectedTemplate.exercises.map((exercise, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <ExerciseIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={
                        <Typography component="div" variant="body2" color="text.secondary">
                          <Box display="flex" gap={1} alignItems="center">
                            <Chip 
                              label={`${exercise.sets} sets`} 
                              size="small" 
                              variant="outlined"
                            />
                            <Chip 
                              label={exercise.reps} 
                              size="small" 
                              variant="outlined"
                            />
                            {exercise.rest && (
                              <Chip 
                                label={`${exercise.rest} rest`} 
                                size="small" 
                                variant="outlined"
                                color="secondary"
                              />
                            )}
                          </Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Tips for Success
              </Typography>

              <List dense>
                {selectedTemplate.tips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> This is a template. Feel free to modify exercises, sets, reps, and rest periods to match your fitness level and goals.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowTemplateDetails(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<StartIcon />}
            onClick={startWorkout}
          >
            Start This Workout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutTemplates;
