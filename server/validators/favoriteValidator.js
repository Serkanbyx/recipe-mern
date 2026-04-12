import { param, query } from 'express-validator';

export const favoriteRecipeIdRules = [
  param('recipeId')
    .isMongoId().withMessage('Invalid recipe ID'),
];

export const favoriteQueryRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];
