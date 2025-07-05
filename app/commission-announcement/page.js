'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaFileDownload, FaUsers, FaGlobeAmericas, FaLightbulb } from 'react-icons/fa';
import styles from './commission-announcement.module.css';

export default function CommissionAnnouncementPage() {
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
          <span className={styles.category}>Official Announcement</span>
          <span className={styles.date}>
            <FaCalendarAlt className={styles.dateIcon} /> July 2024
          </span>
        </div>
        
        <h1>The Lancet Commission on US Societal Resilience in a Global Pandemic Age</h1>
        <a href="/documents/PIIS0140673624027211.pdf" download className={styles.downloadAnnouncement}>
          Download Full Announcement <FaFileDownload />
        </a>
      </motion.div>
      
      <div className={styles.heroImage}>
        <img 
          src="/images/lancet-commission-header.jpg" 
          alt="Lancet Commission on US Societal Resilience"
        />
      </div>
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.mainContent}>
          <div className={styles.introduction}>
            <p>
              The Lancet and the University of California San Diego have established the 
              Lancet Commission on US Societal Resilience in a Global Pandemic Age. This Commission will 
              examine the policy lessons and institutional reform opportunities for the US in the wake of COVID-19,
              with a focus on societal determinants of health.
            </p>
          </div>
          
          <h2>Commission Background</h2>
          <p>
            The COVID-19 pandemic exposed critical weaknesses in US pandemic preparedness and response capabilities. 
            Despite having some of the world's leading health institutions and significant investments in biodefense, 
            the US experienced one of the highest COVID-19 death rates among wealthy nations. The pandemic 
            disproportionately affected marginalized communities and revealed deep inequities in the healthcare system.
          </p>
          
          <div className={styles.calloutBox}>
            <h3>Commission Leadership</h3>
            <p>
              The Commission is co-chaired by Dr. William Short, MD, MS-HPHR from University of California San Diego, School of 
              Medicine, USA, and Dr. Richard Carmona, MD, MPH, FACS, the 17th Surgeon General of the United States.
            </p>
          </div>
          
          <h2>Commission Objectives</h2>
          <ul className={styles.objectivesList}>
            <li>
              Develop a societal framework for pandemic resilience that includes clinical, public health, social, economic, 
              and environmental determinants of health
            </li>
            <li>
              Propose reforms to strengthen equitable access to health care and social services
            </li>
            <li>
              Identify strategies to counter misinformation and rebuild public trust in science and public health
            </li>
            <li>
              Create policy recommendations for improving US institutional capacity to prepare for and respond to future biological threats
            </li>
          </ul>
          
          <h2>Key Areas of Investigation</h2>
          
          <div className={styles.focusAreas}>
            <div className={styles.focusCard}>
              <div className={styles.focusIcon}><FaUsers /></div>
              <h3>Health Equity & Social Determinants</h3>
              <p>
                Examining how social factors like housing, employment, and education affect pandemic outcomes and 
                developing strategies to address systemic inequities.
              </p>
            </div>
            
            <div className={styles.focusCard}>
              <div className={styles.focusIcon}><FaGlobeAmericas /></div>
              <h3>Community-Based Approaches</h3>
              <p>
                Documenting successful community-led efforts during COVID-19 and identifying models that can be adapted 
                and scaled for future public health emergencies.
              </p>
            </div>
            
            <div className={styles.focusCard}>
              <div className={styles.focusIcon}><FaLightbulb /></div>
              <h3>Rebuilding Public Trust</h3>
              <p>
                Developing strategies to combat misinformation, enhance science communication, and restore trust in 
                public health institutions.
              </p>
            </div>
          </div>
          
          <h2>Timeline & Deliverables</h2>
          <p>
            The Commission will conduct its work over a three-year period, culminating in a comprehensive 
            report and policy recommendations. Throughout this period, the Commission will publish interim 
            findings and engage with communities across the United States to ensure diverse 
            perspectives inform its recommendations.
          </p>
          
          <div className={styles.downloadSection}>
            <h3>Access the Full Announcement</h3>
            <p>
              Download the complete Commission announcement published in The Lancet to learn more about this important initiative.
            </p>
            <a href="/documents/PIIS0140673624027211.pdf" download className={styles.downloadButton}>
              Download PDF <FaFileDownload />
            </a>
          </div>
        </div>
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarWidget}>
            <h3>Get Involved</h3>
            <p>Join our network of experts and community leaders working to strengthen societal resilience.</p>
            <Link href="/join-us" className={styles.sidebarButton}>
              Join the Network
            </Link>
          </div>
          
          <div className={styles.sidebarWidget}>
            <h3>Related Resources</h3>
            <ul className={styles.resourceLinks}>
              <li>
                <Link href="/landscape">Resilience Framework</Link>
              </li>
              <li>
                <Link href="/case-studies">Case Studies</Link>
              </li>
              <li>
                <Link href="/documents">Commission Documents</Link>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
