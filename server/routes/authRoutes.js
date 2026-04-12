import { Router } from 'express';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  updatePreferences,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.put('/preferences', protect, updatePreferences);
router.delete('/account', protect, deleteAccount);

export default router;
