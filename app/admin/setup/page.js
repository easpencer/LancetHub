'use client';

import { useState, useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaDatabase, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import styles from './setup.module.css';

function AdminSetupContent() {
  const sessionData = useSession();
  const { data: session, status } = sessionData || { data: null, status: 'loading' };
  const router = useRouter();
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    checkSystemStatus();
  }, [session, status, router]);

  const checkSystemStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/system-check');
      if (!response.ok) {
        throw new Error('Failed to check system status');
      }
      
      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      console.error('Error checking system status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <h2>Checking system status...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>System Check Failed</h2>
        <p>{error}</p>
        <button onClick={checkSystemStatus} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/dashboard" className={styles.backLink}>
          ê Back to Dashboard
        </Link>
        <h1>System Setup & Status</h1>
        <p>Check your system configuration and connectivity</p>
      </header>

      <div className={styles.content}>
        <div className={styles.statusSection}>
          <h2>System Status</h2>
          
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <FaDatabase className={styles.statusIcon} />
                <h3>Airtable Connection</h3>
              </div>
              <div className={styles.statusBody}>
                {systemStatus?.airtableConnected ? (
                  <div className={styles.statusSuccess}>
                    <FaCheckCircle /> Connected
                  </div>
                ) : (
                  <div className={styles.statusError}>
                    <FaExclamationTriangle /> {systemStatus?.airtableError || 'Not connected'}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <h3>Environment Configuration</h3>
              </div>
              <div className={styles.statusBody}>
                <div className={styles.configItem}>
                  <span>Airtable API Key:</span>
                  {systemStatus?.environment?.hasAirtableConfig ? (
                    <FaCheckCircle className={styles.configSuccess} />
                  ) : (
                    <FaExclamationTriangle className={styles.configError} />
                  )}
                </div>
                <div className={styles.configItem}>
                  <span>NextAuth Secret:</span>
                  {systemStatus?.environment?.hasAuthConfig ? (
                    <FaCheckCircle className={styles.configSuccess} />
                  ) : (
                    <FaExclamationTriangle className={styles.configError} />
                  )}
                </div>
                <div className={styles.configItem}>
                  <span>Mock Data Mode:</span>
                  <span className={systemStatus?.environment?.mockDataEnabled ? styles.configWarning : styles.configInfo}>
                    {systemStatus?.environment?.mockDataEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {systemStatus?.airtableDetails && (
          <div className={styles.detailsSection}>
            <h2>Airtable Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <h3>Base Information</h3>
                <p><strong>Base ID:</strong> {systemStatus.airtableDetails.baseId}</p>
              </div>
              
              {systemStatus.airtableDetails.tables && (
                <div className={styles.detailCard}>
                  <h3>Table Status</h3>
                  {Object.entries(systemStatus.airtableDetails.tables).map(([tableName, tableInfo]) => (
                    <div key={tableName} className={styles.tableStatus}>
                      <span className={styles.tableName}>{tableName}:</span>
                      {tableInfo.exists ? (
                        <span className={styles.tableSuccess}>
                          <FaCheckCircle /> {tableInfo.recordCount} records
                        </span>
                      ) : (
                        <span className={styles.tableError}>
                          <FaExclamationTriangle /> {tableInfo.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.actionsSection}>
          <button onClick={checkSystemStatus} className={styles.refreshButton}>
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSetup() {
  return (
    <SessionProvider>
      <AdminSetupContent />
    </SessionProvider>
  );
}