'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import styles from './error.module.css';

export default function NotFound() {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.errorCard}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h1>404 - Page Not Found</h1>
        <p className={styles.message}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className={styles.suggestions}>
          <p>You might want to:</p>
          <ul>
            <li>Check the URL for typos</li>
            <li>Return to the homepage</li>
            <li>Go back to the previous page</li>
          </ul>
        </div>
        
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <FaHome /> Return to Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className={styles.secondaryButton}
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}
