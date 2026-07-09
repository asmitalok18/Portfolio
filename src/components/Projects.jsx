import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import '../styles/custom.css'

// Base URL for backend API and media. Prefer REACT_APP_BASE_URL, then BASE_URL, then localhost default.
const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const ProjectImageShowcase = ({ project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Calculate dynamic glare based on mouse position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="project-image-showcase position-relative w-100 overflow-hidden" 
      style={{ 
        aspectRatio: '16/9',
        background: 'radial-gradient(circle at 50% 50%, rgba(220, 232, 245, 0.05), transparent 70%), linear-gradient(180deg, #05070a 0%, #030406 100%)',
        borderBottom: '1px solid rgba(220, 232, 245, 0.05)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '80%',
        height: '80%',
        background: 'rgba(174, 189, 204, 0.15)',
        filter: 'blur(45px)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}/>
      
      {/* Dynamic 3D Container */}
      <motion.div
        className="project-image-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(220, 232, 245, 0.15)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          background: 'rgba(8, 10, 14, 0.6)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.img
          src={project.image_url?.startsWith('/media/') 
            ? `${BASE_URL}${project.image_url}` 
            : (project.image_url || project.image)}
          alt={project.name || project.title}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            padding: '12px',
            transform: 'translateZ(40px)' // Pops the image out in 3D space
          }}
        />

        {/* Dynamic Glare Effect */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%)',
            pointerEvents: 'none',
            x: glareX,
            y: glareY,
            transform: 'scale(1.5)',
            opacity: 0.8
          }}
        />
      </motion.div>
      
      {/* Decorative Corner Accents */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '12px', height: '12px', borderTop: '2px solid rgba(220,232,245,0.4)', borderLeft: '2px solid rgba(220,232,245,0.4)' }}/>
      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '12px', height: '12px', borderTop: '2px solid rgba(220,232,245,0.4)', borderRight: '2px solid rgba(220,232,245,0.4)' }}/>
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '12px', height: '12px', borderBottom: '2px solid rgba(220,232,245,0.4)', borderLeft: '2px solid rgba(220,232,245,0.4)' }}/>
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '12px', height: '12px', borderBottom: '2px solid rgba(220,232,245,0.4)', borderRight: '2px solid rgba(220,232,245,0.4)' }}/>
    </div>
  );
};

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
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
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
    <section id="projects" className="section-padding" style={{ paddingTop: '20px' }}>
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
                    <Card className="card-custom" style={{ height: '620px', display: 'flex', flexDirection: 'column' }}>
                      <ProjectImageShowcase project={project} />
                      
                      {/* Project name: placed just below the image */}
                      <div className="project-name-container" style={{ padding: '16px 24px 0 24px' }}>
                        <h3 style={{ 
                          fontSize: '1.4rem',
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontWeight: 500,
                          letterSpacing: '-0.02em',
                          color: '#ffffff',
                          margin: '0 0 4px 0',
                          padding: 0,
                          textAlign: 'left',
                          lineHeight: '1.3'
                        }}>
                          {project.name || project.title || 'Untitled Project'}
                        </h3>
                        <div style={{ height: '2px', width: '40px', background: 'linear-gradient(90deg, #aebdcc, transparent)', marginTop: '8px' }} />
                      </div>

                      <Card.Body className="d-flex flex-column" style={{ flexGrow: 1, padding: '16px 24px 24px 24px' }}>
                        
                        <motion.div 
                          className="text-gray-custom mb-3 project-description-scroll"
                          style={{ 
                            fontSize: '0.92rem',
                            lineHeight: '1.6',
                            color: 'rgba(235, 240, 246, 0.7)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '70px'
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
                          className="mb-4"
                          style={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            gap: '8px',
                            height: '80px',
                            overflow: 'hidden',
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {(() => {
                            const techs = (project.technologies || '').split(',').map(t => t.trim()).filter(Boolean);
                            const displayTechs = techs.slice(0, 6);
                            const extra = techs.length - 6;
                            
                            return (
                              <>
                                {displayTechs.map((tech, techIndex) => (
                                  <motion.span
                                    key={techIndex}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <span 
                                      className="badge-custom"
                                      style={{
                                        backgroundColor: 'rgba(220, 232, 245, 0.04)',
                                        border: '1px solid rgba(220, 232, 245, 0.1)',
                                        color: '#aebdcc',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '0.02em',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      {tech}
                                    </span>
                                  </motion.span>
                                ))}
                                {extra > 0 && (
                                  <span style={{ 
                                    color: 'rgba(220, 232, 245, 0.5)', 
                                    fontSize: '0.75rem', 
                                    alignSelf: 'center', 
                                    marginLeft: '4px',
                                    fontWeight: 600
                                  }}>
                                    +{extra} more
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </motion.div>
                        
                        <motion.div 
                          className="d-flex gap-2 mt-auto"
                          style={{ height: '48px' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {(project.live_url || project.live) && (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-100 h-100">
                              <Button
                                href={project.live_url || project.live}
                                target="_blank"
                                className="w-100 h-100 d-flex align-items-center justify-content-center border-0"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(220, 232, 245, 0.12), rgba(220, 232, 245, 0.04))',
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.3)',
                                  color: '#ffffff',
                                  borderRadius: '12px',
                                  fontWeight: 600,
                                  letterSpacing: '0.04em',
                                  textTransform: 'uppercase',
                                  fontSize: '0.8rem',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <FaExternalLinkAlt className="me-2" style={{ color: '#aebdcc' }} />
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