const express = require('express');
const router = express.Router();
const guidesController = require('../controllers/guidesController');

router.get('/', guidesController.getAllGuides);
router.get('/:id', guidesController.getGuideById);
router.post('/', guidesController.createGuide);
router.put('/:id', guidesController.updateGuide);
router.delete('/:id', guidesController.deleteGuide);

module.exports = router;
