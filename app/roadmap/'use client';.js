'use client';

import { useState } from 'react';
import styles from './roadmap.module.css';

export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState('landscape');
  
  const phases = [
    {
      id: 'landscape',
      title: 'Landscape Analysis',
      description: 'Mapping the current state of resilience frameworks, identifying gaps, and understanding vulnerabilities exposed by recent global crises.',
      activities: [
        'Comprehensive literature review of resilience frameworks',
        'Analysis of COVID-19 response successes and failures',
        'Identification of key vulnerabilities across different systems',
        'Stakeholder interviews and community consultations',
        'Mapping of existing resources and capacities'
      ],
      outcomes: [
        'Detailed landscape assessment report',
        'Gap analysis of current resilience approaches',
        'Database of effective practices from global case studies',
        'Identification of priority areas for intervention'
      ],
      timeline: 'Q3 2024 - Q1 2025'
    },
    {
      id: 'speculation',
      title: 'Future Speculation',
      description: 'Envisioning potential future scenarios, emerging threats, and opportunities to build adaptive capacity for unknown challenges.',
      activities: [
        'Scenario planning workshops with diverse stakeholders',
        'Horizon scanning for emerging threats and opportunities',
        'Cross-disciplinary foresight activities',
        'Assessment of technological and social trends',
        'Exploration of alternative futures and their implications'
      ],
      outcomes: [
        'Set of plausible future scenarios',
        'Identification of capabilities needed for various futures',
        'Early warning indicators for monitored threats',
        'Creative outputs visualizing potential futures'
      ],
      timeline: 'Q1 2025 - Q3 2025'
    },
    {
      id: 'generation',
      title: 'Solution Generation',
      description: 'Co-creating innovative approaches, tools, and frameworks to build resilience across multiple scales and sectors.',
      activities: [
        'Collaborative design workshops with communities',
        'Development of resilience assessment tools',
        'Prototyping of innovative interventions',
        'Policy framework development',
        'Creation of educational resources and training materials'
      ],
      outcomes: [
        'Toolkit of resilience-building interventions',
        'Policy recommendations for different governance levels',
        'Educational curricula and training modules',
        'Community engagement strategies',
        'Digital tools for resilience planning'
      ],
      timeline: 'Q3 2025 - Q1 2026'
    },
    {
      id: 'delivery',
      title: 'Implementation & Delivery',
      description: 'Translating insights into action through pilot projects, policy adoption, capacity building, and community engagement.',
      activities: [
        'Launch of pilot projects in diverse settings',
        'Capacity building workshops and training',
        'Policy advocacy and stakeholder engagement',
        'Development of implementation guidelines',
        'Creation of monitoring and evaluation frameworks'
      ],
      outcomes: [
        'Successful pilot implementations',
        'Adoption of recommendations by key stakeholders',
        'Trained community of practice',
        'Impact assessment reports',
        'Long-term implementation roadmap'
      ],
      timeline: 'Q1 2026 - Q4 2026'
    }
  ];
  
  const currentPhase = phases.find(phase => phase.id === activePhase);

  return (
    <div className={styles.container}>
      <h1>Commission Roadmap</h1>
      <p className={styles.intro}>
        Our approach to building societal resilience follows four integrated phases that move from understanding the current landscape to implementing actionable solutions.
      </p>
      
      <div className={styles.phasesNavigation}>
        {phases.map(phase => (
          <button 
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`${styles.phaseButton} ${activePhase === phase.id ? styles.activePhase : ''}`}
          >
            {phase.title}
          </button>
        ))}
      </div>
      
      <div className={styles.phaseContent}>
        <div className={styles.phaseHeader}>
          <h2>{currentPhase.title}</h2>
          <span className={styles.timeline}>{currentPhase.timeline}</span>
        </div>
        
        <p className={styles.phaseDescription}>
          {currentPhase.description}
        </p>
        
        <div className={styles.phaseDetails}>
          <div className={styles.detailColumn}>
            <h3>Key Activities</h3>
            <ul>
              {currentPhase.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
          <div className={styles.detailColumn}>
            <h3>Expected Outcomes</h3>
            <ul>
              {currentPhase.outcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {activePhase === 'landscape' && (
          <div className={styles.phaseHighlight}>
            <h3>Current Focus</h3>
            <p>We are currently in the Landscape Analysis phase, collecting and analyzing data from around the world to understand the current state of societal resilience and identify key opportunities for intervention.</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '65%' }}></div>
            </div>
            <div className={styles.progressLabel}>65% Complete</div>
          </div>
        )}
      </div>
      
      <div className={styles.roadmapVisual}>
        <div className={styles.roadmapLine}></div>
        {phases.map((phase, index) => (
          <div 
            key={phase.id} 
            className={`${styles.roadmapNode} ${activePhase === phase.id ? styles.activeNode : ''} ${index < phases.findIndex(p => p.id === activePhase) ? styles.completedNode : ''}`}
            onClick={() => setActivePhase(phase.id)}
          >
            <div className={styles.nodePoint}></div>
            <div className={styles.nodeLabel}>{phase.title}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.callToAction}>
        <h3>Get Involved</h3>
        <p>The Commission welcomes input and collaboration from researchers, practitioners, policymakers, and community members. Contact us to learn how you can contribute to our work.</p>
        <button className={styles.ctaButton}>Contact the Commission</button>
      </div>
    </div>
  );
}
