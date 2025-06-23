const express = require('express');
const router = express.Router();
const controller = require('../controllers/organizationController');
const { validateOrganization } = require('../validators/organizationValidator');

router.post('/', validateOrganization, controller.createOrganization);
router.get('/', controller.getOrganizations);
router.get('/:id', controller.getOrganizationById);
router.patch('/:id', controller.updateOrganization);
router.delete('/:id', controller.deleteOrganization);

module.exports = router;
