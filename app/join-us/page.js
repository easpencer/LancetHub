'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaEnvelope, FaFileAlt, FaCheck, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './join-us.module.css';
import { AnimatedSection } from '../../components/AnimatedSection';

export default function JoinUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    interests: [],
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const interestAreas = [
    'Health Equity Research',
    'Policy Development',
    'Community Organizing',
    'Environmental Resilience',
    'Public Health',
    'Education',
    'Healthcare Delivery',
    'Economic Sustainability',
    'Cultural Preservation',
    'Traditional Knowledge Systems'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return { 
          ...prev, 
          interests: [...prev.interests, value] 
        };
      } else {
        return { 
          ...prev, 
          interests: prev.interests.filter(interest => interest !== value) 
        };
      }
    });
    
    // Clear error when interests are being selected
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate organization
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }
    
    // Validate interests
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would send data to an API endpoint
      // For now, simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful submission
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form data
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        interests: [],
        message: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setErrors({
        submit: 'An error occurred while submitting the form. Please try again.'
      });
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.thankYouMessage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.checkmarkIcon}>
            <FaCheck />
          </div>
          <h2>Thank You for Joining Us!</h2>
          <p>
            Your information has been successfully submitted. We'll be in touch soon with more details about 
            the Lancet Commission network and opportunities to collaborate.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Join Our Network</h1>
        <p className={styles.subtitle}>
          Connect with researchers, practitioners, and community leaders working to strengthen societal resilience
        </p>
      </motion.div>
      
      <div className={styles.contentWrapper}>
        <AnimatedSection type="slide" className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="organization">Organization/Institution*</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className={errors.organization ? styles.inputError : ''}
                />
                {errors.organization && <div className={styles.errorMessage}>{errors.organization}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="role">Role/Position</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Areas of Interest*</label>
                <div className={styles.checkboxGroup}>
                  {interestAreas.map(area => (
                    <label key={area} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        value={area}
                        checked={formData.interests.includes(area)}
                        onChange={handleCheckboxChange}
                      />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
                {errors.interests && <div className={styles.errorMessage}>{errors.interests}</div>}
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share how you'd like to contribute or any specific interests related to the Commission's work"
                ></textarea>
              </div>
            </div>
            
            {errors.submit && (
              <div className={styles.submitError}>
                <FaExclamationTriangle /> {errors.submit}
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Join the Network'}
            </button>
          </form>
        </AnimatedSection>
        
        <AnimatedSection type="fade" delay={0.3} className={styles.infoSidebar}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <FaUsers />
            </div>
            <h3>Connect With Experts</h3>
            <p>
              Join a diverse network of researchers, practitioners, and community leaders 
              working to build societal resilience in the face of global challenges.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <FaEnvelope />
            </div>
            <h3>Stay Informed</h3>
            <p>
              Receive updates on the Commission's work, including upcoming events, 
              new publications, and opportunities for collaboration.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <FaFileAlt />
            </div>
            <h3>Access Resources</h3>
            <p>
              Get early access to research findings, toolkits, and other resources 
              developed by the Commission and its partners.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
            </div>
            <h3>Questions?</h3>
            <p>
              For inquiries about the Lancet Commission network or other ways to get involved, 
              please contact us at <a href="mailto:info@lancetcommission.org">info@lancetcommission.org</a>.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
