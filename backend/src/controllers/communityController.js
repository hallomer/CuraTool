const CommunityPost = require('../models/Community');
const User = require('../models/User');
const mongoose = require('mongoose');


// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('user', 'username profilePicture uid')
      .populate('comments.user', 'username profilePicture uid')
      .sort({ createdAt: -1 });

    const postsWithTotalRating = posts.map(post => {
      const totalRating = post.ratings.reduce((sum, rating) => sum + rating.value, 0);
      return { ...post.toObject(), totalRating };
    });
    res.json(postsWithTotalRating);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Add a new post
exports.addPost = async (req, res) => {
  const { text } = req.body;
  const image = req.file ? req.file.path : '';

  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPost = new CommunityPost({
      user: user._id,
      text,
      image,
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};


// Delete a post
exports.deletePost = async (req, res) => {
  console.log('req.user:', req.user);
  const { postId } = req.params;
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.uid;
    const user = await User.findOne({ uid: userId });

    if (!user) {
      console.log(`User with uid ${userId} not found`);
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!post.user.equals(user._id)) {
      console.log(`User ${userId} not authorized to delete post ${postId}`);
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await CommunityPost.deleteOne({ _id: postId });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};


// Add a comment
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const image = req.file ? req.file.path : ''; 

  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const comment = { user: user._id, text, image };
    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) return res.status(404).json({ error: 'Comment not found' });

    const userId = req.user.uid;
    const user = await User.findOne({ uid: userId });

    if (!post.comments[commentIndex].user.equals(user._id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};



// Rate a post
exports.ratePost = async (req, res) => {
  const { postId } = req.params;
  const { value } = req.body;
  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const userId = req.user.uid;
    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const existingRating = post.ratings.find(rating => rating.user.toString() === user._id.toString());
    if (existingRating) {
      if (existingRating.value === value) {
        post.ratings = post.ratings.filter(rating => rating.user.toString() !== user._id.toString());
      } else {
        existingRating.value = value;
      }
    } else {
      post.ratings.push({ user: user._id, value });
    }
    await post.save();
    const totalRating = post.ratings.reduce((sum, rating) => sum + rating.value, 0);
    res.json({ message: 'Rating updated successfully', totalRating });
  } catch (error) {
    console.error("Error rating post:", error);
    res.status(500).json({ error: 'Failed to rate post' });
  }
};
