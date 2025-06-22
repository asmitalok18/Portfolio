import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCode, FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/About.css'
import '../styles/custom.css'
const About = () => {
  const features = [
    {
      icon: <FaCode />,
      title: "Clean Code",
      description: "Writing maintainable and scalable code following best practices"
    },
    {
      icon: <FaLightbulb />,
      title: "Problem Solving",
      description: "Analytical thinking to solve complex technical challenges"
    },
    {
      icon: <FaUsers />,
      title: "Team Player",
      description: "Collaborative approach with excellent communication skills"
    },
    {
      icon: <FaRocket />,
      title: "Fast Learner",
      description: "Quick to adapt and learn new technologies and frameworks"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateY: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textRevealVariants = {
    hidden: { 
      opacity: 0,
      x: -100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const iconHoverVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      color: "#00ff88",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <section id="about" className="section-padding bg-dark-custom">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <motion.h2 
                className="section-title text-light-custom"
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                About Me
              </motion.h2>
            </Col>
          </Row>
          
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div
                variants={textRevealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="text-primary-custom mb-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Passionate Full Stack Developer
                </motion.h3>
                <motion.p 
                  className="text-light-custom mb-4 lead"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  I'm a passionate technology enthusiast dedicated to staying at the 
                  forefront of emerging industry trends and advancements. My commitment 
                  to continuous learning drives me to actively seek opportunities where 
                  I can contribute meaningfully to the ever-evolving world of technology.
                </motion.p>
                <motion.p 
                  className="text-light-custom mb-4"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  I specialize in React.js and Angular for frontend development and Python for backend 
                  services, with experience in database design and . 
                  I'm committed to writing clean, efficient code and staying updated 
                  with the latest industry trends.
                </motion.p>
                <motion.p 
                  className="text-light-custom"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Recognized for my disciplined work ethic and strong time management 
                  abilities, I consistently deliver successful and timely outcomes by 
                  effectively balancing multiple tasks and ensuring each project receives 
                  the attention it deserves.
                </motion.p>
              </motion.div>
            </Col>
            
            <Col lg={6}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Row>
                  {features.map((feature, index) => (
                    <Col md={6} className="mb-4" key={index}>
                      <motion.div
                        variants={cardVariants}
                        whileHover={{
                          scale: 1.05,
                          rotateY: 10,
                          z: 50
                        }}
                        style={{ perspective: 1000 }}
                        className="feature-card-wrapper"
                      >
                        <Card className="card-custom feature-card text-center">
                          <Card.Body className="d-flex flex-column">
                            <motion.div 
                              className="text-primary-custom fs-1 mb-3 feature-icon"
                              variants={iconHoverVariants}
                              whileHover="hover"
                            >
                              {feature.icon}
                            </motion.div>
                            <motion.h5 
                              className="text-light-custom mb-3 feature-title"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                            >
                              {feature.title}
                            </motion.h5>
                            <motion.p 
                              className="text-gray feature-description"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              {feature.description}
                            </motion.p>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;