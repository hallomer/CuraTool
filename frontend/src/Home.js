import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'; 
import FooterComponent from './FooterComponent';

const Home = () => {
    return (
        <>
        <div className="home-page">
            <div className="hero-section">
                <div className="overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Build Essential Medical Tools with What You Have</h1>
                    <div className="cta-buttons">
                        <Link to="/guides" className="btn btn-primary">Start Building</Link>
                        <Link to="/community" className="btn btn-secondary">Join the Community</Link>
                    </div>
                </div>
            </div>
            <div className="features-section">
                <h2 className="features-title">What You’ll Find on CuraTool</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>DIY Guides</h3>
                        <p>Step-by-step guides with safety tips for low-resource settings. Download each guide as a PDF for offline access.</p>
                    </div>
                    <div className="feature-card">
                        <h3>AI Assistant</h3>
                        <p>Have questions? CuraBot provides material recommendations, platform guidance, and support whenever you need it.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Community</h3>
                        <p>Join a network of innovators sharing solutions and ideas to create lasting impact.</p>
                    </div>
                </div>
            </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default Home;
