import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
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
          src={(() => {
            const apiImg = project.image_url || project.image;
            if (apiImg && apiImg.startsWith('http')) return apiImg;
            if (apiImg && apiImg.startsWith('/')) return `${BASE_URL}${apiImg}`;
            if (project.name?.toLowerCase().includes('trident') || project.title?.toLowerCase().includes('trident')) return '/Trident_image.png';
            if (project.name?.toLowerCase().includes('portfolio') || project.title?.toLowerCase().includes('portfolio')) return '/portfolio.png';
            return apiImg || '/blog_app_image.png';
          })()}
          alt={project.name || project.title}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
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

const projectDetailCache = {};

const Projects = () => {
  const { projects: contextProjects, loading: contextLoading } = usePortfolioData();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetail, setProjectDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fallbackProjects = [
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
  ];

  const projects = contextProjects && contextProjects.length > 0 ? contextProjects : fallbackProjects;
  const loading = contextLoading;

  const handleOpenProject = async (project) => {
    setSelectedProject(project);

    if (projectDetailCache[project.id]) {
      setProjectDetail(projectDetailCache[project.id]);
      return;
    }

    setProjectDetail(project); // Optimistically set summary data
    setDetailLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/api/projects/${project.id}/`);
        if(response.ok) {
            const data = await response.json();
            projectDetailCache[project.id] = data;
            
            // Only update if still open
            setProjectDetail((currentDetail) => currentDetail && currentDetail.id === project.id ? data : currentDetail);
        }
    } catch(err) {
        console.error("Failed to fetch project details", err);
    } finally {
        setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedProject]);

  // Carousel States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1200) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, projects.length - itemsPerView);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? prev : prev + 1));
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
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '30vh', gap: '24px' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '2px solid rgba(255, 255, 255, 0.03)',
                  borderTop: '2px solid rgba(255, 255, 255, 0.9)',
                  borderRight: '2px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  boxShadow: '0 0 24px rgba(255, 255, 255, 0.15)'
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.03)',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
                  borderLeft: '2px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                }}
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              />
            </div>
            <motion.div 
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", ease: "easeInOut" }}
              style={{ color: '#a1a1aa', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500 }}
            >
              Loading Showcase
            </motion.div>
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

        {/* Projects Carousel */}
        <div className="projects-carousel-wrapper" style={{ overflow: 'hidden', width: '100%', marginBottom: '48px', padding: '10px 0' }}>
          <div 
            className="projects-carousel-track"
            style={{ 
              display: 'flex', 
              gap: '24px',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * (24 / itemsPerView)}px))`
            }}
          >
            {projects.map((project, index) => {
              return (
                <div 
                  key={index} 
                  style={{ flex: `0 0 calc(${100 / itemsPerView}% - ${24 * (itemsPerView - 1) / itemsPerView}px)` }}
                >
                  <motion.div 
                    variants={cardVariants}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <Card className="card-custom" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '560px' }}>
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
                            minHeight: '66px'
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
                          className="mb-3"
                          style={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            gap: '8px',
                            minHeight: '76px',
                            maxHeight: '76px',
                            overflow: 'hidden'
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
                                    color: 'rgba(220, 232, 245, 0.7)', 
                                    fontSize: '0.75rem', 
                                    alignSelf: 'center', 
                                    marginLeft: '4px',
                                    fontWeight: 600,
                                    background: 'rgba(220, 232, 245, 0.08)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px'
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
                          style={{ height: '42px', paddingTop: '4px' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className={(project.live_url || project.live) ? "w-50 h-100" : "w-100 h-100"}>
                            <Button
                              onClick={() => handleOpenProject(project)}
                              className="w-100 h-100 d-flex align-items-center justify-content-center border-0 project-action-btn project-action-details"
                            >
                              <FaInfoCircle className="me-2" /> Details
                            </Button>
                          </motion.div>

                          {(project.live_url || project.live) && (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-50 h-100">
                              <Button
                                href={project.live_url || project.live}
                                target="_blank"
                                className="w-100 h-100 d-flex align-items-center justify-content-center border-0 project-action-btn project-action-view"
                              >
                                <FaExternalLinkAlt className="me-2" /> View Project
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          {projects.length > itemsPerView && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '32px', gap: '24px' }}>
              <button 
                onClick={prevSlide} 
                className={`carousel-arrow ${currentIndex === 0 ? 'disabled' : ''}`}
                disabled={currentIndex === 0}
              >
                <FaChevronLeft />
              </button>
              
              <button 
                onClick={nextSlide} 
                className={`carousel-arrow ${currentIndex >= maxIndex ? 'disabled' : ''}`}
                disabled={currentIndex >= maxIndex}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </Container>

      {/* Premium Project Details Modal */}
      <Modal 
        show={!!selectedProject} 
        onHide={() => { setSelectedProject(null); setProjectDetail(null); }} 
        size="lg" 
        className="premium-modal"
        dialogClassName="premium-modal-dialog"
        contentClassName="premium-modal-content-wrapper"
        backdropClassName="premium-modal-backdrop"
      >
        {projectDetail && (
          <div style={{
            background: 'linear-gradient(145deg, #09090b, #18181b)',
            borderRadius: '24px',
            border: '1px solid rgba(220, 232, 245, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            color: '#e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'relative', height: '280px', flexShrink: 0, width: '100%', overflow: 'hidden', background: '#000' }}>
               {detailLoading && (
                 <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(9, 9, 11, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                   <div className="spinner-border text-light" role="status" style={{ width: '2rem', height: '2rem' }}>
                     <span className="visually-hidden">Loading...</span>
                   </div>
                 </div>
               )}
               <img 
                 src={(() => {
                   const apiImg = projectDetail.image_url || projectDetail.image;
                   if (apiImg && apiImg.startsWith('http')) return apiImg;
                   if (apiImg && apiImg.startsWith('/')) return `${BASE_URL}${apiImg}`;
                   if (projectDetail.name?.toLowerCase().includes('trident') || projectDetail.title?.toLowerCase().includes('trident')) return '/Trident_image.png';
                   if (projectDetail.name?.toLowerCase().includes('portfolio') || projectDetail.title?.toLowerCase().includes('portfolio')) return '/portfolio.png';
                   return apiImg || '/blog_app_image.png';
                 })()} 
                 alt={projectDetail.name} 
                 draggable="false"
                 onDragStart={(e) => e.preventDefault()}
                 style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, userSelect: 'none' }}
               />
               <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 30px 20px', background: 'linear-gradient(to top, #09090b 10%, transparent)' }}>
                 <Badge bg="transparent" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#aebdcc', marginBottom: '12px' }}>
                   {projectDetail.category || 'Web Application'}
                 </Badge>
                 <h2 style={{ fontSize: '2.4rem', fontFamily: 'Georgia, serif', fontWeight: 500, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                   {projectDetail.name || projectDetail.title}
                 </h2>
               </div>
               <button 
                 onClick={() => { setSelectedProject(null); setProjectDetail(null); }} 
                 style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }} 
                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
               >
                 <FaTimes />
               </button>
            </div>
            
            <div className="custom-scrollbar" style={{ padding: '32px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                 {(projectDetail.live_url || projectDetail.live) && (
                   <Button href={projectDetail.live_url || projectDetail.live} target="_blank" className="d-flex align-items-center" style={{ background: '#e2e8f0', color: '#09090b', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 600, fontSize: '0.9rem' }}>
                     <FaExternalLinkAlt className="me-2" /> Live Demo
                   </Button>
                 )}
                 {projectDetail.github_url && (
                   <Button href={projectDetail.github_url} target="_blank" className="d-flex align-items-center" style={{ background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 24px', fontWeight: 600, fontSize: '0.9rem' }}>
                     <FaGithub className="me-2" /> Source Code
                   </Button>
                 )}
              </div>

              <h4 style={{ fontSize: '1.1rem', color: '#aebdcc', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Project Overview</h4>
              <p style={{ lineHeight: '1.8', color: 'rgba(235, 240, 246, 0.8)', marginBottom: '32px', fontSize: '0.95rem' }}>
                {projectDetail.description}
              </p>

              {projectDetail.features_list && (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#aebdcc', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Key Highlights</h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                    {(() => {
                      let features = [];
                      try {
                        features = Array.isArray(projectDetail.features_list) ? projectDetail.features_list : JSON.parse(projectDetail.features_list);
                        if (!Array.isArray(features)) features = [projectDetail.features_list];
                      } catch {
                        features = (projectDetail.features_list || '').split('\n').filter(Boolean);
                      }
                      return features.map((f, i) => (
                        <li key={i} style={{ color: 'rgba(235, 240, 246, 0.8)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ color: '#4ade80', marginTop: '2px', fontSize: '12px' }}>●</div>
                          <span style={{ lineHeight: '1.5' }}>{f.trim()}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>
              )}

              <h4 style={{ fontSize: '1.1rem', color: '#aebdcc', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Technologies</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Array.isArray(projectDetail.technologies) ? projectDetail.technologies.map((tech, i) => (
                   <span key={i} style={{ background: 'rgba(220, 232, 245, 0.05)', border: '1px solid rgba(220, 232, 245, 0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 500 }}>
                     {tech.trim()}
                   </span>
                )) : (projectDetail.technologies || '').split(',').map((tech, i) => (
                   <span key={i} style={{ background: 'rgba(220, 232, 245, 0.05)', border: '1px solid rgba(220, 232, 245, 0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 500 }}>
                     {tech.trim()}
                   </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .carousel-arrow {
          background: rgba(220, 232, 245, 0.05);
          border: 1px solid rgba(220, 232, 245, 0.1);
          color: #aebdcc;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .carousel-arrow:hover:not(.disabled) {
          background: rgba(220, 232, 245, 0.15);
          color: #ffffff;
          transform: scale(1.1);
        }
        .carousel-arrow.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: rgba(220, 232, 245, 0.02);
        }
        
        .premium-modal {
          z-index: 99999 !important;
        }
        
        .premium-modal-dialog {
          max-width: 800px;
          margin: 40px auto 0.7rem auto !important;
          height: calc(100vh - 40px - 0.7rem) !important;
        }
        
        .premium-modal-content-wrapper {
          background: transparent !important;
          border: none !important;
          height: 100%;
        }
        
        .premium-modal-backdrop {
          z-index: 99998 !important;
          background-color: rgba(0, 0, 0, 0.85) !important;
          backdrop-filter: blur(8px) !important;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 232, 245, 0.2); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 232, 245, 0.4); 
        }
        
        .project-action-btn {
          border-radius: 10px !important;
          font-weight: 600 !important;
          letter-spacing: 0.04em !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          transition: all 0.3s ease !important;
          color: #aebdcc !important;
        }
        
        .project-action-details {
          background: transparent !important;
          border: 1px solid rgba(220, 232, 245, 0.15) !important;
        }
        
        .project-action-view {
          background: linear-gradient(135deg, rgba(220, 232, 245, 0.12), rgba(220, 232, 245, 0.04)) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.3) !important;
        }

        .project-action-btn:hover {
          background: rgba(220, 232, 245, 0.15) !important;
          color: #ffffff !important;
        }
        
        .project-action-btn:hover svg {
          color: #ffffff !important;
        }
      `}</style>
    </section>
  );
};

export default Projects;