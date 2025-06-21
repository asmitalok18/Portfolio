// import React from 'react';
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import { FaLinkedin, FaGithub, FaWhatsapp, FaTelegram, FaDownload } from 'react-icons/fa';
// import '../styles/custom.css'

// const Hero = () => {
//   return (
//     <section id="home" className="min-vh-100 d-flex align-items-center position-relative">
//       <Container className="position-relative hero-content">
//         <Row className="align-items-center min-vh-100">
//           <Col lg={6} className="order-2 order-lg-1">
//             <div data-aos="fade-right">
//               <p className="text-primary-custom fs-5 mb-2">👋 Hello, I'm</p>
//               <h1 className="display-2 fw-bold mb-3 text-light-custom">
//                 Asmit Alok
//               </h1>
//               <h2 className="text-primary-custom fs-2 mb-4">
//                 Full Stack Developer
//               </h2>
//               <p className="fs-5 text-gray-custom mb-4 lead">
//                 Specializing in Angular, ReactJS, Python and Django | Crafting Scalable Web Apps with a User-Centric Approach
//               </p>
              
//               <div className="d-flex gap-3 mb-4">
//                 <Button 
//                   href="#contact" 
//                   className="btn-primary-custom"
//                   size="lg"
//                 >
//                   Let's Connect
//                 </Button>
//                 <Button 
//                   href="/resume.pdf" 
//                   className="btn-outline-custom"
//                   size="lg"
//                   download
//                 >
//                   <FaDownload className="me-2" />
//                   Resume
//                 </Button>
//               </div>

//               <div className="d-flex gap-3">
//                 <a 
//                   href="https://www.linkedin.com/in/asmitalok" 
//                   className="text-primary-custom fs-4"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FaLinkedin />
//                 </a>
//                 <a 
//                   href="https://github.com/asmitalok18" 
//                   className="text-primary-custom fs-4"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FaGithub />
//                 </a>
//                 <a 
//                   href="https://wa.link/60n6aa" 
//                   className="text-primary-custom fs-4"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FaWhatsapp />
//                 </a>
//                 <a 
//                   href="https://t.me/Vrm01234"
//                   className="text-primary-custom fs-4"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FaTelegram />
//                 </a>
//               </div>
//             </div>
//           </Col>
          
//           <Col lg={6} className="order-1 order-lg-2 text-center">
//             <div data-aos="fade-left">
//               <div className="position-relative d-inline-block">
//                 <img 
//                   src="/asmit_image1.png" 
//                   alt="Asmit Alok"
//                   className="img-fluid rounded-circle hero-image"
//                   style={{ maxWidth: '400px',width:'100%', height:'400px', objectFit:'cover' }}
//                 />
//                 <div 
//                   className="position-absolute bg-primary-custom rounded-circle d-flex align-items-center justify-content-center glow-effect"
//                   style={{
//                     width: '60px',
//                     height: '60px',
//                     bottom: '20px',
//                     right: '20px',
//                     animation: 'pulse 2s infinite'
//                   }}
//                 >
//                   {/* <span className="text-dark fw-bold">👨‍💻</span> */}
//                 </div>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default Hero;

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

  return (
    <section id="home" className="min-vh-100 d-flex align-items-center position-relative">
      <Container className="position-relative hero-content">
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
                >
                  👋 Hello, I'm
                </motion.p>
                <motion.h1 
                  className="display-2 fw-bold mb-3 text-light-custom"
                  variants={nameVariants}
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
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Full Stack Developer
                </motion.h2>
                <motion.p 
                  className="fs-5 text-gray-custom mb-4 lead"
                  variants={textAnimationVariants}
                >
                  Specializing in Angular, ReactJS, Python and Django | Crafting Scalable Web Apps with a User-Centric Approach
                </motion.p>
                
                <motion.div 
                  className="d-flex gap-3 mb-4"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      href="#contact" 
                      className="btn-primary-custom"
                      size="lg"
                    >
                      Let's Connect
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      href="/resume.pdf" 
                      className="btn-outline-custom"
                      size="lg"
                      download="Asmit_Alok_full_stack_resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
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
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
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
                    style={{ maxWidth: '400px',width:'100%', height:'400px', objectFit:'cover' }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <motion.div 
                    className="position-absolute bg-primary-custom rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      bottom: '20px',
                      right: '20px'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
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