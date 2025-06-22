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
      const currentScrollY = window.scrollY;
      
      // Change navbar background when scrolled
      const isScrolled = currentScrollY > 50;
      setScrolled(isScrolled);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkVariants = {
    inactive: {
      scale: 1,
      color: "#ffffff"
    },
    active: {
      scale: 1.1,
      color: "#00ff88",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      color: "#00ff88",
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
            &lt;Asmit Alok/&gt;
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