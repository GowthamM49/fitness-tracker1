import api from './api';

export const workoutsService = {
  async list() {
    const { data } = await api.get('/workouts');
    return data;
  },

  async create(workout) {
    const { data } = await api.post('/workouts', workout);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/workouts/${id}`);
    return data;
  },

  async update(id, workout) {
    const { data } = await api.put(`/workouts/${id}`, workout);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/workouts/${id}`);
    return data;
  }
};

export default workoutsService;


