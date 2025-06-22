import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
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

            const response = await fetch('https://formspree.io/f/mzzgalny', {
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
            } else {
                const data = await response.json();
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
            value: "alokasmit@gmail.com",
            link: "mailto:alokasmit@gmail.com"
        },
        {
            icon: <FaPhone />,
            title: "Phone",
            value: "+91 8210632703",
            link: "tel:+918210632703"
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Location",
            value: "Gurugram, India",
            link: "#"
        }
    ];

    const socialLinks = [
        {
            icon: <FaLinkedin />,
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/asmitalok",
            color: "#0077b5"
        },
        {
            icon: <FaGithub />,
            name: "GitHub",
            url: "https://github.com/asmitalok18",
            color: "#333"
        },
        {
            icon: <FaWhatsapp />,
            name: "WhatsApp",
            url: "https://wa.link/60n6aa",
            color: "#25d366"
        },
        {
            icon: <FaTelegram />,
            name: "Telegram",
            url: "https://t.me/Vrm01234",
            color: "#0088cc"
        }
    ];

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
        <section id="contact" className="section-padding bg-dark-custom">
            <Container>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <Row>
                        <Col lg={12} className="text-center mb-5">
                            <motion.h2 
                                className="section-title text-light-custom"
                                variants={itemVariants}
                            >
                                Get In Touch
                            </motion.h2>
                            <motion.p 
                                className="text-gray lead"
                                variants={itemVariants}
                            >
                                Let's discuss your next project or collaboration opportunity
                            </motion.p>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col lg={8} className="mb-5 mb-lg-0">
                            <motion.div variants={formVariants}>
                                <Card className="card-custom p-4">
                                    <motion.h4 
                                        className="text-primary-custom mb-4 text-start"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Send Me a Message
                                    </motion.h4>
                                    
                                    {showAlert && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <Alert variant={alertVariant} className={alertVariant === 'success' ? "bg-primary-custom text-dark border-0" : "border-0"}>
                                                {alertMessage}
                                            </Alert>
                                        </motion.div>
                                    )}
                                    
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="text-light-custom text-start d-block">Name *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="form-control"
                                                        placeholder="Enter your name"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="text-light-custom text-start d-block">Email *</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="form-control"
                                                        placeholder="Enter your email"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-light-custom text-start d-block">Subject *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                                placeholder="Enter subject"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-light-custom text-start d-block">Message *</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                                placeholder="Enter your message"
                                            />
                                        </Form.Group>
                                        
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button 
                                                type="submit" 
                                                className="btn-primary-custom" 
                                                size="lg"
                                                disabled={isLoading}
                                                style={{
                                                    pointerEvents: 'auto',
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
                        
                        <Col lg={4}>
                            <motion.div variants={cardVariants}>
                                <Card className="card-custom p-4 mb-4">
                                    <motion.h4 
                                        className="text-primary-custom mb-4 text-start"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Contact Information
                                    </motion.h4>
                                    
                                    {contactInfo.map((info, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="d-flex align-items-center mb-4"
                                            whileHover={{ x: 10 }}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <motion.div 
                                                className="text-primary-custom fs-4 me-3"
                                                whileHover={{ 
                                                    scale: 1.2, 
                                                    rotate: 360,
                                                    transition: { duration: 0.5 }
                                                }}
                                            >
                                                {info.icon}
                                            </motion.div>
                                            <div className="text-start">
                                                <h6 className="text-light-custom mb-1">{info.title}</h6>
                                                <a 
                                                    href={info.link}
                                                    className="text-gray text-decoration-none"
                                                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                                >
                                                    {info.value}
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </Card>
                            </motion.div>
                            
                            <motion.div
                                variants={cardVariants}
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card className="card-custom p-4">
                                    <motion.h4 
                                        className="text-primary-custom mb-4 text-start"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        Follow Me
                                    </motion.h4>
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
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                                                    border: '1px solid #333',
                                                    color: social.color,
                                                    fontSize: '20px',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer',
                                                    pointerEvents: 'auto'
                                                }}
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: 360,
                                                    y: -5,
                                                    backgroundColor: social.color,
                                                    color: '#fff',
                                                    boxShadow: `0 10px 20px ${social.color}40`
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                initial={{ opacity: 0, scale: 0 }}
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
        </section>
    );
};

export default Contact;