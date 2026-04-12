import api from './api';

const recipeService = {
  getAll: (params) => api.get('/recipes', { params }),
  getBySlug: (slug) => api.get(`/recipes/slug/${slug}`),
  getById: (id) => api.get(`/recipes/${id}`),
  getMyRecipes: (params) => api.get('/recipes/my', { params }),
  create: (data) => api.post('/recipes', data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
  toggleLike: (id) => api.put(`/recipes/${id}/like`),
  uploadImage: (formData) => api.post('/recipes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default recipeService;
