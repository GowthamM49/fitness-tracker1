import api from './api';

export const usersService = {
  async getProfile() {
    const { data } = await api.get('/users/profile');
    return data;
  },

  async updateProfile(profile) {
    const { data } = await api.put('/users/profile', profile);
    return data;
  },

  async updateSettings(settings) {
    // For now, save settings to localStorage since backend doesn't have settings endpoint
    localStorage.setItem('userSettings', JSON.stringify(settings));
    return settings;
  },

  async deleteAccount() {
    // Placeholder for account deletion
    localStorage.removeItem('token');
    localStorage.removeItem('userSettings');
    return { message: 'Account deleted successfully' };
  }
};

export default usersService;


