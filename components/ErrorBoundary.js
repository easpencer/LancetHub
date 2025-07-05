'use client';

import { useState } from 'react';
import { FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';
import styles from './ErrorBoundary.module.css';

/**
 * Custom error boundary component for production use
 * Provides error recovery options and user-friendly messages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Function} props.fallback - Optional custom fallback component
 */
export default function ErrorBoundary({ children, fallback }) {
  // By default no error
  const [error, setError] = useState(null);
  
  // If a client-side error occurs, this will be triggered
  if (error) {
    // Use custom fallback if provided
    if (fallback) {
      return fallback({ error, reset: () => setError(null) });
    }
    
    // Default error UI
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2>Something went wrong</h2>
          <p className={styles.errorMessage}>
            We apologize for the inconvenience. An error occurred while loading this content.
          </p>
          <div className={styles.actions}>
            <button 
              onClick={() => window.location.reload()}
              className={styles.primaryButton}
            >
              <FaRedoAlt /> Reload Page
            </button>
            <button
              onClick={() => setError(null)}
              className={styles.secondaryButton}
            >
              Try Again
            </button>
          </div>
          <div className={styles.errorDetails}>
            <details>
              <summary>Technical Details</summary>
              <pre>{error.toString()}</pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  // If no error, render children inside an error boundary 
  return (
    <div
      onError={(e) => {
        e.preventDefault();
        setError(e.error);
      }}
    >
      {children}
    </div>
  );
}
