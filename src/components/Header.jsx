// import React, {useState,useEffect} from 'react';
// import {Navbar,Nav,Container} from 'react-bootstrap'
// import '../styles/custom.css'


// const Header = () => {
//     const [scrolled,setScrolled]  = useState(false)

//     useEffect(()=>{
//         const handleScroll = () =>{
//             const isScrolled = window.scrollY > 50;
//             setScrolled(isScrolled)
//         }
//         window.addEventListener('scroll',handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll)
//     },[]);
//     return (
//     <Navbar 
//       expand="lg" 
//       fixed="top" 
//       className={`py-3 transition-all ${scrolled ? 'bg-dark-custom shadow-lg' : ''}`}
//       style={{
//         transition: 'all 0.3s ease',
//         backdropFilter: scrolled ? 'blur(10px)' : 'none'
//       }}
//     >
//       <Container>
//         <Navbar.Brand href="#home" className="text-light fw-bold fs-3">
//           &lt;Asmit Alok/&gt;
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             <Nav.Link href="#home" className="text-light mx-2">Home</Nav.Link>
//             <Nav.Link href="#about" className="text-light mx-2">About</Nav.Link>
//             <Nav.Link href="#experience" className="text-light mx-2">Experience</Nav.Link>
//             <Nav.Link href="#skills" className="text-light mx-2">Skills</Nav.Link>
//             <Nav.Link href="#projects" className="text-light mx-2">Projects</Nav.Link>
//             <Nav.Link href="#contact" className="text-light mx-2">Contact</Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default Header;


import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/custom.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

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
    <motion.div
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <Navbar 
        expand="lg" 
        fixed="top" 
        className={`py-3 transition-all ${scrolled ? 'bg-dark-custom shadow-lg' : ''}`}
        style={{
          transition: 'all 0.3s ease',
          backdropFilter: scrolled ? 'blur(10px)' : 'none'
        }}
      >
        <Container>
          <motion.div variants={brandVariants} whileHover="hover">
            <Navbar.Brand href="#home" className="text-light fw-bold fs-3">
              &lt;Asmit Alok/&gt;
            </Navbar.Brand>
          </motion.div>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <AnimatePresence>
                {menuItems.map((item, index) => {
                  const sectionName = item.href.substring(1);
                  const isActive = activeSection === sectionName;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
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
                          className={`mx-2 position-relative ${isActive ? 'text-primary-custom' : 'text-light'}`}
                          style={{ fontWeight: isActive ? '600' : '500' }}
                        >
                          {item.label}
                          {isActive && (
                            <motion.div
                              className="position-absolute"
                              style={{
                                bottom: '-5px',
                                left: '50%',
                                width: '20px',
                                height: '2px',
                                backgroundColor: '#00ff88',
                                borderRadius: '1px'
                              }}
                              layoutId="activeIndicator"
                              initial={{ scale: 0, x: '-50%' }}
                              animate={{ scale: 1, x: '-50%' }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </Nav.Link>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default Header;