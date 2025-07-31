'use client';

import styles from './commission.module.css';
import Link from 'next/link';

export default function CommissionPage() {
  return (
    <div className={styles.container}>
      <h1>The Lancet Commission on Societal Resilience</h1>
      
      <div className={styles.introCard}>
        <div className={styles.cardContent}>
          <h2>About the Commission</h2>
          <p className={styles.publishedInfo}>
            Published: August 31, 2024 in <em>The Lancet</em>
          </p>
          <p>The Lancet Commission on Societal Resilience is a global initiative that brings together experts from diverse fields to address vulnerabilities exposed by the COVID-19 pandemic and strengthen societal resilience against future threats.</p>
          <div className={styles.buttonContainer}>
            <a 
              href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)02721-1/abstract" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.buttonPrimary}
            >
              View in The Lancet
            </a>
            <Link href="/commission/members" className={styles.buttonSecondary}>
              Commission Members
            </Link>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="/images/commission-placeholder.jpg" 
            alt="Lancet Commission on Societal Resilience" 
            className={styles.commissionImage}
          />
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>Background</h2>
        <p>The COVID-19 pandemic revealed critical weaknesses in global health security, social safety nets, international cooperation, and societal structures. While the pandemic devastated communities worldwide, it also presented an opportunity to rethink and rebuild more resilient systems and societies.</p>
        
        <p>The Commission on Societal Resilience was established to analyze these vulnerabilities and develop evidence-based solutions that can strengthen societies' ability to withstand and adapt to future crises, whether they are health emergencies, climate disasters, economic shocks, or other threats.</p>
        
        <div className={styles.quote}>
          <blockquote>
            "Building societal resilience requires a systemic approach that strengthens the capacity of individuals, communities, institutions, and governments to anticipate, prepare for, respond to, and recover from shocks and stressors."
          </blockquote>
        </div>
        
        <p>The Commission brings together a diverse group of experts from public health, economics, climate science, social sciences, public policy, technology, and community organization. By leveraging this interdisciplinary expertise, the Commission aims to create a comprehensive framework for building resilient societies that can protect human well-being in the face of emerging global challenges.</p>
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
        <h2>Timeline</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2024</div>
            <div className={styles.timelineContent}>
              <h3>Commission Launch</h3>
              <p>Formal announcement and first meeting of commissioners</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2024-2025</div>
            <div className={styles.timelineContent}>
              <h3>Research and Analysis</h3>
              <p>Working groups conduct research, analyze data, and develop frameworks</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2025</div>
            <div className={styles.timelineContent}>
              <h3>Preliminary Findings</h3>
              <p>Release of interim report with initial findings and recommendations</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2026</div>
            <div className={styles.timelineContent}>
              <h3>Final Report</h3>
              <p>Publication of the Commission's comprehensive report and recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
