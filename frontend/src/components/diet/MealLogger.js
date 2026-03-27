import React, { useState, useEffect } from 'react';
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
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Restaurant as FoodIcon,
} from '@mui/icons-material';
import { dietService } from '../../services/dietService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MealLogger = ({ onMealSaved, dailyCalorieTarget, recommendedMeal = null }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mealData, setMealData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    mealType: '',
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

  // Handle recommended meal when component receives one
  useEffect(() => {
    if (recommendedMeal) {
      setMealData(prev => ({
        ...prev,
        name: recommendedMeal.name,
        mealType: recommendedMeal.mealType.toLowerCase()
      }));
      
      // Convert recommended meal food items to the format expected by the form
      const recommendedFoodItems = recommendedMeal.foodItems.map((food, index) => ({
        id: Date.now() + index,
        name: food.name,
        quantity: food.quantity,
        unit: food.unit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
      }));
      
      setFoodItems(recommendedFoodItems);
    }
  }, [recommendedMeal]);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
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

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const saveMeal = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!mealData.name || foodItems.length === 0) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const meal = {
        name: mealData.name,
        mealType: mealData.mealType.charAt(0).toUpperCase() + mealData.mealType.slice(1), // Capitalize first letter
        date: mealData.date,
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

      const savedMeal = await dietService.create(meal);

      // Show success message
      setSuccess('Meal saved successfully to MongoDB!');

      // Reset form
      setMealData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        mealType: 'breakfast',
        notes: ''
      });
      setFoodItems([]);

      // Notify parent component
      if (onMealSaved) {
        onMealSaved(savedMeal);
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      if (error.response?.status === 401) {
        setError('Please log in to save meals.');
        navigate('/login');
      } else {
        setError('Failed to save meal. Please try again.');
      }
    } finally {
      setIsSaving(false);
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
        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Please <strong>log in</strong> to save your meals to the database.
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </Alert>
        )}
        
        <Typography variant="h6" gutterBottom>
          Log New Meal
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Meal Name"
              name="name"
              value={mealData.name}
              onChange={handleMealChange}
              placeholder="e.g., Protein Bowl, Healthy Salad, Quick Snack"
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={mealData.date}
              onChange={handleMealChange}
              InputLabelProps={{ shrink: true }}
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
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={mealData.notes}
              onChange={handleMealChange}
              multiline
              rows={2}
              placeholder="How did it taste? Any special notes?"
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
                onClick={saveMeal}
                disabled={!mealData.name || isSaving}
                size="large"
              >
                {isSaving ? 'Saving...' : 'Save Meal'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MealLogger;
