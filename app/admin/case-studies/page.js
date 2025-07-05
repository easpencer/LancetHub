'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaExclamationTriangle,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import styles from './case-studies-admin.module.css';

export default function CaseStudiesAdmin() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || 'loading';
  const router = useRouter();
  
  const [caseStudies, setCaseStudies] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [formData, setFormData] = useState({
    "Case Study Title": "",
    "Name": "",
    "Section": "",
    "Date": "",
    "Resilient Dimensions": "",
    "Short Description": "",
    "Study Focus": "",
    "Relevance to Community/Societal Resilience": ""
  });
  
  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    fetchCaseStudies();
    fetchDimensions();
  }, [session, status, router]);
  
  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/case-studies');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch case studies: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Fetched case studies:", data);
      setCaseStudies(data.caseStudies || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching case studies:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const fetchDimensions = async () => {
    try {
      const response = await fetch('/api/admin/dimensions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dimensions');
      }
      
      const data = await response.json();
      if (data && data.dimensions) {
        setDimensions(data.dimensions);
      } else {
        console.warn('Dimensions data is empty or invalid');
        setDimensions([]);
      }
    } catch (err) {
      console.error('Error fetching dimensions:', err);
      setDimensions([]);
    }
  };
  
  const handleCreateNew = () => {
    setFormData({
      "Case Study Title": "",
      "Name": "",
      "Section": "",
      "Date": new Date().toISOString().split('T')[0],
      "Resilient Dimensions": "",
      "Short Description": "",
      "Study Focus": "",
      "Relevance to Community/Societal Resilience": ""
    });
    setEditingStudy(null);
    setIsEditing(true);
  };
  
  const handleEdit = (study) => {
    setFormData({
      "Case Study Title": study["Case Study Title"] || "",
      "Name": study["Name"] || "",
      "Section": study["Section"] || "",
      "Date": study["Date"] ? new Date(study["Date"]).toISOString().split('T')[0] : "",
      "Resilient Dimensions": study["Resilient Dimensions"] || "",
      "Short Description": study["Short Description"] || "",
      "Study Focus": study["Study Focus"] || "",
      "Relevance to Community/Societal Resilience": study["Relevance to Community/Societal Resilience"] || ""
    });
    setEditingStudy(study);
    setIsEditing(true);
  };
  
  const handleDelete = async (studyId) => {
    if (!confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/case-studies?id=${studyId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete case study: ${response.status} ${response.statusText}`);
      }
      
      // Refresh the list
      await fetchCaseStudies();
      
    } catch (err) {
      console.error('Error deleting case study:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const method = editingStudy ? 'PUT' : 'POST';
      const url = editingStudy ? 
        `/api/admin/case-studies?id=${editingStudy.id}` : 
        '/api/admin/case-studies';
      
      console.log(`Submitting case study with ${method} to ${url}:`, formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to ${editingStudy ? 'update' : 'create'} case study: ${errorData.error || response.status}`);
      }
      
      // Reset form and refresh list
      setIsEditing(false);
      setEditingStudy(null);
      await fetchCaseStudies();
      
    } catch (err) {
      console.error(`Error ${editingStudy ? 'updating' : 'creating'} case study:`, err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const filteredCaseStudies = caseStudies
    .filter(study => {
      // Search filter
      const matchesSearch = (
        study["Case Study Title"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study["Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study["Short Description"]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Section filter
      const matchesSection = filterSection === 'all' || study["Section"] === filterSection;
      
      return matchesSearch && matchesSection;
    });
  
  // Get unique sections for the filter
  const sections = ['all', ...new Set(caseStudies.map(study => study["Section"]).filter(Boolean))];
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/admin/dashboard" className={styles.backLink}>
              Back to Dashboard
            </Link>
            <h1>Case Studies Management</h1>
          </div>
          <button 
            className={styles.createButton}
            onClick={handleCreateNew}
            disabled={isEditing}
          >
            <FaPlus /> New Case Study
          </button>
        </div>
      </header>
      
      <div className={styles.content}>
        {error && (
          <div className={styles.errorMessage}>
            <FaExclamationTriangle /> {error}
          </div>
        )}
        
        {isEditing ? (
          <div className={styles.editSection}>
            <div className={styles.editHeader}>
              <h2>{editingStudy ? 'Edit Case Study' : 'Create New Case Study'}</h2>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                <FaTimes /> Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Title*</label>
                  <input
                    type="text"
                    id="title"
                    name="Case Study Title"
                    value={formData["Case Study Title"]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="author">Author*</label>
                  <input
                    type="text"
                    id="author"
                    name="Name"
                    value={formData["Name"]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="section">Section</label>
                  <input
                    type="text"
                    id="section"
                    name="Section"
                    value={formData["Section"]}
                    onChange={handleInputChange}
                    placeholder="e.g. Case Study, Field Report, Research"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="Date"
                    value={formData["Date"]}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="dimensions">Resilient Dimensions*</label>
                  <input
                    type="text"
                    id="dimensions"
                    name="Resilient Dimensions"
                    value={formData["Resilient Dimensions"]}
                    onChange={handleInputChange}
                    placeholder="Comma-separated list of dimensions"
                    required
                  />
                  <div className={styles.dimensionsHelp}>
                    Available dimensions: {dimensions && dimensions.length > 0 ? 
                      dimensions.map(d => d.Name || '').filter(Boolean).join(', ') : 
                      'Loading dimensions...'}
                  </div>
                </div>
                
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="description">Short Description*</label>
                  <textarea
                    id="description"
                    name="Short Description"
                    value={formData["Short Description"]}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="focus">Study Focus*</label>
                  <textarea
                    id="focus"
                    name="Study Focus"
                    value={formData["Study Focus"]}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="relevance">Relevance to Community/Societal Resilience*</label>
                  <textarea
                    id="relevance"
                    name="Relevance to Community/Societal Resilience"
                    value={formData["Relevance to Community/Societal Resilience"]}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={loading}
                >
                  <FaSave /> {loading ? 'Saving...' : 'Save Case Study'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className={styles.filters}>
              <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.filterContainer}>
                <FaFilter className={styles.filterIcon} />
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className={styles.filterSelect}
                >
                  {sections.map((section, index) => (
                    <option key={index} value={section}>
                      {section === 'all' ? 'All Sections' : section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className="loading-animation">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p>Loading case studies...</p>
              </div>
            ) : filteredCaseStudies.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No case studies found matching your search criteria.</p>
                <button 
                  className={styles.createButton} 
                  onClick={handleCreateNew}
                >
                  <FaPlus /> Create Your First Case Study
                </button>
              </div>
            ) : (
              <div className={styles.studiesList}>
                <div className={styles.studiesHeader}>
                  <div>Title</div>
                  <div>Author</div>
                  <div>Section</div>
                  <div>Date</div>
                  <div>Actions</div>
                </div>
                
                {filteredCaseStudies.map((study) => (
                  <div key={study.id} className={styles.studyItem}>
                    <div className={styles.studyTitle}>
                      {study["Case Study Title"]}
                      <span className={styles.dimensionsLabel}>
                        {study["Resilient Dimensions"]}
                      </span>
                    </div>
                    <div>{study["Name"]}</div>
                    <div>{study["Section"] || '-'}</div>
                    <div>
                      {study["Date"] ? 
                        new Date(study["Date"]).toLocaleDateString() : 
                        '-'
                      }
                    </div>
                    <div className={styles.actions}>
                      <button 
                        onClick={() => handleEdit(study)} 
                        className={styles.editButton}
                        aria-label="Edit case study"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(study.id)} 
                        className={styles.deleteButton}
                        aria-label="Delete case study"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
