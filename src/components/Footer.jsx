import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #030406 0%, #0a0c10 100%)',
      borderTop: '1px solid rgba(220, 232, 245, 0.05)',
      padding: '40px 0 20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '60%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(220, 232, 245, 0.2), transparent)',
        transform: 'translateX(-50%)'
      }} />

      <Container>
        <Row>
          <Col lg={12} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif', 
                color: '#ffffff', 
                fontSize: '1.5rem',
                marginBottom: '20px',
                fontWeight: 600,
                letterSpacing: '-0.02em'
              }}>
                &lt;Asmit Alok/&gt;
              </h3>
              <div style={{ 
                height: '1px', 
                width: '40px', 
                background: 'linear-gradient(90deg, transparent, #aebdcc, transparent)', 
                margin: '0 auto 20px auto' 
              }} />
              <p style={{ 
                color: 'rgba(235, 240, 246, 0.5)', 
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                marginBottom: 0,
                textTransform: 'uppercase'
              }}>
                &copy; {new Date().getFullYear()} ASMIT ALOK. ALL RIGHTS RESERVED.
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;