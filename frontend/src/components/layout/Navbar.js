import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Divider,
  Chip,
  Paper,
  Fade,
  Popper,
  ClickAwayListener,
  Card,
  CardContent
} from '@mui/material';
import {
  FitnessCenter as FitnessIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  Restaurant as MealIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Workout Completed!',
      message: 'Great job completing your morning workout. Keep up the momentum!',
      time: '2 minutes ago',
      read: false,
      icon: <CheckIcon />
    },
    {
      id: 2,
      type: 'warning',
      title: 'Calorie Goal Reminder',
      message: 'You\'re 200 calories short of your daily goal. Consider a healthy snack!',
      time: '1 hour ago',
      read: false,
      icon: <WarningIcon />
    },
    {
      id: 3,
      type: 'info',
      title: 'New Achievement Unlocked!',
      message: 'Congratulations! You\'ve completed 7 consecutive workout days.',
      time: '3 hours ago',
      read: true,
      icon: <FireIcon />
    },
    {
      id: 4,
      type: 'success',
      title: 'Weight Progress Update',
      message: 'You\'ve lost 2kg this month. Excellent progress towards your goal!',
      time: '1 day ago',
      read: true,
      icon: <TrendingUpIcon />
    }
  ]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(notificationAnchor ? null : event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar position="fixed" className="bg-primary-600" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <FitnessIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" className="text-white no-underline hover:text-gray-200">
            KEC Fitness Tracker
          </Link>
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              color="inherit" 
              onClick={handleNotificationClick}
              sx={{ 
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Button
              color="inherit"
              onClick={handleMenu}
              startIcon={
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user?.name || 'User'}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              }
            >
              {user?.name || 'User'}
            </Button>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                <AccountIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>

            {/* Notification Dropdown */}
            <Popper
              open={Boolean(notificationAnchor)}
              anchorEl={notificationAnchor}
              placement="bottom-end"
              transition
              sx={{ zIndex: 1300 }}
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                  <Paper
                    sx={{
                      width: 400,
                      maxHeight: 500,
                      overflow: 'auto',
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <ClickAwayListener onClickAway={handleNotificationClose}>
                      <Box>
                        {/* Notification Header */}
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              Notifications
                            </Typography>
                            {unreadCount > 0 && (
                              <Chip
                                label={`${unreadCount} new`}
                                size="small"
                                color="primary"
                                onClick={handleMarkAllAsRead}
                                sx={{ cursor: 'pointer' }}
                              />
                            )}
                          </Box>
                        </Box>

                        {/* Notification List */}
                        <List sx={{ p: 0 }}>
                          {notifications.length === 0 ? (
                            <ListItem>
                              <ListItemText
                                primary="No notifications"
                                secondary="You're all caught up!"
                                sx={{ textAlign: 'center', py: 2 }}
                              />
                            </ListItem>
                          ) : (
                            notifications.map((notification, index) => (
                              <React.Fragment key={notification.id}>
                                <ListItemButton
                                  onClick={() => handleNotificationRead(notification.id)}
                                  sx={{
                                    backgroundColor: notification.read ? 'transparent' : 'rgba(14, 165, 233, 0.05)',
                                    borderLeft: notification.read ? 'none' : '4px solid #0ea5e9',
                                    '&:hover': {
                                      backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                    }
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar
                                      sx={{
                                        bgcolor: notification.type === 'success' ? '#4caf50' :
                                                notification.type === 'warning' ? '#ff9800' :
                                                notification.type === 'error' ? '#f44336' : '#2196f3',
                                        width: 40,
                                        height: 40
                                      }}
                                    >
                                      {notification.icon}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography 
                                          variant="subtitle2" 
                                          sx={{ 
                                            fontWeight: notification.read ? 400 : 600,
                                            color: notification.read ? 'text.secondary' : 'text.primary'
                                          }}
                                        >
                                          {notification.title}
                                        </Typography>
                                        {!notification.read && (
                                          <Box
                                            sx={{
                                              width: 8,
                                              height: 8,
                                              borderRadius: '50%',
                                              bgcolor: 'primary.main'
                                            }}
                                          />
                                        )}
                                      </Box>
                                    }
                                    secondary={
                                      <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                          {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {notification.time}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </ListItemButton>
                                {index < notifications.length - 1 && <Divider />}
                              </React.Fragment>
                            ))
                          )}
                        </List>

                        {/* Notification Footer */}
                        {notifications.length > 0 && (
                          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                            <Button
                              size="small"
                              color="primary"
                              onClick={handleMarkAllAsRead}
                              disabled={unreadCount === 0}
                            >
                              Mark all as read
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </ClickAwayListener>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              className="hover:bg-primary-700"
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/register"
              className="hover:bg-primary-700"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 