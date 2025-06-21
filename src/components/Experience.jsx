import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaCode, FaCogs, FaFileAlt, FaDatabase, FaBrain, FaReact, FaNodeJs, FaShieldAlt, FaUsers, FaMobile } from 'react-icons/fa';

const Experience = () => {
  const [monthsExperience, setMonthsExperience] = useState(0);

  // Calculate months of experience from your start date
  useEffect(() => {
    const calculateExperience = () => {
      // Set your career start date (June 2024 based on your internship)
      const startDate = new Date('2024-06-01');
      const currentDate = new Date();
      
      const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
      const monthDiff = currentDate.getMonth() - startDate.getMonth();
      
      const totalMonths = yearDiff * 12 + monthDiff;
      
      // Ensure minimum of 1 month
      setMonthsExperience(Math.max(1, totalMonths));
    };

    calculateExperience();
    
    // Update every day to keep it current
    const interval = setInterval(calculateExperience, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: `${monthsExperience}+`, label: "Months Experience" },
    { number: "15+", label: "Technologies" },
    { number: "7+", label: "Projects Completed" },
    { number: "24/7", label: "Learning Mode" }
  ];

  const experiences = [
    {
      title: "Associate Consultant L1 - Frontend Development",
      company: "Oodles Technologies",
      location: "Gurugram, India",
      duration: "Feb 2025 - Present",
      type: "Full-time",
      responsibilities: [
        {
          icon: FaCode,
          text: "Developed a comprehensive GenAI application using Angular 18+ with TypeScript, implementing complex components like file upload, query processing, and data visualization"
        },
        {
          icon: FaCogs,
          text: "Integrated NgRx for state management to handle query states across components and maintain application data consistency"
        },
        {
          icon: FaFileAlt,
          text: "Implemented automated report generation using jsPDF and PptxGenJS, generating professional PDFs and PowerPoint slides with multi-page layouts, embedded charts, and structured analytics from API responses"
        },
        {
          icon: FaDatabase,
          text: "Connected Django backend with frontend for smooth LLM-powered interactions and clean API use"
        },
        {
          icon: FaBrain,
          text: "Implemented data preprocessing workflows to generate embeddings using large language models (LLMs)"
        }
      ]
    },
    {
      title: "Software Developer Intern",
      company: "Akshar Consultancy Services Pvt. Ltd.",
      location: "Delhi, India",
      duration: "Jun 2024 - Dec 2024",
      type: "Internship",
      responsibilities: [
        {
          icon: FaReact,
          text: "Built dynamic and responsive single-page applications (SPAs) using React.js, JSX, and Tailwind CSS, enhancing performance through efficient Virtual DOM handling and reusable UI components"
        },
        {
          icon: FaCogs,
          text: "Designed and implemented modular React components using Hooks (useState, useEffect, useContext) and a props-driven architecture, ensuring code scalability and maintainability"
        },
        {
          icon: FaMobile,
          text: "Developed and deployed responsive web interfaces with Tailwind CSS, significantly improving cross-device compatibility and user engagement"
        },
        {
          icon: FaUsers,
          text: "Collaborated in a cross-functional team of 4 developers to build RESTful APIs using Node.js and Express, streamlining backend operations and improving data handling efficiency"
        },
        {
          icon: FaShieldAlt,
          text: "Implemented secure authentication mechanisms using JSON Web Tokens (JWT), ensuring safe and reliable access management for over 500+ user accounts"
        }
      ]
    }
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
            <div className="position-relative">
              {/* Timeline line */}
              <div 
                className="position-absolute bg-primary-custom"
                style={{
                  left: '30px',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  zIndex: 1
                }}
              ></div>
              
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className="position-relative mb-5"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  {/* Timeline dot */}
                  <div 
                    className="position-absolute bg-primary-custom rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      left: '18px',
                      top: '30px',
                      width: '26px',
                      height: '26px',
                      zIndex: 2
                    }}
                  >
                    
                  </div>
                  
                  <Card 
                    className="card-custom ms-5 p-4"
                    style={{ marginLeft: '60px' }}
                  >
                    <Row>
                      <Col lg={8}>
                        <h4 className="text-primary-custom mb-2">{exp.title}</h4>
                        <h5 className="text-light-custom mb-3">{exp.company}</h5>
                      </Col>
                      <Col lg={4} className="text-lg-end">
                        <div className="mb-2">
                          <FaCalendarAlt className="text-primary-custom me-2" />
                          <span className="text-gray">{exp.duration}</span>
                        </div>
                        <div className="mb-2">
                          <FaMapMarkerAlt className="text-primary-custom me-2" />
                          <span className="text-gray">{exp.location}</span>
                        </div>
                        <span className="badge bg-primary-custom text-dark px-3 py-2">
                          {exp.type}
                        </span>
                      </Col>
                    </Row>
                    
                    <hr className="border-primary-custom opacity-25 my-4" />
                    
                    <div className="responsibilities-section">
                      <h6 className="text-light-custom mb-4 fw-bold">
                        Key Responsibilities & Achievements
                      </h6>
                      <div className="row g-3">
                        {exp.responsibilities.map((responsibility, idx) => {
                          const IconComponent = responsibility.icon;
                          return (
                            <div key={idx} className="col-12">
                              <div className="responsibility-item d-flex align-items-start p-3 rounded-3 border border-primary-custom border-opacity-25 bg-dark bg-opacity-25">
                                <div 
                                  className="icon-wrapper me-3 d-flex align-items-center justify-content-center rounded-circle bg-primary-custom"
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
                                <p className="text-gray-custom mb-0 lh-base">
                                  {responsibility.text}
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

      <style jsx>{`
        .stats-container .card-custom {
          transition: all 0.3s ease;
          border: 1px solid rgba(var(--primary-color-rgb), 0.3);
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .stats-container .card-custom:hover {
          transform: translateY(-5px);
          border-color: var(--primary-color);
          box-shadow: 0 10px 30px rgba(var(--primary-color-rgb), 0.3);
          background: rgba(var(--primary-color-rgb), 0.1);
        }
        
        .stat-number {
          background: linear-gradient(45deg, var(--primary-color), #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(var(--primary-color-rgb), 0.5);
          font-family: 'Arial', sans-serif;
          font-weight: 800;
        }
        
        .stat-label {
          font-size: 0.95rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .responsibility-item {
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .responsibility-item:hover {
          transform: translateX(5px);
          border-color: var(--primary-color) !important;
          background-color: rgba(var(--primary-color-rgb), 0.1) !important;
        }
        
        .icon-wrapper {
          transition: all 0.3s ease;
        }
        
        .responsibility-item:hover .icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(var(--primary-color-rgb), 0.5);
        }
        
        .responsibilities-section {
          animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .stats-container .col-md-6 {
            margin-bottom: 1rem;
          }
          
          .stat-number {
            font-size: 2rem !important;
          }
          
          .stat-label {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;