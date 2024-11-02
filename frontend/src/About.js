// About.js
import React from 'react';
import './About.css';
import FooterComponent from './FooterComponent';

const About = () => {
  return (
    <>
    <div className="about-container">
      <h1>About CuraTool</h1>
      <p className="intro">
        Welcome to <strong>CuraTool</strong>! We empower healthcare providers and aid organizations to create essential medical equipment using locally available materials. Whether you're in a remote area, a conflict zone, or responding to an emergency, CuraTool offers easy-to-follow guides, an intelligent AI assistant, and a supportive community focused on making a difference with the resources at hand.
      </p>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          At CuraTool, we believe in accessible healthcare for everyone, everywhere. Our mission is to bridge resource gaps with practical, DIY solutions that utilize local materials whenever possible. As a doctor from Sudan, I’ve seen firsthand how these guides can make a tangible difference in resource-limited settings. These guides are crafted for when there’s almost nothing available—simple solutions born from necessity. While professional tools are ideal, these improvisational tools empower healthcare workers to provide care even when resources are scarce.
        </p>
      </section>

      <section className="why-curatool">
        <h2>Why Choose CuraTool?</h2>
        <p>
          Created by a software engineer and a doctor, CuraTool combines practical medical insights with innovative technology to help anyone, anywhere, craft impactful solutions. Our AI assistant, <strong>CuraBot</strong>, assists with everything from material substitutions to healthcare guidance, enabling frontline workers to make a difference, especially in low-resource settings.
        </p>
      </section>

      <p className="thank-you">
        Thank you for visiting CuraTool. Together, we can make healthcare accessible for all.
      </p>
    </div>
    <FooterComponent />
    </>
  );
};

export default About;
