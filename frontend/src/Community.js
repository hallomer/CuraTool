import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from './firebaseConfig';
import { FaTrash, FaComments, FaImage } from 'react-icons/fa';
import './Community.css';
const Community = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostImage, setNewPostImage] = useState(null);
    const [newCommentData, setNewCommentData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [activeRatings, setActiveRatings] = useState(() => {
        return JSON.parse(localStorage.getItem('activeRatings')) || {};
    });

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const handleImageClick = (src) => {
      setImageSrc(src);
      setShowImageModal(true);
    };

    const closeImageModal = () => {
      setShowImageModal(false);
      setImageSrc("");
    };


    useEffect(() => {
        const fetchUser = async () => {
            auth.onAuthStateChanged((currentUser) => {
                setUser(currentUser);
            });
        };
        fetchUser();
        fetchPosts();
    }, []);
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}community`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    const handleAddPost = async () => {
        if (!newPostContent.trim()) {
            console.error("Post content cannot be empty");
            return;
        }
        const formData = new FormData();
        formData.append('text', newPostContent);
        if (newPostImage) formData.append('image', newPostImage);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}community`, formData, {
                headers: { Authorization: `Bearer ${await user.getIdToken()}` },
                transformRequest: [(data) => data],
            });
            setNewPostContent("");
            setNewPostImage(null);
            setShowModal(false);
            fetchPosts();
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };
    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}community/${postId}`, {
                headers: { Authorization: `Bearer ${await user.getIdToken()}` },
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };
    const handleAddComment = async (postId) => {
        const { text, image } = newCommentData[postId] || {};
        if (!text?.trim()) return;
        const formData = new FormData();
        formData.append('text', text);
        if (image) formData.append('image', image);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}community/${postId}/comments`, formData, {
                headers: { Authorization: `Bearer ${await user.getIdToken()}` },
            });
            setNewCommentData((prev) => ({ ...prev, [postId]: { text: '', image: null } }));
            fetchPosts();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    const handleCommentInputChange = (postId, field, value) => {
        setNewCommentData((prev) => ({
            ...prev,
            [postId]: { ...prev[postId], [field]: value },
        }));
    };
    const handleDeleteComment = async (postId, commentId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}community/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${await user.getIdToken(true)}` },
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    const handleRatePost = async (postId, value) => {
      const currentRating = activeRatings[postId] || 0;
      let newActiveRatings = { ...activeRatings };
      let updatedPosts = [...posts];
  
      if (currentRating === value) {
          newActiveRatings[postId] = 0;
          localStorage.setItem('activeRatings', JSON.stringify(newActiveRatings));
  
          updatedPosts = updatedPosts.map(post => {
              if (post._id === postId) {
                  post.ratings = post.ratings.filter(rate => rate.value !== value);
              }
              return post;
          });
  
          try {
              await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}community/${postId}/rate`, {
                  headers: { Authorization: `Bearer ${await user.getIdToken()}` },
              });
          } catch (error) {
              console.error("Error removing rating:", error);
          }
      } else {
          newActiveRatings[postId] = value;
          localStorage.setItem('activeRatings', JSON.stringify(newActiveRatings));
  
          updatedPosts = updatedPosts.map(post => {
              if (post._id === postId) {
                  post.ratings = post.ratings.filter(rate => rate.value !== -value);
                  post.ratings.push({ value });
              }
              return post;
          });
  
          try {
              await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}community/${postId}/rate`, { value }, {
                  headers: { Authorization: `Bearer ${await user.getIdToken()}` },
              });
          } catch (error) {
              console.error("Error rating post:", error);
          }
      }
  
      setActiveRatings(newActiveRatings);
      setPosts(updatedPosts);
  };
  
  
    const toggleComments = (postId) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const formatDate = (date) => {
      const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
      };
      return new Date(date).toLocaleDateString(undefined, options);
  };

    return (
        <div className="community-container">
            <div className="header-row">
                <h1>Community</h1>
                <button
                    className="add-post-button"
                    onClick={() => {
                        if (user) {
                            setShowModal(true);
                        } else {
                            window.location.href = "/login";
                        }
                    }}
                >
                    + Add a Post
                </button>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                      <span className="post-close-modal" onClick={() => setShowModal(false)}>&times;</span>
                      <textarea 
                          placeholder="Write a post..." 
                          value={newPostContent} 
                          onChange={(e) => setNewPostContent(e.target.value)}
                          onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="post-textarea"
                      />
                      <div className="modal-footer">
                          <label htmlFor="post-file-upload" className="file-upload-label">
                              <FaImage />
                          </label>
                          <input
                              type="file"
                              id="post-file-upload"
                              style={{ display: 'none' }} 
                              onChange={(e) => setNewPostImage(e.target.files[0])}
                          />
                          <button className="post-button" onClick={handleAddPost}>Post</button>
                      </div>
                    </div>
                </div>
            )}
            <div className="posts">
                {posts.map((post) => {
                    const currentRating = activeRatings[post._id];
                    const displayedRating = post.ratings.reduce((sum, rate) => sum + rate.value, 0);
                    return (
                        <div key={post._id} className="post">
                            <div className="post-header">
                                <img src={post.user.profilePicture} alt={post.user.username} />
                                <span className="username">{post.user.username}</span>
                                <span className="post-date">{formatDate(post.createdAt)}</span>
                                {user && user.uid === post.user.uid && (
                                        <FaTrash className="delete-icon" onClick={() => handleDeletePost(post._id)} />
                                )}
                            </div>
                            <p>{post.text}</p>
                            {post.image && (
                              <img
                                src={`${process.env.REACT_APP_UPLOADS_BASE_URL}uploads/${post.image}`}
                                alt="Post"
                                className="post-image"
                                onClick={() => handleImageClick(`${process.env.REACT_APP_UPLOADS_BASE_URL}uploads/${post.image}`)}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            <div className="post-actions">
                                <div className="rating-buttons">
                                    <button
                                        className="rating-button"
                                        style={{ color: currentRating === 1 ? '#FFA07A' : '#666' }}
                                        onClick={() => handleRatePost(post._id, 1)}
                                    >
                                        ▲
                                    </button>
                                    <span className="rating-count">{displayedRating}</span>
                                    <button
                                        className="rating-button"
                                        style={{ color: currentRating === -1 ? '#FFA07A' : '#666' }}
                                        onClick={() => handleRatePost(post._id, -1)}
                                    >
                                        ▼
                                    </button>
                                </div>
                                <button className="comments-button" onClick={() => toggleComments(post._id)}>
                                    <FaComments /> Comments
                                </button>
                            </div>
                            {expandedPosts[post._id] && (
                                <div className="comments">
                                    {post.comments.map((comment) => (
                                        <div key={comment._id} className="comment">
                                            <div className="comment-header">
                                                <img src={comment.user.profilePicture} alt={comment.user.username} />
                                                <span className="username">{comment.user.username}</span>
                                                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                                {user && comment.user && user.uid === comment.user.uid && (
                                                    <FaTrash className="delete-icon" onClick={() => handleDeleteComment(post._id, comment._id)} />
                                                )}
                                            </div>
                                            <div className="comment-body">
                                            <p>{comment.text}</p>
                                            {comment.image && (
                                              <img
                                                className="comment-image"
                                                src={`${process.env.REACT_APP_UPLOADS_BASE_URL}uploads/${comment.image}`}
                                                alt="Comment"
                                                onClick={() => handleImageClick(`${process.env.REACT_APP_UPLOADS_BASE_URL}uploads/${comment.image}`)}
                                                style={{ cursor: "pointer" }}
                                              />
                                            )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-comment">
                                        <textarea
                                            placeholder="Write a comment..."
                                            value={newCommentData[post._id]?.text || ""}
                                            onChange={(e) => handleCommentInputChange(post._id, 'text', e.target.value)}
                                            onInput={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = `${e.target.scrollHeight}px`;
                                            }}
                                            className="comment-textarea"
                                            onClick={() => {
                                                if (!user) window.location.href = "/login";
                                            }}
                                            readOnly={!user}
                                        />
                                        <label
                                            htmlFor={`file-upload-${post._id}`}
                                            className="file-upload-label"
                                            onClick={() => {
                                                if (!user) window.location.href = "/login";
                                            }}
                                        >
                                            <FaImage />
                                        </label>
                                        <input
                                            type="file"
                                            id={`file-upload-${post._id}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleCommentInputChange(post._id, 'image', e.target.files[0])}
                                            disabled={!user}
                                        />
                                        <button
                                            onClick={() => {
                                                if (user) handleAddComment(post._id);
                                                else window.location.href = "/login";
                                            }}
                                        >
                                            Add Comment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {showImageModal && (
            <div className="image-modal" onClick={closeImageModal}>
                <span className="image-modal-close" onClick={closeImageModal}>&times;</span>
                <img src={imageSrc} alt="Full View" />
            </div>
        )}
        </div>
    );
};
export default Community;