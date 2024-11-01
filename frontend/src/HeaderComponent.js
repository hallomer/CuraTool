import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Profile from './Profile';
import logo from './logo.png';
import './HeaderComponent.css';

const HeaderComponent = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <header className="app-header">
      <NavLink exact to="/">
        <img src={logo} alt="Logo" className="logo" />
      </NavLink>
      <nav className="nav-links">
        <NavLink exact to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Home</NavLink>
        <NavLink to="/guides" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Guides</NavLink>
        <NavLink to="/community" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Community</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>About</NavLink>
        
        {user ? (
          <div
          className="user-profile"
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundImage: `url(${user.photoURL})`,
          }}
        ></div>
        
        ) : (
          <NavLink to="/login" className="nav-item">Login / Signup</NavLink>
        )}
      </nav>
      <Profile user={user} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </header>
  );
};

export default HeaderComponent;
