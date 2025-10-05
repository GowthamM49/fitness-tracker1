import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as DietIcon,
  TrendingUp as ProgressIcon,
  People as CommunityIcon,
  Person as ProfileIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Workout', icon: <WorkoutIcon />, path: '/workout' },
    { text: 'Diet & Nutrition', icon: <DietIcon />, path: '/diet' },
    { text: 'Progress & Analytics', icon: <ProgressIcon />, path: '/progress' },
    { text: 'Community', icon: <CommunityIcon />, path: '/community' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' }
  ];

  // Add admin panel for admin and faculty users
  if (user && ['admin', 'faculty'].includes(user.role)) {
    menuItems.push({ text: 'Admin Panel', icon: <AdminIcon />, path: '/admin' });
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          top: '64px', // Height of the AppBar
          height: 'calc(100vh - 64px)'
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Navigation
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.100',
                    color: 'primary.700',
                    '&:hover': {
                      backgroundColor: 'primary.200',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.700' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 