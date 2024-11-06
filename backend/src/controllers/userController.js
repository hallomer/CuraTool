const admin = require('../config/firebaseConfig');
const User = require('../models/User');
const CommunityPost = require('../models/Community');
const mongoose = require('mongoose');

// Check if email exists
exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: 'Error checking email' });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { uid, email, username, profilePicture } = req.body;

  try {
    const defaultProfilePicture = profilePicture || `${req.protocol}://${req.get('host')}/symbols/default.png`;

    await admin.auth().updateUser(uid, {
      displayName: username,
      photoURL: defaultProfilePicture,
    });

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, username, profilePicture: defaultProfilePicture });
      await user.save();
    }

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Retrieve user profile
exports.getUserProfile = async (req, res) => {
  try {
    const firebaseUser = await admin.auth().getUser(req.user.uid);
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userProfile = {
      uid: user.uid,
      email: user.email,
      username: user.username,
      profilePicture: firebaseUser.photoURL || user.profilePicture,
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { username } = req.body;
  const profilePicture = req.file ? req.file.path : '';

  if (!profilePicture && !username) {
    return res.status(400).json({ error: 'No data to update' });
  }

  try {
    const updates = {};
    const updateFields = {};

    if (username) {
      updates.displayName = username;
      updateFields.username = username;
    }
    
    if (profilePicture) {
      updates.photoURL = req.file.path;
      updateFields.profilePicture = req.file.path;
    }

    if (Object.keys(updates).length > 0) {
      await admin.auth().updateUser(req.user.uid, updates);
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid: req.user.uid },
      updateFields,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Update failed', details: error.message });
  }
};



// Delete user and all their contributions
exports.deleteUser = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = user._id; 


    await CommunityPost.deleteMany({ user: userId });
    console.log(`Deleted all community posts by user with ID: ${userId}`);

    await CommunityPost.updateMany(
      {},
      { $pull: { comments: { user: userId } } }
    );
    console.log(`Deleted all comments by user with ID: ${userId}`);

    await CommunityPost.updateMany(
      {},
      { $pull: { ratings: { user: userId } } }
    );
    console.log(`Deleted all ratings by user with ID: ${userId}`);

    await User.findOneAndDelete({ uid });
    console.log(`Successfully deleted user from MongoDB with UID: ${uid}`);

    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user from Firebase with UID: ${uid}`);

    res.status(200).json({ message: 'User and all their contributions deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Failed to delete user and their contributions' });
  }
};
