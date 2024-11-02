import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Profile from './Profile';
import logo from './logo.png';
import './HeaderComponent.css';

const HeaderComponent = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <header className="app-header">
      <NavLink exact to="/">
        <img src={logo} alt="Logo" className="logo" />
      </NavLink>
      <nav className={`nav-links ${isNavOpen ? 'active' : ''}`}>

        <NavLink exact to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={closeNav}>Home</NavLink>
        <NavLink to="/guides" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={closeNav}>Guides</NavLink>
        <NavLink to="/community" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={closeNav}>Community</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={closeNav}>About</NavLink>
        
        {user ? (
          <div
            className="user-profile"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          ></div>
        ) : (
          <NavLink to="/login" className="nav-item" onClick={closeNav}>Join us</NavLink>
        )}
      </nav>
      <div className={`hamburger ${isNavOpen ? 'active' : ''}`} onClick={toggleNav}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
      <Profile user={user} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </header>
  );
};

export default HeaderComponent;
