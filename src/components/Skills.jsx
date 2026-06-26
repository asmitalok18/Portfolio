import React, { useState, useEffect } from 'react';
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

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const getIcon = (name) => {
  const icons = {
    FaReact: <FaReact />,
    FaNodeJs: <FaNodeJs />,
    FaDatabase: <FaDatabase />,
    FaCode: <FaCode />,
    FaGitAlt: <FaGitAlt />,
    FaDocker: <FaDocker />,
    FaTools: <FaTools />,
    SiJavascript: <SiJavascript />,
    SiTypescript: <SiTypescript />,
    SiPython: <SiPython />,
    SiMongodb: <SiMongodb />,
    SiPostgresql: <SiPostgresql />,
    SiMysql: <SiMysql />,
    SiTailwindcss: <SiTailwindcss />,
    SiBootstrap: <SiBootstrap />,
    SiGithub: <SiGithub />,
    SiVercel: <SiVercel />,
    SiPostman: <SiPostman />
  };
  return icons[name] || <FaCode />;
};

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [tools, setTools] = useState([]);

  // Static Fallbacks
  const fallbackCategories = [
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

  const fallbackTools = [
    { name: "Code Editor", icon: <FaCode /> },
    { name: "Git", icon: <FaGitAlt /> },
    { name: "GitHub", icon: <SiGithub /> },
    { name: "API Testing", icon: <FaTools /> },
    { name: "Vercel", icon: <SiVercel /> },
    { name: "Postman", icon: <SiPostman /> }
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/portfolio-data/`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.skills && data.skills.length > 0) {
          // Process skills into categories & tools
          const fetchedTools = data.skills
            .filter(s => s.category === 'Tools')
            .map(s => ({ name: s.name, icon: getIcon(s.icon) }));
          
          const categoriesMap = {
            'Frontend Development': {
              title: "Frontend Development",
              icon: <FaCode className="fs-1 text-primary-custom" />,
              skills: []
            },
            'Backend Development': {
              title: "Backend Development",
              icon: <FaNodeJs className="fs-1 text-primary-custom" />,
              skills: []
            },
            'Database & DevOps': {
              title: "Database & DevOps",
              icon: <FaDatabase className="fs-1 text-primary-custom" />,
              skills: []
            }
          };

          data.skills.forEach(s => {
            if (s.category !== 'Tools' && categoriesMap[s.category]) {
              categoriesMap[s.category].skills.push({
                name: s.name,
                level: s.level,
                icon: getIcon(s.icon)
              });
            }
          });

          // Convert back to array
          const finalCategories = Object.values(categoriesMap).filter(cat => cat.skills.length > 0);
          
          setSkillCategories(finalCategories.length > 0 ? finalCategories : fallbackCategories);
          setTools(fetchedTools.length > 0 ? fetchedTools : fallbackTools);
        } else {
          setSkillCategories(fallbackCategories);
          setTools(fallbackTools);
        }
      } catch (error) {
        console.error('Failed to load dynamic skills, using defaults:', error);
        setSkillCategories(fallbackCategories);
        setTools(fallbackTools);
      }
    };

    fetchSkills();
  }, []);

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
      `}</style>
    </>
  );
};

export default Skills;