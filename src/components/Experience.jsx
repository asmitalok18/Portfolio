import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import '../styles/Experience.css';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const AnimatedCounter = ({ value, isFloat = false }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }
    const duration = 2000; 
    const stepTime = 50;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  
  const displayValue = isFloat ? count.toFixed(1).replace('.0', '') : Math.ceil(count);
  return <>{displayValue}</>;
};

const Experience = () => {
  const { experiences: contextExperiences, projects, skills } = usePortfolioData();
  const [yearsExperience, setYearsExperience] = useState(0);
  const [experiences, setExperiences] = useState([]);
  const [totalProjects, setTotalProjects] = useState(7);
  const [totalTech, setTotalTech] = useState(15);

  const fallbackExperiences = [
    {
      role: "Associate Consultant L1 - Frontend Development",
      company: "Oodles Technologies",
      location: "Gurugram, India",
      duration: "Feb 2025 – Present",
      type: "Current",
      label: "CURRENT",
      mission: "Building production-ready GenAI workflows, frontend architecture, Django API integrations, and automated reporting experiences.",
      impacts: [
        { text: "Built Angular 18+ GenAI application interfaces with reusable component architecture." },
        { text: "Integrated Django APIs for file queries, reports, and analytics workflows." },
        { text: "Implemented automated PDF and PowerPoint report generation using jsPDF and PPTXGenJS." },
        { text: "Delivered file upload, query processing, visualization, and structured API response experiences." }
      ],
      tech: ["Angular", "TypeScript", "NgRx", "Django", "DRF", "Python", "REST APIs", "jsPDF", "PPTXGenJS"]
    },
    {
      role: "Software Developer Intern",
      company: "Akshar Consultancy Services Pvt. Ltd.",
      location: "India",
      duration: "Jun 2024 – Dec 2024",
      type: "Internship",
      label: "PREVIOUS",
      mission: "Worked across frontend and backend to build responsive interfaces, REST APIs, authentication flows, and deployment-ready features.",
      impacts: [
        { text: "Built responsive React and Tailwind interfaces for production web applications." },
        { text: "Integrated Node.js, Express, MongoDB, and JWT authentication flows." },
        { text: "Improved backend response handling and database query performance." },
        { text: "Worked in Agile workflow with debugging, code reviews, and deployment support." }
      ],
      tech: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "JWT", "AWS", "Git"]
    }
  ];

  useEffect(() => {
    const calculateExperience = () => {
      const startDate = new Date('2024-06-01');
      const currentDate = new Date();
      const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
      const monthDiff = currentDate.getMonth() - startDate.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;
      const years = Math.floor(totalMonths / 6) * 0.5;
      setYearsExperience(Math.max(1, years));
    };
    calculateExperience();
  }, []);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setTotalProjects(projects.length);
    }
    if (skills && skills.length > 0) {
      setTotalTech(skills.length);
    }

    if (contextExperiences && contextExperiences.length > 0) {
      const processed = contextExperiences.map((exp, index) => {
        const respArray = Array.isArray(exp.responsibilities) ? exp.responsibilities : [];
        const impacts = respArray.map((text) => ({ text })).slice(0, 4);
        
        let techArray = Array.isArray(exp.technologies) ? exp.technologies : [];
        if (techArray.length === 0) {
          techArray = ["React", "Django", "APIs"];
        }

        return {
          ...exp,
          impacts,
          tech: techArray,
          label: index === 0 ? "CURRENT" : "PREVIOUS",
          type: index === 0 ? "Current" : exp.type || "Previous",
          mission: "Worked across full-stack development to build and deliver production-ready features."
        };
      });
      setExperiences(processed);
    } else {
      setExperiences(fallbackExperiences);
    }
  }, [contextExperiences, projects, skills]);

  return (
    <section className="experience-editorial" id="experience">
      <div className="experience-bg-glow" />

      <div className="experience-editorial-container">
        <div className="experience-editorial-top">
          <div className="experience-title-block">
            <span className="experience-kicker">PROFESSIONAL EXPERIENCE</span>
            <h2>Where consistency became shipped work.</h2>
            <p>
              A career timeline focused on production impact, systems built, and real delivery.
            </p>
          </div>

          <div className="experience-stats-panel">
            <div>
              <strong><AnimatedCounter value={yearsExperience} isFloat={true} />+</strong>
              <span>Years Experience</span>
            </div>
            <div>
              <strong><AnimatedCounter value={totalTech} />+</strong>
              <span>Technologies</span>
            </div>
            <div>
              <strong><AnimatedCounter value={totalProjects} />+</strong>
              <span>Projects Built</span>
            </div>
          </div>
        </div>

        <div className="experience-entries">
          {experiences.map((exp, index) => (
            <article className={`experience-entry ${index === 0 ? 'current' : ''}`} key={index}>
              <div className="experience-rail">
                <span className={`rail-node ${index === 0 ? 'active' : ''}`}></span>
                {index !== experiences.length - 1 && <span className="rail-line"></span>}
              </div>

              <div className="experience-meta">
                <p>{exp.duration}</p>
                <span>{exp.type}</span>
                <small>{exp.location}</small>
              </div>

              <div className="experience-role">
                <h3>{exp.role}</h3>
                <a>{exp.company}</a>
                <p>{exp.mission}</p>

                <div className="experience-tech">
                  {exp.tech && exp.tech.map((t, i) => (
                    <span key={i}>{t.trim()}</span>
                  ))}
                </div>
              </div>

              <ul className="experience-impact">
                {exp.impacts && exp.impacts.map((impact, i) => (
                  <li key={i}>{impact.text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;