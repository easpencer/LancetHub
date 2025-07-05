'use client';

import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaFolder, 
  FaUsers, 
  FaBook, 
  FaFileAlt, 
  FaChartLine, 
  FaSignOutAlt, 
  FaExclamationTriangle,
  FaDatabase,
  FaLayerGroup,
  FaSyncAlt
} from 'react-icons/fa';
import styles from './dashboard.module.css';

function AdminDashboardContent() {
  const sessionData = useSession();
  const { data: session, status } = sessionData || { data: null, status: 'loading' };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [airtableStatus, setAirtableStatus] = useState('checking');
  const [contentStats, setContentStats] = useState({
    caseStudies: '...',
    bibliography: '...',
    people: '...',
    dimensions: '...'
  });
  
  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    checkAirtableConnection();
    fetchContentStats();
  }, [session, status, router]);
  
  // Check Airtable connection
  const checkAirtableConnection = async () => {
    try {
      setAirtableStatus('checking');
      const response = await fetch('/api/admin/system-check');
      
      if (!response.ok) {
        throw new Error('Failed to check system status');
      }
      
      const data = await response.json();
      setAirtableStatus(data.airtableConnected ? 'connected' : 'disconnected');
    } catch (err) {
      console.error('Error checking Airtable connection:', err);
      setAirtableStatus('error');
    }
  };
  
  // Fetch content statistics
  const fetchContentStats = async () => {
    try {
      // Case Studies count
      const csResponse = await fetch('/api/admin/case-studies');
      if (csResponse.ok) {
        const csData = await csResponse.json();
        setContentStats(prev => ({ ...prev, caseStudies: csData.caseStudies?.length || 0 }));
      }
      
      // Bibliography count
      const bibResponse = await fetch('/api/admin/bibliography');
      if (bibResponse.ok) {
        const bibData = await bibResponse.json();
        setContentStats(prev => ({ ...prev, bibliography: bibData.bibliography?.length || 0 }));
      }
      
      // People count
      const peopleResponse = await fetch('/api/admin/people');
      if (peopleResponse.ok) {
        const peopleData = await peopleResponse.json();
        setContentStats(prev => ({ ...prev, people: peopleData.people?.length || 0 }));
      }
      
      // Dimensions count
      const dimResponse = await fetch('/api/admin/dimensions');
      if (dimResponse.ok) {
        const dimData = await dimResponse.json();
        setContentStats(prev => ({ ...prev, dimensions: dimData.dimensions?.length || 0 }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching content stats:', err);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="loading-animation">
          <div></div><div></div><div></div><div></div>
        </div>
        <h2>Loading admin interface...</h2>
      </div>
    );
  }

  const contentTypes = [
    {
      title: 'Case Studies',
      description: 'Manage, edit and create case studies',
      icon: <FaFileAlt />,
      link: '/admin/case-studies',
      count: contentStats.caseStudies
    },
    {
      title: 'Bibliography',
      description: 'Manage research references and citations',
      icon: <FaBook />,
      link: '/admin/bibliography',
      count: contentStats.bibliography
    },
    {
      title: 'People',
      description: 'Manage community members and experts',
      icon: <FaUsers />,
      link: '/admin/people',
      count: contentStats.people
    },
    {
      title: 'Resilience Framework',
      description: 'Edit resilience dimensions and landscape',
      icon: <FaChartLine />,
      link: '/admin/resilience-framework',
      count: contentStats.dimensions
    }
  ];
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Admin Dashboard
          </motion.h1>
          <div className={styles.userInfo}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.airtableStatus}
            >
              <FaDatabase className={styles.dbIcon} /> 
              <span>Airtable: </span>
              <span className={`${styles.statusIndicator} ${styles[airtableStatus]}`}>
                {airtableStatus === 'connected' && 'Connected'}
                {airtableStatus === 'disconnected' && 'Disconnected'}
                {airtableStatus === 'checking' && 'Checking...'}
                {airtableStatus === 'error' && 'Error'}
              </span>
              {(airtableStatus === 'disconnected' || airtableStatus === 'error') && (
                <button 
                  onClick={checkAirtableConnection} 
                  className={styles.refreshButton}
                  title="Retry connection"
                >
                  <FaSyncAlt />
                </button>
              )}
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Welcome, {session.user.name}
            </motion.span>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={styles.logoutButton}
              onClick={() => {
                signOut({ callbackUrl: '/admin/login' });
              }}
            >
              <FaSignOutAlt /> Sign Out
            </motion.button>
          </div>
        </div>
      </header>
      
      <div className={styles.content}>
        <motion.div 
          className={styles.contentHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2>Content Management</h2>
          <p>Select a content type to manage</p>
        </motion.div>
        
        <div className={styles.contentGrid}>
          {contentTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                borderColor: 'var(--primary-color)',
                transition: { duration: 0.3 }
              }}
            >
              <Link href={type.link} className={styles.contentCard}>
                <div className={styles.contentIcon}>
                  {type.icon}
                </div>
                <div className={styles.contentInfo}>
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                </div>
                <div className={styles.contentCount}>
                  <span>{type.count}</span>
                  <span className={styles.contentCountLabel}>items</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className={styles.systemSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3>System Management</h3>
          <div className={styles.systemGrid}>
            <motion.div 
              className={styles.systemCard}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <div className={styles.systemIcon}>
                <FaDatabase />
              </div>
              <div className={styles.systemInfo}>
                <h4>Database Tools</h4>
                <p>Check data integrity and synchronize content</p>
              </div>
              <Link href="/admin/tools/database" className={styles.systemButton}>
                Access Tools
              </Link>
            </motion.div>
            
            <motion.div 
              className={styles.systemCard}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                transition: { duration: 0.3 }
              }}
            >
              <div className={styles.systemIcon}>
                <FaLayerGroup />
              </div>
              <div className={styles.systemInfo}>
                <h4>Export/Import</h4>
                <p>Transfer content between environments</p>
              </div>
              <Link href="/admin/tools/export" className={styles.systemButton}>
                Access Tools
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.noteSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className={styles.noteCard}>
            <FaExclamationTriangle className={styles.noteIcon} />
            <div>
              <h3>Important Note</h3>
              <p>
                Changes made in the admin interface will be immediately visible on the public site.
                Please review your edits carefully before saving. All changes are synchronized with Airtable.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <SessionProvider>
      <AdminDashboardContent />
    </SessionProvider>
  );
}
