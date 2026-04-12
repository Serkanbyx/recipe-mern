import { body } from 'express-validator';

export const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Bio must be at most 300 characters')
    .escape(),
];

export const changePasswordRules = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

export const deleteAccountRules = [
  body('password')
    .notEmpty().withMessage('Password is required to delete account'),
];

export const updatePreferencesRules = [
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'system']).withMessage('Theme must be light, dark, or system'),
  body('preferences.fontSize')
    .optional()
    .isIn(['small', 'medium', 'large']).withMessage('Font size must be small, medium, or large'),
  body('preferences.contentDensity')
    .optional()
    .isIn(['compact', 'comfortable', 'spacious']).withMessage('Content density must be compact, comfortable, or spacious'),
  body('preferences.animations')
    .optional()
    .isBoolean().withMessage('Animations must be a boolean'),
  body('preferences.privacy.showEmail')
    .optional()
    .isBoolean().withMessage('Show email must be a boolean'),
  body('preferences.privacy.showFavorites')
    .optional()
    .isBoolean().withMessage('Show favorites must be a boolean'),
];
