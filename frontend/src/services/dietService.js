import api from './api';

export const dietService = {
  async list() {
    const { data } = await api.get('/diet');
    return data;
  },

  async create(meal) {
    const { data } = await api.post('/diet', meal);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/diet/${id}`);
    return data;
  },

  async update(id, meal) {
    const { data } = await api.put(`/diet/${id}`, meal);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/diet/${id}`);
    return data;
  }
};

export default dietService;


