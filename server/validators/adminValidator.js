import { body, param, query } from 'express-validator';

export const updateUserRoleRules = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['user', 'admin']).withMessage('Role must be user or admin'),
];

export const adminUserQueryRules = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long')
    .escape(),
  query('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Invalid role filter'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];

export const adminUserIdRules = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
];

export const adminRecipeIdRules = [
  param('id')
    .isMongoId().withMessage('Invalid recipe ID'),
];
