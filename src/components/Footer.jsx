import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark py-4">
      <Container>
        <Row>
          <Col lg={12} className="text-center">
            <p className="text-gray mb-2">
              &copy; 2025 Asmit Alok. All rights reserved.
            </p>
            {/* <p className="text-gray mb-0">
              Made with <FaHeart className="text-danger mx-1" /> using <FaReact className="text-primary-custom mx-1" /> 
            </p> */}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;