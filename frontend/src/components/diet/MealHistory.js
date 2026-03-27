import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  TextField,
  LinearProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  CalendarToday as DateIcon,
  Restaurant as MealIcon,
  LocalFireDepartment as CalorieIcon
} from '@mui/icons-material';
import { dietService } from '../../services/dietService';

const MealHistory = ({ onMealDeleted }) => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dietService.list();
      setMeals(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading meals:', error);
      setError('Failed to load meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      await dietService.remove(mealId);
      setMeals(prev => prev.filter(m => m._id !== mealId));
      
      if (onMealDeleted) {
        onMealDeleted(mealId);
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
      setError('Failed to delete meal. Please try again.');
    }
  };

  const getFilteredMeals = () => {
    let filteredMeals = meals;
    
    // Apply date filter
    if (filter !== 'all') {
      const now = new Date();
      const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      
      switch (filter) {
        case 'today':
          filteredMeals = meals.filter(m => m.date === today);
          break;
        case 'week':
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredMeals = meals.filter(m => new Date(m.date) >= oneWeekAgo);
          break;
        case 'month':
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredMeals = meals.filter(m => new Date(m.date) >= oneMonthAgo);
          break;
        default:
          break;
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredMeals = filteredMeals.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mealType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.foodItems.some(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filteredMeals;
  };

  const getMealStats = () => {
    const filteredMeals = getFilteredMeals();
    
    if (filteredMeals.length === 0) return null;

    const totalMeals = filteredMeals.length;
    const totalCalories = filteredMeals.reduce((sum, m) => sum + m.totalCalories, 0);
    const totalProtein = filteredMeals.reduce((sum, m) => sum + m.totalProtein, 0);
    const totalCarbs = filteredMeals.reduce((sum, m) => sum + m.totalCarbs, 0);
    const totalFat = filteredMeals.reduce((sum, m) => sum + m.totalFat, 0);
    const avgCalories = Math.round(totalCalories / totalMeals);

    return {
      totalMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      avgCalories
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMealTypeColor = (mealType) => {
    const colors = {
      'breakfast': 'primary',
      'lunch': 'success',
      'dinner': 'secondary',
      'snack': 'warning'
    };
    return colors[mealType] || 'default';
  };

  const getMealTypeIcon = (mealType) => {
    const icons = {
      'breakfast': '🌅',
      'lunch': '🌞',
      'dinner': '🌙',
      'snack': '🍎'
    };
    return icons[mealType] || '🍽️';
  };

  const stats = getMealStats();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Meal History
        </Typography>
        
        <Box display="flex" gap={1}>
          <TextField
            size="small"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button
            size="small"
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="small"
            variant={filter === 'today' ? 'contained' : 'outlined'}
            onClick={() => setFilter('today')}
          >
            Today
          </Button>
          <Button
            size="small"
            variant={filter === 'week' ? 'contained' : 'outlined'}
            onClick={() => setFilter('week')}
          >
            This Week
          </Button>
          <Button
            size="small"
            variant={filter === 'month' ? 'contained' : 'outlined'}
            onClick={() => setFilter('month')}
          >
            This Month
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading meals...
          </Typography>
        </Box>
      )}

      {!loading && stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalMeals}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Meals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {stats.totalCalories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Calories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success">
                  {stats.avgCalories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Calories/Meal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning">
                  {Math.round(stats.totalProtein + stats.totalCarbs + stats.totalFat)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Macros (g)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {meals.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <MealIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No meals logged yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by logging your first meal above!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {getFilteredMeals().map((meal) => (
            <Card key={meal._id} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      <Typography component="div" variant="h6">
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{getMealTypeIcon(meal.mealType)}</span>
                          <Typography variant="h6">
                            {meal.name}
                          </Typography>
                          <Chip 
                            label={meal.mealType} 
                            color={getMealTypeColor(meal.mealType)}
                            size="small"
                          />
                          <Chip 
                            label={formatDate(meal.date)} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </Typography>
                    }
                    secondary={
                      <Typography component="div" variant="body2" color="text.secondary">
                        <Box sx={{ mt: 1 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <CalorieIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {meal.totalCalories} calories
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <MealIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {meal.foodItems.length} food items
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" color="success">
                                  P: {meal.totalProtein}g
                                </Typography>
                                <Typography variant="body2" color="info">
                                  C: {meal.totalCarbs}g
                                </Typography>
                                <Typography variant="body2" color="warning">
                                  F: {meal.totalFat}g
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography variant="body2" color="text.secondary">
                                Total: {meal.totalQuantity}g
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          {meal.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              "{meal.notes}"
                            </Typography>
                          )}
                        </Box>
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => {
                          setSelectedMeal(meal);
                          setShowDetails(true);
                        }}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteMeal(meal._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Meal Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <span>{selectedMeal && getMealTypeIcon(selectedMeal.mealType)}</span>
            {selectedMeal?.name}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedMeal && (
            <Box>
              <Box display="flex" gap={1} sx={{ mb: 2 }}>
                <Chip 
                  label={selectedMeal.mealType} 
                  color={getMealTypeColor(selectedMeal.mealType)}
                />
                <Chip 
                  label={formatDate(selectedMeal.date)}
                  variant="outlined"
                />
                <Chip 
                  label={`${selectedMeal.totalCalories} calories`}
                  color="warning"
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Calories
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.totalCalories} kcal
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Food Items
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.foodItems.length}
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Protein
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.totalProtein}g
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Carbs
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.totalCarbs}g
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Fat
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.totalFat}g
                  </Typography>
                </Grid>
                
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Weight
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.totalQuantity}g
                  </Typography>
                </Grid>
              </Grid>
              
              {selectedMeal.notes && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedMeal.notes}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Food Items
              </Typography>
              
              <List dense>
                {selectedMeal.foodItems.map((food, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={food.name}
                      secondary={
                        <Typography component="div" variant="body2" color="text.secondary">
                          <Box>
                            <Chip 
                              label={`${food.quantity}${food.unit}`} 
                              size="small" 
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`${food.calories} cal`} 
                              size="small" 
                              color="warning"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`P: ${food.protein}g`} 
                              size="small" 
                              variant="outlined"
                              color="success"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`C: ${food.carbs}g`} 
                              size="small" 
                              variant="outlined"
                              color="info"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`F: ${food.fat}g`} 
                              size="small" 
                              variant="outlined"
                              color="error"
                            />
                          </Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealHistory;
