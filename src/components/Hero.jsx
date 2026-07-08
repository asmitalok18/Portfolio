import React from 'react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaTelegram, FaCode, FaRegUser, FaRocket } from 'react-icons/fa';
import '../styles/custom.css';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Hero = () => {
  return (
    <section id="home" className="hero-premium">
      <div className="hero-container">
        <div className="hero-left">
          <h1>
            Consistency<br />
            and Engineering<span>.</span>
          </h1>

          <p>
            Full Stack Developer specializing in Angular, ReactJS,<br />
            Python and Django. I build scalable, reliable<br />
            web applications with a user-centric approach.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Let's Connect
              <span>↗</span>
            </a>

            <a href={`${BASE_URL}/api/resume/download/`} className="btn btn-outline" download="Asmit_Alok_full_stack_resume.pdf" target="_blank" rel="noopener noreferrer">
              View Resume
              <span>↗</span>
            </a>
          </div>

          <div className="hero-socials">
            <a href="https://www.linkedin.com/in/asmitalok" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://github.com/asmitalok18" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href="https://wa.link/60n6aa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="https://t.me/Vrm01234" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><FaTelegram /></a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-arc-lines"></div>
          <div className="hero-light-streaks"></div>
          
          <div className="hero-feature-card card-code">
            <div className="hero-feature-icon"><FaCode /></div>
            <h4>Clean Code</h4>
            <p>Maintainable.<br />Scalable.<br />Future-ready.</p>
          </div>

          <div className="hero-feature-card card-user">
            <div className="hero-feature-icon"><FaRegUser /></div>
            <h4>User First</h4>
            <p>Intent-driven<br />design with<br />seamless<br />experiences.</p>
          </div>

          <div className="hero-feature-card card-rocket">
            <div className="hero-feature-icon"><FaRocket /></div>
            <h4>Ship Faster</h4>
            <p>Agile mindset,<br />rapid iteration,<br />real impact.</p>
          </div>

          <div className="hero-portrait-wrap">
            <img src="/portfolio_image.png" alt="Asmit Alok" />
          </div>
        </div>
      </div>
      <div className="hero-bottom-cover"></div>
    </section>
  );
};

export default Hero;