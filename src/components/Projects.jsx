import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/custom.css'

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const projectsPerPage = 3;

  const projects = [
    {
      title: "Blog Project",
      description: "Built a full-stack blog app with Django REST and React, featuring JWT auth, role-based access, and scalable CRUD APIs. Integrated paginated blog cards, dynamic routing, voice-to-text blog creation, and a user-specific comment system.",
      image: "/blog_app_image.png",
      technologies: ["React", "Python", "Django", "MySQL", "JWT","Tailwind css"],
      github: "https://github.com/yourusername/ecommerce",
      live: "https://your-ecommerce-demo.vercel.app",
    //   featured: true
    },
    {
      title: "Portfolio Website",
      description: "Developed a fully responsive portfolio website using React and Bootstrap, showcasing smooth scroll animations, modern UI design, and optimized performance across devices to highlight personal projects and skills.",
      image: "/portfolio.png",
      technologies: ["React", "Bootstrap", "AOS", "CSS3","Javascript","Framer Motion"],
      github: "https://github.com/asmitalok18/Portfolio",
      live: "https://portfolio-chi-one-53.vercel.app/",
      featured: false
    },
    {
      title: "Cricket Website",
      description: "Developed a multi-page web app using IPL 2022 data with features like match winner prediction, team creation (Create XI), match highlights, and a user-friendly toggle switch for theme control.",
      image: "/cricket_website.png",
      technologies: ["React", "Material-UI","Javascript","Local Storage","Framer Motion","API"],
      github: "https://github.com/asmitalok18/Cricket-website",
      live: "https://cricket-website-five.vercel.app/",
      featured: false
    },
    {
      title: "PlayTube",
      description: "Implemented secure authentication using JWT with access/refresh tokens and encrypted passwords. Integrated MongoDB via Mongoose for efficient data handling, and built custom middleware for auth, authorization, and secure file uploads.",
      image: "/playtube.png",
      technologies: [ "Node.js", "MongoDB","JWT","Mongoose","Express.js","Access & Refresh Tokens","Middleware","Multer"],
      github: "https://github.com/asmitalok18/playTube",
    //   live: "https://your-taskmanager.vercel.app",
    //   featured: true
    },
    {
      title: "EDUCATOR",
      description: "Built a learning platform to help students explore multiple technologies, featuring a custom landing page and responsive design using CSS media queries for enhanced user experience.",
      image: "/educator.png",
      technologies: ["javascript","HTML","CSS"],
      github: "https://github.com/asmitalok18/Educator",
      live: "https://educatorweb.vercel.app/",
      featured: false
    },
    {
      title: "Student Report Management System",
      description: "Built a C++ record management system with CRUD operations, linked list-based data storage, a percentage-based grading feature, and a user-friendly menu-driven interface for smooth navigation.",
      image: "/student_management.jpg",
      technologies: ["C++","Data Structure","OOPS"],
      github: "https://github.com/yourusername/chatapp",
      live: "https://your-chatapp.vercel.app",
      featured: false
    }
  ];

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Auto-play functionality with hover pause
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, totalPages]);

  // Get current projects to display
  const getCurrentProjects = () => {
    const startIndex = currentPage * projectsPerPage;
    return projects.slice(startIndex, startIndex + projectsPerPage);
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  // Handle card hover
  const handleCardMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
  };

  // Animation variants
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
      y: 100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.8,
      transition: {
        duration: 0.4
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      rotateY: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 255, 136, 0.4)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <section id="projects" className="section-padding">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <motion.h2 
              className="section-title text-light-custom"
              data-aos="fade-up"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              className="text-gray-custom fs-5 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Showcasing my latest work and technical expertise
            </motion.p>
          </Col>
        </Row>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Row>
              {getCurrentProjects().map((project, index) => (
                <Col lg={4} md={6} className="mb-4" key={`${currentPage}-${index}`}>
                  <motion.div 
                    variants={cardVariants}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <Card className="card-custom" style={{ height: '600px' }}>
                      <div className="position-relative overflow-hidden">
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="card-img-top project-image"
                          style={{ height: '200px', objectFit: 'cover' }}
                          variants={imageVariants}
                          whileHover="hover"
                        />
                        <motion.div 
                          className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Button variant="outline-light" size="lg">
                              View Project
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                      
                      <Card.Body className="d-flex flex-column" style={{ height: '400px' }}>
                        <motion.h5 
                          className="text-light-custom mb-3"
                          style={{ height: '50px', overflow: 'hidden' }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {project.title}
                        </motion.h5>
                        
                        <motion.p 
                          className="text-gray-custom mb-3"
                          style={{ 
                            height: '120px', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {project.description}
                        </motion.p>
                        
                        <motion.div 
                          className="mb-3 flex-grow-1"
                          style={{ 
                            minHeight: '120px',
                            maxHeight: '120px',
                            overflow: 'auto',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            gap: '0.25rem'
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {project.technologies.map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Badge 
                                bg="outline-primary" 
                                className="badge-custom"
                                style={{
                                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                  border: '1px solid var(--primary-color)',
                                  color: 'var(--primary-color)',
                                  fontSize: '0.7rem',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '15px',
                                  margin: '0.1rem',
                                  whiteSpace: 'nowrap',
                                  display: 'inline-block'
                                }}
                              >
                                {tech}
                              </Badge>
                            </motion.span>
                          ))}
                        </motion.div>
                        
                        <motion.div 
                          className="d-flex gap-2 mt-auto"
                          style={{ height: '50px' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button
                              href={project.github}
                              target="_blank"
                              className="btn-outline-custom flex-fill"
                            >
                              <FaGithub className="me-2" />
                              Code
                            </Button>
                          </motion.div>
                          
                          {project.live && (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                              <Button
                                href={project.live}
                                target="_blank"
                                className="btn-primary-custom flex-fill"
                              >
                                <FaExternalLinkAlt className="me-2" />
                                Live
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Row className="mt-5">
          <Col lg={12} className="text-center">
            <motion.div 
              className="d-flex justify-content-center align-items-center gap-3"
              data-aos="fade-up"
              data-aos-delay="300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                className="btn btn-outline-primary"
                onClick={handlePrevPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronLeft />
              </motion.button>

              {/* Page indicators */}
              <div className="d-flex gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <motion.button
                    key={index}
                    className={`btn ${currentPage === index ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handlePageChange(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="btn btn-outline-primary"
                onClick={handleNextPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronRight />
              </motion.button>
            </motion.div>

            {/* Auto-play indicator */}
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {/* <small className="text-gray-custom">
                {isHovered ? (
                  <span style={{ color: 'var(--primary-color)' }}>
                    ⏸️ Auto-play paused (hover detected)
                  </span>
                ) : (
                  <span>
                    ▶️ Auto-play active
                  </span>
                )}
              </small> */}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Projects;