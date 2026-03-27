import api from './api';

export const progressService = {
  // Progress Entries
  async getEntries() {
    const { data } = await api.get('/progress/entries');
    return data;
  },

  async createEntry(entry) {
    const { data } = await api.post('/progress/entries', entry);
    return data;
  },

  async updateEntry(id, entry) {
    const { data } = await api.put(`/progress/entries/${id}`, entry);
    return data;
  },

  async removeEntry(id) {
    const { data } = await api.delete(`/progress/entries/${id}`);
    return data;
  },

  // Goals
  async getGoals() {
    const { data } = await api.get('/progress/goals');
    return data;
  },

  async createGoal(goal) {
    const { data } = await api.post('/progress/goals', goal);
    return data;
  },

  async updateGoal(id, goal) {
    const { data } = await api.put(`/progress/goals/${id}`, goal);
    return data;
  },

  async removeGoal(id) {
    const { data } = await api.delete(`/progress/goals/${id}`);
    return data;
  }
};

export default progressService;


