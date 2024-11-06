const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/authMiddleware');
const communityController = require('../controllers/communityController');
const upload = require('../middleware/cloudinary');


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
