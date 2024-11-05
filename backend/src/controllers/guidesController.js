const Guide = require('../models/Guide');


// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching guides' });
  }
};

// Get a specific guide by ID
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching guide' });
  }
};

// Create a new guide
exports.createGuide = async (req, res) => {
    try {
      const guide = new Guide(req.body);
      await guide.save();
      res.status(201).json(guide);
    } catch (error) {
      res.status(400).json({ error: 'Error creating guide' });
    }
  };
  
  // Update a guide
  exports.updateGuide = async (req, res) => {
    try {
      const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!guide) {
        return res.status(404).json({ error: 'Guide not found' });
      }
      res.status(200).json(guide);
    } catch (error) {
      res.status(400).json({ error: 'Error updating guide' });
    }
  };
  
  // Delete a guide
  exports.deleteGuide = async (req, res) => {
    try {
      const guide = await Guide.findByIdAndDelete(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: 'Guide not found' });
      }
      res.status(200).json({ message: 'Guide deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting guide' });
    }
  };
