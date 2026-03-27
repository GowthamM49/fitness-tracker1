import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  TextField, 
  Button, 
  Stack,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Zoom
} from '@mui/material';
import {
  Person as ProfileIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CameraAlt as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as AgeIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Wc as GenderIcon,
  Flag as GoalIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  FitnessCenter as FitnessIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import HeroHeader from '../components/layout/HeroHeader';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/usersService';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    age: '', 
    gender: '', 
    height: '', 
    weight: '', 
    fitnessGoal: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: false,
    workoutReminders: false,
    goalReminders: false,
    weeklyReports: false,
    theme: '',
    language: '',
    units: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDialog, setPhotoDialog] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await usersService.getProfile();
        
        // Map fitness goal values to match Select options
        const mapFitnessGoal = (goal) => {
          if (!goal) return '';
          const goalMap = {
            'Weight Loss': 'weight_loss',
            'Muscle Gain': 'muscle_gain',
            'General Fitness': 'general_fitness',
            'Endurance Training': 'endurance',
            'Strength Training': 'strength'
          };
          return goalMap[goal] || goal;
        };
        
        setForm({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          gender: data.gender || '',
          height: data.height || '',
          weight: data.weight || '',
          fitnessGoal: mapFitnessGoal(data.fitnessGoal),
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || ''
        });
        updateUser(data);
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []); // Remove updateUser dependency to prevent infinite loop

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((f) => ({ ...f, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings((s) => ({ 
      ...s, 
      [name]: e.target.type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Map fitness goal back to display format for backend
      const mapFitnessGoalToDisplay = (goal) => {
        if (!goal) return '';
        const goalMap = {
          'weight_loss': 'Weight Loss',
          'muscle_gain': 'Muscle Gain',
          'general_fitness': 'General Fitness',
          'endurance': 'Endurance Training',
          'strength': 'Strength Training'
        };
        return goalMap[goal] || goal;
      };
      
      const updated = await usersService.updateProfile({
        ...form,
        age: form.age ? Number(form.age) : undefined,
        height: form.height ? Number(form.height) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        fitnessGoal: mapFitnessGoalToDisplay(form.fitnessGoal)
      });
      updateUser(updated);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      await usersService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await usersService.updateSettings(settings);
      setSuccess('Settings updated successfully!');
    } catch (e) {
      setError(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    try {
      await usersService.deleteAccount();
      // This would typically redirect to login or show a confirmation
      setSuccess('Account deleted successfully');
    } catch (e) {
      setError(e.message || 'Failed to delete account');
    } finally {
      setSaving(false);
      setDeleteDialog(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getBMI = () => {
    if (!form.height || !form.weight) return null;
    const heightInMeters = form.height / 100;
    return (form.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'warning' };
    if (bmi < 25) return { category: 'Normal', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'error' };
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = async () => {
    if (!profilePhoto) return;
    
    setPhotoUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('photo', profilePhoto);
      
      // Simulate photo upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user context with new photo
      updateUser({ ...user, profilePhoto: photoPreview });
      
      setSuccess('Profile photo updated successfully!');
      setPhotoDialog(false);
    } catch (e) {
      setError('Failed to upload photo. Please try again.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoRemove = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    setPhotoDialog(false);
  };

  const handleCameraClick = () => {
    setPhotoDialog(true);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const bmi = getBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <Box>
      <HeroHeader
        icon={<ProfileIcon fontSize="large" />}
        title="Profile & Settings"
        subtitle="Manage your profile, update personal information, and customize your fitness goals"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<ProfileIcon />} label="Profile" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Box>

      {/* Profile Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Profile Summary Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Zoom in={true} timeout={500}>
              <Card className="card" sx={{ textAlign: 'center', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={user?.profilePhoto || photoPreview}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto', 
                        mb: 2,
                        fontSize: '3rem',
                        background: user?.profilePhoto || photoPreview ? 'transparent' : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      alt={user?.name || 'User'}
                    >
                      {!user?.profilePhoto && !photoPreview && (user?.name?.charAt(0) || 'U')}
                    </Avatar>
                    <IconButton
                      onClick={handleCameraClick}
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                      size="small"
                    >
                      <CameraIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {user?.name || 'User Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user?.email || 'user@example.com'}
                  </Typography>
                  
                  {bmi && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {bmi}
                      </Typography>
                      <Chip 
                        label={bmiCategory.category} 
                        color={bmiCategory.color}
                        size="small"
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        BMI
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Profile Form Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Fade in={true} timeout={700}>
              <Card className="card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Personal Information
                    </Typography>
                    <Button
                      variant={editing ? "outlined" : "contained"}
                      startIcon={editing ? <CancelIcon /> : <EditIcon />}
                      onClick={() => setEditing(!editing)}
                    >
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Stack spacing={3}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Full Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            label="Age"
                            name="age"
                            type="number"
                            value={form.age}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <AgeIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <FormControl fullWidth disabled={!editing}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                              name="gender"
                              value={form.gender}
                              onChange={handleChange}
                              label="Gender"
                              startAdornment={<GenderIcon sx={{ mr: 1, color: 'action.active' }} />}
                            >
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Height (cm)"
                            name="height"
                            type="number"
                            value={form.height}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <HeightIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Weight (kg)"
                            name="weight"
                            type="number"
                            value={form.weight}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <WeightIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editing}
                        InputProps={{
                          startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />

                      <FormControl fullWidth disabled={!editing}>
                        <InputLabel>Fitness Goal</InputLabel>
                        <Select
                          name="fitnessGoal"
                          value={form.fitnessGoal}
                          onChange={handleChange}
                          label="Fitness Goal"
                          startAdornment={<GoalIcon sx={{ mr: 1, color: 'action.active' }} />}
                        >
                          <MenuItem value="weight_loss">Weight Loss</MenuItem>
                          <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                          <MenuItem value="general_fitness">General Fitness</MenuItem>
                          <MenuItem value="endurance">Endurance Training</MenuItem>
                          <MenuItem value="strength">Strength Training</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={!editing}
                        placeholder="Tell us about yourself..."
                      />

                      {editing && (
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={() => setEditing(false)}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card className="card">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Change Password
                </Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => togglePasswordVisibility('current')}>
                          {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      )
                    }}
                  />
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => togglePasswordVisibility('new')}>
                          {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      )
                    }}
                  />
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                          {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      )
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePasswordUpdate}
                    disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card className="card">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Notification Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive notifications via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleSettingsChange}
                        name="emailNotifications"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <FitnessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Workout Reminders"
                      secondary="Get reminded about your scheduled workouts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.workoutReminders}
                        onChange={handleSettingsChange}
                        name="workoutReminders"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <GoalIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Goal Reminders"
                      secondary="Receive reminders about your fitness goals"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.goalReminders}
                        onChange={handleSettingsChange}
                        name="goalReminders"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Weekly Reports"
                      secondary="Get weekly progress reports"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.weeklyReports}
                        onChange={handleSettingsChange}
                        name="weeklyReports"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  onClick={handleSettingsSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card className="card">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Application Settings
                </Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      name="theme"
                      value={settings.theme}
                      onChange={handleSettingsChange}
                      label="Theme"
                      startAdornment={<ThemeIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={settings.language}
                      onChange={handleSettingsChange}
                      label="Language"
                      startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Units</InputLabel>
                    <Select
                      name="units"
                      value={settings.units}
                      onChange={handleSettingsChange}
                      label="Units"
                    >
                      <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                      <MenuItem value="imperial">Imperial (lbs, ft)</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={handleSettingsSave}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="card" sx={{ mt: 3, border: '1px solid #f44336' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Once you delete your account, there is no going back. Please be certain.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog 
        open={photoDialog} 
        onClose={() => setPhotoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CameraIcon color="primary" />
            Update Profile Photo
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {photoPreview ? (
              <Box>
                <Avatar
                  src={photoPreview}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mx: 'auto', 
                    mb: 2,
                    border: '3px solid #e0e0e0'
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Preview of your new profile photo
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 4 }}>
                <Avatar
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mx: 'auto', 
                    mb: 2,
                    fontSize: '4rem',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'
                  }}
                >
                  <CameraIcon sx={{ fontSize: '3rem' }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  No photo selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Choose Photo" to select an image
                </Typography>
              </Box>
            )}
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CameraIcon />}
                sx={{ mr: 2 }}
              >
                Choose Photo
              </Button>
            </label>
            
            {photoPreview && (
              <Button
                variant="outlined"
                color="error"
                onClick={handlePhotoRemove}
                startIcon={<DeleteIcon />}
              >
                Remove
              </Button>
            )}
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Requirements:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Image format: JPG, PNG, or GIF
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Maximum file size: 5MB
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Recommended size: 400x400 pixels or larger
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePhotoSave}
            variant="contained"
            disabled={!profilePhoto || photoUploading}
            startIcon={photoUploading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {photoUploading ? 'Uploading...' : 'Save Photo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage; 