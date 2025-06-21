import React, { useEffect } from 'react';

const AnimatedBackground = () => {
  useEffect(() => {
    // Force dark background on component mount
    document.body.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 70%, #0a0a0a 100%)';
    document.documentElement.style.background = '#0a0a0a';
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      {/* Dark Animated Background */}
      <div className="dark-animated-background"></div>
      
      {/* Floating Particles */}
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;