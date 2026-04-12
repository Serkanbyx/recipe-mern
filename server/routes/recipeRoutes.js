import { Router } from 'express';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { likeLimiter, uploadLimiter } from '../middlewares/rateLimiter.js';
import upload from '../middlewares/upload.js';
import validate from '../middlewares/validate.js';
import {
  createRecipeRules,
  updateRecipeRules,
  recipeQueryRules,
  recipeIdRules,
  recipeSlugRules,
} from '../validators/recipeValidator.js';
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

router.get('/', optionalAuth, recipeQueryRules, validate, getAllRecipes);
router.get('/my', protect, recipeQueryRules, validate, getMyRecipes);
router.get('/slug/:slug', optionalAuth, recipeSlugRules, validate, getRecipeBySlug);
router.get('/:id', optionalAuth, recipeIdRules, validate, getRecipeById);
router.post('/', protect, createRecipeRules, validate, createRecipe);
router.post('/upload', protect, uploadLimiter, upload.single('image'), uploadImage);
router.put('/:id', protect, recipeIdRules, updateRecipeRules, validate, updateRecipe);
router.delete('/:id', protect, recipeIdRules, validate, deleteRecipe);
router.put('/:id/like', protect, recipeIdRules, validate, likeLimiter, toggleLike);

export default router;
