import React from 'react';
import { motion } from 'framer-motion';
import '../styles/About.css';
import '../styles/custom.css';

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="about-blueprint" id="about">
      <div className="about-blueprint-glow"></div>

      <div className="about-blueprint-container">
        <motion.div 
          className="about-story"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          <motion.span variants={fadeUp} className="about-kicker">ABOUT ME</motion.span>

          <motion.h2 variants={fadeUp}>
            My work runs on<br />
            consistency, clarity,<br />
            and clean engineering.
          </motion.h2>

          <motion.p variants={fadeUp}>
            I’m a Full Stack Developer focused on building scalable, user-centric
            web applications that feel simple on the surface and reliable underneath.
          </motion.p>

          <motion.p variants={fadeUp}>
            I work across frontend, backend, APIs, and databases — connecting
            product thinking with clean implementation so features are not just
            built, but shipped with purpose.
          </motion.p>

          <motion.div variants={fadeUp} className="about-proof-chips">
            <span><i></i>1.5+ Years Experience</span>
            <span><i></i>Full Stack Development</span>
            <span><i></i>User-Centric Products</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="blueprint-panel"
          initial={{ opacity: 0.2, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="blueprint-topbar">
            <div className="window-dots">
              <span></span><span></span><span></span>
            </div>
            <strong>asmit.workflow.ts</strong>
            <em>active</em>
          </div>

          <div className="blueprint-steps">
            <div className="blueprint-line"></div>

            <div className="blueprint-step">
              <span className="step-no">01</span>
              <div>
                <h3>Think</h3>
                <p>Understand the user, product goal, and real problem.</p>
              </div>
            </div>

            <div className="blueprint-step">
              <span className="step-no">02</span>
              <div>
                <h3>Design</h3>
                <p>Create clear interfaces, flows, and component systems.</p>
              </div>
            </div>

            <div className="blueprint-step">
              <span className="step-no">03</span>
              <div>
                <h3>Build</h3>
                <p>Develop frontend, backend, APIs, and database logic.</p>
              </div>
            </div>

            <div className="blueprint-step">
              <span className="step-no">04</span>
              <div>
                <h3>Ship</h3>
                <p>Test, refine, deploy, and keep it maintainable.</p>
              </div>
            </div>
          </div>

          <div className="architecture-flow">
            <span>Frontend</span>
            <i></i>
            <span>API Layer</span>
            <i></i>
            <span>Database</span>
            <i></i>
            <span>Deploy</span>
          </div>

          <div className="blueprint-footer">
            consistent • scalable • production-ready
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;