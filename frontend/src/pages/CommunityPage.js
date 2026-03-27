import React, { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import EnhancedCommunityFeatures from '../components/community/EnhancedCommunityFeatures';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box sx={{ fontSize: '4rem' }}>🏆</Box>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Community Hub
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Join challenges, compete on leaderboards, and connect with fellow fitness enthusiasts
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="community tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              px: 4,
              py: 2
            },
            '& .Mui-selected': {
              fontWeight: 600,
              color: 'primary.main'
            },
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '2px 2px 0 0'
            }
          }}
        >
          <Tab label="🏆 Challenges" />
          <Tab label="📊 Leaderboard" />
          <Tab label="💬 Forum" />
        </Tabs>
      </Paper>

      {/* Info Alert */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Alert severity="info" sx={{ borderRadius: 2, backgroundColor: '#e3f2fd' }}>
          <Typography variant="body1">
            <strong>Enhanced Community Features:</strong> Join fitness challenges, compete on leaderboards, 
            participate in community discussions, and earn badges for your achievements. Connect with fellow 
            KEC fitness enthusiasts and stay motivated together!
          </Typography>
        </Alert>
      </Paper>

      {/* Enhanced Community Features */}
      <EnhancedCommunityFeatures activeTab={activeTab} onTabChange={handleTabChange} />
    </Container>
  );
};

export default CommunityPage;