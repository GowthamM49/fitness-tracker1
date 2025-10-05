import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Flag as GoalIcon
} from '@mui/icons-material';
import { progressService } from '../../services/progressService';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    type: '',
    target: '',
    current: '',
    unit: '',
    deadline: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await progressService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setGoalForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { unit: getGoalUnit(value) } : {})
    }));
  };

  const addGoal = async () => {
    if (!goalForm.title || !goalForm.target || !goalForm.deadline) return;

    setLoading(true);
    setError('');

    try {
      const goal = {
        title: goalForm.title,
        type: goalForm.type,
        target: parseFloat(goalForm.target),
        current: parseFloat(goalForm.current) || 0,
        unit: goalForm.unit,
        deadline: goalForm.deadline,
        description: goalForm.description
      };

      const savedGoal = await progressService.createGoal(goal);
      setGoals(prev => [...prev, savedGoal]);

      // Reset form
      setGoalForm({
        title: '',
        type: 'weight',
        target: '',
        current: '',
        unit: 'kg',
        deadline: '',
        description: ''
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding goal:', error);
      setError('Failed to add goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async () => {
    if (!editingGoal || !goalForm.title || !goalForm.target || !goalForm.deadline) return;

    setLoading(true);
    setError('');

    try {
      const updatedGoal = {
        title: goalForm.title,
        type: goalForm.type,
        target: parseFloat(goalForm.target),
        current: parseFloat(goalForm.current) || 0,
        unit: goalForm.unit,
        deadline: goalForm.deadline,
        description: goalForm.description
      };

      const savedGoal = await progressService.updateGoal(editingGoal._id, updatedGoal);
      setGoals(prev => prev.map(goal => goal._id === editingGoal._id ? savedGoal : goal));

      setEditingGoal(null);
      setGoalForm({
        title: '',
        type: 'weight',
        target: '',
        current: '',
        unit: 'kg',
        deadline: '',
        description: ''
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await progressService.removeGoal(goalId);
      setGoals(prev => prev.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError('Failed to delete goal. Please try again.');
    }
  };

  const editGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      type: goal.type,
      target: goal.target.toString(),
      current: goal.current ? goal.current.toString() : '',
      unit: goal.unit || 'kg',
      deadline: goal.deadline,
      description: goal.description || ''
    });
  };

  const calculateProgress = (goal) => {
    if (goal.type === 'weight') {
      const current = goal.current || 0;
      const target = goal.target;
      const start = goal.startValue || goal.current || 0;
      
      if (target < start) {
        // Weight loss goal
        const totalToLose = start - target;
        const lost = start - current;
        return Math.min(100, Math.max(0, (lost / totalToLose) * 100));
      } else {
        // Weight gain goal
        const totalToGain = target - start;
        const gained = current - start;
        return Math.min(100, Math.max(0, (gained / totalToGain) * 100));
      }
    } else if (goal.type === 'workout') {
      const current = goal.current || 0;
      const target = goal.target;
      return Math.min(100, Math.max(0, (current / target) * 100));
    } else if (goal.type === 'streak') {
      const current = goal.current || 0;
      const target = goal.target;
      return Math.min(100, Math.max(0, (current / target) * 100));
    }
    return 0;
  };

  const getGoalStatus = (goal) => {
    const progress = calculateProgress(goal);
    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) return { status: 'Completed', color: 'success', icon: <CheckCircleIcon /> };
    if (daysLeft < 0) return { status: 'Overdue', color: 'error', icon: <TrendingUpIcon /> };
    if (daysLeft <= 7) return { status: 'Due Soon', color: 'warning', icon: <TrendingUpIcon /> };
    return { status: 'In Progress', color: 'info', icon: <TrendingUpIcon /> };
  };

  const getGoalIcon = (type) => {
    switch (type) {
      case 'weight': return '⚖️';
      case 'workout': return '🏋️';
      case 'streak': return '🔥';
      case 'nutrition': return '🍎';
      default: return '🎯';
    }
  };

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case 'weight': return 'Weight Goal';
      case 'workout': return 'Workout Goal';
      case 'streak': return 'Streak Goal';
      case 'nutrition': return 'Nutrition Goal';
      default: return 'Custom Goal';
    }
  };

  const getGoalUnit = (type) => {
    switch (type) {
      case 'weight': return 'kg';
      case 'workout': return 'workouts';
      case 'streak': return 'days';
      case 'nutrition': return 'calories';
      default: return '';
    }
  };

  const openAddDialog = () => {
    setGoalForm({
      title: '',
      type: 'weight',
      target: '',
      current: '',
      unit: getGoalUnit('weight'),
      deadline: '',
      description: ''
    });
    setShowAddDialog(true);
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingGoal(null);
    setGoalForm({
      title: '',
      type: 'weight',
      target: '',
      current: '',
      unit: getGoalUnit('weight'),
      deadline: '',
      description: ''
    });
  };

  return (
    <Box>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <GoalIcon sx={{ fontSize: 48, color: 'white' }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                🎯 Goal Tracker
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Set, track, and achieve your fitness goals
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            Add New Goal
          </Button>
        </Box>
      </Paper>

      {/* Goals Display */}
      {goals.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <GoalIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No goals set yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Set your first fitness goal to start tracking your progress!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
            }}
          >
            Create Your First Goal
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal) => {
            const progress = calculateProgress(goal);
            const status = getGoalStatus(goal);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <Grid size={{ xs: 12, md: 6 }} key={goal.id}>
                <Paper elevation={2} sx={{ 
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    {/* Goal Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <span style={{ fontSize: '2rem' }}>{getGoalIcon(goal.type)}</span>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {goal.title}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <Chip 
                              label={getGoalTypeLabel(goal.type)} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                            <Chip 
                              label={status.status} 
                              color={status.color}
                              size="small"
                              icon={status.icon}
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => editGoal(goal)}
                          color="primary"
                          sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteGoal(goal.id)}
                          color="error"
                          sx={{ bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.main' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Goal Description */}
                    {goal.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                        💬 {goal.description}
                      </Typography>
                    )}

                    {/* Progress Section */}
                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body1" fontWeight={500}>
                          Progress: {progress.toFixed(1)}%
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                          {goal.current || 0} / {goal.target} {getGoalUnit(goal.type)}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        color={progress >= 100 ? 'success' : 'primary'}
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            background: progress >= 100 
                              ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }
                        }}
                      />
                    </Box>

                    {/* Deadline and Status */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        📅 Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={daysLeft < 0 ? 'error.main' : daysLeft <= 7 ? 'warning.main' : 'text.secondary'}
                        fontWeight={500}
                      >
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                         daysLeft === 0 ? 'Due today' : 
                         daysLeft === 1 ? 'Due tomorrow' : 
                         `${daysLeft} days left`}
                      </Typography>
                    </Box>
                  </CardContent>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog
        open={showAddDialog || !!editingGoal}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }} component="div">
          <Typography variant="h5" component="h2" fontWeight={600}>
            {editingGoal ? '✏️ Edit Goal' : '🎯 Add New Goal'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Goal Title"
                name="title"
                value={goalForm.title}
                onChange={handleGoalChange}
                placeholder="e.g., Lose 5kg, Complete 30 workouts this month"
                variant="outlined"
                size="large"
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Goal Type</InputLabel>
                <Select
                  name="type"
                  value={goalForm.type}
                  onChange={handleGoalChange}
                  label="Goal Type"
                  variant="outlined"
                >
                  <MenuItem value="weight">⚖️ Weight Goal</MenuItem>
                  <MenuItem value="workout">🏋️ Workout Goal</MenuItem>
                  <MenuItem value="streak">🔥 Streak Goal</MenuItem>
                  <MenuItem value="nutrition">🍎 Nutrition Goal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Target Value"
                name="target"
                type="number"
                value={goalForm.target}
                onChange={handleGoalChange}
                placeholder="e.g., 70"
                variant="outlined"
                size="large"
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Current Value (optional)"
                name="current"
                type="number"
                value={goalForm.current}
                onChange={handleGoalChange}
                placeholder="e.g., 75"
                variant="outlined"
                size="large"
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Deadline"
                name="deadline"
                type="date"
                value={goalForm.deadline}
                onChange={handleGoalChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="large"
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description (optional)"
                name="description"
                value={goalForm.description}
                onChange={handleGoalChange}
                multiline
                rows={3}
                placeholder="Describe your goal and motivation..."
                variant="outlined"
                size="large"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeDialog} size="large">
            Cancel
          </Button>
          <Button 
            onClick={editingGoal ? updateGoal : addGoal}
            variant="contained"
            disabled={!goalForm.title || !goalForm.target || !goalForm.deadline}
            size="large"
            sx={{ 
              py: 1, 
              px: 3,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              borderRadius: 2
            }}
          >
            {editingGoal ? 'Update Goal' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalTracker;
