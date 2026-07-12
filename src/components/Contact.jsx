import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../contexts/PortfolioDataContext';

const Contact = () => {
    const { contact: contactDataContext, socialLinks: socialLinksContext } = usePortfolioData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic contact information state matching database structure
    const [contactData, setContactData] = useState({
        email: "alokasmit@gmail.com",
        phone: "+91 8210632703",
        location: "Gurugram, India",
        social_links: {
            linkedin: "https://www.linkedin.com/in/asmitalok",
            github: "https://github.com/asmitalok18",
            whatsapp: "https://wa.link/60n6aa",
            telegram: "https://t.me/Vrm01234"
        }
    });

    useEffect(() => {
        if (contactDataContext) {
            setContactData({
                email: contactDataContext.email || "alokasmit@gmail.com",
                phone: contactDataContext.phone || "+91 8210632703",
                location: contactDataContext.location || "Gurugram, India",
                social_links: socialLinksContext || {}
            });
        }
    }, [contactDataContext, socialLinksContext]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Create FormData object for Formspree
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('message', formData.message);

            const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${BASE_URL}/api/contact/`, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setAlertMessage('Thank you for your message! I\'ll get back to you soon.');
                setAlertVariant('success');
                setShowAlert(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After') || 60;
                setAlertMessage(`You have made too many requests. Please try again in ${retryAfter} seconds.`);
                setAlertVariant('warning');
                setShowAlert(true);
            } else {
                const data = await response.json().catch(() => ({}));
                if (data.errors) {
                    setAlertMessage(data.errors.map(error => error.message).join(', '));
                } else {
                    setAlertMessage('Oops! There was a problem submitting your form');
                }
                setAlertVariant('danger');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Formspree error:', error);
            setAlertMessage('Sorry, there was an error sending your message. Please try again.');
            setAlertVariant('danger');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    const contactInfo = [
        {
            icon: <FaEnvelope />,
            title: "Email",
            value: contactData.email,
            link: `mailto:${contactData.email}`
        },
        {
            icon: <FaPhone />,
            title: "Phone",
            value: contactData.phone,
            link: `tel:${contactData.phone.replace(/\s+/g, '')}`
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Location",
            value: contactData.location,
            link: "#"
        }
    ];

    const socialLinks = [];
    if (contactData.social_links) {
        if (contactData.social_links.linkedin) {
            socialLinks.push({
                icon: <FaLinkedin />,
                name: "LinkedIn",
                url: contactData.social_links.linkedin,
                color: "#0077b5"
            });
        }
        if (contactData.social_links.github) {
            socialLinks.push({
                icon: <FaGithub />,
                name: "GitHub",
                url: contactData.social_links.github,
                color: "#333"
            });
        }
        if (contactData.social_links.whatsapp) {
            socialLinks.push({
                icon: <FaWhatsapp />,
                name: "WhatsApp",
                url: contactData.social_links.whatsapp,
                color: "#25d366"
            });
        }
        if (contactData.social_links.telegram) {
            socialLinks.push({
                icon: <FaTelegram />,
                name: "Telegram",
                url: contactData.social_links.telegram,
                color: "#0088cc"
            });
        }
    }

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

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 50 
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const formVariants = {
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

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            x: 100 
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

    return (
        <section id="contact" className="position-relative" style={{ padding: '100px 0', background: 'radial-gradient(circle at 50% 0%, rgba(220, 232, 245, 0.03), transparent 70%), #030406' }}>
            <Container>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Header Section */}
                    <Row className="mb-5">
                        <Col lg={8} className="mx-auto text-center">
                            <motion.h2 
                                variants={itemVariants}
                                style={{ 
                                    fontFamily: 'Georgia, "Times New Roman", serif', 
                                    letterSpacing: '-0.02em', 
                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    marginBottom: '1rem'
                                }}
                            >
                                Let's Build Together.
                            </motion.h2>
                            <motion.div 
                                style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, #aebdcc, transparent)', margin: '0 auto 1.5rem auto' }}
                                variants={itemVariants}
                            />
                            <motion.p 
                                variants={itemVariants}
                                style={{ color: 'rgba(235, 240, 246, 0.65)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}
                            >
                                Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                            </motion.p>
                        </Col>
                    </Row>
                    
                    <Row className="g-5 mt-2">
                        {/* Contact Form Column */}
                        <Col lg={7}>
                            <motion.div variants={formVariants} className="h-100">
                                <Card className="h-100 border-0" style={{ 
                                    background: 'linear-gradient(145deg, rgba(15, 17, 21, 0.7), rgba(10, 12, 16, 0.9))',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(220, 232, 245, 0.08)',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                                    padding: '40px'
                                }}>
                                    <h4 style={{ 
                                        color: '#ffffff', 
                                        fontFamily: 'Georgia, serif', 
                                        fontSize: '1.6rem', 
                                        marginBottom: '32px' 
                                    }}>
                                        Send a Message
                                    </h4>
                                    
                                    {showAlert && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Alert variant={alertVariant} style={{ 
                                                background: alertVariant === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                                border: `1px solid ${alertVariant === 'success' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`,
                                                color: alertVariant === 'success' ? '#2ecc71' : '#e74c3c',
                                                borderRadius: '12px'
                                            }}>
                                                {alertMessage}
                                            </Alert>
                                        </motion.div>
                                    )}
                                    
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="g-4 mb-4">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="contact-label">Your Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="contact-input"
                                                        placeholder="Enter your name here"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="contact-label">Email Address</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="contact-input"
                                                        placeholder="user@gmail.com"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-4">
                                            <Form.Label className="contact-label">Subject</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="contact-input"
                                                placeholder="How can I help you?"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-5">
                                            <Form.Label className="contact-label">Message</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                className="contact-input"
                                                placeholder="Write your message here..."
                                                style={{ resize: 'none' }}
                                            />
                                        </Form.Group>
                                        
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="w-100 border-0 d-flex align-items-center justify-content-center"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(220, 232, 245, 0.15), rgba(220, 232, 245, 0.05))',
                                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 20px rgba(0,0,0,0.2)',
                                                    color: '#ffffff',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.05em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s ease',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {isLoading ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </motion.div>
                                    </Form>
                                </Card>
                            </motion.div>
                        </Col>
                        
                        {/* Contact Info Column */}
                        <Col lg={5}>
                            <motion.div variants={cardVariants} className="h-100 d-flex flex-column gap-4">
                                
                                {/* Info Card */}
                                <Card className="border-0" style={{ 
                                    background: 'linear-gradient(145deg, rgba(15, 17, 21, 0.4), rgba(10, 12, 16, 0.6))',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(220, 232, 245, 0.05)',
                                    padding: '40px'
                                }}>
                                    <h4 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: '1.6rem', marginBottom: '32px' }}>
                                        Contact Info
                                    </h4>
                                    
                                    <div className="d-flex flex-column gap-4">
                                        {contactInfo.map((info, index) => (
                                            <motion.a 
                                                key={index} 
                                                href={info.link}
                                                className="contact-info-row text-decoration-none d-flex align-items-center"
                                                whileHover={{ x: 8 }}
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                            >
                                                <div className="contact-info-icon-box me-4">
                                                    {info.icon}
                                                </div>
                                                <div className="text-start">
                                                    <div className="contact-label mb-1" style={{ fontSize: '0.65rem' }}>{info.title}</div>
                                                    <div style={{ color: '#ffffff', fontWeight: 500, fontSize: '1.05rem' }}>
                                                        {info.value}
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </Card>

                                {/* Social Links Card */}
                                <Card className="border-0 flex-grow-1" style={{ 
                                    background: 'linear-gradient(145deg, rgba(15, 17, 21, 0.4), rgba(10, 12, 16, 0.6))',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(220, 232, 245, 0.05)',
                                    padding: '40px'
                                }}>
                                    <h4 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: '1.6rem', marginBottom: '32px' }}>
                                        Social Profiles
                                    </h4>
                                    <motion.div 
                                        className="d-flex gap-3 flex-wrap"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        {socialLinks.map((social, index) => (
                                            <motion.a
                                                key={index}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="d-flex align-items-center justify-content-center text-decoration-none"
                                                style={{
                                                    width: '56px',
                                                    height: '56px',
                                                    borderRadius: '16px',
                                                    backgroundColor: 'rgba(220, 232, 245, 0.03)',
                                                    border: '1px solid rgba(220, 232, 245, 0.08)',
                                                    color: '#aebdcc',
                                                    fontSize: '22px',
                                                    pointerEvents: 'auto'
                                                }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    y: -5,
                                                    backgroundColor: social.color,
                                                    borderColor: social.color,
                                                    color: '#ffffff',
                                                    boxShadow: `0 15px 30px ${social.color}40`
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ 
                                                    delay: 0.8 + index * 0.1,
                                                    type: "spring",
                                                    stiffness: 260,
                                                    damping: 20
                                                }}
                                            >
                                                {social.icon}
                                            </motion.a>
                                        ))}
                                    </motion.div>
                                </Card>

                            </motion.div>
                        </Col>
                    </Row>
                </motion.div>
            </Container>

            <style>{`
                .contact-input {
                    background: rgba(220, 232, 245, 0.02) !important;
                    border: 1px solid rgba(220, 232, 245, 0.08) !important;
                    color: #ffffff !important;
                    border-radius: 12px !important;
                    padding: 16px 20px !important;
                    font-size: 0.95rem;
                    transition: all 0.3s ease !important;
                    box-shadow: none !important;
                }
                .contact-input:focus {
                    background: rgba(220, 232, 245, 0.06) !important;
                    border-color: rgba(220, 232, 245, 0.3) !important;
                    box-shadow: 0 0 0 4px rgba(220, 232, 245, 0.05) !important;
                    transform: translateY(-2px);
                }
                .contact-input::placeholder {
                    color: rgba(235, 240, 246, 0.3) !important;
                }
                .contact-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: rgba(235, 240, 246, 0.5);
                    margin-bottom: 10px;
                    font-weight: 600;
                    display: block;
                    text-align: left;
                }
                .contact-info-icon-box {
                    width: 54px;
                    height: 54px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(220, 232, 245, 0.08), rgba(220, 232, 245, 0.01));
                    border: 1px solid rgba(220, 232, 245, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    color: #aebdcc;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .contact-info-row:hover .contact-info-icon-box {
                    background: rgba(220, 232, 245, 0.15);
                    color: #ffffff;
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                    border-color: rgba(220, 232, 245, 0.3);
                }
            `}</style>
        </section>
    );
};

export default Contact;