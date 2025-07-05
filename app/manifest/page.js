'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHandshake, FaGlobeAmericas, FaChartLine, FaUsers, FaBook, FaLeaf, FaHeart, FaBalanceScale, FaSyncAlt, FaCompass } from 'react-icons/fa';
import styles from './manifest.module.css';

export default function ManifestPage() {
  const [activeSection, setActiveSection] = useState(null);
  
  const { ref: introRef, inView: introInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  
  const { ref: principlesRef, inView: principlesInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  const { ref: approachRef, inView: approachInView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  
  const { ref: commitmentRef, inView: commitmentInView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  
  const { ref: signatureRef, inView: signatureInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (introInView) setActiveSection('intro');
    else if (principlesInView) setActiveSection('principles');
    else if (approachInView) setActiveSection('approach');
    else if (commitmentInView) setActiveSection('commitment');
    else if (signatureInView) setActiveSection('signature');
  }, [introInView, principlesInView, approachInView, commitmentInView, signatureInView]);

  const principles = [
    {
      title: "Community Wisdom",
      icon: <FaHeart size={24} />,
      description: "We honor and elevate diverse forms of local knowledge and traditional wisdom as essential foundations for building resilient communities."
    },
    {
      title: "Ecological Integration",
      icon: <FaLeaf size={24} />,
      description: "We recognize that community resilience must be rooted in sustainable relationships with local ecosystems and natural resources."
    },
    {
      title: "Inclusive Participation",
      icon: <FaUsers size={24} />,
      description: "We commit to centering the voices and decision-making power of those most affected by challenges, particularly historically marginalized communities."
    },
    {
      title: "Knowledge Exchange",
      icon: <FaBook size={24} />,
      description: "We facilitate sharing of insights and practices across communities while respecting the contextual nature of resilience knowledge."
    },
    {
      title: "Locally-Rooted Solutions",
      icon: <FaHandshake size={24} />,
      description: "We prioritize approaches that build on existing community strengths and are adapted to local contexts rather than imposing external frameworks."
    }
  ];
  
  const approaches = [
    {
      title: "Interdisciplinary Collaboration",
      icon: <FaUsers />,
      description: "Bringing together diverse experts from public health, ecology, social sciences, and community practice to develop holistic resilience approaches."
    },
    {
      title: "Systems Thinking",
      icon: <FaSyncAlt />,
      description: "Analyzing the complex interdependencies between health, environmental, social, and economic systems that shape community resilience."
    },
    {
      title: "Equity-Centered Practice",
      icon: <FaBalanceScale />,
      description: "Placing justice and equity at the center of resilience frameworks, acknowledging historical disparities and power imbalances."
    },
    {
      title: "Adaptive Learning",
      icon: <FaCompass />,
      description: "Embracing flexible, iterative approaches that allow continuous refinement of resilience strategies based on emerging evidence and changing contexts."
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Our Manifesto</h1>
        <p className={styles.subtitle}>
          Strengthening US Societal Resilience in a Global Pandemic Age
        </p>
      </motion.div>
      
      <motion.div
        ref={introRef}
        className={`${styles.manifestSection} ${styles.manifestIntro} ${introInView ? styles.visible : ''}`}
        initial="hidden"
        animate={introInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <p>
          The Lancet Commission on US Societal Resilience in a Global Pandemic Age brings together diverse knowledge 
          systems and perspectives to strengthen America's capacity to prepare for, respond to, and recover from 
          biological threats. We recognize that pandemic resilience requires addressing the social, economic, 
          and environmental determinants of health while rebuilding public trust in scientific institutions.
        </p>
        <p>
          Through our work, we aim to develop an inclusive health security framework that promotes health equity and 
          draws on lessons from communities that demonstrated resilience during the COVID-19 pandemic.
        </p>
      </motion.div>
      
      <h2 className={styles.sectionTitle}>Our Core Principles</h2>
      
      <motion.div 
        ref={principlesRef}
        className={`${styles.manifestSection} ${principlesInView ? styles.visible : ''}`}
      >
        <div className={styles.principlesGrid}>
          {principles.map((principle, index) => (
            <motion.div 
              key={index} 
              className={styles.principleCard}
              initial={{ opacity: 0, y: 30 }}
              animate={principlesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className={styles.principleNumber}>{index + 1}</span>
              <div className={styles.principleIcon}>{principle.icon}</div>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <h2 className={styles.sectionTitle}>Our Approach</h2>
      
      <motion.div
        ref={approachRef}
        className={`${styles.manifestSection} ${styles.approachSection} ${approachInView ? styles.visible : ''}`}
      >
        <p className={styles.approachIntro}>
          The Lancet Commission employs multiple complementary approaches to advance understanding
          and practice of societal resilience:
        </p>
        
        <div className={styles.approachGrid}>
          {approaches.map((approach, index) => (
            <motion.div
              key={index}
              className={styles.approachCard}
              initial={{ opacity: 0, y: 30 }}
              animate={approachInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.approachIcon}>{approach.icon}</div>
              <div>
                <h3>{approach.title}</h3>
                <p>{approach.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        ref={commitmentRef}
        className={`${styles.manifestSection} ${styles.commitmentSection} ${commitmentInView ? styles.visible : ''}`}
        initial="hidden"
        animate={commitmentInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <h2>Our Commitment to Communities</h2>
        <p>
          Beyond research and documentation, we are committed to supporting communities in their own resilience journeys:
        </p>
        
        <ul className={styles.commitmentList}>
          <li>
            <strong>Knowledge Preservation:</strong> Supporting communities in documenting and preserving their traditional wisdom and practices.
          </li>
          <li>
            <strong>Community-Led Documentation:</strong> Developing participatory tools that enable communities to share their resilience stories on their own terms.
          </li>
          <li>
            <strong>Policy Advocacy:</strong> Amplifying community voices in policy discussions at local, national, and international levels.
          </li>
          <li>
            <strong>Capacity Exchange:</strong> Facilitating peer-to-peer learning between communities facing similar challenges rather than top-down expertise.
          </li>
          <li>
            <strong>Resource Justice:</strong> Working to ensure that communities have equitable access to the resources they need to implement their own resilience strategies.
          </li>
          <li>
            <strong>Knowledge Democratization:</strong> Making resilience research, tools, and frameworks accessible to all communities regardless of resources.
          </li>
        </ul>
      </motion.div>
      
      <motion.div 
        ref={signatureRef}
        className={`${styles.manifestSection} ${styles.signatureSection} ${signatureInView ? styles.visible : ''}`}
        initial="hidden"
        animate={signatureInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <h2>Join Our Community of Practice</h2>
        <p>
          The challenges we face—from climate change to health inequities, from eroding social cohesion to economic instability—affect communities unevenly and require solutions grounded in local realities. We believe that by honoring diverse forms of knowledge, supporting community leadership, and advocating for systems change, we can build a world where all communities can thrive through crises and beyond.
        </p>
        <p>
          We invite communities, practitioners, researchers, and change-makers to join this movement. Together, we can transform how resilience is understood, supported, and practiced in the face of unprecedented global challenges.
        </p>
        
        <div className={styles.signatures}>
          <div className={styles.signatureLine}></div>
          <p>The Lancet Commission on Societal Resilience</p>
          <span className={styles.signatureDate}>May 2024</span>
        </div>
      </motion.div>
      
      <div className={styles.endorseSection}>
        <h2>Endorse Our Manifesto</h2>
        <p>
          Join communities and organizations worldwide in supporting our vision of community-led resilience.
        </p>
        <a href="/join-us" className={styles.endorseButton}>
          Sign the Manifesto
        </a>
      </div>
    </div>
  );
}
