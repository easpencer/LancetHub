'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import styles from './error.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.errorCard}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h1>Something went wrong</h1>
        <p className={styles.message}>
          We apologize for the inconvenience. An error has occurred while processing your request.
        </p>
        
        <div className={styles.errorDetails}>
          <details>
            <summary>Technical Details</summary>
            <pre>{error?.message || 'Unknown error'}</pre>
          </details>
        </div>
        
        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryButton}>
            <FaRedo /> Try Again
          </button>
          <Link href="/" className={styles.secondaryButton}>
            <FaHome /> Return to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
