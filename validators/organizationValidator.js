const { body } = require('express-validator');

exports.validateOrganization = [
  body('name').notEmpty().withMessage('Organization name is required'),
];