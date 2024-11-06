const express = require('express');
const { handleAssistantQuery } = require('../controllers/assistantController');

const router = express.Router();

// Endpoint to handle AI queries
router.post('/query', handleAssistantQuery);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Assistant service is running' });
});

module.exports = router;