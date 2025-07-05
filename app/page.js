'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LancetHubLogo from '../components/LancetHubLogo';
import styles from './page.module.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="loading-animation">
          <div></div><div></div><div></div><div></div>
        </div>
        <p>Loading Pandemic Resilience Hub...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            <LancetHubLogo size={150} showText={false} />
          </motion.div>
          <h1 className={styles.title}>
            The Lancet Commission on
            <span className={styles.highlight}> US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future</span>
          </h1>
          <p className={styles.subtitle}>
            Understanding and strengthening societal resilience in a global pandemic age
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/pandemic-vulnerability" className={styles.primaryButton}>
              Explore Pandemic Map
            </Link>
            <Link href="/landscape" className={styles.secondaryButton}>
              View Framework
            </Link>
            <Link href="/case-studies" className={styles.secondaryButton}>
              Case Studies
            </Link>
          </div>
        </motion.div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Key Research Areas</h2>
        
        <div className={styles.featuresGrid}>
          <motion.div 
            className={styles.featureCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
              <span className={styles.emoji}>🏥</span>
            </div>
            <h3>Health Equity</h3>
            <p>Examining how healthcare systems can be made more equitable and resilient to future health crises.</p>
            <Link href="/landscape#health-equity" className={styles.featureLink}>
              Learn More
            </Link>
          </motion.div>
          
          <motion.div 
            className={styles.featureCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(6, 167, 125, 0.1)' }}>
              <span className={styles.emoji}>🌎</span>
            </div>
            <h3>Environmental Resilience</h3>
            <p>Investigating the connections between environmental health and community resilience.</p>
            <Link href="/landscape#environmental" className={styles.featureLink}>
              Learn More
            </Link>
          </motion.div>
          
          <motion.div 
            className={styles.featureCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(247, 184, 1, 0.1)' }}>
              <span className={styles.emoji}>💰</span>
            </div>
            <h3>Economic Sustainability</h3>
            <p>Analyzing economic structures that promote long-term prosperity without depleting resources.</p>
            <Link href="/landscape#economic" className={styles.featureLink}>
              Learn More
            </Link>
          </motion.div>
          
          <motion.div 
            className={styles.featureCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(43, 80, 170, 0.1)' }}>
              <span className={styles.emoji}>🏛️</span>
            </div>
            <h3>Governance & Civic Engagement</h3>
            <p>Exploring inclusive decision-making and community participation in crisis management.</p>
            <Link href="/landscape#governance" className={styles.featureLink}>
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <motion.div 
          className={styles.ctaContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <h2>Join Our Research Community</h2>
          <p>
            Connect with researchers, practitioners, and community leaders working 
            to strengthen societal resilience in the face of global challenges.
          </p>
          <Link href="/join-us" className={styles.ctaButton}>
            Get Involved
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
