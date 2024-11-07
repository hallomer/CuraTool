const express = require('express');
const router = express.Router();
const guidesController = require('../controllers/guidesController');

// Get all guides
router.get('/', guidesController.getAllGuides);

// Get a specific guide by ID
router.get('/:id', guidesController.getGuideById);

// Create a new guide
router.post('/', guidesController.createGuide);

// Update a specific guide by ID
router.put('/:id', guidesController.updateGuide);

// Delete a specific guide by ID
router.delete('/:id', guidesController.deleteGuide);

module.exports = router;
