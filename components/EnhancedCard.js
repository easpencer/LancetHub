'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './EnhancedCard.module.css';

export function EnhancedCard({ 
  children, 
  className = '', 
  variant = 'default', 
  hoverEffect = true,
  delay = 0,
  initialInView = false
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getVariantStyles = () => {
    switch(variant) {
      case 'gradient':
        return styles.gradientCard;
      case 'accent':
        return styles.accentCard;
      case 'outline':
        return styles.outlineCard;
      case 'minimal':
        return styles.minimalCard;
      default:
        return '';
    }
  };

  return (
    <motion.div
      className={`${styles.card} ${getVariantStyles()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hoverEffect ? { 
        y: -8, 
        boxShadow: '0 15px 30px rgba(0,0,0,0.25), 0 10px 15px rgba(0,0,0,0.15)', 
        transition: { duration: 0.3 } 
      } : {}}
    >
      <div className={`${styles.cardContent} ${isHovered ? styles.hovered : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}
