import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Container,
  Paper,
  Divider
} from '@mui/material';
import { TrendingUp as ProgressIcon } from '@mui/icons-material';
import WeightProgressTracker from '../components/progress/WeightProgressTracker';
import AnalyticsDashboard from '../components/progress/AnalyticsDashboard';
import GoalTracker from '../components/progress/GoalTracker';
import EnhancedAnalyticsDashboard from '../components/analytics/EnhancedAnalyticsDashboard';

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [weightEntries, setWeightEntries] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadWeightEntries();
  }, []);

  const loadWeightEntries = () => {
    const savedEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    setWeightEntries(savedEntries);
  };

  const handleWeightLogged = (newEntry) => {
    setWeightEntries(prev => [newEntry, ...prev]);
    showNotification(`Weight entry logged: ${newEntry.weight} kg`, 'success');
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <ProgressIcon sx={{ fontSize: 48, color: 'white' }} />
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Progress & Analytics
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Track BMI, weight changes, and performance trends with detailed analytics
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="progress tabs"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              px: 4
            },
            '& .Mui-selected': {
              fontWeight: 600
            }
          }}
        >
          <Tab label="📊 Weight Tracker" />
          <Tab label="📈 Analytics Dashboard" />
          <Tab label="🚀 Enhanced Analytics" />
          <Tab label="🎯 Goal Tracker" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ minHeight: '600px' }}>
        {activeTab === 0 && (
          <Box>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1">
                  <strong>Track your weight progress:</strong> Log your weight entries, monitor changes over time, 
                  and see your progress towards your target weight. Regular tracking helps identify trends and patterns.
                </Typography>
              </Alert>
            </Paper>
            
            <WeightProgressTracker onWeightLogged={handleWeightLogged} />
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1">
                  <strong>Comprehensive fitness analytics:</strong> View detailed insights about your workouts, 
                  nutrition, and overall fitness progress. Get personalized recommendations and track your fitness score.
                </Typography>
              </Alert>
            </Paper>
            
            <AnalyticsDashboard />
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1">
                  <strong>Advanced analytics with interactive charts:</strong> View comprehensive fitness analytics 
                  with detailed charts, graphs, and insights. Export your data and track multiple fitness metrics.
                </Typography>
              </Alert>
            </Paper>
            
            <EnhancedAnalyticsDashboard />
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1">
                  <strong>Set and track your goals:</strong> Create specific fitness goals with deadlines, 
                  monitor your progress, and celebrate your achievements. Goals help keep you motivated and focused.
                </Typography>
              </Alert>
            </Paper>
            
            <GoalTracker />
          </Box>
        )}
      </Box>

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
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProgressPage; 