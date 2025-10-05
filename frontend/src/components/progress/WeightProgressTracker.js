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
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { progressService } from '../../services/progressService';

const WeightProgressTracker = ({ onWeightLogged }) => {
  const [weightEntries, setWeightEntries] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWeightEntries();
  }, []);

  const loadWeightEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await progressService.getEntries();
      setWeightEntries(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading weight entries:', error);
      setError('Failed to load weight entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addWeightEntry = async () => {
    if (!newWeight || !newDate) return;

    setLoading(true);
    setError('');

    try {
      const weight = parseFloat(newWeight);
      const entry = {
        weight: weight,
        date: newDate,
        notes: notes
      };

      const savedEntry = await progressService.createEntry(entry);
      
      setWeightEntries(prev => [savedEntry, ...prev]);

      // Reset form
      setNewWeight('');
      setNotes('');

      // Notify parent component
      if (onWeightLogged) {
        onWeightLogged(savedEntry);
      }
    } catch (error) {
      console.error('Error adding weight entry:', error);
      setError('Failed to add weight entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressStats = () => {
    if (weightEntries.length < 2) {
      return {
        firstWeight: 0,
        currentWeight: 0,
        targetWeight: 70,
        totalChange: 0,
        changeFromTarget: 0,
        progressToTarget: 0,
        entriesCount: weightEntries.length,
        daysTracked: 0
      };
    }

    const sortedEntries = [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedEntries[0].weight;
    const currentWeight = sortedEntries[sortedEntries.length - 1].weight;
    const targetWeight = 70; // This should come from user's dashboard data

    const totalChange = currentWeight - firstWeight;
    const changeFromTarget = currentWeight - targetWeight;
    const progressToTarget = firstWeight !== targetWeight 
      ? ((firstWeight - currentWeight) / (firstWeight - targetWeight)) * 100 
      : 0;

    return {
      firstWeight,
      currentWeight,
      targetWeight,
      totalChange,
      changeFromTarget,
      progressToTarget: Math.max(0, Math.min(100, progressToTarget)),
      entriesCount: weightEntries.length,
      daysTracked: Math.ceil((new Date(sortedEntries[sortedEntries.length - 1].date) - new Date(sortedEntries[0].date)) / (1000 * 60 * 60 * 24))
    };
  };

  const getWeightTrend = () => {
    if (weightEntries.length < 2) return 'stable';
    
    const recentEntries = weightEntries.slice(0, 3);
    const weights = recentEntries.map(entry => entry.weight);
    
    let increasing = 0;
    let decreasing = 0;
    
    for (let i = 1; i < weights.length; i++) {
      if (weights[i] > weights[i-1]) increasing++;
      else if (weights[i] < weights[i-1]) decreasing++;
    }
    
    if (increasing > decreasing) return 'increasing';
    if (decreasing > increasing) return 'decreasing';
    return 'stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUpIcon color="warning" />;
      case 'decreasing': return <TrendingDownIcon color="success" />;
      default: return <CheckCircleIcon color="info" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'warning';
      case 'decreasing': return 'success';
      default: return 'info';
    }
  };

  const getTrendLabel = (trend) => {
    switch (trend) {
      case 'increasing': return 'Weight Increasing';
      case 'decreasing': return 'Weight Decreasing';
      default: return 'Weight Stable';
    }
  };

  const stats = getProgressStats();
  const trend = getWeightTrend();

  return (
    <Box>
      {/* Input Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          📝 Log New Weight Entry
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="e.g., 75.5"
              variant="outlined"
              size="large"
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="large"
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., After workout, morning weight"
              variant="outlined"
              size="large"
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addWeightEntry}
          disabled={!newWeight || !newDate}
          size="large"
          sx={{ 
            py: 1.5, 
            px: 4, 
            fontSize: '1.1rem',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          Log Weight Entry
        </Button>
      </Paper>

      {/* Progress Summary Section */}
      {stats && (
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            📊 Progress Summary
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {stats.currentWeight || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Current Weight (kg)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {stats.targetWeight || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Target Weight (kg)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: stats.totalChange > 0 
                  ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
                  : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {stats.totalChange > 0 ? '+' : ''}{(stats.totalChange || 0).toFixed(1)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Change (kg)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                color: 'white',
                borderRadius: 3
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {stats.entriesCount || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Entries Logged
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={500}>
                Progress to Target Weight
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={600}>
                {(stats.progressToTarget || 0).toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stats.progressToTarget || 0} 
              sx={{ 
                height: 12, 
                borderRadius: 6,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: stats.progressToTarget >= 100 
                    ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }
              }}
            />
          </Box>

          {/* Trend and Stats */}
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Box display="flex" gap={1} alignItems="center">
              {getTrendIcon(trend)}
              <Chip 
                label={getTrendLabel(trend)} 
                color={getTrendColor(trend)}
                size="medium"
                sx={{ fontWeight: 500 }}
              />
            </Box>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              📅 {stats.daysTracked || 0} days tracked
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Recent Entries Section */}
      {weightEntries.length > 0 && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            📋 Recent Entries
          </Typography>
          
          <Grid container spacing={3}>
            {weightEntries.slice(0, 6).map((entry) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                <Card elevation={1} sx={{ 
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                      {entry.weight} kg
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      📅 {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                    {entry.notes && (
                      <Typography variant="body2" display="block" sx={{ mt: 2, fontStyle: 'italic' }}>
                        💬 "{entry.notes}"
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Empty State */}
      {weightEntries.length === 0 && (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            🎯 Start Tracking Your Weight!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Log your first weight entry to begin monitoring your progress and see detailed analytics.
          </Typography>
          <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto', borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> Consistent weight tracking helps identify patterns and measure progress towards your fitness goals.
            </Typography>
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default WeightProgressTracker;
