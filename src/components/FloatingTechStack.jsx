// filepath: /home/asmit/Desktop/Projects/portfolio/src/components/FloatingTechStack.jsx
import React, { useEffect, useState } from 'react';

const FloatingTechStack = () => {
  const [techItems, setTechItems] = useState([]);

  const technologies = [
    'React', 'JavaScript', 'Node.js', 'Python', 'MongoDB', 'Express',
    'HTML5', 'CSS3', 'Bootstrap', 'Git', 'Docker', 'AWS',
    'TypeScript', 'Vue.js', 'Angular', 'PHP', 'MySQL', 'Firebase',
    'Next.js', 'Tailwind', 'Redux', 'GraphQL', 'REST API', 'JWT',
    'Webpack', 'Babel', 'Jest', 'Cypress', 'Linux', 'Nginx'
  ];

  const generateTechItem = () => {
    const tech = technologies[Math.floor(Math.random() * technologies.length)];
    const size = Math.random() * 20 + 14;
    const left = Math.random() * 100;
    const delay = Math.random() * 20;
    
    return {
      id: Math.random(),
      text: tech,
      size: size + 'px',
      left: left + '%',
      animationDelay: delay + 's'
    };
  };

  useEffect(() => {
    // Generate initial tech items
    const initialItems = Array.from({ length: 20 }, generateTechItem);
    setTechItems(initialItems);

    // Add new tech items periodically
    const interval = setInterval(() => {
      const newItem = generateTechItem();
      setTechItems(prev => [...prev, newItem]);
      
      // Remove old items to prevent memory leak
      setTimeout(() => {
        setTechItems(prev => prev.filter(item => item.id !== newItem.id));
      }, 25000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-tech-container">
      {techItems.map(item => (
        <div
          key={item.id}
          className="tech-item"
          style={{
            fontSize: item.size,
            left: item.left,
            animationDelay: item.animationDelay
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default FloatingTechStack;