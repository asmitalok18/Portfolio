import React from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaCode, 
  FaGitAlt, 
  FaDocker,
  FaTools,
} from 'react-icons/fa';
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiMongodb, 
  SiPostgresql, 
  SiMysql,
  SiTailwindcss,
  SiBootstrap,
  SiGithub,
  SiVercel,
  SiPostman
} from 'react-icons/si';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <FaCode className="fs-1 text-primary-custom" />,
      skills: [
        { name: "React.js", level: 80, icon: <FaReact /> },
        { name: "JavaScript", level: 80, icon: <SiJavascript /> },
        { name: "TypeScript", level: 75, icon: <SiTypescript /> },
        { name: "HTML/CSS", level: 90, icon: <FaCode /> },
        { name: "Tailwind CSS", level: 80, icon: <SiTailwindcss /> },
        { name: "Bootstrap", level: 75, icon: <SiBootstrap /> }
      ]
    },
    {
      title: "Backend Development",
      icon: <FaNodeJs className="fs-1 text-primary-custom" />,
      skills: [
        { name: "Node.js", level: 70, icon: <FaNodeJs /> },
        { name: "Express.js", level: 70, icon: <FaCode /> },
        { name: "Python", level: 80, icon: <SiPython /> },
        { name: "REST APIs", level: 85, icon: <FaCode /> },
        { name: "Django", level: 80, icon: <FaCode /> }
      ]
    },
    {
      title: "Database & DevOps",
      icon: <FaDatabase className="fs-1 text-primary-custom" />,
      skills: [
        { name: "MongoDB", level: 70, icon: <SiMongodb /> },
        { name: "PostgreSQL", level: 75, icon: <SiPostgresql /> },
        { name: "MySQL", level: 85, icon: <SiMysql /> },
        { name: "Docker", level: 50, icon: <FaDocker /> }
        
      ]
    }
  ];

  const tools = [
    { name: "Code Editor", icon: <FaCode /> },
    { name: "Git", icon: <FaGitAlt /> },
    { name: "GitHub", icon: <SiGithub /> },
    { name: "API Testing", icon: <FaTools /> },
    { name: "Vercel", icon: <SiVercel /> },
    { name: "Postman",icon: <SiPostman/>}
  ];

  return (
    <>
      {/* Floating Particles Background */}
      <div className="floating-particles">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      <section id="skills" className="section-padding bg-dark-custom position-relative overflow-hidden">
        <Container>
          {/* Section Header */}
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 
                className="section-title text-center mb-4 animate-fade-in-up" 
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Technical Skills
              </h2>
              <p 
                className="fs-5 text-gray-custom mb-0 animate-fade-in-up"
                data-aos="fade-up" 
                data-aos-delay="200"
                data-aos-duration="800"
              >
                A comprehensive overview of my technical expertise and the tools 
                I use to build exceptional web applications.
              </p>
            </Col>
          </Row>

          {/* Skills Categories */}
          <Row className="g-4 mb-5">
            {skillCategories.map((category, categoryIndex) => (
              <Col lg={4} md={6} key={categoryIndex}>
                <Card 
                  className="card-custom skill-card h-100 animate-skill-card"
                  data-aos="zoom-in"
                  data-aos-delay={categoryIndex * 150}
                  data-aos-duration="600"
                  style={{
                    animationDelay: `${categoryIndex * 0.2}s`
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <div className="category-icon mb-3 animate-bounce-gentle">
                        {category.icon}
                      </div>
                      <h4 className="text-light-custom mb-3 animate-slide-in">
                        {category.title}
                      </h4>
                    </div>
                    
                    <div className="skills-list">
                      {category.skills.map((skill, skillIndex) => (
                        <div 
                          key={skillIndex} 
                          className="mb-3 animate-skill-item"
                          style={{
                            animationDelay: `${(categoryIndex * 0.3) + (skillIndex * 0.1)}s`
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center">
                              <span className="skill-icon me-2 text-primary-custom animate-rotate-gentle">
                                {skill.icon}
                              </span>
                              <span className="text-light-custom fw-medium">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-primary-custom fw-bold animate-count-up">
                              {skill.level}%
                            </span>
                          </div>
                          <ProgressBar className="custom-progress animate-progress-bar">
                            <ProgressBar 
                              now={skill.level} 
                              className="skill-progress-bar animate-fill"
                              style={{ 
                                animationDelay: `${(categoryIndex * 0.5) + (skillIndex * 0.2)}s` 
                              }}
                            />
                          </ProgressBar>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Tools & Technologies */}
          <Row>
            <Col lg={10} className="mx-auto">
              <h3 
                className="text-center text-light-custom mb-4 animate-fade-in-up"
                data-aos="fade-up"
                data-aos-duration="600"
              >
                Tools & Technologies
              </h3>
              <div 
                className="d-flex flex-wrap justify-content-center gap-3"
                data-aos="fade-up" 
                data-aos-delay="300"
                data-aos-duration="800"
              >
                {tools.map((tool, index) => (
                  <div 
                    key={index}
                    className="tool-badge badge-custom px-3 py-2 d-flex align-items-center gap-2 animate-tool-badge"
                    style={{ 
                      animationDelay: `${index * 0.1}s` 
                    }}
                  >
                    <span className="text-primary-custom animate-pulse-gentle">
                      {tool.icon}
                    </span>
                    <span className="text-light-custom">{tool.name}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        /* Floating Particles Enhanced */
        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: linear-gradient(45deg, #64ffda, #00bcd4);
          border-radius: 50%;
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }

        .particle:nth-child(1) { width: 6px; height: 6px; top: 10%; left: 10%; }
        .particle:nth-child(2) { width: 8px; height: 8px; top: 20%; left: 80%; }
        .particle:nth-child(3) { width: 4px; height: 4px; top: 60%; left: 20%; }
        .particle:nth-child(4) { width: 10px; height: 10px; top: 80%; left: 70%; }
        .particle:nth-child(5) { width: 5px; height: 5px; top: 30%; left: 50%; }
        .particle:nth-child(6) { width: 7px; height: 7px; top: 70%; left: 90%; }
        .particle:nth-child(7) { width: 6px; height: 6px; top: 40%; left: 15%; }
        .particle:nth-child(8) { width: 9px; height: 9px; top: 15%; left: 60%; }
        .particle:nth-child(9) { width: 4px; height: 4px; top: 90%; left: 30%; }
        .particle:nth-child(10) { width: 8px; height: 8px; top: 50%; left: 85%; }
        .particle:nth-child(11) { width: 5px; height: 5px; top: 25%; left: 40%; }
        .particle:nth-child(12) { width: 7px; height: 7px; top: 75%; left: 60%; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-15px) rotate(270deg); opacity: 0.9; }
        }

        /* Card Animations */
        .animate-skill-card {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
          animation: slideInScale 0.6s ease-out forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .animate-skill-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(100, 255, 218, 0.2);
        }

        @keyframes slideInScale {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Icon Animations */
        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }

        @keyframes bounceGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-rotate-gentle {
          transition: transform 0.3s ease;
        }

        .animate-rotate-gentle:hover {
          transform: rotate(360deg) scale(1.2);
        }

        /* Progress Bar Animation */
        .animate-progress-bar {
          overflow: hidden;
          position: relative;
        }

        .animate-fill {
          transform: translateX(-100%);
          animation: fillProgress 1.5s ease-out forwards;
        }

        @keyframes fillProgress {
          to {
            transform: translateX(0);
          }
        }

        .animate-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Skill Item Animation */
        .animate-skill-item {
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInLeft 0.5s ease-out forwards;
        }

        @keyframes slideInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Count Up Animation */
        .animate-count-up {
          display: inline-block;
          animation: countUp 0.8s ease-out;
        }

        @keyframes countUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tool Badge Animation */
        .animate-tool-badge {
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          animation: popIn 0.4s ease-out forwards;
          transition: all 0.3s ease;
        }

        .animate-tool-badge:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 20px rgba(100, 255, 218, 0.3);
        }

        @keyframes popIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Pulse Animation for Icons */
        .animate-pulse-gentle {
          animation: pulseGentle 2s ease-in-out infinite;
        }

        @keyframes pulseGentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        /* Fade In Up Animation */
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Slide In Animation */
        .animate-slide-in {
          opacity: 0;
          transform: translateX(-30px);
          animation: slideIn 0.6s ease-out forwards;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Enhanced Hover Effects */
        .skill-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .skill-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .skill-card:hover::before {
          left: 100%;
        }

        /* Mobile Responsive Animations */
        @media (max-width: 768px) {
          .animate-skill-card:hover {
            transform: translateY(-5px) scale(1.01);
          }
          
          .animate-tool-badge:hover {
            transform: translateY(-2px) scale(1.02);
          }
        }
      `}</style>
    </>
  );
};

export default Skills;