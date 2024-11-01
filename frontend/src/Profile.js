import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from './firebaseConfig';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = ({ user, isModalOpen, setIsModalOpen }) => {
  const [username, setUsername] = useState(user?.displayName || '');
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || '');
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    setError('');
    const formData = new FormData();
    
    if (editingField === 'username' && newUsername) {
      formData.append('username', newUsername);
    } else if (editingField === 'photo' && newProfilePicture) {
      formData.append('profilePicture', newProfilePicture);
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}user/profile`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (response.data.username) setUsername(response.data.username);
      if (response.data.profilePicture) setProfilePicture(response.data.profilePicture);
      
      setNewUsername('');
      setNewProfilePicture(null);
      setEditing(false);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setIsModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      auth.signOut();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account');
    }
  };

  return isModalOpen ? (
    <div className="profile-modal">
      <div className="profile-content">
      <button className="close-modal" onClick={() => setIsModalOpen(false)}>✕</button> 
        {error && <div className="error-message">{error}</div>}
        <div className="profile-header">
          <div
            className="profile-pic"
            style={{ backgroundImage: `url(${profilePicture})` }}
          >
            <FaPen 
              className="edit-icon" 
              onClick={() => {
                setEditing(true);
                setEditingField('photo');
              }} 
            />
            {editing && editingField === 'photo' && (
              <div className="photo-edit-container">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) setNewProfilePicture(e.target.files[0]);
                  }}
                  accept="image/*"
                />
                <button className="save-btn" onClick={handleUpdateProfile}>Save Photo</button>
                <button className="cancel-btn" onClick={() => {
                  setEditing(false);
                  setEditingField(null);
                  setNewProfilePicture(null);
                }}>Cancel</button>
              </div>
            )}
          </div>
          <div className="username-container">
            <h2>Hi, {username}!</h2>
            <FaPen 
              className="edit-icon" 
              onClick={() => {
                setEditing(true);
                setEditingField('username');
                setNewUsername(username);
              }} 
            />
          </div>
          <p>Email: {user.email}</p>
        </div>

        {editing && editingField === 'username' && (
          <div className="profile-info">
            <label>New Username:</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleUpdateProfile}>Save Username</button>
              <button className="cancel-btn" onClick={() => {
                setEditing(false);
                setEditingField(null);
                setNewUsername('');
              }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button onClick={handleLogout}>Logout</button>
          <button className="delete-btn" onClick={handleDeleteAccount}>
            <FaTrashAlt /> Delete Account
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Profile;
