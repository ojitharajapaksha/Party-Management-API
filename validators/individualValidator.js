const { body } = require('express-validator');

exports.validateIndividual = [
  body('givenName').notEmpty().withMessage('Given name is required'),
  body('birthDate').optional().isISO8601().toDate(),
];