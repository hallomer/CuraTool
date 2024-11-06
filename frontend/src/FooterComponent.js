import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import './FooterComponent.css';

const FooterComponent = () => {
  return (
    <div className="footer-component">
      <footer>
      <div className="footer-social">
          <a href="https://github.com/hallomer/CuraTool" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="mailto:hebaaltayeb2@icloud.com" aria-label="Email">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://x.com/Hibathepro" aria-label="Twitter / X">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.linkedin.com/in/hibaeltayeb/" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <div>
          © 2024 CuraTool 🇸🇩
        </div>
        <span>Hiba's Portfolio Project for Holberton School.</span>
      </footer>
    </div>
  );
};

export default FooterComponent;
