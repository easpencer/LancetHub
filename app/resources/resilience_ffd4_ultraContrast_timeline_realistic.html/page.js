'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaGlobeAmericas, FaDownload, FaHandshake } from 'react-icons/fa';
import styles from './ffd4.module.css';

export default function Ffd4Page() {
  return (
    <div className={styles.container}>
      <div className={styles.backLinkContainer}>
        <Link href="/" className={styles.backLink}>
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
      
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.metaInfo}>
          <span className={styles.category}>Community Resource</span>
          <span className={styles.date}>
            <FaCalendarAlt className={styles.dateIcon} /> May 2024
          </span>
        </div>
        
        <h1>Community Resilience at FfD4</h1>
        <p className={styles.subtitle}>
          Centering community wisdom in financial decision-making at the 
          Fourth International Conference on Financing for Development
        </p>
      </motion.div>
      
      <div className={styles.heroImage}>
        <img 
          src="https://source.unsplash.com/1600x500/?community,finance,development" 
          alt="Community-Led Development Finance"
        />
      </div>
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.mainContent}>
          <h2>Overview</h2>
          <p>
            The Fourth International Conference on Financing for Development (FfD4) presents a critical 
            opportunity to transform how we finance community resilience. This resource explores how honoring 
            local knowledge systems and community-led approaches can ensure financing reaches those most 
            affected by global challenges.
          </p>
          
          <h2>Key Insights</h2>
          <ul className={styles.keyPoints}>
            <li>
              <strong>Community-Led Priorities:</strong> Financial decisions made with meaningful 
              community participation result in more effective and sustainable outcomes
            </li>
            <li>
              <strong>Local Knowledge Systems:</strong> Traditional community wisdom about risk management 
              must be valued alongside conventional financial metrics
            </li>
            <li>
              <strong>Equitable Access:</strong> New financing mechanisms are needed to ensure resources 
              reach marginalized communities directly
            </li>
            <li>
              <strong>Collective Governance:</strong> Communities must have a voice in determining how 
              resilience is defined, measured, and financed
            </li>
          </ul>
          
          <div className={styles.calloutBox}>
            <h3>Community Financial Resilience Framework</h3>
            <p>
              Our approach centers community wisdom in financial decision-making and creates pathways for 
              direct community access to resources for implementing locally-appropriate resilience strategies.
            </p>
            <Link href="/resources/community-framework.pdf" className={styles.downloadButton}>
              <FaDownload /> Download Framework
            </Link>
          </div>
          
          <h2>Timeline for Community-Led Implementation</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>Phase 1: Community Knowledge Documentation</h3>
                <p>Support communities in documenting their traditional resilience practices and financial needs</p>
                <span className={styles.timelinePeriod}>2024-2025</span>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>Phase 2: Participatory Frameworks</h3>
                <p>Co-create community-defined metrics and approaches to resilience financing</p>
                <span className={styles.timelinePeriod}>2025-2027</span>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>Phase 3: Community-Led Implementation</h3>
                <p>Direct financing to community-governed resilience initiatives worldwide</p>
                <span className={styles.timelinePeriod}>2027-2030</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarWidget}>
            <h3>Related Resources</h3>
            <ul className={styles.resourceLinks}>
              <li>
                <Link href="/landscape">Community Resilience Framework</Link>
              </li>
              <li>
                <Link href="/case-studies">Community Case Studies</Link>
              </li>
              <li>
                <Link href="/bibliography">Research & Publications</Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.sidebarWidget}>
            <h3>Get Involved</h3>
            <p>Join our network of communities sharing resilience knowledge and practices.</p>
            <Link href="/join-us" className={styles.contactButton}>
              <FaHandshake /> Connect With Us
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
