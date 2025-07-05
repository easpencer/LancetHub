'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './AnimatedSection.module.css';

/**
 * AnimatedSection - A reusable component that animates its children when they enter the viewport
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be animated
 * @param {string} props.type - Animation type: 'fade', 'slide', 'scale', 'stagger'
 * @param {number} props.threshold - Intersection observer threshold (0-1)
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.className - Additional CSS class
 * @param {number} props.staggerDelay - Delay between children animations for stagger type
 * @param {string} props.direction - Direction for slide animations: 'up', 'down', 'left', 'right'
 * @param {string} props.tag - HTML element to render (div, section, etc.)
 */
export function AnimatedSection({
  children,
  type = 'fade',
  threshold = 0.2,
  delay = 0,
  duration = 0.7,
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  tag = 'div'
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [childElements, setChildElements] = useState([]);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          if (type === 'stagger') {
            // Get direct child elements for stagger animation
            const children = Array.from(ref.current.children);
            setChildElements(children);
          }
          
          // Unobserve after becoming visible
          observer.unobserve(ref.current);
        }
      },
      { threshold }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, type]);

  // Define animation variants based on type
  const getAnimationVariants = () => {
    switch (type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { 
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1]
            } 
          }
        };
      
      case 'slide':
        const getDirectionProps = () => {
          switch (direction) {
            case 'up': return { y: 50 };
            case 'down': return { y: -50 };
            case 'left': return { x: 50 };
            case 'right': return { x: -50 };
            default: return { y: 50 };
          }
        };
        
        return {
          hidden: { opacity: 0, ...getDirectionProps() },
          visible: { 
            opacity: 1, 
            x: 0, 
            y: 0, 
            transition: { 
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1]
            } 
          }
        };
      
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { 
              duration,
              delay,
              ease: [0.34, 1.56, 0.64, 1] // Spring-like effect
            } 
          }
        };
        
      case 'stagger':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
        
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  // For stagger animations
  if (type === 'stagger' && isVisible) {
    const staggerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * staggerDelay + delay,
          duration,
          ease: [0.25, 0.1, 0.25, 1]
        }
      })
    };
    
    return (
      <div ref={ref} className={`${styles.animatedSection} ${styles[type]} ${className}`}>
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
            className={styles.staggerItem}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  // For other animation types
  const Component = motion[tag];
  
  return (
    <Component
      ref={ref}
      className={`${styles.animatedSection} ${styles[type]} ${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={getAnimationVariants()}
    >
      {children}
    </Component>
  );
}

export default AnimatedSection;
