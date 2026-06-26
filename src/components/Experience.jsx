import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaCode, FaCogs, 
  FaFileAlt, FaDatabase, FaBrain, FaReact, 
  FaNodeJs, FaShieldAlt, FaUsers, FaMobile 
} from 'react-icons/fa';
import '../styles/Experience.css'

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const getResponsibilityIcon = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('angular') || lower.includes('react') || lower.includes('frontend') || lower.includes('ui') || lower.includes('component')) {
    return FaCode;
  }
  if (lower.includes('ngrx') || lower.includes('state') || lower.includes('integrate') || lower.includes('workflows')) {
    return FaCogs;
  }
  if (lower.includes('pdf') || lower.includes('report') || lower.includes('document') || lower.includes('pptx')) {
    return FaFileAlt;
  }
  if (lower.includes('db') || lower.includes('database') || lower.includes('postgres') || lower.includes('sql') || lower.includes('api') || lower.includes('backend')) {
    return FaDatabase;
  }
  return FaBrain;
};

const Experience = () => {
  const [monthsExperience, setMonthsExperience] = useState(0);
  const [experiences, setExperiences] = useState([]);

  // Fallbacks if backend is empty or fails
  const fallbackExperiences = [
    {
      role: "Associate Consultant L1 - Frontend Development",
      company: "Oodles Technologies",
      location: "Gurugram, India",
      duration: "Feb 2025 - Present",
      type: "Full-time",
      responsibilities: [
        "Developed a comprehensive GenAI application using Angular 18+ with TypeScript, implementing complex components like file upload, query processing, and data visualization",
        "Integrated NgRx for state management to handle query states across components and maintain application data consistency",
        "Implemented automated report generation using jsPDF and PptxGenJS, generating professional PDFs and PowerPoint slides with multi-page layouts, embedded charts, and structured analytics from API responses",
        "Connected Django backend with frontend for smooth LLM-powered interactions and clean API use",
        "Implemented data preprocessing workflows to generate embeddings using large language models (LLMs)"
      ]
    },
    {
      role: "Software Developer Intern",
      company: "Akshar Consultancy Services Pvt. Ltd.",
      location: "Delhi, India",
      duration: "Jun 2024 - Dec 2024",
      type: "Internship",
      responsibilities: [
        "Built dynamic and responsive single-page applications (SPAs) using React.js, JSX, and Tailwind CSS, enhancing performance through efficient Virtual DOM handling and reusable UI components",
        "Designed and implemented modular React components using Hooks (useState, useEffect, useContext) and a props-driven architecture, ensuring code scalability and maintainability",
        "Developed and deployed responsive web interfaces with Tailwind CSS, significantly improving cross-device compatibility and user engagement",
        "Collaborated in a cross-functional team of 4 developers to build RESTful APIs using Node.js and Express, streamlining backend operations and improving data handling efficiency",
        "Implemented secure authentication mechanisms using JSON Web Tokens (JWT), ensuring safe and reliable access management for over 500+ user accounts"
      ]
    }
  ];

  // Calculate months of experience from your start date
  useEffect(() => {
    const calculateExperience = () => {
      // Set your career start date (June 2024 based on your internship)
      const startDate = new Date('2024-06-01');
      const currentDate = new Date();
      
      const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
      const monthDiff = currentDate.getMonth() - startDate.getMonth();
      
      const totalMonths = yearDiff * 12 + monthDiff;
      setMonthsExperience(Math.max(1, totalMonths));
    };

    calculateExperience();
    
    // Update every day to keep it current
    const interval = setInterval(calculateExperience, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/portfolio-data/`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        if (data.experiences && data.experiences.length > 0) {
          // Parse responsibilities from JSON string if needed
          const processed = data.experiences.map(exp => {
            let respArray = [];
            try {
              respArray = JSON.parse(exp.responsibilities);
            } catch {
              respArray = Array.isArray(exp.responsibilities) ? exp.responsibilities : [exp.responsibilities];
            }
            return {
              ...exp,
              responsibilities: respArray
            };
          });
          setExperiences(processed);
        } else {
          setExperiences(fallbackExperiences);
        }
      } catch (error) {
        console.error('Failed to fetch experiences, using fallbacks:', error);
        setExperiences(fallbackExperiences);
      }
    };

    fetchExperiences();
  }, []);

  const stats = [
    { number: `${monthsExperience}+`, label: "Months Experience" },
    { number: "15+", label: "Technologies" },
    { number: "7+", label: "Projects Completed" },
    { number: "24/7", label: "Learning Mode" }
  ];

  return (
    <section id="experience" className="section-padding">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="section-title text-light-custom" data-aos="fade-up">
              Professional Experience
            </h2>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="mb-5">
          <Col lg={12}>
            <div className="stats-container">
              <Row className="g-4">
                {stats.map((stat, index) => (
                  <Col lg={3} md={6} key={index}>
                    <Card className="card-custom text-center p-4 h-100" data-aos="fade-up" data-aos-delay={index * 100}>
                      <div className="stat-number text-primary-custom display-4 fw-bold mb-2">
                        {stat.number}
                      </div>
                      <div className="stat-label text-gray-custom">
                        {stat.label}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col lg={12}>
            <div className="timeline-container position-relative px-4">
              {/* Timeline line */}
              <div 
                className="timeline-line position-absolute bg-primary-custom"
                style={{
                  left: '50px',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  zIndex: 1
                }}
              ></div>
              
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className="timeline-item position-relative mb-5"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  {/* Timeline dot */}
                  <div 
                    className="timeline-dot position-absolute bg-primary-custom rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      left: '38px',
                      top: '30px',
                      width: '26px',
                      height: '26px',
                      zIndex: 2,
                      boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 255, 136, 0.4)'
                    }}
                  ></div>
                  
                  <Card 
                    className="card-custom experience-card p-4"
                    style={{ 
                      marginLeft: '80px',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Row>
                      <Col lg={8} md={12}>
                        <h4 className="text-primary-custom mb-2 fw-bold">{exp.role}</h4>
                        <h5 className="text-light-custom mb-3">{exp.company}</h5>
                      </Col>
                      <Col lg={4} md={12} className="text-lg-end text-md-start">
                        <div className="mb-2">
                          <FaCalendarAlt className="text-primary-custom me-2" />
                          <span className="text-gray">{exp.duration}</span>
                        </div>
                        <div className="mb-2">
                          <FaMapMarkerAlt className="text-primary-custom me-2" />
                          <span className="text-gray">{exp.location}</span>
                        </div>
                        <span className="badge bg-primary-custom text-dark px-3 py-2 fw-semibold">
                          {exp.type}
                        </span>
                      </Col>
                    </Row>
                    
                    <hr className="border-primary-custom opacity-50 my-4" />
                    
                    <div className="responsibilities-section">
                      <h6 className="text-light-custom mb-4 fw-bold">
                        Key Responsibilities & Achievements
                      </h6>
                      <div className="row g-3">
                        {exp.responsibilities && exp.responsibilities.map((responsibility, idx) => {
                          const IconComponent = getResponsibilityIcon(responsibility);
                          return (
                            <div key={idx} className="col-12">
                              <div className="responsibility-item d-flex align-items-start p-3 rounded-3 border border-primary-custom border-opacity-25 bg-dark bg-opacity-25">
                                <div 
                                  className="icon-wrapper me-3 d-flex align-items-center justify-content-center rounded-circle bg-primary-custom flex-shrink-0"
                                  style={{ 
                                    minWidth: '32px', 
                                    height: '32px',
                                    marginTop: '2px'
                                  }}
                                >
                                  <IconComponent 
                                    className="text-dark" 
                                    style={{ fontSize: '14px' }} 
                                  />
                                </div>
                                <p className="text-gray-custom mb-0 lh-base flex-grow-1">
                                  {responsibility}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Experience;