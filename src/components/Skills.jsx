import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { 
  FaReact, FaNodeJs, FaDatabase, FaCode, FaGitAlt, FaDocker, FaTools, FaAws,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { 
  SiJavascript, SiTypescript, SiPython, SiMongodb, SiPostgresql, SiMysql,
  SiTailwindcss, SiGithub, SiVercel, SiPostman, SiAngular
} from 'react-icons/si';
import { motion } from 'framer-motion';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const getIcon = (name) => {
  const icons = {
    FaReact: <FaReact />, FaNodeJs: <FaNodeJs />, FaDatabase: <FaDatabase />,
    FaCode: <FaCode />, FaGitAlt: <FaGitAlt />, FaDocker: <FaDocker />,
    FaTools: <FaTools />, SiJavascript: <SiJavascript />, SiTypescript: <SiTypescript />,
    SiPython: <SiPython />, SiMongodb: <SiMongodb />, SiPostgresql: <SiPostgresql />,
    SiMysql: <SiMysql />, SiTailwindcss: <SiTailwindcss />, SiAngular: <SiAngular />,
    SiGithub: <SiGithub />, SiVercel: <SiVercel />, SiPostman: <SiPostman />,
    FaAws: <FaAws />
  };
  return icons[name] || <FaCode />;
};

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [tools, setTools] = useState([]);

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

  const maxIndex = Math.max(0, skillCategories.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? prev : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  };



  const activeDotIndex = currentIndex;
  const extendedCategories = skillCategories;

  const fallbackCategories = [
    {
      title: "Frontend Development",
      description: "Building responsive, performant UIs",
      skills: [
        { name: "React.js", level: 90, icon: <FaReact /> },
        { name: "JavaScript", level: 90, icon: <SiJavascript /> },
        { name: "TypeScript", level: 75, icon: <SiTypescript /> },
        { name: "HTML/CSS", level: 95, icon: <FaCode /> },
        { name: "Tailwind CSS", level: 85, icon: <SiTailwindcss /> },
        { name: "Angular", level: 60, icon: <SiAngular /> }
      ]
    },
    {
      title: "Backend Development",
      description: "Server-side logic & API design",
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
      description: "Data storage & deployment",
      skills: [
        { name: "MongoDB", level: 70, icon: <SiMongodb /> },
        { name: "PostgreSQL", level: 75, icon: <SiPostgresql /> },
        { name: "MySQL", level: 85, icon: <SiMysql /> },
        { name: "Docker", level: 50, icon: <FaDocker /> },
        { name: "AWS", level: 60, icon: <FaAws /> },
        { name: "CI/CD", level: 70, icon: <FaTools /> },
        { name: "Chroma DB", level: 60, icon: <FaDatabase /> }
      ]
    },
    {
      title: "AI",
      description: "Artificial Intelligence & LLMs",
      skills: [
        { name: "Vector Database", level: 55, icon: <FaDatabase /> },
        { name: "RAG", level: 60, icon: <FaCode /> },
        { name: "GENAI", level: 50, icon: <FaCode /> },
        { name: "Open AI", level: 60, icon: <FaCode /> }
      ]
    }
  ];

  const fallbackTools = [
    { name: "VS Code", icon: <FaCode /> },
    { name: "Git", icon: <FaGitAlt /> },
    { name: "GitHub", icon: <SiGithub /> },
    { name: "Postman", icon: <SiPostman /> },
    { name: "Vercel", icon: <SiVercel /> },
    { name: "Docker", icon: <FaDocker /> }
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/portfolio-data/`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (data.skills && data.skills.length > 0) {
          const fetchedTools = data.skills
            .filter(s => s.category === 'Tools')
            .map(s => ({ name: s.name, icon: getIcon(s.icon) }));
          const categoriesMap = {
            'Frontend Development': { title: "Frontend Development", description: "Building responsive, performant UIs", skills: [] },
            'Backend Development': { title: "Backend Development", description: "Server-side logic & API design", skills: [] },
            'Database & DevOps': { title: "Database & DevOps", description: "Data storage & deployment", skills: [] },
            'AI': { title: "AI", description: "Artificial Intelligence & LLMs", skills: [] }
          };
          
          data.skills.forEach(s => {
            if (s.name.toLowerCase() === 'bootstrap') return; // Strip Bootstrap
            if (s.category !== 'Tools' && categoriesMap[s.category]) {
              categoriesMap[s.category].skills.push({ name: s.name, level: s.level, icon: getIcon(s.icon) });
            }
          });

          // Inject mandatory overrides
          const injectSkill = (cat, name, level, iconNode) => {
              const catObj = categoriesMap[cat];
              if (!catObj) return;
              const existing = catObj.skills.find(s => s.name.toLowerCase() === name.toLowerCase());
              if (existing) {
                  existing.level = level;
                  existing.icon = iconNode;
              } else {
                  catObj.skills.push({ name, level, icon: iconNode });
              }
          };

          injectSkill('Frontend Development', 'Angular', 60, getIcon('SiAngular'));
          injectSkill('Database & DevOps', 'AWS', 60, getIcon('FaAws'));
          injectSkill('Database & DevOps', 'CI/CD', 70, getIcon('FaTools'));
          injectSkill('Database & DevOps', 'Chroma DB', 60, getIcon('FaDatabase'));
          
          injectSkill('AI', 'Vector Database', 55, getIcon('FaDatabase'));
          injectSkill('AI', 'RAG', 60, getIcon('FaCode'));
          injectSkill('AI', 'GENAI', 50, getIcon('FaCode'));
          injectSkill('AI', 'Open AI', 60, getIcon('FaCode'));

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

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="skills" className="section-padding position-relative overflow-hidden">
      <Container>
        {/* Section Header */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ color: '#ffffff', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', marginBottom: '16px' }}
            >
              Technical Skills
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ color: '#8f8780', fontSize: '1.05rem', lineHeight: '1.6' }}
            >
              A comprehensive overview of my technical expertise and the tools I use to build exceptional web applications.
            </motion.p>
          </Col>
        </Row>

        {/* Category Carousel */}
        <div className="skills-carousel-wrapper" style={{ overflow: 'hidden', width: '100%', marginBottom: '48px', padding: '10px 0' }}>
          <div 
            className="skills-carousel-track"
            style={{ 
              display: 'flex', 
              gap: '24px',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * (24 / itemsPerView)}px))`
            }}
          >
            {skillCategories.map((category, ci) => (
              <div 
                key={ci} 
                style={{ flex: `0 0 calc(${100 / itemsPerView}% - ${24 * (itemsPerView - 1) / itemsPerView}px)` }}
              >
                <div className="skill-category-card">
                  <div className="skill-cat-header">
                    <h4 className="skill-cat-title">{category.title}</h4>
                    {category.description && (
                      <p className="skill-cat-desc">{category.description}</p>
                    )}
                  </div>

                  <div className="skill-cat-list">
                    {category.skills.map((skill, si) => (
                      <div key={si} className="skill-row">
                        <div className="skill-row-top">
                          <div className="skill-name-group">
                            <span className="skill-icon-sm">{skill.icon}</span>
                            <span className="skill-name">{skill.name}</span>
                          </div>
                          <span className="skill-level">{skill.level}%</span>
                        </div>
                        <div className="skill-bar-track">
                          <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          {skillCategories.length > itemsPerView && (
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

        {/* Core Stack Cloud */}
        <Row>
          <Col lg={10} className="mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center"
            >
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>
                Tools &amp; Technologies
              </h3>
              <div className="skill-tools-cloud">
                {tools.map((tool, i) => (
                  <span key={i} className="skill-tool-chip">
                    <span className="skill-tool-icon">{tool.icon}</span>
                    {tool.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style>{`
        /* Category Card */
        .skill-category-card {
          background: rgba(220, 232, 245, 0.02);
          border: 1px solid rgba(220, 232, 245, 0.06);
          border-radius: 16px;
          padding: 28px;
          height: 100%;
          transition: all 0.35s ease;
        }
        .skill-category-card:hover {
          border-color: rgba(220, 232, 245, 0.12);
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .skill-cat-header { margin-bottom: 24px; }
        .skill-cat-title {
          color: #ffffff;
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .skill-cat-desc {
          color: #aebdcc;
          font-size: 0.82rem;
          margin-bottom: 0;
        }

        .skill-cat-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skill-row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .skill-name-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .skill-icon-sm {
          color: #aebdcc;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }
        .skill-name {
          color: #f5f7fa;
          font-size: 0.88rem;
          font-weight: 500;
        }
        .skill-level {
          color: #aebdcc;
          font-size: 0.78rem;
          font-weight: 500;
        }

        /* Progress Bar */
        .skill-bar-track {
          height: 4px;
          background: rgba(220, 232, 245, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #aebdcc, rgba(220, 232, 245, 0.3));
          border-radius: 4px;
          transition: width 0.8s ease;
        }

        /* Tool Chips */
        .skill-tools-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .skill-tool-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(220, 232, 245, 0.03);
          border: 1px solid rgba(220, 232, 245, 0.06);
          color: #cbd5df;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 500;
          transition: all 0.25s ease;
        }
        .skill-tool-chip:hover {
          border-color: rgba(220, 232, 245, 0.15);
          color: #ffffff;
        }
        .skill-tool-icon {
          font-size: 0.9rem;
          display: flex;
          color: #aebdcc;
        }

        /* Carousel Controls */
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

export default Skills;