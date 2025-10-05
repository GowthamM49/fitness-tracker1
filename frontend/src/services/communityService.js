import api from './api';

export const communityService = {
  async listChallenges() {
    const { data } = await api.get('/community/challenges');
    return data;
  },

  async createChallenge(challenge) {
    const { data } = await api.post('/community/challenges', challenge);
    return data;
  },

  async getChallengeById(id) {
    const { data } = await api.get(`/community/challenges/${id}`);
    return data;
  },

  async joinChallenge(id) {
    const { data } = await api.post(`/community/challenges/${id}/join`);
    return data;
  },

  async leaderboard() {
    const { data } = await api.get('/community/leaderboard');
    return data;
  },

  async getComments(challengeId) {
    const { data } = await api.get(`/community/challenges/${challengeId}/comments`);
    return data;
  },

  async addComment(challengeId, text) {
    const { data } = await api.post(`/community/challenges/${challengeId}/comments`, { text });
    return data;
  },

  async listForums() {
    const { data } = await api.get('/community/forums');
    return data;
  },

  async createThread(title) {
    const { data } = await api.post('/community/forums', { title });
    return data;
  },

  async getThread(id) {
    const { data } = await api.get(`/community/forums/${id}`);
    return data;
  },

  async replyToThread(id, text) {
    const { data } = await api.post(`/community/forums/${id}/replies`, { text });
    return data;
  },

  async listFriends() {
    const { data } = await api.get('/community/friends');
    return data;
  },

  async requestFriend(id) {
    const { data } = await api.post(`/community/friends/${id}/request`);
    return data;
  },

  async acceptFriend(id) {
    const { data } = await api.post(`/community/friends/${id}/accept`);
    return data;
  }
};

export default communityService;


