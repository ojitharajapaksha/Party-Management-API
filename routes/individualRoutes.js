const express = require('express');
const router = express.Router();
const controller = require('../controllers/individualController');
const { validateIndividual } = require('../validators/individualValidator');

router.post('/', validateIndividual, controller.createIndividual);
router.get('/', controller.getIndividuals);
router.get('/:id', controller.getIndividualById);
router.patch('/:id', controller.updateIndividual);
router.delete('/:id', controller.deleteIndividual);

module.exports = router;