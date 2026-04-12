import api from './api';

const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  updatePreferences: (data) => api.put('/auth/preferences', data),
  deleteAccount: (data) => api.delete('/auth/account', { data }),
};

export default authService;
