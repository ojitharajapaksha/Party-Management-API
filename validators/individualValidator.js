const { body, validationResult } = require('express-validator');

exports.validateIndividual = [
  // Core required fields
  body('givenName')
    .notEmpty()
    .withMessage('Given name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Given name must be between 1 and 100 characters')
    .trim(),
    
  body('familyName')
    .notEmpty()
    .withMessage('Family name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Family name must be between 1 and 100 characters')
    .trim(),
    
  // Alternative field names for frontend compatibility
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters')
    .trim(),
    
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters')
    .trim(),
    
  // Email validation
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
    
  // Phone validation
  body('phone')
    .optional()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Must be a valid phone number'),
    
  // Date fields
  body('birthDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Birth date must be a valid date'),
    
  // Enum fields
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'unknown'])
    .withMessage('Gender must be one of: male, female, other, unknown'),
    
  body('maritalStatus')
    .optional()
    .isIn(['single', 'married', 'divorced', 'widowed', 'separated', 'unknown'])
    .withMessage('Marital status must be one of: single, married, divorced, widowed, separated, unknown'),
    
  body('status')
    .optional()
    .isIn(['initialized', 'validated', 'active', 'inactive', 'terminated'])
    .withMessage('Status must be one of: initialized, validated, active, inactive, terminated'),
    
  // Password validation for authentication context
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  // Boolean fields
  body('agreeToTerms')
    .optional()
    .isBoolean()
    .withMessage('agreeToTerms must be a boolean'),
    
  body('subscribeToNewsletter')
    .optional()
    .isBoolean()
    .withMessage('subscribeToNewsletter must be a boolean'),
    
  // Contact medium validation
  body('contactMedium')
    .optional()
    .isArray()
    .withMessage('Contact medium must be an array'),
    
  body('contactMedium.*.mediumType')
    .optional()
    .isIn(['email', 'phone', 'mobile', 'fax', 'pager', 'sms', 'landline', 'other'])
    .withMessage('Medium type must be valid'),
    
  // Custom validation to check required fields based on context
  (req, res, next) => {
    const errors = validationResult(req);
    
    // If creating from frontend form, ensure we have either givenName/familyName or firstName/lastName
    if (!req.body.givenName && !req.body.firstName) {
      errors.errors.push({
        msg: 'Either givenName or firstName is required',
        param: 'givenName',
        location: 'body'
      });
    }
    
    if (!req.body.familyName && !req.body.lastName) {
      errors.errors.push({
        msg: 'Either familyName or lastName is required',
        param: 'familyName',
        location: 'body'
      });
    }
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    next();
  }
];