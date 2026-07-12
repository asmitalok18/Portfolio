import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaTelegram, FaCode, FaServer, FaCogs } from 'react-icons/fa';
import '../styles/custom.css';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/portfolio-data/`)
      .then(res => res.json())
      .then(data => {
        if (data.hero) setHeroData(data.hero);
      })
      .catch(err => console.error("Failed to fetch hero data:", err));
  }, []);

  const getHeroImage = () => {
    const apiImg = heroData?.profile_image;
    if (apiImg && apiImg.startsWith('http')) return apiImg;
    if (apiImg && apiImg !== '/image.jpg' && apiImg !== '') {
      return apiImg.startsWith('/') ? `${BASE_URL}${apiImg}` : apiImg;
    }
    return '/portfolio_image.png';
  };
  const imageUrl = getHeroImage();

  return (
    <section id="home" className="hero-premium">
      <div className="hero-container">
        <div className="hero-left">
          <h1>
            Consistency and Engineering<span>.</span>
          </h1>

          <p>
            Full Stack Developer specializing in Angular, ReactJS, Python and Django. I build scalable, reliable web applications with a user-centric approach.
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
            <div className="hero-feature-icon"><FaServer /></div>
            <h4>Backend Scaling</h4>
            <p>Query optimization, Redis caching, robust APIs.</p>
          </div>

          <div className="hero-feature-card card-user">
            <div className="hero-feature-icon"><FaCode /></div>
            <h4>UI Optimization</h4>
            <p>State management, lazy loading, seamless CSR.</p>
          </div>

          <div className="hero-feature-card card-rocket">
            <div className="hero-feature-icon"><FaCogs /></div>
            <h4>DevOps & CI/CD</h4>
            <p>Dockerized apps, AWS hosting, automated pipelines.</p>
          </div>

          <div className="hero-portrait-wrap">
            <img src={imageUrl} alt="Asmit Alok" />
          </div>
        </div>
      </div>

      {/* Premium Skills Ticker */}
      <div className="premium-ticker-wrapper">
        <div className="premium-ticker-track">
          <div className="premium-ticker-content">
            <span>PYTHON</span><div className="ticker-dot"></div>
            <span>DJANGO</span><div className="ticker-dot"></div>
            <span>REACT</span><div className="ticker-dot"></div>
            <span>ANGULAR</span><div className="ticker-dot"></div>
            <span>DRF</span><div className="ticker-dot"></div>
            <span>POSTGRESQL</span><div className="ticker-dot"></div>
            <span>AWS</span><div className="ticker-dot"></div>
            <span>DOCKER</span><div className="ticker-dot"></div>
            <span>REDIS</span><div className="ticker-dot"></div>
            <span>GIT</span><div className="ticker-dot"></div>
            <span>LINUX</span><div className="ticker-dot"></div>
          </div>
          {/* Duplicate for seamless infinite scrolling */}
          <div className="premium-ticker-content" aria-hidden="true">
            <span>PYTHON</span><div className="ticker-dot"></div>
            <span>DJANGO</span><div className="ticker-dot"></div>
            <span>REACT</span><div className="ticker-dot"></div>
            <span>ANGULAR</span><div className="ticker-dot"></div>
            <span>DRF</span><div className="ticker-dot"></div>
            <span>POSTGRESQL</span><div className="ticker-dot"></div>
            <span>AWS</span><div className="ticker-dot"></div>
            <span>DOCKER</span><div className="ticker-dot"></div>
            <span>REDIS</span><div className="ticker-dot"></div>
            <span>GIT</span><div className="ticker-dot"></div>
            <span>LINUX</span><div className="ticker-dot"></div>
          </div>
        </div>
      </div>
      <div className="hero-bottom-cover"></div>
    </section>
  );
};

export default Hero;