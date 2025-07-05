'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './commission.module.css';

export default function CommissionPage() {
  return (
    <div className={styles.container}>
      <h1>The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future</h1>
      
      <div className={styles.introCard}>
        <div className={styles.cardContent}>
          <div className={styles.commissionHeader}>
            <div className={styles.commissionLogo}>
              <div className={styles.logoDesign}>
                <div className={styles.logoCircle}>
                  <div className={styles.logoInner}>
                    <span className={styles.logoText}>LC</span>
                    <span className={styles.logoSubtext}>RESILIENCE</span>
                  </div>
                </div>
              </div>
            </div>
            <h2>About the Commission</h2>
          </div>
          <p className={styles.publishedInfo}>
            Published: February 8, 2025 in <em>The Lancet</em>
          </p>
          <p>5 years since the onset of the COVID-19 pandemic, with SARS-CoV-2 moving to endemicity and new threats such as H5N1 influenza, mpox, and Marburg virus spilling into human populations, the world continues to face ecological, sociotechnical, and infectious disease threats that are rising in urgency and complexity.</p>
          <div className={styles.buttonContainer}>
            <a 
              href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(25)00057-6/fulltext" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.buttonPrimary}
            >
              Read Commission Announcement
            </a>
            <a 
              href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)02721-1/fulltext" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.buttonSecondary}
            >
              View Full Article
            </a>
            <Link href="/commission/members" className={styles.buttonSecondary}>
              Meet the Commissioners
            </Link>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>Commission Mission</h2>
        <p>The Lancet Commission on US Societal Resilience in a Global Pandemic Age seeks to discover the common principles and activities, crucial resources, sustainable policies, and core technologies that could enable the USA, other societies, and their constituent communities to prepare for, resist, and rapidly recover from infectious disease threats.</p>
        <div className={styles.quoteBox}>
          <blockquote>
            "Achieving societal resilience to pandemics requires attention to be reprioritised on individual communities, which lie at the front line of our shared challenges. As the basic units of a society, communities offer both pragmatic levels of study and important levers of action to develop greater societal resilience in our pandemic age."
          </blockquote>
        </div>
        
        <p>Our Commission's founding goals are to advance new approaches and frameworks for resilience by focusing on the personal, social, economic, and cultural capacities; information systems; scientific and technological infrastructures; and leadership strategies that enable adaptable communities to be resilient against a wide range of coexisting threats to essential health, social, and economic needs.</p>
      </div>
      
      <div className={styles.section}>
        <h2>Key Focus Areas</h2>
        <div className={styles.focusGrid}>
          <div className={styles.focusCard}>
            <h3>Health Systems Resilience</h3>
            <p>Strengthening healthcare infrastructure and capacity to respond to emerging health threats while maintaining essential services.</p>
          </div>
          <div className={styles.focusCard}>
            <h3>Social Safety Nets</h3>
            <p>Ensuring robust support systems that protect vulnerable populations during crises and reduce societal inequities.</p>
          </div>
          <div className={styles.focusCard}>
            <h3>Information Ecosystems</h3>
            <p>Developing trustworthy information systems and combating misinformation that undermines effective crisis response.</p>
          </div>
          <div className={styles.focusCard}>
            <h3>Governance Structures</h3>
            <p>Improving coordination between different levels of government and across sectors to enhance crisis management.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>Objectives</h2>
        <ul className={styles.objectivesList}>
          <li>Identify key vulnerabilities exposed by the COVID-19 pandemic across different societies and systems</li>
          <li>Analyze successful and failed approaches to crisis management during recent global emergencies</li>
          <li>Develop a comprehensive framework for assessing and building societal resilience</li>
          <li>Provide evidence-based recommendations for policymakers, community leaders, and institutions</li>
          <li>Create tools and metrics to measure and monitor progress toward resilience goals</li>
        </ul>
      </div>
      
      <div className={styles.section}>
        <h2>Three-Phase Process</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Phase 1</div>
            <div className={styles.timelineContent}>
              <h3>Document Failures & Resilience Factors</h3>
              <p>Document infectious disease-related community and societal failure modes, resilience factors, and their drivers. Engage stakeholders and review in-depth case studies of pandemic preparedness and response, contrasting North American and global experiences.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Phase 2</div>
            <div className={styles.timelineContent}>
              <h3>Lessons from Future Scenarios</h3>
              <p>Draw lessons for the present from what is predicted for the future through inclusive co-design approaches and analyses that synergistically combine human, modelling, and artificial intelligence capacities in an exploration of potential threats and future opportunities.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>Phase 3</div>
            <div className={styles.timelineContent}>
              <h3>Policy Roadmaps & Implementation</h3>
              <p>Generate practical policy roadmaps to mitigate speculated threats and leverage identified opportunities, culminating in a formal summary of recommendations that set the stage for application and future work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
