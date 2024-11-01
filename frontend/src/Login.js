import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebaseConfig';
import { fetchSignInMethodsForEmail, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import './Login.css';
import { FaGoogle, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const resetErrorOnChange = () => setError('');

  const registerUserInBackend = async (user) => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${BACKEND_BASE_URL}user/register`,
        {
          uid: user.uid,
          email: user.email,
          username: user.displayName || username || email.split('@')[0],
          profilePicture: user.photoURL || '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('User registered in backend');
    } catch (err) {
      console.error('Backend registration failed:', err);
      setError('Failed to register user. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await registerUserInBackend(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in with Google.');
    }
  };


  const handleEmailCheck = async () => {
    try {
      const response = await axios.post(`${BACKEND_BASE_URL}user/check-email`, { email });
      setIsRegistered(response.data.exists);
    } catch (error) {
      console.error('Error checking email:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to sign in. Please check your password.');
    }
  };

  const handleEmailSignup = async () => {
    try {
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      await registerUserInBackend(auth.currentUser);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="My Logo" className="logo" />
        
        <button className="google-button" onClick={handleGoogleLogin}>
          <FaGoogle className="icon" /> Continue with Google
        </button>

        <div className="or-divider">OR</div>

        <div className="email-login">
          {isRegistered === null ? (
            <>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetErrorOnChange();
                }}
              />
              <button className="email-button" onClick={handleEmailCheck}>
                <FaEnvelope className="icon" /> Continue with Email
              </button>
            </>
          ) : isRegistered ? (
            <>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    resetErrorOnChange();
                  }}
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button className="button" onClick={handleEmailLogin}>Log In</button>
            </>
          ) : (
            <>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    resetErrorOnChange();
                  }}
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <input
                type="text"
                className="input"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  resetErrorOnChange();
                }}
              />
              <button className="button" onClick={handleEmailSignup}>Sign Up</button>
            </>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
