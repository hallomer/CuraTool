import React, { useEffect, useState } from 'react';
import './Home.css';
import FooterComponent from './FooterComponent';

const Home = () => {
    const [title, setTitle] = useState('');
    const [showSubtitleAndButtons, setShowSubtitleAndButtons] = useState(false);
    const fullTitle = "Build Essential Medical Tools with What You Have";
    
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < fullTitle.length) {
                setTitle((prev) => prev + fullTitle.charAt(index));
                index++;
            } else {
                clearInterval(typingInterval);
                setShowSubtitleAndButtons(true); 
            }
        }, 60);
        return () => clearInterval(typingInterval);
    }, [fullTitle]);

    return (
        <>
            <section className="hero-section">
                <div className="overlay"></div>

                <div className="hero-content">
                    <h1 className="hero-title">{title}</h1>
                    {showSubtitleAndButtons && ( 
                        <>
                            <p className="hero-subtitle">Empower yourself with step-by-step guides and community support</p>
                            <div className="cta-buttons">
                                <button className="btn btn-primary">Get Started</button>
                                <button className="btn btn-secondary">View Community</button>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <FooterComponent />
        </>
    );
};

export default Home;
