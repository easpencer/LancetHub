'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import Link from 'next/link';

const containerStyle = {
  width: '100%',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem'
};

const errorCardStyle = {
  backgroundColor: '#1a1a1a',
  padding: '3rem',
  borderRadius: '12px',
  maxWidth: '600px',
  width: '100%',
  textAlign: 'center',
  border: '1px solid #333'
};

const errorIconStyle = {
  color: '#ff3b5c',
  fontSize: '4rem',
  marginBottom: '2rem'
};

const messageStyle = {
  color: '#cccccc',
  fontSize: '1.2rem',
  lineHeight: '1.6',
  marginBottom: '2rem'
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  flexWrap: 'wrap'
};

const primaryButtonStyle = {
  backgroundColor: '#0066cc',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '25px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const secondaryButtonStyle = {
  backgroundColor: 'transparent',
  color: '#cccccc',
  padding: '0.75rem 1.5rem',
  borderRadius: '25px',
  textDecoration: 'none',
  border: '1px solid #cccccc',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <motion.div 
      style={containerStyle}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={errorCardStyle}>
        <FaExclamationTriangle style={errorIconStyle} />
        <h1 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Something went wrong</h1>
        <p style={messageStyle}>
          We apologize for the inconvenience. An error has occurred while processing your request.
        </p>
        
        <div style={actionsStyle}>
          <button onClick={reset} style={primaryButtonStyle}>
            <FaRedo /> Try Again
          </button>
          <Link href="/" style={secondaryButtonStyle}>
            <FaHome /> Return to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
