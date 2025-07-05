'use client';

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaTimesCircle, FaCheckCircle, FaSync } from 'react-icons/fa';
import styles from './EnvCheck.module.css';

/**
 * Environment Check component that verifies API connections
 * Useful for debugging connection issues
 */
export default function EnvCheck() {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  
  const checkEnvironment = async () => {
    try {
      setStatus('checking');
      
      // Test Airtable connection
      const response = await fetch('/api/admin/system-check');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check environment');
      }
      
      setDetails(data);
      setStatus(data.airtableConnected ? 'connected' : 'disconnected');
      setError(data.airtableError);
    } catch (err) {
      console.error('Error checking environment:', err);
      setStatus('error');
      setError(err.message);
    }
  };
  
  useEffect(() => {
    checkEnvironment();
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.statusIndicator}>
        {status === 'checking' && (
          <FaSync className={`${styles.icon} ${styles.iconChecking} ${styles.spinning}`} />
        )}
        {status === 'connected' && (
          <FaCheckCircle className={`${styles.icon} ${styles.iconSuccess}`} />
        )}
        {status === 'disconnected' && (
          <FaExclamationTriangle className={`${styles.icon} ${styles.iconWarning}`} />
        )}
        {status === 'error' && (
          <FaTimesCircle className={`${styles.icon} ${styles.iconError}`} />
        )}
        
        <div className={styles.statusText}>
          {status === 'checking' && 'Checking environment...'}
          {status === 'connected' && 'Connected to Airtable'}
          {status === 'disconnected' && 'Disconnected from Airtable'}
          {status === 'error' && 'Error checking environment'}
        </div>
      </div>
      
      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className={styles.details}>
        {details && (
          <>
            <div className={styles.detailItem}>
              <span className={styles.label}>Mock Data:</span> 
              <span className={`${styles.value} ${details.environment?.mockDataEnabled ? styles.warning : styles.success}`}>
                {details.environment?.mockDataEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.label}>Airtable Config:</span> 
              <span className={`${styles.value} ${details.environment?.hasAirtableConfig ? styles.success : styles.error}`}>
                {details.environment?.hasAirtableConfig ? 'Configured' : 'Missing'}
              </span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.label}>Auth Config:</span> 
              <span className={`${styles.value} ${details.environment?.hasAuthConfig ? styles.success : styles.error}`}>
                {details.environment?.hasAuthConfig ? 'Configured' : 'Missing'}
              </span>
            </div>
            
            {details.airtableDetails && (
              <div className={styles.tableStatus}>
                <h4>Table Status</h4>
                <ul>
                  {Object.entries(details.airtableDetails.tables).map(([table, status]) => (
                    <li key={table} className={status.exists ? styles.tableExists : styles.tableMissing}>
                      {table}: {status.exists ? `${status.recordCount} records` : 'Not found'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      
      <button 
        className={styles.retryButton}
        onClick={checkEnvironment}
        disabled={status === 'checking'}
      >
        <FaSync className={status === 'checking' ? styles.spinning : ''} /> 
        Recheck Connection
      </button>
    </div>
  );
}
