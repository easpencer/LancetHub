'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { FaExternalLinkAlt, FaLightbulb, FaUsers, FaHandshake, FaSeedling, FaBook } from 'react-icons/fa';
import styles from './overview.module.css';

export default function LandscapeOverviewPage() {
  const { ref: introRef, inView: introInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { ref: principlesRef, inView: principlesInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { ref: dimensionsRef, inView: dimensionsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Community Resilience Landscape</h1>
        <p className={styles.subtitle}>
          Understanding the complex dimensions of community resilience through traditional knowledge and collaborative approaches
        </p>
      </motion.div>

      <motion.div
        ref={introRef}
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={introInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Introduction to Community Resilience</h2>
        <div className={styles.contentWithImage}>
          <div className={styles.text}>
            <p>
              The concept of community resilience has evolved significantly over the past decades, 
              moving from a focus on bouncing back after crises to a more holistic understanding 
              of how communities adapt, transform, and thrive amid ongoing challenges.
            </p>
            <p>
              Our approach centers the wisdom already present within communities while acknowledging 
              the complex interplay of social, ecological, economic, and governance factors that shape 
              resilience outcomes. Particularly important is the recognition of traditional knowledge 
              systems that have helped communities remain resilient for generations.
            </p>
            <p>
              Based on extensive research and community partnerships, the Lancet Commission has developed 
              a comprehensive framework that identifies key dimensions and practices that contribute to 
              community resilience across diverse contexts.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <img
              src="https://source.unsplash.com/600x400/?community,gathering"
              alt="Community gathering"
              className={styles.sectionImage}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={principlesRef}
        className={`${styles.section} ${styles.principlesSection}`}
        initial={{ opacity: 0 }}
        animate={principlesInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Key Principles</h2>
        <div className={styles.principlesGrid}>
          <div className={styles.principleCard}>
            <div className={styles.principleIcon}>
              <FaUsers />
            </div>
            <h3>Community-Led Approaches</h3>
            <p>
              Resilience initiatives must be guided by community priorities and leadership,
              respecting local decision-making processes and knowledge systems.
            </p>
          </div>
          
          <div className={styles.principleCard}>
            <div className={styles.principleIcon}>
              <FaHandshake />
            </div>
            <h3>Equity & Inclusion</h3>
            <p>
              Efforts must prioritize the needs of marginalized populations and address 
              structural inequities that contribute to differential vulnerability.
            </p>
          </div>
          
          <div className={styles.principleCard}>
            <div className={styles.principleIcon}>
              <FaSeedling />
            </div>
            <h3>Systems Thinking</h3>
            <p>
              Understanding resilience requires examining the interconnections between 
              social, ecological, economic, and governance systems at multiple scales.
            </p>
          </div>
          
          <div className={styles.principleCard}>
            <div className={styles.principleIcon}>
              <FaLightbulb />
            </div>
            <h3>Adaptive Learning</h3>
            <p>
              Building resilience is an ongoing process of experimentation, reflection, 
              and adaptation based on changing contexts and emerging knowledge.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={dimensionsRef}
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={dimensionsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Core Resilience Dimensions</h2>
        <p className={styles.dimensionIntro}>
          Our research has identified four interrelated dimensions that form the foundation 
          for community resilience across different contexts:
        </p>
        
        <div className={styles.dimensionsGrid}>
          <div className={styles.dimensionCard}>
            <h3>Environmental Stewardship & Resource Security</h3>
            <ul>
              <li>Sustainable resource management practices</li>
              <li>Traditional ecological knowledge</li>
              <li>Climate adaptation strategies</li>
              <li>Food and water security systems</li>
            </ul>
            <Link href="/landscape#environmental" className={styles.exploreLink}>
              Explore dimension <FaExternalLinkAlt />
            </Link>
          </div>
          
          <div className={styles.dimensionCard}>
            <h3>Social Equity & Well-being</h3>
            <ul>
              <li>Accessible healthcare systems</li>
              <li>Inclusive education opportunities</li>
              <li>Social support networks</li>
              <li>Cultural preservation and identity</li>
            </ul>
            <Link href="/landscape#social" className={styles.exploreLink}>
              Explore dimension <FaExternalLinkAlt />
            </Link>
          </div>
          
          <div className={styles.dimensionCard}>
            <h3>Governance & Civic Engagement</h3>
            <ul>
              <li>Participatory decision-making processes</li>
              <li>Transparent and accountable institutions</li>
              <li>Community ownership of assets</li>
              <li>Inclusive leadership structures</li>
            </ul>
            <Link href="/landscape#governance" className={styles.exploreLink}>
              Explore dimension <FaExternalLinkAlt />
            </Link>
          </div>
          
          <div className={styles.dimensionCard}>
            <h3>Knowledge & Learning</h3>
            <ul>
              <li>Indigenous and traditional knowledge systems</li>
              <li>Community-based monitoring</li>
              <li>Intergenerational knowledge transfer</li>
              <li>Innovation and experimentation spaces</li>
            </ul>
            <Link href="/landscape#knowledge" className={styles.exploreLink}>
              Explore dimension <FaExternalLinkAlt />
            </Link>
          </div>
        </div>
        
        <div className={styles.callToAction}>
          <h3>Explore the Full Framework</h3>
          <p>
            Dive deeper into our comprehensive resilience framework with detailed indicators, 
            case studies, and practical tools for assessment and implementation.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/landscape" className={styles.primaryButton}>
              Interactive Framework <FaBook />
            </Link>
            <Link href="/documents/community-resilience-framework.pdf" className={styles.secondaryButton}>
              Download Full Report <FaExternalLinkAlt />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
