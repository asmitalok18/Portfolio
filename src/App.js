import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import './styles/custom.css'

import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import PortfolioManagement from './components/PortfolioManagement';

// Main Portfolio Component
const Portfolio = () => (
  <>
    <AnimatedBackground />
    <Header />
    <Hero />
    <About />
    <Experience />
    <Skills />
    <Projects />
    <Contact />
    <Footer />
    <AIAssistant />
  </>
);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin-portfolio-management-secure" element={<PortfolioManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;