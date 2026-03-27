import api from './api';

export const recommendationService = {
  // Get personalized meal recommendations
  async getMealRecommendations() {
    try {
      const { data } = await api.get('/recommendations/meals');
      return data;
    } catch (error) {
      console.error('Error fetching meal recommendations:', error);
      throw error;
    }
  },

  // Get recommendations for specific meal type
  async getMealRecommendationsByType(mealType) {
    try {
      const { data } = await api.get(`/recommendations/meals/${mealType}`);
      return data;
    } catch (error) {
      console.error('Error fetching meal recommendations by type:', error);
      throw error;
    }
  },

  // Get breakfast recommendations
  async getBreakfastRecommendations() {
    return this.getMealRecommendationsByType('breakfast');
  },

  // Get lunch recommendations
  async getLunchRecommendations() {
    return this.getMealRecommendationsByType('lunch');
  },

  // Get dinner recommendations
  async getDinnerRecommendations() {
    return this.getMealRecommendationsByType('dinner');
  },

  // Get snack recommendations
  async getSnackRecommendations() {
    return this.getMealRecommendationsByType('snack');
  },

  // Save a custom meal
  async saveCustomMeal(mealData) {
    try {
      const { data } = await api.post('/recommendations/meals/custom', { mealData });
      return data;
    } catch (error) {
      console.error('Error saving custom meal:', error);
      throw error;
    }
  },

  // Get user's custom meals
  async getCustomMeals(mealType = null) {
    try {
      const params = mealType ? { mealType } : {};
      const { data } = await api.get('/recommendations/meals/custom', { params });
      return data;
    } catch (error) {
      console.error('Error fetching custom meals:', error);
      throw error;
    }
  },

  // Rate a meal
  async rateMeal(mealId, rating, feedback = '') {
    try {
      const { data } = await api.post(`/recommendations/meals/${mealId}/rate`, {
        rating,
        feedback
      });
      return data;
    } catch (error) {
      console.error('Error rating meal:', error);
      throw error;
    }
  }
};

export default recommendationService;
