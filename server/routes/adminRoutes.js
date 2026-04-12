import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import { adminLimiter } from '../middlewares/rateLimiter.js';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
} from '../controllers/adminController.js';

const router = Router();

router.use(protect, adminOnly, adminLimiter);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/recipes', getAllRecipesAdmin);
router.delete('/recipes/:id', deleteRecipeAdmin);

export default router;
