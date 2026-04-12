import api from './api';

const favoriteService = {
  getMyFavorites: (params) => api.get('/favorites', { params }),
  toggleFavorite: (recipeId) => api.put(`/favorites/${recipeId}`),
  checkFavorite: (recipeId) => api.get(`/favorites/check/${recipeId}`),
};

export default favoriteService;
