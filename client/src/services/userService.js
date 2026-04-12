import api from './api';

const userService = {
  getPublicProfile: (userId, params) => api.get(`/auth/users/${userId}`, { params }),
};

export default userService;
