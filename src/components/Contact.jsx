// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
// import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaWhatsapp, FaTelegram } from 'react-icons/fa';
// import emailjs from '@emailjs/browser';
// const Contact = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         subject: '',
//         message: ''
//     });
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [alertVariant, setAlertVariant] = useState('success');
//     const [isLoading, setIsLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             // EmailJS configuration
//             const serviceID = 'service_5xodnc6'; // Replace with your EmailJS service ID
//             const templateID = 'template_6ckabpg'; // Replace with your EmailJS template ID
//             const publicKey = 'IRJ2nfDn7pfaipAxu'; // Replace with your EmailJS public key

//             const templateParams = {
//                 from_name: formData.name,
//                 from_email: formData.email,
//                 to_email: 'alokasmit@gmail.com',
//                 subject: formData.subject,
//                 message: formData.message,
//             };

//             await emailjs.send(serviceID, templateID, templateParams, publicKey);

//             setAlertMessage('Thank you for your message! I\'ll get back to you soon.');
//             setAlertVariant('success');
//             setShowAlert(true);
//             setFormData({ name: '', email: '', subject: '', message: '' });
//         } catch (error) {
//             console.error('EmailJS error:', error);
//             setAlertMessage('Sorry, there was an error sending your message. Please try again.');
//             setAlertVariant('danger');
//             setShowAlert(true);
//         } finally {
//             setIsLoading(false);
//             setTimeout(() => setShowAlert(false), 5000);
//         }
//     // Handle form submission here
//     console.log('Form submitted:', formData);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//     setFormData({ name: '', email: '', subject: '', message: '' });
// };

// const contactInfo = [
//     {
//         icon: <FaEnvelope />,
//         title: "Email",
//         value: "alokasmit@gmail.com",
//         link: "mailto:asmit.alok@example.com"
//     },
//     {
//         icon: <FaPhone />,
//         title: "Phone",
//         value: "+91 8210632703",
//         link: "tel:+918210632703"
//     },
//     {
//         icon: <FaMapMarkerAlt />,
//         title: "Location",
//         value: "Gurugram, India",
//         link: "#"
//     }
// ];

// const socialLinks = [
//     {
//         icon: <FaLinkedin />,
//         name: "LinkedIn",
//         url: "https://www.linkedin.com/in/asmitalok",
//         color: "#0077b5"
//     },
//     {
//         icon: <FaGithub />,
//         name: "GitHub",
//         url: "https://github.com/asmitalok18",
//         color: "#333"
//     },
//     {
//         icon: <FaWhatsapp />,
//         name: "WhatsApp",
//         url: "https://wa.link/60n6aa",
//         color: "#25d366"
//     },
//     {
//         icon: <FaTelegram />,
//         name: "Telegram",
//         url: "https://t.me/Vrm01234",
//         color: "#0088cc"
//     }
// ];

// return (
//   <section id="contact" className="section-padding bg-dark-custom">
//     <Container>
//       <Row>
//         <Col lg={12} className="text-center mb-5">
//           <h2 className="section-title text-light-custom" data-aos="fade-up">
//             Get In Touch
//           </h2>
//           <p className="text-gray lead" data-aos="fade-up" data-aos-delay="200">
//             Let's discuss your next project or collaboration opportunity
//           </p>
//         </Col>
//       </Row>
      
//       <Row>
//         <Col lg={8} className="mb-5 mb-lg-0">
//           <Card className="card-custom p-4" data-aos="fade-right">
//             <h4 className="text-primary-custom mb-4 text-start">Send Me a Message</h4>
            
//             {showAlert && (
//               <Alert variant={alertVariant} className={alertVariant === 'success' ? "bg-primary-custom text-dark border-0" : "border-0"}>
//                 {alertMessage}
//               </Alert>
//             )}
            
//             <Form onSubmit={handleSubmit}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="text-light-custom text-start d-block">Name *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       className="bg-dark text-light-custom border-secondary"
//                       style={{ backgroundColor: 'rgba(26, 26, 46, 0.8) !important' }}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="text-light-custom text-start d-block">Email *</Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="bg-dark text-light-custom border-secondary"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
              
//               <Form.Group className="mb-3">
//                 <Form.Label className="text-light-custom text-start d-block">Subject *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   required
//                   className="bg-dark text-light-custom border-secondary"
//                 />
//               </Form.Group>
              
//               <Form.Group className="mb-4">
//                 <Form.Label className="text-light-custom text-start d-block">Message *</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={6}
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   required
//                   className="bg-dark text-light-custom border-secondary"
//                 />
//               </Form.Group>
              
//               <Button 
//                 type="submit" 
//                 className="btn-primary-custom" 
//                 size="lg"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Sending...' : 'Send Message'}
//               </Button>
//             </Form>
//           </Card>
//         </Col>
        
//         <Col lg={4}>
//           <Card className="card-custom p-4 mb-4" data-aos="fade-left">
//             <h4 className="text-primary-custom mb-4 text-start">Contact Information</h4>
            
//             {contactInfo.map((info, index) => (
//               <div key={index} className="d-flex align-items-center mb-4">
//                 <div className="text-primary-custom fs-4 me-3">
//                   {info.icon}
//                 </div>
//                 <div className="text-start">
//                   <h6 className="text-light-custom mb-1 text-start">{info.title}</h6>
//                   <a 
//                     href={info.link}
//                     className="text-gray text-decoration-none"
//                   >
//                     {info.value}
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </Card>
          
//           <Card className="card-custom p-4" data-aos="fade-left" data-aos-delay="200">
//             <h4 className="text-primary-custom mb-4 text-start">Follow Me</h4>
//             <div className="d-flex gap-3">
//               {socialLinks.map((social, index) => (
//                 <a
//                   key={index}
//                   href={social.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="social-link d-flex align-items-center justify-content-center"
//                   style={{
//                     width: '50px',
//                     height: '50px',
//                     borderRadius: '50%',
//                     backgroundColor: 'rgba(26, 26, 46, 0.8)',
//                     border: '1px solid #333',
//                     color: social.color,
//                     fontSize: '20px',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = social.color;
//                     e.target.style.color = '#fff';
//                     e.target.style.transform = 'translateY(-2px)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = 'rgba(26, 26, 46, 0.8)';
//                     e.target.style.color = social.color;
//                     e.target.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   {social.icon}
//                 </a>
//               ))}
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   </section>
// );
// };

// export default Contact;


import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

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
            // EmailJS configuration
            const serviceID = 'service_5xodnc6'; // Replace with your EmailJS service ID
            const templateID = 'template_6ckabpg'; // Replace with your EmailJS template ID
            const publicKey = 'IRJ2nfDn7pfaipAxu'; // Replace with your EmailJS public key

            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                to_email: 'alokasmit@gmail.com',
                subject: formData.subject,
                message: formData.message,
            };

            await emailjs.send(serviceID, templateID, templateParams, publicKey);

            setAlertMessage('Thank you for your message! I\'ll get back to you soon.');
            setAlertVariant('success');
            setShowAlert(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('EmailJS error:', error);
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
            link: "mailto:asmit.alok@example.com"
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

    const inputVariants = {
        focus: {
            scale: 1.02,
            boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
            transition: {
                duration: 0.2
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

    const socialIconVariants = {
        hover: {
            scale: 1.2,
            rotate: 360,
            y: -5,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.9
        }
    };

    const contactInfoVariants = {
        hover: {
            x: 10,
            transition: {
                duration: 0.2
            }
        }
    };

    const alertVariants = {
        hidden: {
            opacity: 0,
            y: -20,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.8,
            transition: {
                duration: 0.3
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
                                data-aos="fade-up"
                            >
                                Get In Touch
                            </motion.h2>
                            <motion.p 
                                className="text-gray lead"
                                variants={itemVariants}
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                Let's discuss your next project or collaboration opportunity
                            </motion.p>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col lg={8} className="mb-5 mb-lg-0">
                            <motion.div
                                variants={formVariants}
                                data-aos="fade-right"
                            >
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
                                            variants={alertVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
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
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        <Form.Label className="text-light-custom text-start d-block">Name *</Form.Label>
                                                        <motion.div variants={inputVariants} whileFocus="focus">
                                                            <Form.Control
                                                                type="text"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                required
                                                                className="bg-dark text-light-custom border-secondary"
                                                                style={{ backgroundColor: 'rgba(26, 26, 46, 0.8) !important' }}
                                                            />
                                                        </motion.div>
                                                    </motion.div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        <Form.Label className="text-light-custom text-start d-block">Email *</Form.Label>
                                                        <motion.div variants={inputVariants} whileFocus="focus">
                                                            <Form.Control
                                                                type="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required
                                                                className="bg-dark text-light-custom border-secondary"
                                                            />
                                                        </motion.div>
                                                    </motion.div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-3">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <Form.Label className="text-light-custom text-start d-block">Subject *</Form.Label>
                                                <motion.div variants={inputVariants} whileFocus="focus">
                                                    <Form.Control
                                                        type="text"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        required
                                                        className="bg-dark text-light-custom border-secondary"
                                                    />
                                                </motion.div>
                                            </motion.div>
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <Form.Label className="text-light-custom text-start d-block">Message *</Form.Label>
                                                <motion.div variants={inputVariants} whileFocus="focus">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={6}
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        required
                                                        className="bg-dark text-light-custom border-secondary"
                                                    />
                                                </motion.div>
                                            </motion.div>
                                        </Form.Group>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <motion.div
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button 
                                                    type="submit" 
                                                    className="btn-primary-custom" 
                                                    size="lg"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <motion.span
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            Sending...
                                                        </motion.span>
                                                    ) : (
                                                        'Send Message'
                                                    )}
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </Form>
                                </Card>
                            </motion.div>
                        </Col>
                        
                        <Col lg={4}>
                            <motion.div
                                variants={cardVariants}
                                data-aos="fade-left"
                            >
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
                                            variants={contactInfoVariants}
                                            whileHover="hover"
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
                                                <h6 className="text-light-custom mb-1 text-start">{info.title}</h6>
                                                <a 
                                                    href={info.link}
                                                    className="text-gray text-decoration-none"
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
                                data-aos="fade-left"
                                data-aos-delay="200"
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
                                        className="d-flex gap-3"
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
                                                className="social-link d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                                                    border: '1px solid #333',
                                                    color: social.color,
                                                    fontSize: '20px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                variants={socialIconVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = social.color;
                                                    e.target.style.color = '#fff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(26, 26, 46, 0.8)';
                                                    e.target.style.color = social.color;
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