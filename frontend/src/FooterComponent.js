import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import './FooterComponent.css';

const FooterComponent = () => {
  return (
    <div className="footer-component">
      <footer>
        <span>Hiba's Portfolio Project for Holberton School.</span>
        <div>
          © 2024 CuraTool 🇸🇩
        </div>
        <div className="footer-social">
          <a href="https://github.com/hallomer/sandoog/" aria-label="GitHub">
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
          <a href="https://discordapp.com/users/hallomer" aria-label="Discord">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FooterComponent;
