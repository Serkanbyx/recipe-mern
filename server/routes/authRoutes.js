import { Router } from 'express';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validate.js';
import {
  registerRules,
  loginRules,
  updateProfileRules,
  changePasswordRules,
  deleteAccountRules,
  updatePreferencesRules,
} from '../validators/authValidator.js';
import {
  register,
  login,
  getMe,
  getPublicProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  updatePreferences,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.get('/me', protect, getMe);
router.get('/users/:userId', optionalAuth, getPublicProfile);
router.put('/profile', protect, updateProfileRules, validate, updateProfile);
router.put('/password', protect, changePasswordRules, validate, changePassword);
router.put('/preferences', protect, updatePreferencesRules, validate, updatePreferences);
router.delete('/account', protect, deleteAccountRules, validate, deleteAccount);

export default router;
