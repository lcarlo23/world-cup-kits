import { body, validationResult } from 'express-validator';

export function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors
        .array()
        .map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
}

export function productValidationRules() {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('The product name is required')
      .isLength({ min: 3 })
      .withMessage('The name must be at least 3 characters long'),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10 })
      .withMessage('The description must be at least 10 characters long'),

    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),

    body('stock')
      .notEmpty()
      .withMessage('Stock is required')
      .isInt({ min: 0 })
      .withMessage('Stock must be an integer of 0 or greater'),

    body('team').trim().notEmpty().withMessage('Team name is required'),

    body('year')
      .notEmpty()
      .withMessage('Year is required')
      .isInt({ min: 1930 })
      .withMessage('Must be a valid year (1930 or later)'),

    body('sizes')
      .notEmpty()
      .withMessage('Sizes are required')
      .isArray({ min: 1 })
      .withMessage(
        'Sizes must be an array with at least one element (e.g., ["S", "M", "L"])',
      ),
  ];
}

export function userValidationRules() {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('The user name is required')
      .isLength({ min: 2 })
      .withMessage('The name must be at least 2 characters long'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address'),

    body('role')
      .trim()
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['admin', 'customer'])
      .withMessage('Role must be either "admin" or "customer"'),

    body('provider')
      .trim()
      .notEmpty()
      .withMessage('Provider is required')
      .equals('github')
      .withMessage('Provider must be "github"'),

    body('providerId').trim().notEmpty().withMessage('Provider ID is required'),
  ];
}
