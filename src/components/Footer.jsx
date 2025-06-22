import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark py-4">
      <Container>
        <Row>
          <Col lg={12} className="text-center">
            <p className="text-gray mb-0">
              &copy; 2025 Asmit Alok. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;