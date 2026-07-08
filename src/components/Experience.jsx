import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/Experience.css'

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const Experience = () => {
  const [monthsExperience, setMonthsExperience] = useState(0);
  const [experiences, setExperiences] = useState([]);

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

  useEffect(() => {
    const calculateExperience = () => {
      const startDate = new Date('2024-06-01');
      const currentDate = new Date();
      const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
      const monthDiff = currentDate.getMonth() - startDate.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;
      setMonthsExperience(Math.max(1, totalMonths));
    };
    calculateExperience();
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
          const processed = data.experiences.map(exp => {
            let respArray = [];
            try { respArray = JSON.parse(exp.responsibilities); }
            catch { respArray = Array.isArray(exp.responsibilities) ? exp.responsibilities : [exp.responsibilities]; }
            return { ...exp, responsibilities: respArray };
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
    { value: `${monthsExperience}+`, label: "Months Experience" },
    { value: "15+", label: "Technologies" },
    { value: "7+", label: "Projects Built" },
    { value: "Open", label: "Availability" }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="experience" className="section-padding">
      <Container>
        {/* Section Header */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ color: '#ffffff', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', marginBottom: '16px' }}
            >
              Professional Experience
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ color: '#8f8780', fontSize: '1.05rem', lineHeight: '1.6' }}
            >
              A summary of my professional journey building scalable web applications.
            </motion.p>
          </Col>
        </Row>

        {/* Stats Row */}
        <Row className="g-3 mb-5">
          {stats.map((s, i) => (
            <Col lg={3} md={6} key={i}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.08 } } }}
                className="exp-stat-card"
              >
                <div className="exp-stat-value">{s.value}</div>
                <div className="exp-stat-label">{s.label}</div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Experience Cards with Timeline */}
        <div className="exp-timeline">
          {experiences.map((exp, index) => (
            <motion.div key={index} className="exp-timeline-item"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: index * 0.15 } } }}
            >
              {/* Timeline indicator */}
              <div className="exp-timeline-indicator">
                <div className="exp-timeline-dot" />
                {index < experiences.length - 1 && <div className="exp-timeline-line" />}
              </div>

              {/* Card content */}
              <div className="exp-card">
                <div className="exp-card-header">
                  <div className="exp-card-titles">
                    <h3 className="exp-card-role">{exp.role}</h3>
                    <h4 className="exp-card-company">{exp.company}</h4>
                  </div>
                  <div className="exp-card-meta">
                    <span className="exp-meta-item">
                      <FaCalendarAlt /> {exp.duration}
                    </span>
                    <span className="exp-meta-item">
                      <FaMapMarkerAlt /> {exp.location}
                    </span>
                    <span className="exp-type-badge">{exp.type}</span>
                  </div>
                </div>

                <div className="exp-card-divider" />

                <div className="exp-achievements">
                  <h5 className="exp-achievements-title">Key Achievements</h5>
                  <ul className="exp-achievements-list">
                    {exp.responsibilities && exp.responsibilities.map((item, idx) => (
                      <li key={idx} className="exp-achievement-item">
                        <FaChevronRight className="exp-achievement-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Experience;