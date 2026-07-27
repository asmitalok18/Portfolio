import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaTimes, FaAward } from 'react-icons/fa';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import '../styles/custom.css'; // to make sure we use the same generic styles

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const CertificateImageShowcase = ({ cert }) => {
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

  const imageSrc = cert.image_url ? (cert.image_url.startsWith('http') ? cert.image_url : `${BASE_URL}${cert.image_url}`) : null;

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
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={cert.title}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              padding: '0px',
              transform: 'translateZ(40px)' // Pops the image out in 3D space
            }}
          />
        ) : (
          <div style={{ transform: 'translateZ(40px)' }}>
             <FaAward size={64} color="var(--text-muted)" style={{ opacity: 0.5 }} />
          </div>
        )}

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

const Certificates = () => {
  const { certificates: contextCertificates, loading: contextLoading } = usePortfolioData();
  const [selectedCert, setSelectedCert] = useState(null);
  
  const loading = contextLoading;
  const certificates = contextCertificates && contextCertificates.length > 0 ? contextCertificates : [];

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

  const maxIndex = Math.max(0, certificates.length - itemsPerView);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? prev : prev + 1));
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

  if (loading) return null;
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="section-padding" style={{ paddingTop: '80px', paddingBottom: '80px', background: '#09090b', position: 'relative' }}>
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
              Certificates & Achievements
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
              Continuous learning and professional milestones
            </motion.p>
          </Col>
        </Row>

        {/* Certificates Carousel */}
        <div className="projects-carousel-wrapper" style={{ overflow: 'hidden', width: '100%', marginBottom: '20px', padding: '10px 0' }}>
          <div 
            className="projects-carousel-track"
            style={{ 
              display: 'flex', 
              gap: '24px',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * (24 / itemsPerView)}px))`
            }}
          >
            {certificates.map((cert, index) => {
              return (
                <div 
                  key={index} 
                  style={{ flex: `0 0 calc(${100 / itemsPerView}% - ${24 * (itemsPerView - 1) / itemsPerView}px)` }}
                >
                  <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ height: '100%' }}
                  >
                    <Card className="card-custom" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <CertificateImageShowcase cert={cert} />
                      
                      {/* Certificate name: placed just below the image */}
                      <div className="project-name-container" style={{ padding: '16px 24px 0 24px' }}>
                        <h3 
                          title={cert.title}
                          style={{ 
                          fontSize: '1.25rem',
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontWeight: 500,
                          letterSpacing: '-0.02em',
                          color: '#ffffff',
                          margin: '0 0 4px 0',
                          padding: 0,
                          textAlign: 'left',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minHeight: '2.8rem' // Reserve space for 2 lines
                        }}>
                          {cert.title}
                        </h3>
                        <div style={{ height: '2px', width: '40px', background: 'linear-gradient(90deg, #aebdcc, transparent)', marginTop: '8px' }} />
                      </div>

                      <Card.Body className="d-flex flex-column" style={{ flexGrow: 1, padding: '12px 24px 24px 24px' }}>
                        
                        {cert.description && cert.description.trim() !== '' && (
                          <motion.div 
                            className="text-gray-custom mb-3 project-description-scroll"
                            style={{ 
                              fontSize: '0.92rem',
                              lineHeight: '1.6',
                              color: 'rgba(235, 240, 246, 0.7)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <p className="mb-0">
                              {cert.description}
                            </p>
                          </motion.div>
                        )}
                        
                        <motion.div 
                          className="mb-4 mt-auto"
                          style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            overflow: 'hidden'
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
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
                                borderRadius: '6px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                letterSpacing: '0.02em',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                              }}
                              title={`Issuer: ${cert.issuer}`}
                            >
                              <span style={{opacity: 0.7, marginRight: '4px'}}>Issuer:</span> {cert.issuer}
                            </span>
                            <span 
                              className="badge-custom"
                              style={{
                                backgroundColor: 'rgba(220, 232, 245, 0.04)',
                                border: '1px solid rgba(220, 232, 245, 0.1)',
                                color: '#aebdcc',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                letterSpacing: '0.02em',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                              }}
                            >
                              <span style={{opacity: 0.7, marginRight: '4px'}}>Issued:</span> {cert.date_issued}
                            </span>
                          </motion.div>
                          
                          <motion.div 
                            className="d-flex gap-2"
                            style={{ height: '42px' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {cert.credential_url ? (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-100 h-100">
                              <Button
                                href={cert.credential_url}
                                target="_blank"
                                className="w-100 h-100 d-flex align-items-center justify-content-center border-0 project-action-btn project-action-view"
                              >
                                <FaExternalLinkAlt className="me-2" /> Verify Credential
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-100 h-100">
                              <Button
                                onClick={() => setSelectedCert(cert)}
                                className="w-100 h-100 d-flex align-items-center justify-content-center border-0 project-action-btn project-action-details"
                              >
                                <FaAward className="me-2" /> View Certificate
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
          {certificates.length > itemsPerView && (
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

      {/* Premium Certificate Details Modal */}
      <Modal 
        show={!!selectedCert} 
        onHide={() => setSelectedCert(null)} 
        size="lg" 
        className="premium-modal"
        dialogClassName="premium-modal-dialog"
        contentClassName="premium-modal-content-wrapper"
        backdropClassName="premium-modal-backdrop"
      >
        {selectedCert && (
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
            <div style={{ position: 'relative', flexGrow: 1, width: '100%', overflow: 'hidden', background: '#000', minHeight: '400px' }}>
               <img 
                 src={(() => {
                   const apiImg = selectedCert.image_url;
                   if (apiImg && apiImg.startsWith('http')) return apiImg;
                   if (apiImg && apiImg.startsWith('/')) return `${BASE_URL}${apiImg}`;
                   return apiImg;
                 })()} 
                 alt={selectedCert.title} 
                 draggable="false"
                 style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
               />
               <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 30px 20px', background: 'linear-gradient(to top, #09090b 10%, transparent)', pointerEvents: 'none' }}>
                 <h2 style={{ fontSize: '2.4rem', fontFamily: 'Georgia, serif', fontWeight: 500, margin: 0, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                   {selectedCert.title}
                 </h2>
               </div>
               <button 
                 onClick={() => setSelectedCert(null)} 
                 style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }} 
                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
               >
                 <FaTimes />
               </button>
            </div>
            
            <div className="custom-scrollbar" style={{ padding: '32px', flexShrink: 0, background: '#09090b' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <span style={{ color: '#aebdcc', fontWeight: 600 }}>Issuer:</span> <span style={{ color: '#fff' }}>{selectedCert.issuer}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                <span style={{ color: '#aebdcc', fontWeight: 600 }}>Date:</span> <span style={{ color: '#fff' }}>{selectedCert.date_issued}</span>
              </div>
              {selectedCert.description && (
                <p style={{ lineHeight: '1.8', color: 'rgba(235, 240, 246, 0.8)', margin: 0, fontSize: '0.95rem' }}>
                  {selectedCert.description}
                </p>
              )}
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
      `}</style>
    </section>
  );
};

export default Certificates;
