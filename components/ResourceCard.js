'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from './ResourceCard.module.css';

export function ResourceCard({ id, title, description, link, delay = 0, initialY = 50 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  
  return (
    <motion.div
      ref={ref}
      className={styles.resourceCard}
      id={id || `resource-${Math.random().toString(36).substring(7)}`}
      initial={{ opacity: 0, y: initialY }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: initialY }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <Link href={link} className={styles.resourceLink}>
        Read the narrative <FaArrowRight className={styles.icon} />
      </Link>
    </motion.div>
  );
}
