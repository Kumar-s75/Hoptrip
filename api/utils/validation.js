const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Trip validation rules
const validateTripCreation = [
  body('tripName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Trip name must be between 1 and 100 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('background')
    .isURL()
    .withMessage('Background must be a valid URL'),
  handleValidationErrors
];

const validateTripUpdate = [
  body('tripName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Trip name must be between 1 and 100 characters'),
  body('status')
    .optional()
    .isIn(['planning', 'confirmed', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid trip status'),
  body('visibility')
    .optional()
    .isIn(['private', 'public', 'friends'])
    .withMessage('Invalid visibility setting'),
  handleValidationErrors
];

// Expense validation rules
const validateExpense = [
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('paidBy')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Paid by field is required'),
  body('splitBy')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Split by field is required'),
  handleValidationErrors
];

// User validation rules
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address'),
  handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  handleValidationErrors
];

module.exports = {
  validateTripCreation,
  validateTripUpdate,
  validateExpense,
  validateUserUpdate,
  validateObjectId,
  validatePagination,
  handleValidationErrors
};