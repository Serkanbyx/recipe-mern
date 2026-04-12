import api from './api';

const userService = {
  getPublicProfile: (userId) => api.get(`/auth/users/${userId}`),
};

export default userService;
