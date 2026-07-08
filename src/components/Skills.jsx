import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { 
  FaReact, FaNodeJs, FaDatabase, FaCode, FaGitAlt, FaDocker, FaTools 
} from 'react-icons/fa';
import { 
  SiJavascript, SiTypescript, SiPython, SiMongodb, SiPostgresql, SiMysql,
  SiTailwindcss, SiBootstrap, SiGithub, SiVercel, SiPostman
} from 'react-icons/si';
import { motion } from 'framer-motion';

const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const getIcon = (name) => {
  const icons = {
    FaReact: <FaReact />, FaNodeJs: <FaNodeJs />, FaDatabase: <FaDatabase />,
    FaCode: <FaCode />, FaGitAlt: <FaGitAlt />, FaDocker: <FaDocker />,
    FaTools: <FaTools />, SiJavascript: <SiJavascript />, SiTypescript: <SiTypescript />,
    SiPython: <SiPython />, SiMongodb: <SiMongodb />, SiPostgresql: <SiPostgresql />,
    SiMysql: <SiMysql />, SiTailwindcss: <SiTailwindcss />, SiBootstrap: <SiBootstrap />,
    SiGithub: <SiGithub />, SiVercel: <SiVercel />, SiPostman: <SiPostman />
  };
  return icons[name] || <FaCode />;
};

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [tools, setTools] = useState([]);

  const fallbackCategories = [
    {
      title: "Frontend Development",
      description: "Building responsive, performant UIs",
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
        { name: "Docker", level: 50, icon: <FaDocker /> }
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
            'Database & DevOps': { title: "Database & DevOps", description: "Data storage & deployment", skills: [] }
          };
          data.skills.forEach(s => {
            if (s.category !== 'Tools' && categoriesMap[s.category]) {
              categoriesMap[s.category].skills.push({ name: s.name, level: s.level, icon: getIcon(s.icon) });
            }
          });
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

        {/* Category Cards */}
        <Row className="g-4 mb-5">
          {skillCategories.map((category, ci) => (
            <Col lg={4} md={6} key={ci}>
              <motion.div className="skill-category-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: ci * 0.1 } } }}
              >
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
              </motion.div>
            </Col>
          ))}
        </Row>

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
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          height: 100%;
          transition: all 0.35s ease;
        }
        .skill-category-card:hover {
          border-color: rgba(255,255,255,0.12);
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
          color: #8f8780;
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
          color: #8f8780;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }
        .skill-name {
          color: #fffaf3;
          font-size: 0.88rem;
          font-weight: 500;
        }
        .skill-level {
          color: #8f8780;
          font-size: 0.78rem;
          font-weight: 500;
        }

        /* Progress Bar */
        .skill-bar-track {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6a00, #c2410c);
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #b8afa8;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 500;
          transition: all 0.25s ease;
        }
        .skill-tool-chip:hover {
          border-color: rgba(255,255,255,0.15);
          color: #fffaf3;
        }
        .skill-tool-icon {
          font-size: 0.9rem;
          display: flex;
          color: #8f8780;
        }
      `}</style>
    </section>
  );
};

export default Skills;