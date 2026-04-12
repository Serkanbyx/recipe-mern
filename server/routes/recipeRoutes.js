import { Router } from 'express';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { likeLimiter, uploadLimiter } from '../middlewares/rateLimiter.js';
import upload from '../middlewares/upload.js';
import {
  createRecipe,
  getAllRecipes,
  getRecipeBySlug,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  uploadImage,
} from '../controllers/recipeController.js';

const router = Router();

router.get('/', optionalAuth, getAllRecipes);
router.get('/my', protect, getMyRecipes);
router.get('/slug/:slug', optionalAuth, getRecipeBySlug);
router.get('/:id', optionalAuth, getRecipeById);
router.post('/', protect, createRecipe);
router.post('/upload', protect, uploadLimiter, upload.single('image'), uploadImage);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.put('/:id/like', protect, likeLimiter, toggleLike);

export default router;
