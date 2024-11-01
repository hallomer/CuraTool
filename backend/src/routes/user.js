const express = require('express');
const { registerUser, getUserProfile, updateUserProfile, deleteUser, checkEmail } = require('../controllers/userController'); 
const multer = require('multer');
const verifyAuth = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }
});
// Register user
router.post('/register', verifyAuth, registerUser);
// Get user profile
router.get('/profile', verifyAuth, getUserProfile);
// Update user profile with file upload
router.put('/profile', verifyAuth, upload.single('profilePicture'), async (req, res, next) => {
    try {
      await updateUserProfile(req, res);
    } catch (error) {
      console.error('Error in profile update:', error);
      res.status(500).json({ error: 'Profile update failed' });
    }
});
  
// Delete user
router.delete('/profile', verifyAuth, deleteUser);
// Check if email exists
router.post('/check-email', checkEmail);
// GET User by UID
router.get('/:uid', verifyAuth, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});
module.exports = router;
