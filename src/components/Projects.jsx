import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/custom.css'

// Base URL for backend API and media. Prefer REACT_APP_BASE_URL, then BASE_URL, then localhost default.
const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const projectsPerPage = 3;

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/projects/`);
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to static data if API fails
        setProjects([
          {
            name: "Blog Project",
            description: "Built a full-stack blog app with Django REST and React, featuring JWT auth, role-based access, and scalable CRUD APIs. Integrated paginated blog cards, dynamic routing, voice-to-text blog creation, and a user-specific comment system.",
            image_url: "/blog_app_image.png",
            technologies: "React, Python, Django, MySQL, JWT, Tailwind css",
            github_url: "https://github.com/yourusername/ecommerce",
            live_url: "https://your-ecommerce-demo.vercel.app",
          },
          {
            name: "Portfolio Website",
            description: "Developed a fully responsive portfolio website using React and Bootstrap, showcasing smooth scroll animations, modern UI design, and optimized performance across devices to highlight personal projects and skills.",
            image_url: "/portfolio.png",
            technologies: "React, Bootstrap, AOS, CSS3, Javascript, Framer Motion",
            github_url: "https://github.com/asmitalok18/Portfolio",
            live_url: "https://portfolio-chi-one-53.vercel.app/",
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Auto-play functionality with hover pause
  useEffect(() => {
    if (!isAutoPlay || isHovered || totalPages <= 1) return;
    
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

  if (loading) {
    return (
      <section id="projects" className="section-padding">
        <Container>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading projects...</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

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
              {getCurrentProjects().map((project, index) => {
                console.log('Rendering project:', project.name, project); // Debug log
                return (
                <Col lg={4} md={6} className="mb-4" key={`${currentPage}-${index}`}>
                  <motion.div 
                    variants={cardVariants}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <Card className="card-custom" style={{ height: '600px' }}>
                      <div className="position-relative" style={{ backgroundColor: '#f8f9fa', height: '250px', overflow: 'hidden', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                        <motion.img
                          src={project.image_url?.startsWith('/media/') 
                            ? `${BASE_URL}${project.image_url}` 
                            : (project.image_url || project.image)}
                          alt={project.name || project.title}
                          className="card-img-top project-image"
                          style={{ 
                            height: '200px', 
                            objectFit: 'contain',
                            width: '100%',
                            backgroundColor: 'white'
                          }}
                          variants={imageVariants}
                          whileHover="hover"
                        />

                      </div>
                      
                      {/* Project name: placed just below the image */}
                      <div className="project-name-container" style={{ padding: '12px 20px 0 20px' }}>
                        <h3 style={{ 
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          margin: '0 0 8px 0',
                          padding: 0,
                          textAlign: 'left',
                          lineHeight: '1.3'
                        }}>
                          {project.name || project.title || 'Untitled Project'}
                        </h3>
                      </div>

                      <Card.Body className="d-flex flex-column" style={{ height: '360px', padding: '20px 20px 20px 20px' }}>
                        
                        <motion.div 
                          className="text-gray-custom mb-3 project-description-scroll"
                          style={{ 
                            height: '100px', 
                            overflow: 'auto',
                            fontSize: '0.9rem',
                            lineHeight: '1.4',
                            paddingRight: '8px'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="mb-0">
                            {project.description}
                          </p>
                        </motion.div>
                        
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
                          {(project.technologies || '').split(',').map((tech, techIndex) => (
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
                                {tech.trim()}
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
                          {(project.live_url || project.live) && (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-100">
                              <Button
                                href={project.live_url || project.live}
                                target="_blank"
                                className="btn-primary-custom w-100"
                              >
                                <FaExternalLinkAlt className="me-2" />
                                View Project
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
                );
              })}
            </Row>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {totalPages > 1 && (
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
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Projects;