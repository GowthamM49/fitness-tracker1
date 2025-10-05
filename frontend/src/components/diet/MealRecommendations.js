import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Restaurant as FoodIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as CalorieIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { recommendationService } from '../../services/recommendationService';
import { useAuth } from '../../context/AuthContext';
import CustomMealCreator from './CustomMealCreator';

const MealRecommendations = ({ onMealSelect }) => {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showCustomMealCreator, setShowCustomMealCreator] = useState(false);
  const [customMeals, setCustomMeals] = useState([]);

  const mealTypes = [
    { value: 'all', label: 'All Meals', icon: <FoodIcon /> },
    { value: 'breakfast', label: 'Breakfast', icon: <FoodIcon /> },
    { value: 'lunch', label: 'Lunch', icon: <FoodIcon /> },
    { value: 'dinner', label: 'Dinner', icon: <FoodIcon /> },
    { value: 'snack', label: 'Snack', icon: <FoodIcon /> }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations();
      fetchCustomMeals();
    }
  }, [isAuthenticated]);

  const fetchRecommendations = async (mealType = 'all') => {
    setLoading(true);
    setError('');
    
    try {
      let data;
      if (mealType === 'all') {
        data = await recommendationService.getMealRecommendations();
      } else {
        data = await recommendationService.getMealRecommendationsByType(mealType);
      }
      
      setRecommendations(data.recommendations || []);
      setUserProfile(data.userProfile);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load meal recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomMeals = async () => {
    try {
      const data = await recommendationService.getCustomMeals();
      setCustomMeals(data.customMeals || []);
    } catch (error) {
      console.error('Error fetching custom meals:', error);
    }
  };

  const handleCustomMealCreated = (newMeal) => {
    setCustomMeals(prev => [newMeal, ...prev]);
    setShowCustomMealCreator(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    const mealType = mealTypes[newValue].value;
    fetchRecommendations(mealType);
  };

  const handleRefresh = () => {
    const mealType = mealTypes[selectedTab].value;
    fetchRecommendations(mealType);
  };

  const handleMealSelect = (recommendation) => {
    if (onMealSelect) {
      onMealSelect(recommendation);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return 'primary';
      case 'lunch':
        return 'success';
      case 'dinner':
        return 'secondary';
      case 'snack':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            <Typography variant="body2">
              Please log in to get personalized meal recommendations.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            <StarIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Personalized Meal Recommendations
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowCustomMealCreator(true)}
              size="small"
            >
              Create Custom Meal
            </Button>
            <Tooltip title="Refresh recommendations">
              <span>
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {userProfile && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Your Profile:</strong> {userProfile.fitnessGoal} goal, 
              {userProfile.age} years old, {userProfile.gender}, 
              {userProfile.height}cm, {userProfile.weight}kg
            </Typography>
          </Alert>
        )}

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {mealTypes.map((type, index) => (
            <Tab
              key={type.value}
              label={type.label}
              icon={type.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <Alert severity="info">
            <Typography variant="body2">
              No recommendations available. Please complete your profile to get personalized suggestions.
            </Typography>
          </Alert>
        )}

        {!loading && !error && (recommendations.length > 0 || customMeals.length > 0) && (
          <Grid container spacing={3}>
            {/* Custom Meals Section */}
            {customMeals.length > 0 && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                    Your Custom Meals
                  </Typography>
                </Grid>
                {customMeals.slice(0, 4).map((meal, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={`custom-${meal._id}`}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {meal.name}
                            </Typography>
                            <Chip
                              label={meal.mealType}
                              color={getMealTypeColor(meal.mealType)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="h6" color="primary">
                              {meal.totalCalories} cal
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Custom Meal
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" paragraph>
                          {meal.notes || 'Your custom creation'}
                        </Typography>

                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            <CalorieIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                            Nutrition
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                              label={`${meal.totalCalories} cal`}
                              size="small"
                              color="warning"
                            />
                            <Chip
                              label={`${meal.totalProtein}g protein`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                            <Chip
                              label={`${meal.totalCarbs}g carbs`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                            <Chip
                              label={`${meal.totalFat}g fat`}
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleMealSelect(meal)}
                          startIcon={<FoodIcon />}
                        >
                          Use This Meal
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </>
            )}

            {/* AI Recommendations Section */}
            {recommendations.length > 0 && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                    AI Recommendations
                  </Typography>
                </Grid>
                {recommendations.map((recommendation, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {recommendation.name}
                        </Typography>
                        <Chip
                          label={recommendation.mealType}
                          color={getMealTypeColor(recommendation.mealType)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6" color="primary">
                          {recommendation.estimatedCalories} cal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {recommendation.prepTime}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {recommendation.description}
                    </Typography>

                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        <CalorieIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        Nutrition (per serving)
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={`${recommendation.nutrition.calories} cal`}
                          size="small"
                          color="warning"
                        />
                        <Chip
                          label={`${recommendation.nutrition.protein}g protein`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                        <Chip
                          label={`${recommendation.nutrition.carbs}g carbs`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                        <Chip
                          label={`${recommendation.nutrition.fat}g fat`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          <FoodIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                          Ingredients ({recommendation.foodItems.length} items)
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {recommendation.foodItems.map((food, foodIndex) => (
                            <ListItem key={foodIndex}>
                              <ListItemIcon>
                                <FoodIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={food.name}
                                secondary={`${food.quantity}${food.unit} - ${food.calories} cal`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>

                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        Benefits
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        {recommendation.benefits.map((benefit, benefitIndex) => (
                          <Chip
                            key={benefitIndex}
                            label={benefit}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>

                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        <Chip
                          label={recommendation.difficulty}
                          size="small"
                          color={getDifficultyColor(recommendation.difficulty)}
                        />
                        <Chip
                          icon={<TimeIcon />}
                          label={recommendation.prepTime}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleMealSelect(recommendation)}
                        startIcon={<FoodIcon />}
                      >
                        Use This Meal
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
              </>
            )}
          </Grid>
        )}

        {/* Custom Meal Creator Dialog */}
        {showCustomMealCreator && (
          <CustomMealCreator
            onMealCreated={handleCustomMealCreated}
            onClose={() => setShowCustomMealCreator(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MealRecommendations;
