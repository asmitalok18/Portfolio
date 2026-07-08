import React, { useEffect } from 'react';

const AnimatedBackground = () => {
  useEffect(() => {
    document.body.style.background = 'radial-gradient(circle at 58% 8%, rgba(255, 106, 0, 0.10), transparent 34%), radial-gradient(circle at 82% 38%, rgba(120, 53, 15, 0.08), transparent 28%), radial-gradient(circle at 16% 22%, rgba(255, 150, 60, 0.05), transparent 26%), linear-gradient(135deg, #050302 0%, #0a0504 38%, #100a06 72%, #050302 100%)';
    document.body.style.color = '#fffaf3';
    document.documentElement.style.background = '#050302';

    return () => {};
  }, []);

  return (
    <div className="dark-animated-background"></div>
  );
};

export default AnimatedBackground;