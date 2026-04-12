import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import { adminLimiter } from '../middlewares/rateLimiter.js';
import validate from '../middlewares/validate.js';
import {
  updateUserRoleRules,
  adminUserQueryRules,
  adminUserIdRules,
  adminRecipeIdRules,
} from '../validators/adminValidator.js';
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
router.get('/users', adminUserQueryRules, validate, getAllUsers);
router.get('/users/:id', adminUserIdRules, validate, getUserById);
router.put('/users/:id/role', updateUserRoleRules, validate, updateUserRole);
router.delete('/users/:id', adminUserIdRules, validate, deleteUser);
router.get('/recipes', getAllRecipesAdmin);
router.delete('/recipes/:id', adminRecipeIdRules, validate, deleteRecipeAdmin);

export default router;
