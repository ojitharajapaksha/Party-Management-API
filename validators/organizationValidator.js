const { body, validationResult } = require('express-validator');

exports.validateOrganization = [
  // Core required fields
  body('name')
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Organization name must be between 1 and 200 characters')
    .trim(),
    
  // Alternative field name for frontend compatibility
  body('organizationName')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Organization name must be between 1 and 200 characters')
    .trim(),
    
  // Trading name
  body('tradingName')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Trading name must be between 1 and 200 characters')
    .trim(),
    
  // Organization type
  body('organizationType')
    .optional()
    .isIn(['company', 'partnership', 'sole_proprietorship', 'nonprofit', 'government', 'corporation', 'llc', 'other'])
    .withMessage('Organization type must be one of: company, partnership, sole_proprietorship, nonprofit, government, corporation, llc, other'),
    
  // Status
  body('status')
    .optional()
    .isIn(['initialized', 'validated', 'active', 'inactive', 'terminated'])
    .withMessage('Status must be one of: initialized, validated, active, inactive, terminated'),
    
  // Email validation for contact person
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
    
  // Contact person names
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Contact person first name must be between 1 and 100 characters')
    .trim(),
    
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Contact person last name must be between 1 and 100 characters')
    .trim(),
    
  // Boolean fields
  body('isLegalEntity')
    .optional()
    .isBoolean()
    .withMessage('isLegalEntity must be a boolean'),
    
  body('isHeadOffice')
    .optional()
    .isBoolean()
    .withMessage('isHeadOffice must be a boolean'),
    
  body('agreeToTerms')
    .optional()
    .isBoolean()
    .withMessage('agreeToTerms must be a boolean'),
    
  body('subscribeToNewsletter')
    .optional()
    .isBoolean()
    .withMessage('subscribeToNewsletter must be a boolean'),
    
  // Business registration number
  body('businessRegistrationNumber')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Business registration number must be between 1 and 50 characters')
    .trim(),
    
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
    
  // Contact medium validation
  body('contactMedium')
    .optional()
    .isArray()
    .withMessage('Contact medium must be an array'),
    
  body('contactMedium.*.mediumType')
    .optional()
    .isIn(['email', 'phone', 'mobile', 'fax', 'pager', 'sms', 'landline', 'website', 'other'])
    .withMessage('Medium type must be valid'),
    
  // Custom validation
  (req, res, next) => {
    const errors = validationResult(req);
    
    // If creating from frontend form, ensure we have either name or organizationName
    if (!req.body.name && !req.body.organizationName) {
      errors.errors.push({
        msg: 'Either name or organizationName is required',
        param: 'name',
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