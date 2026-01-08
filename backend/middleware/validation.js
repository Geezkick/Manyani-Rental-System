const { body, validationResult, param, query } = require('express-validator');

// Validation rules
const authValidation = {
  register: [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).withMessage('Please enter a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('nationalId').notEmpty().withMessage('National ID is required')
  ],
  
  login: [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  
  updateProfile: [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('phone').optional().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).withMessage('Please enter a valid phone number')
  ]
};

const propertyValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Property name is required'),
    body('type').isIn(['apartment', 'house', 'studio', 'commercial', 'townhouse', 'bungalow']).withMessage('Invalid property type'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('address.street').trim().notEmpty().withMessage('Street address is required'),
    body('address.city').trim().notEmpty().withMessage('City is required'),
    body('address.county').trim().notEmpty().withMessage('County is required'),
    body('units').isArray().withMessage('Units must be an array'),
    body('units.*.unitNumber').trim().notEmpty().withMessage('Unit number is required'),
    body('units.*.bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a positive number'),
    body('units.*.bathrooms').isInt({ min: 1 }).withMessage('Bathrooms must be at least 1'),
    body('units.*.size').isFloat({ min: 1 }).withMessage('Size must be a positive number'),
    body('units.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('units.*.deposit').isFloat({ min: 0 }).withMessage('Deposit must be a positive number')
  ],
  
  update: [
    param('id').isMongoId().withMessage('Invalid property ID'),
    body('name').optional().trim().notEmpty().withMessage('Property name cannot be empty'),
    body('type').optional().isIn(['apartment', 'house', 'studio', 'commercial', 'townhouse', 'bungalow']).withMessage('Invalid property type')
  ]
};

const bookingValidation = {
  create: [
    body('propertyId').isMongoId().withMessage('Invalid property ID'),
    body('unitId').isMongoId().withMessage('Invalid unit ID'),
    body('moveInDate').isISO8601().withMessage('Invalid move-in date'),
    body('leaseStartDate').isISO8601().withMessage('Invalid lease start date'),
    body('leaseEndDate').isISO8601().withMessage('Invalid lease end date'),
    body('monthlyRent').isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number'),
    body('securityDeposit').isFloat({ min: 0 }).withMessage('Security deposit must be a positive number')
  ]
};

const paymentValidation = {
  create: [
    body('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('paymentType').isIn(['rent', 'deposit', 'amenity', 'late_fee', 'maintenance', 'other']).withMessage('Invalid payment type'),
    body('periodMonth').isString().notEmpty().withMessage('Period month is required'),
    body('periodYear').isInt({ min: 2020, max: 2030 }).withMessage('Invalid year'),
    body('dueDate').isISO8601().withMessage('Invalid due date')
  ],
  
  mpesaPayment: [
    body('phoneNumber').matches(/^254[0-9]{9}$/).withMessage('Invalid M-Pesa phone number. Format: 2547XXXXXXXX'),
    body('amount').isFloat({ min: 1, max: 150000 }).withMessage('Amount must be between 1 and 150,000'),
    body('accountReference').optional().isString()
  ]
};

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  };
};

// Pagination validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

module.exports = {
  authValidation,
  propertyValidation,
  bookingValidation,
  paymentValidation,
  paginationValidation,
  validate
};
