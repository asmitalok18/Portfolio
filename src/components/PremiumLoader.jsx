import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = ({ text = "LOADING...", size = 64, textColor = "#a1a1aa" }) => {
  const innerSize = Math.max(12, size * 0.75);
  const borderSize = Math.max(2, size * 0.03);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '30vh', gap: '24px' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            border: `${borderSize}px solid rgba(255, 255, 255, 0.03)`,
            borderTop: `${borderSize}px solid rgba(255, 255, 255, 0.9)`,
            borderRight: `${borderSize}px solid rgba(255, 255, 255, 0.9)`,
            borderRadius: '50%',
            boxShadow: '0 0 24px rgba(255, 255, 255, 0.15)'
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
        <motion.div
          style={{
            position: 'absolute',
            inset: `${(size - innerSize) / 2}px`,
            border: `${borderSize}px solid rgba(255, 255, 255, 0.03)`,
            borderBottom: `${borderSize}px solid rgba(255, 255, 255, 0.5)`,
            borderLeft: `${borderSize}px solid rgba(255, 255, 255, 0.5)`,
            borderRadius: '50%',
          }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
      </div>
      {text && (
        <motion.div 
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", ease: "easeInOut" }}
          style={{ color: textColor, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500 }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};

export const PremiumLoaderButton = ({ size = 24 }) => {
  const innerSize = Math.max(12, size * 0.75);
  const borderSize = 2;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            border: `${borderSize}px solid rgba(255, 255, 255, 0.03)`,
            borderTop: `${borderSize}px solid rgba(255, 255, 255, 0.9)`,
            borderRight: `${borderSize}px solid rgba(255, 255, 255, 0.9)`,
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.15)'
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
        <motion.div
          style={{
            position: 'absolute',
            inset: `${(size - innerSize) / 2}px`,
            border: `${borderSize}px solid rgba(255, 255, 255, 0.03)`,
            borderBottom: `${borderSize}px solid rgba(255, 255, 255, 0.5)`,
            borderLeft: `${borderSize}px solid rgba(255, 255, 255, 0.5)`,
            borderRadius: '50%',
          }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default PremiumLoader;
