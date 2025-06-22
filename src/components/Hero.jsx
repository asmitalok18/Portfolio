import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaWhatsapp, FaTelegram, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/custom.css'

const Hero = () => {
  // Complex animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const textAnimationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const nameVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 50
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        type: "spring",
        stiffness: 300
      }
    },
    tap: {
      scale: 0.9
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Light reflection animation variants
  const lightReflectionVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const lightBeamVariants = {
    animate: {
      scaleX: [0, 1, 0.8, 1, 0],
      scaleY: [0, 0.5, 1, 0.5, 0],
      rotate: [0, 15, -15, 0],
      opacity: [0, 0.6, 0.3, 0.6, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1]
      }
    }
  };

  return (
    <section id="home" className="min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      {/* Top-left Light Reflection Effects */}
      <motion.div
        className="position-absolute"
        style={{
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, rgba(0, 255, 136, 0.1) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
        variants={lightReflectionVariants}
        animate="animate"
      />

      {/* Secondary light beam */}
      <motion.div
        className="position-absolute"
        style={{
          top: '0',
          left: '0',
          width: '600px',
          height: '400px',
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.1) 30%, transparent 60%)',
          borderRadius: '0 0 50% 0',
          filter: 'blur(15px)',
          zIndex: 1,
          pointerEvents: 'none',
          transformOrigin: 'top left'
        }}
        variants={lightBeamVariants}
        animate="animate"
      />

      {/* Animated light rays */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="position-absolute"
          style={{
            top: '5%',
            left: '5%',
            width: `${100 + index * 50}px`,
            height: '2px',
            background: `linear-gradient(90deg, rgba(0, 255, 136, ${0.3 - index * 0.05}) 0%, transparent 100%)`,
            transformOrigin: 'left',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{
            rotate: [0, 15 + index * 5, -10 + index * 3, 15 + index * 5, 0],
            scaleX: [0, 1, 0.8, 1, 0],
            opacity: [0, 0.6, 0.3, 0.6, 0]
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="position-absolute"
          style={{
            top: `${10 + index * 10}%`,
            left: `${5 + index * 8}%`,
            width: `${4 + index}px`,
            height: `${4 + index}px`,
            background: 'rgba(0, 255, 136, 0.6)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{
            x: [0, 50, -20, 30, 0],
            y: [0, -30, 20, -10, 0],
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0.5, 1, 0.7, 1, 0.5]
          }}
          transition={{
            duration: 6 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3
          }}
        />
      ))}

      <Container className="position-relative hero-content" style={{ zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="order-2 order-lg-1">
              <motion.div variants={itemVariants}>
                <motion.p 
                  className="text-primary-custom fs-5 mb-2"
                  variants={textAnimationVariants}
                  style={{
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.3)'
                  }}
                >
                  👋 Hello, I'm
                </motion.p>
                <motion.h1 
                  className="display-2 fw-bold mb-3 text-light-custom"
                  variants={nameVariants}
                  style={{
                    textShadow: '0 0 20px rgba(0, 255, 136, 0.2), 0 0 40px rgba(0, 255, 136, 0.1)'
                  }}
                >
                  Asmit Alok
                </motion.h1>
                <motion.h2 
                  className="text-primary-custom fs-2 mb-4"
                  variants={textAnimationVariants}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    background: "linear-gradient(45deg, #00ff88, #00cc6a, #00ff88)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: '0 0 30px rgba(0, 255, 136, 0.4)'
                  }}
                >
                  Full Stack Developer
                </motion.h2>
                <motion.p 
                  className="fs-5 text-gray-custom mb-4 lead"
                  variants={textAnimationVariants}
                  style={{
                    textShadow: '0 0 5px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Specializing in Angular, ReactJS, Python and Django | Crafting Scalable Web Apps with a User-Centric Approach
                </motion.p>
                
                <motion.div 
                  className="d-flex gap-3 mb-4"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: "0 10px 30px rgba(0, 255, 136, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      href="#contact" 
                      className="btn-primary-custom"
                      size="lg"
                      style={{
                        boxShadow: '0 5px 15px rgba(0, 255, 136, 0.2)'
                      }}
                    >
                      Let's Connect
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      href="/resume.pdf" 
                      className="btn-outline-custom"
                      size="lg"
                      download="Asmit_Alok_full_stack_resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        boxShadow: '0 5px 15px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <FaDownload className="me-2" />
                      Resume
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="d-flex gap-3"
                  variants={itemVariants}
                >
                  {[
                    { href: "https://www.linkedin.com/in/asmitalok", icon: FaLinkedin },
                    { href: "https://github.com/asmitalok18", icon: FaGithub },
                    { href: "https://wa.link/60n6aa", icon: FaWhatsapp },
                    { href: "https://t.me/Vrm01234", icon: FaTelegram }
                  ].map(({ href, icon: Icon }, index) => (
                    <motion.a
                      key={index}
                      href={href}
                      className="text-primary-custom fs-4"
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover={{
                        ...socialIconVariants.hover,
                        textShadow: "0 0 15px rgba(0, 255, 136, 0.6)"
                      }}
                      whileTap="tap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      style={{
                        textShadow: '0 0 10px rgba(0, 255, 136, 0.3)'
                      }}
                    >
                      <Icon />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </Col>
            
            <Col lg={6} className="order-1 order-lg-2 text-center">
              <motion.div variants={itemVariants}>
                <motion.div 
                  className="position-relative d-inline-block"
                  variants={imageVariants}
                  animate={floatingAnimation}
                >
                  <motion.img 
                    src="/asmit_image1.png" 
                    alt="Asmit Alok"
                    className="img-fluid rounded-circle hero-image"
                    style={{ 
                      maxWidth: '400px',
                      width:'100%', 
                      height:'400px', 
                      objectFit:'cover',
                      boxShadow: '0 0 50px rgba(0, 255, 136, 0.2), 0 0 100px rgba(0, 255, 136, 0.1)'
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      boxShadow: '0 0 60px rgba(0, 255, 136, 0.4), 0 0 120px rgba(0, 255, 136, 0.2)',
                      transition: { duration: 0.3 }
                    }}
                  />
                  <motion.div 
                    className="position-absolute bg-primary-custom rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      bottom: '20px',
                      right: '20px',
                      boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                      boxShadow: [
                        '0 0 20px rgba(0, 255, 136, 0.5)',
                        '0 0 40px rgba(0, 255, 136, 0.8)',
                        '0 0 20px rgba(0, 255, 136, 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Additional light reflection on image */}
                  <motion.div
                    className="position-absolute"
                    style={{
                      top: '-10px',
                      left: '-10px',
                      right: '-10px',
                      bottom: '-10px',
                      background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 136, 0.3), transparent)',
                      borderRadius: '50%',
                      filter: 'blur(10px)',
                      zIndex: -1
                    }}
                    animate={{
                      rotate: [0, 360],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;