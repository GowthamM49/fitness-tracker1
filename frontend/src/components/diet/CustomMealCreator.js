import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Restaurant as FoodIcon,
  Star as StarIcon,
  RateReview as RateIcon
} from '@mui/icons-material';
import { recommendationService } from '../../services/recommendationService';
import { useAuth } from '../../context/AuthContext';

const CustomMealCreator = ({ onMealCreated, onClose }) => {
  const { isAuthenticated } = useAuth();
  const [mealData, setMealData] = useState({
    name: '',
    mealType: '',
    description: '',
    notes: ''
  });

  const [foodItems, setFoodItems] = useState([]);
  const [currentFood, setCurrentFood] = useState({
    name: '',
    quantity: '',
    unit: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const mealTypes = [
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Snack', label: 'Snack' }
  ];

  const commonFoods = [
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, per: 100 },
    { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, per: 100 },
    { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, per: 100 },
    { name: 'Salmon', calories: 208, protein: 25, carbs: 0, fat: 12, per: 100 },
    { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, per: 100 },
    { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, per: 100 },
    { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fat: 1.4, per: 100 },
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, per: 100 },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, per: 100 },
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, per: 100 },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, per: 100 },
    { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, per: 100 }
  ];

  const units = ['g', 'ml', 'cup', 'tbsp', 'tsp', 'piece', 'slice'];

  const handleMealChange = (e) => {
    const { name, value } = e.target;
    setMealData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setCurrentFood(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFoodSelect = (food) => {
    if (food) {
      setCurrentFood(prev => ({
        ...prev,
        name: food.name,
        calories: food.calories.toString(),
        protein: food.protein.toString(),
        carbs: food.carbs.toString(),
        fat: food.fat.toString()
      }));
    }
  };

  const addFoodItem = () => {
    if (!currentFood.name || !currentFood.quantity || !currentFood.calories) {
      return;
    }

    const quantity = parseFloat(currentFood.quantity);
    const multiplier = quantity / 100; // Assuming nutrition values are per 100g

    const newFoodItem = {
      ...currentFood,
      id: Date.now(),
      quantity: quantity,
      calories: Math.round(parseFloat(currentFood.calories) * multiplier),
      protein: Math.round(parseFloat(currentFood.protein) * multiplier * 10) / 10,
      carbs: Math.round(parseFloat(currentFood.carbs) * multiplier * 10) / 10,
      fat: Math.round(parseFloat(currentFood.fat) * multiplier * 10) / 10
    };

    setFoodItems(prev => [...prev, newFoodItem]);
    setCurrentFood({
      name: '',
      quantity: '',
      unit: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
    setShowFoodForm(false);
  };

  const removeFoodItem = (foodId) => {
    setFoodItems(prev => prev.filter(food => food.id !== foodId));
  };

  const saveCustomMeal = async () => {
    if (!isAuthenticated) {
      setError('Please log in to save custom meals.');
      return;
    }

    if (!mealData.name || foodItems.length === 0) {
      setError('Please provide a meal name and at least one food item.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const meal = {
        name: mealData.name,
        mealType: mealData.mealType,
        description: mealData.description,
        foodItems: foodItems.map(food => ({
          name: food.name,
          quantity: parseFloat(food.quantity),
          unit: food.unit,
          calories: parseFloat(food.calories),
          protein: parseFloat(food.protein),
          carbs: parseFloat(food.carbs),
          fat: parseFloat(food.fat)
        })),
        notes: mealData.notes
      };

      const savedMeal = await recommendationService.saveCustomMeal(meal);

      setSuccess('Custom meal saved successfully!');
      
      // Reset form
      setMealData({
        name: '',
        mealType: 'Breakfast',
        description: '',
        notes: ''
      });
      setFoodItems([]);

      // Show rating dialog
      setShowRatingDialog(true);

      // Notify parent component
      if (onMealCreated) {
        onMealCreated(savedMeal.meal);
      }
    } catch (error) {
      console.error('Error saving custom meal:', error);
      setError('Failed to save custom meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (rating > 0) {
      try {
        // In a real app, you'd have the meal ID here
        // For now, we'll just show a success message
        setSuccess('Thank you for your feedback!');
        setShowRatingDialog(false);
        setRating(0);
        setFeedback('');
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
  };

  const getTotalNutrition = () => {
    const totalCalories = foodItems.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = foodItems.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = foodItems.reduce((sum, food) => sum + food.carbs, 0);
    const totalFat = foodItems.reduce((sum, food) => sum + food.fat, 0);

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const nutrition = getTotalNutrition();

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Create Custom Meal
          </Typography>
          {onClose && (
            <IconButton onClick={onClose}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Please log in to create and save custom meals.
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Meal Name"
              name="name"
              value={mealData.name}
              onChange={handleMealChange}
              placeholder="e.g., My Special Protein Bowl"
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                name="mealType"
                value={mealData.mealType}
                onChange={handleMealChange}
                label="Meal Type"
              >
                {mealTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={mealData.description}
              onChange={handleMealChange}
              multiline
              rows={2}
              placeholder="Describe your custom meal..."
            />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={mealData.notes}
              onChange={handleMealChange}
              multiline
              rows={2}
              placeholder="Any special notes or cooking tips..."
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Food Items ({foodItems.length})
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowFoodForm(true)}
          >
            Add Food
          </Button>
        </Box>

        {showFoodForm && (
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Food Item
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={commonFoods}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => handleFoodSelect(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Food Name"
                      name="name"
                      value={currentFood.name}
                      onChange={handleFoodChange}
                    />
                  )}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={currentFood.quantity}
                  onChange={handleFoodChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={currentFood.unit}
                    onChange={handleFoodChange}
                    label="Unit"
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Calories (per 100g)"
                  name="calories"
                  type="number"
                  value={currentFood.calories}
                  onChange={handleFoodChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Protein (g per 100g)"
                  name="protein"
                  type="number"
                  value={currentFood.protein}
                  onChange={handleFoodChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Carbs (g per 100g)"
                  name="carbs"
                  type="number"
                  value={currentFood.carbs}
                  onChange={handleFoodChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Fat (g per 100g)"
                  name="fat"
                  type="number"
                  value={currentFood.fat}
                  onChange={handleFoodChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={addFoodItem}
                disabled={!currentFood.name || !currentFood.quantity || !currentFood.calories}
              >
                Add Food
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFoodForm(false)}
              >
                Cancel
              </Button>
            </Box>
          </Card>
        )}

        {foodItems.length > 0 && (
          <List>
            {foodItems.map((food) => (
              <ListItem key={food.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <FoodIcon color="primary" />
                      <Typography variant="subtitle1">
                        {food.name}
                      </Typography>
                    </Box>
                  }
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
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeFoodItem(food.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        {foodItems.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Meal Summary:</strong> {foodItems.length} food items, 
                {nutrition.totalCalories} calories, 
                {nutrition.totalProtein}g protein, 
                {nutrition.totalCarbs}g carbs, 
                {nutrition.totalFat}g fat
              </Typography>
            </Alert>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveCustomMeal}
                disabled={!mealData.name || isSaving}
                size="large"
              >
                {isSaving ? 'Saving...' : 'Save Custom Meal'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Rating Dialog */}
        <Dialog open={showRatingDialog} onClose={() => setShowRatingDialog(false)}>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <RateIcon color="primary" />
              Rate Your Custom Meal
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" gutterBottom>
              How would you rate this custom meal? Your feedback helps improve recommendations for other users.
            </Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              label="Feedback (optional)"
              multiline
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share any tips or suggestions about this meal..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRatingDialog(false)}>
              Skip
            </Button>
            <Button 
              onClick={handleRatingSubmit}
              variant="contained"
              disabled={rating === 0}
            >
              Submit Rating
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomMealCreator;
