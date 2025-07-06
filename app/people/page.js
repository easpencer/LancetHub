'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaEnvelope } from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './people.module.css';

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [roles, setRoles] = useState(['all']);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/people');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch people data: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("People data:", data);
        
        const peopleData = data.people || [];
        setPeople(peopleData);
        setFilteredPeople(peopleData);
        
        // Extract unique roles
        const roleSet = new Set(peopleData.map(person => person.Role).filter(Boolean));
        setRoles(['all', ...Array.from(roleSet)]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching people data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPeople();
  }, []);
  
  // Filter people when search or filter changes
  useEffect(() => {
    if (!people.length) return;
    
    let results = [...people];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(person => 
        (person.Name || '').toLowerCase().includes(term) ||
        (person.Affiliation || '').toLowerCase().includes(term) ||
        (person.Expertise || '').toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (filterRole !== 'all') {
      results = results.filter(person => person.Role === filterRole);
    }
    
    setFilteredPeople(results);
  }, [searchTerm, filterRole, people]);

  if (loading) {
    return <LoadingState message="Loading People" submessage="Fetching team members..." />;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Could not load people data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <AnimatedSection type="fade" className={styles.pageHeader}>
          <h1>People</h1>
          <p className={styles.subtitle}>
            Meet the team behind The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future
          </p>
        </AnimatedSection>
        
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search people..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <FaFilter className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role === 'all' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredPeople.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={styles.peopleGrid}>
            {filteredPeople.map((person, index) => (
              <AnimatedSection 
                key={person.id || index} 
                type="fade" 
                delay={index * 0.1}
                className={styles.personCard}
              >
                <div className={styles.personAvatar}>
                  {person.Image && person.Image.length > 0 ? (
                    <img src={person.Image[0]?.url} alt={person.Name} />
                  ) : (person.Photo && person.Photo.length > 0) || (person.Image && person.Image.length > 0) ? (
                    <img src={(person.Photo || person.Image)[0]?.url} alt={person.Name} />
                  ) : (
                    <div className={styles.initialsAvatar}>
                      {person.Name?.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                
                <div className={styles.personInfo}>
                  <h2>{person.Name}</h2>
                  
                  {person.Role && (
                    <div className={styles.personRole}>{person.Role}</div>
                  )}
                  
                  {person.JobTitle && person.JobTitle !== person.Role && (
                    <div className={styles.personJobTitle}>{person.JobTitle}</div>
                  )}
                  
                  {person.Affiliation && (
                    <div className={styles.personAffiliation}>{person.Affiliation}</div>
                  )}
                  
                  {person.Department && (
                    <div className={styles.personDepartment}>{person.Department}</div>
                  )}
                  
                  {person.Expertise && (
                    <div className={styles.expertiseTags}>
                      <h4>Expertise:</h4>
                      <div className={styles.tagsContainer}>
                        {person.Expertise.split(',').map((expertise, i) => (
                          <span key={i} className={styles.expertiseTag}>{expertise.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {person.ResearchInterests && (
                    <div className={styles.researchSection}>
                      <h4>Research Interests:</h4>
                      <p>{person.ResearchInterests}</p>
                    </div>
                  )}
                  
                  {person.Bio && (
                    <div className={styles.bioSection}>
                      <h4>Biography:</h4>
                      <p className={styles.personBio}>{person.Bio}</p>
                    </div>
                  )}
                  
                  {person.Education && (
                    <div className={styles.educationSection}>
                      <h4>Education:</h4>
                      <p>{person.Education}</p>
                    </div>
                  )}
                  
                  {person.YearsExperience && (
                    <div className={styles.experienceSection}>
                      <h4>Experience:</h4>
                      <p>{person.YearsExperience} years</p>
                    </div>
                  )}
                  
                  {person.Awards && (
                    <div className={styles.awardsSection}>
                      <h4>Awards & Recognition:</h4>
                      <p>{person.Awards}</p>
                    </div>
                  )}
                  
                  {person.CurrentProjects && (
                    <div className={styles.projectsSection}>
                      <h4>Current Projects:</h4>
                      <p>{person.CurrentProjects}</p>
                    </div>
                  )}
                  
                  {person.Publications && (
                    <div className={styles.publicationsSection}>
                      <h4>Publications:</h4>
                      <p>{person.Publications}</p>
                    </div>
                  )}
                  
                  {person.Location && (
                    <div className={styles.locationSection}>
                      <h4>Location:</h4>
                      <p>{person.Location}{person.Country && `, ${person.Country}`}</p>
                    </div>
                  )}
                  
                  {person.CommissionRole && person.CommissionRole !== person.Role && (
                    <div className={styles.commissionSection}>
                      <h4>Commission Role:</h4>
                      <p>{person.CommissionRole}</p>
                    </div>
                  )}
                  
                  {person.WorkingGroups && (
                    <div className={styles.workingGroupsSection}>
                      <h4>Working Groups:</h4>
                      <p>{person.WorkingGroups}</p>
                    </div>
                  )}
                  
                  {person.Contributions && (
                    <div className={styles.contributionsSection}>
                      <h4>Key Contributions:</h4>
                      <p>{person.Contributions}</p>
                    </div>
                  )}
                  
                  <div className={styles.contactSection}>
                    {person.Email && (
                      <a href={`mailto:${person.Email}`} className={styles.contactButton}>
                        <FaEnvelope /> Email
                      </a>
                    )}
                    
                    {person.Website && (
                      <a href={person.Website} target="_blank" rel="noopener noreferrer" className={styles.websiteButton}>
                        🌐 Website
                      </a>
                    )}
                    
                    {person.LinkedIn && (
                      <a href={person.LinkedIn} target="_blank" rel="noopener noreferrer" className={styles.linkedinButton}>
                        💼 LinkedIn
                      </a>
                    )}
                    
                    {person.ORCID && (
                      <a href={`https://orcid.org/${person.ORCID}`} target="_blank" rel="noopener noreferrer" className={styles.orcidButton}>
                        🔬 ORCID
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
