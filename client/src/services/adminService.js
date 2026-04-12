import api from './api';

const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getRecipes: (params) => api.get('/admin/recipes', { params }),
  deleteRecipe: (id) => api.delete(`/admin/recipes/${id}`),
};

export default adminService;
