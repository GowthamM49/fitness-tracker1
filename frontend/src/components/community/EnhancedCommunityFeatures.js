import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Paper,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Chat as ChatIcon,
  ThumbUp as LikeIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as DietIcon,
  Scale as WeightIcon,
  Star as StarIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { communityService } from '../../services/communityService';

const EnhancedCommunityFeatures = ({ activeTab = 0, onTabChange }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);
  
  // Use external tab control if provided, otherwise use internal state
  const currentTab = onTabChange ? activeTab : internalActiveTab;
  const handleTabChange = onTabChange || ((event, newValue) => setInternalActiveTab(newValue));
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [forum, setForum] = useState([]);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: '',
    duration: '',
    target: '',
    reward: ''
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      // Load real data from API with localStorage fallback
      try {
        const challengesResponse = await communityService.listChallenges();
        setChallenges(challengesResponse.items || []);
      } catch (error) {
        console.warn('Backend unavailable, using mock challenges:', error);
        setChallenges([
      {
        id: 1,
        title: '30-Day Push-up Challenge',
        description: 'Complete 100 push-ups every day for 30 days',
        type: 'workout',
        duration: 30,
        participants: 156,
        reward: 'Fitness Badge + 500 Points',
        status: 'active',
        createdBy: 'Admin',
        startDate: '2024-01-01',
        endDate: '2024-01-30',
        progress: 65,
        userProgress: 20
      },
      {
        id: 2,
        title: 'Healthy Eating Streak',
        description: 'Log meals and stay within calorie goals for 21 days',
        type: 'diet',
        duration: 21,
        participants: 89,
        reward: 'Nutrition Expert Badge + 300 Points',
        status: 'active',
        createdBy: 'Faculty',
        startDate: '2024-01-15',
        endDate: '2024-02-05',
        progress: 45,
        userProgress: 12
      },
      {
        id: 3,
        title: 'Weight Loss Warriors',
        description: 'Lose 5kg in 60 days with healthy lifestyle changes',
        type: 'weight',
        duration: 60,
        participants: 234,
        reward: 'Transformation Badge + 1000 Points',
        status: 'active',
        createdBy: 'Admin',
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        progress: 30,
        userProgress: 8
      }
        ]);
      }

      try {
        const leaderboardResponse = await communityService.leaderboard();
        setLeaderboard(leaderboardResponse.items || []);
      } catch (error) {
        console.warn('Backend unavailable, using mock leaderboard:', error);
        setLeaderboard([
          { rank: 1, name: 'Alex Johnson', points: 2450, avatar: 'AJ', badge: 'Champion' },
          { rank: 2, name: 'Sarah Wilson', points: 2200, avatar: 'SW', badge: 'Elite' },
          { rank: 3, name: 'Mike Chen', points: 1950, avatar: 'MC', badge: 'Expert' },
          { rank: 4, name: 'Emma Davis', points: 1800, avatar: 'ED', badge: 'Advanced' },
          { rank: 5, name: 'Tom Brown', points: 1650, avatar: 'TB', badge: 'Intermediate' }
        ]);
      }

      try {
        const forumResponse = await communityService.listForums();
        setForum(forumResponse.items || []);
      } catch (error) {
        console.warn('Backend unavailable, using mock forum:', error);
        setForum([
          {
            id: 1,
            title: 'Best workout routines for beginners?',
            author: 'Newbie123',
            replies: 15,
            likes: 23,
            lastReply: '2 hours ago',
            category: 'Workout Tips'
          },
          {
            id: 2,
            title: 'Meal prep ideas for busy students',
            author: 'BusyStudent',
            replies: 8,
            likes: 31,
            lastReply: '5 hours ago',
            category: 'Nutrition'
          },
          {
            id: 3,
            title: 'How to stay motivated during weight loss plateau?',
            author: 'FitnessJourney',
            replies: 22,
            likes: 45,
            lastReply: '1 day ago',
            category: 'Motivation'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading community data:', error);
    }
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.title || !newChallenge.description) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const challengeData = {
        title: newChallenge.title,
        description: newChallenge.description
      };

      try {
        const createdChallenge = await communityService.createChallenge(challengeData);
        setChallenges(prev => [createdChallenge, ...prev]);
        showNotification('Challenge created successfully!', 'success');
      } catch (backendError) {
        console.warn('Backend unavailable, saving locally:', backendError);
        
        // Fallback to localStorage
        const challenge = {
          id: challenges.length + 1,
          ...newChallenge,
          participants: 0,
          status: 'active',
          createdBy: 'Current User',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + newChallenge.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progress: 0,
          userProgress: 0
        };

        const existingChallenges = JSON.parse(localStorage.getItem('challenges') || '[]');
        existingChallenges.unshift(challenge);
        localStorage.setItem('challenges', JSON.stringify(existingChallenges));
        
        setChallenges([challenge, ...challenges]);
        showNotification('Challenge saved locally! (Backend unavailable)', 'warning');
      }

      setCreateChallengeOpen(false);
      setNewChallenge({ title: '', description: '', type: 'workout', duration: 30, target: '', reward: '' });
    } catch (error) {
      console.error('Error creating challenge:', error);
      showNotification('Failed to create challenge', 'error');
    }
  };

  const joinChallenge = async (challengeId) => {
    if (!challengeId) {
      showNotification('Invalid challenge ID', 'error');
      return;
    }
    
    try {
      try {
        const response = await communityService.joinChallenge(challengeId);
        setChallenges(challenges.map(challenge => 
          (challenge._id || challenge.id) === challengeId 
            ? { ...challenge, participants: response.participants || challenge.participants + 1, userProgress: 1 }
            : challenge
        ));
        showNotification('Joined challenge successfully!', 'success');
      } catch (backendError) {
        console.warn('Backend unavailable, updating locally:', backendError);
        setChallenges(challenges.map(challenge => 
          (challenge._id || challenge.id) === challengeId 
            ? { ...challenge, participants: challenge.participants + 1, userProgress: 1 }
            : challenge
        ));
        showNotification('Joined challenge locally! (Backend unavailable)', 'warning');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      showNotification('Failed to join challenge', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const renderChallenges = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Active Challenges</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateChallengeOpen(true)}
          >
            Create Challenge
          </Button>
        </Box>
      </Grid>

      {challenges.map((challenge) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={challenge._id || challenge.id || `challenge-${Math.random()}`}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" component="h2">
                  {challenge.title}
                </Typography>
                <Chip
                  label={challenge.status}
                  color={challenge.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              <Typography color="textSecondary" gutterBottom>
                {challenge.description}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                {challenge.type === 'workout' && <WorkoutIcon color="primary" />}
                {challenge.type === 'diet' && <DietIcon color="secondary" />}
                {challenge.type === 'weight' && <WeightIcon color="success" />}
                <Typography variant="body2" color="textSecondary">
                  {challenge.duration} days • {challenge.participants} participants
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Progress: {challenge.userProgress}/{challenge.duration} days
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(challenge.userProgress / challenge.duration) * 100}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {challenge.progress}% of participants active
                </Typography>
              </Box>

              <Typography variant="body2" color="primary" gutterBottom>
                🏆 Reward: {challenge.reward}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="caption" color="textSecondary">
                  Created by {challenge.createdBy}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => joinChallenge(challenge._id || challenge.id)}
                  disabled={challenge.userProgress > 0}
                >
                  {challenge.userProgress > 0 ? 'Joined' : 'Join Challenge'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderLeaderboard = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🏆 Leaderboard
        </Typography>
        <List>
          {leaderboard.map((user, index) => (
            <ListItem key={user.id || user.rank || `user-${index}`} divider={index < leaderboard.length - 1}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#CD7F32' : 'primary.main',
                    color: 'white'
                  }}
                >
                  {index < 3 ? <TrophyIcon /> : user.avatar}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">
                      #{user.rank} {user.name}
                    </Typography>
                    <Chip label={user.badge} size="small" color="primary" />
                  </Box>
                }
                secondary={
                  <span>
                    <span>{user.points.toLocaleString()} points</span>
                    {index < 3 && (
                      <span style={{ marginLeft: '16px', color: '#1976d2' }}>
                        🏆 Top {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : '3rd Place'}
                      </span>
                    )}
                  </span>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <ShareIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderForum = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Community Forum</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Post
          </Button>
        </Box>

        <List>
          {forum.map((post, index) => (
            <ListItem key={post._id || post.id || `post-${index}`} divider={index < forum.length - 1}>
              <ListItemAvatar>
                <Avatar>
                  {post.author.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">
                      {post.title}
                    </Typography>
                    <Chip label={post.category} size="small" color="secondary" />
                  </Box>
                }
                secondary={
                  <span>
                    <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      by {post.author} • {post.lastReply}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ChatIcon fontSize="small" color="action" />
                        <span style={{ fontSize: '0.75rem' }}>{post.replies} replies</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <LikeIcon fontSize="small" color="action" />
                        <span style={{ fontSize: '0.75rem' }}>{post.likes} likes</span>
                      </span>
                    </div>
                  </span>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <MessageIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderCreateChallengeDialog = () => (
    <Dialog open={createChallengeOpen} onClose={() => setCreateChallengeOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Create New Challenge</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Challenge Title"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Challenge Type</InputLabel>
              <Select
                value={newChallenge.type}
                onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
                label="Challenge Type"
              >
                <MenuItem value="workout">Workout Challenge</MenuItem>
                <MenuItem value="diet">Diet Challenge</MenuItem>
                <MenuItem value="weight">Weight Loss Challenge</MenuItem>
                <MenuItem value="consistency">Consistency Challenge</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Duration (days)"
              type="number"
              value={newChallenge.duration}
              onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Target"
              value={newChallenge.target}
              onChange={(e) => setNewChallenge({...newChallenge, target: e.target.value})}
              placeholder="e.g., 100 push-ups daily"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Reward"
              value={newChallenge.reward}
              onChange={(e) => setNewChallenge({...newChallenge, reward: e.target.value})}
              placeholder="e.g., 500 points + badge"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCreateChallengeOpen(false)}>Cancel</Button>
        <Button onClick={handleCreateChallenge} variant="contained">Create Challenge</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Only show header and tabs if not controlled externally */}
      {!onTabChange && (
        <>
          <Typography variant="h4" gutterBottom>
            Community Hub
          </Typography>

          <Paper sx={{ mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Challenges" />
              <Tab label="Leaderboard" />
              <Tab label="Forum" />
            </Tabs>
          </Paper>
        </>
      )}

      {currentTab === 0 && renderChallenges()}
      {currentTab === 1 && renderLeaderboard()}
      {currentTab === 2 && renderForum()}

      {renderCreateChallengeDialog()}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({...notification, open: false})}
      >
        <Alert severity={notification.severity} onClose={() => setNotification({...notification, open: false})}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedCommunityFeatures;
