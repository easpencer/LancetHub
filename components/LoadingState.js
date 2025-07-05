'use client';

import { motion } from 'framer-motion';
import styles from './LoadingState.module.css';

/**
 * Enhanced loading component with customizable appearance and animation
 * 
 * @param {Object} props
 * @param {string} props.message - Primary loading message
 * @param {string} props.submessage - Additional context for loading process
 * @param {string} props.size - Size of the loader ('small', 'medium', 'large')
 * @param {string} props.type - Type of loading animation ('spinner', 'dots', 'pulse')
 * @param {boolean} props.fullPage - Whether to take up the full page height
 */
export default function LoadingState({ 
  message = "Loading...", 
  submessage = "", 
  size = "medium", 
  type = "spinner",
  fullPage = false
}) {
  // Size classes
  const sizeClass = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge
  }[size] || styles.sizeMedium;
  
  // Different loading animations
  const renderLoader = () => {
    switch(type) {
      case 'dots':
        return (
          <div className={`${styles.dotsLoader} ${sizeClass}`}>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
            />
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
            />
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
            />
          </div>
        );
        
      case 'pulse':
        return (
          <motion.div
            className={`${styles.pulseLoader} ${sizeClass}`} 
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        );
        
      case 'spinner':
      default:
        return <div className={`${styles.spinner} ${sizeClass}`} />;
    }
  };
  
  return (
    <div className={`${styles.loadingContainer} ${fullPage ? styles.fullPage : ''}`}>
      {renderLoader()}
      {message && <h2 className={styles.loadingMessage}>{message}</h2>}
      {submessage && <p className={styles.loadingSubmessage}>{submessage}</p>}
    </div>
  );
}
