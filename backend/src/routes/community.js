const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/authMiddleware');
const communityController = require('../controllers/communityController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all posts
router.get('/', communityController.getAllPosts);

// Add a post
router.post('/', verifyAuth, upload.single('image'), communityController.addPost);

// Delete a post
router.delete('/:postId', verifyAuth, communityController.deletePost);

// Add a comment
router.post('/:postId/comments', verifyAuth, upload.single('image'), communityController.addComment);

// Delete a comment
router.delete('/:postId/comments/:commentId', verifyAuth, communityController.deleteComment);

// Rate a post
router.post('/:postId/rate', verifyAuth, communityController.ratePost);

module.exports = router;
