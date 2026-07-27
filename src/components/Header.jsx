import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/custom.css';
import '../styles/Header.css'

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Use Intersection Observer for robust active section tracking
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -70% 0px', // Triggers when the top of the section reaches the upper 30% of the screen
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['home', 'about', 'experience', 'skills', 'projects', 'certificates', 'contact'];
    
    // Function to try observing all sections
    const observeSections = () => {
      sections.forEach(section => {
        const el = document.getElementById(section);
        if (el) {
          observer.observe(el);
        }
      });
    };

    // Observe immediately and also set an interval to catch lazily loaded sections (like Certificates)
    observeSections();
    const intervalId = setInterval(observeSections, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  const linkVariants = {
    inactive: {
      scale: 1,
      color: "#b8afa8"
    },
    active: {
      scale: 1.05,
      color: "#ffffff",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      color: "#ffffff",
      transition: {
        duration: 0.2
      }
    }
  };

  const brandVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  const menuItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#certificates', label: 'Certificates' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`navbar-header ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}
    >
      <Container>
        <motion.div variants={brandVariants} whileHover="hover">
          <Navbar.Brand 
            href="#home" 
            className={`navbar-brand-custom ${scrolled ? 'scrolled' : ''}`}
          >
            &lt;Asmit Alok<span style={{ color: 'var(--accent-main)' }}>/&gt;</span>
          </Navbar.Brand>
        </motion.div>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="navbar-toggle-custom"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {menuItems.map((item, index) => {
              const sectionName = item.href.substring(1);
              const isActive = activeSection === sectionName;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    variants={linkVariants}
                    animate={isActive ? "active" : "inactive"}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Nav.Link 
                      href={item.href} 
                      className={`nav-link-header ${isActive ? 'active' : ''}`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          className="nav-active-indicator"
                          layoutId="activeIndicator"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                    </Nav.Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;