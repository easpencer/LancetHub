'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaEnvelope, FaLinkedin, FaTwitter } from 'react-icons/fa';
import styles from './members.module.css';

export default function CommissionMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch commissioners from our API
        const response = await fetch('/api/people?role=Commissioner');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch commissioners: ${response.status}`);
        }
        
        const data = await response.json();
        setMembers(data.people || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching commissioners:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  const handleSelectMember = (member) => {
    setSelectedMember(member);
    // Scroll to top when selecting a member
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCloseMember = () => {
    setSelectedMember(null);
  };
  
  // Group members by their role
  const groupedMembers = members.reduce((acc, member) => {
    const role = member.Role || 'Other';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {});
  
  // Order roles: first Chairs, then Co-chairs, then Commissioners
  const orderedRoles = Object.keys(groupedMembers).sort((a, b) => {
    const order = { 'Chair': 1, 'Co-chair': 2, 'Commissioner': 3 };
    return (order[a] || 99) - (order[b] || 99);
  });
  
  return (
    <div className={styles.container}>
      {selectedMember ? (
        <motion.div 
          className={styles.memberDetail}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={handleCloseMember}
            className={styles.backButton}
          >
            <FaArrowLeft /> Back to All Commissioners
          </button>
          
          <div className={styles.memberProfile}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                {selectedMember.Photo ? (
                  <Image 
                    src={selectedMember.Photo[0].url}
                    alt={selectedMember.Name}
                    width={200}
                    height={200}
                    className={styles.profileImage}
                  />
                ) : (
                  <div className={styles.profilePlaceholder}>
                    {selectedMember.Name && selectedMember.Name[0]}
                  </div>
                )}
              </div>
              
              <div className={styles.profileInfo}>
                <h2>{selectedMember.Name}</h2>
                <p className={styles.role}>{selectedMember.Role}</p>
                <p className={styles.affiliation}>{selectedMember.Affiliation}</p>
                
                <div className={styles.socialLinks}>
                  {selectedMember.Contact && (
                    <a 
                      href={`mailto:${selectedMember.Contact}`}
                      className={styles.socialLink}
                      title="Email"
                    >
                      <FaEnvelope />
                    </a>
                  )}
                  {selectedMember.LinkedIn && (
                    <a 
                      href={selectedMember.LinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      title="LinkedIn"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {selectedMember.Twitter && (
                    <a 
                      href={selectedMember.Twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      title="Twitter"
                    >
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.profileContent}>
              <div className={styles.expertise}>
                <h3>Areas of Expertise</h3>
                {selectedMember.Expertise && (
                  <div className={styles.expertiseTags}>
                    {selectedMember.Expertise.split(',').map((expertise, index) => (
                      <span key={index} className={styles.expertiseTag}>
                        {expertise.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.bio}>
                <h3>Biography</h3>
                <div className={styles.bioText}>
                  {selectedMember.Bio ? (
                    <p>{selectedMember.Bio}</p>
                  ) : (
                    <p>No biography available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <h1>Commissioners</h1>
          <p className={styles.intro}>
            The Lancet Commission on Societal Resilience brings together diverse experts from public health, 
            economics, climate science, social sciences, policy, and community leadership to develop 
            a comprehensive framework for building resilient societies.
          </p>
          
          {loading ? (
            <div className={styles.loading}>
              <div className="loading-animation">
                <div></div><div></div><div></div><div></div>
              </div>
              <p>Loading commissioners...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error loading commissioners: {error}</p>
              <p>Please try refreshing the page.</p>
            </div>
          ) : (
            <>
              {orderedRoles.map(role => (
                <div key={role} className={styles.roleSection}>
                  <h2 className={styles.roleTitle}>{role}</h2>
                  <div className={styles.membersGrid}>
                    {groupedMembers[role].map(member => (
                      <motion.div
                        key={member.id}
                        className={styles.memberCard}
                        onClick={() => handleSelectMember(member)}
                        whileHover={{ 
                          y: -10,
                          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                          transition: { duration: 0.3 }
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={styles.cardImageContainer}>
                          {member.Photo ? (
                            <Image 
                              src={member.Photo[0].url}
                              alt={member.Name}
                              width={150}
                              height={150}
                              className={styles.cardImage}
                            />
                          ) : (
                            <div className={styles.cardPlaceholder}>
                              {member.Name && member.Name[0]}
                            </div>
                          )}
                        </div>
                        <div className={styles.cardContent}>
                          <h3>{member.Name}</h3>
                          <p className={styles.cardAffiliation}>{member.Affiliation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
