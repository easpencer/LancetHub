'use client';

import { useState, useEffect } from 'react';
import styles from './people.module.css';

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from Airtable API
    // For now, we'll use static data from the CSV
    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/people');
        
        if (!response.ok) {
          throw new Error('Failed to fetch people data');
        }
        
        const data = await response.json();
        setPeople(data.people);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading people data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>People</h1>
      <p>Meet the team members and contributors.</p>
      
      <div className={styles.grid}>
        {people.map((person, index) => (
          <div key={index} className={styles.personCard}>
            {person.Image && (
              <div className={styles.imageContainer}>
                <img 
                  src={`/api/image?url=${encodeURIComponent(person.Image)}`}
                  alt={`Photo of ${person.Name}`} 
                  className={styles.personImage}
                />
              </div>
            )}
            <div className={styles.personInfo}>
              <h2 className={styles.personName}>{person.Name}</h2>
              <p className={styles.personAffiliation}>{person.Affiliation}</p>
              {person.Contact && (
                <p className={styles.personContact}>
                  <a href={`mailto:${person.Contact}`}>{person.Contact}</a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
