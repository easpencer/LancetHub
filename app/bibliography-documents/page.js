'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaExternalLinkAlt, 
  FaQuoteRight, 
  FaFilter, 
  FaLayerGroup, 
  FaTags, 
  FaList, 
  FaTh,
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaBookOpen
} from 'react-icons/fa';
import AnimatedSection from '../../components/AnimatedSection';
import LoadingState from '../../components/LoadingState';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './bibliography-documents.module.css';

export default function BibliographyDocuments() {
  const [papers, setPapers] = useState([]);
  const [references, setReferences] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [filteredReferences, setFilteredReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  
  // Main tab state
  const [activeMainTab, setActiveMainTab] = useState('bibliography'); // 'bibliography' or 'documents'
  
  // Bibliography filters
  const [bibliographySearchTerm, setBibliographySearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterDimension, setFilterDimension] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [bibliographyViewMode, setBibliographyViewMode] = useState('all');
  const [years, setYears] = useState(['all']);
  const [dimensions, setDimensions] = useState(['all']);
  const [types, setTypes] = useState(['all']);
  const [bibliographySortBy, setBibliographySortBy] = useState('year-desc');
  
  // References filters
  const [referencesSearchTerm, setReferencesSearchTerm] = useState('');
  const [referencesFilterType, setReferencesFilterType] = useState('all');
  const [referencesTypes, setReferencesTypes] = useState(['all']);
  const [referencesSortBy, setReferencesSortBy] = useState('title');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch bibliography data
      const bibliographyRes = await fetch('/api/bibliography');
      if (!bibliographyRes.ok) {
        throw new Error(`Failed to fetch bibliography: ${bibliographyRes.status}`);
      }
      const bibliographyData = await bibliographyRes.json();
      console.log('Bibliography data received:', bibliographyData);
      const papersData = bibliographyData.papers || [];
      console.log('Total papers:', papersData.length);
      setPapers(papersData);
      setFilteredPapers(papersData);
      
      // Extract unique values for bibliography filters
      const yearSet = new Set(papersData.map(paper => paper.Year).filter(Boolean));
      const dimensionSet = new Set(papersData.map(paper => paper.Dimension).filter(Boolean));
      const typeSet = new Set(papersData.map(paper => paper.Type).filter(Boolean));
      
      setYears(['all', ...Array.from(yearSet).sort().reverse()]);
      setDimensions(['all', ...Array.from(dimensionSet).sort()]);
      setTypes(['all', ...Array.from(typeSet).sort()]);
      
      // Load references data (mock for now)
      const referencesData = getMockReferences();
      setReferences(referencesData);
      setFilteredReferences(referencesData);
      
      const refTypeSet = new Set(referencesData.map(ref => ref.type).filter(Boolean));
      setReferencesTypes(['all', ...Array.from(refTypeSet).sort()]);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getMockReferences = () => [
    {
      id: 'ref-1',
      title: 'The Lancet Commission Report: US Societal Resilience in a Global Pandemic Age',
      type: 'Commission Report',
      year: '2024',
      authors: 'Commission Members',
      description: 'Full report of The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future.',
      url: 'https://www.thelancet.com/commissions/us-resilience',
      downloadUrl: '/documents/commission-report-2024.pdf',
      tags: ['Commission Report', 'Policy', 'Framework']
    },
    {
      id: 'ref-2',
      title: 'Community Resilience Framework: Implementation Guide',
      type: 'Implementation Guide',
      year: '2024',
      authors: 'Framework Working Group',
      description: 'Practical guide for implementing the seven dimensions of community resilience at local and regional levels.',
      url: '/documents/resilience-framework-guide.pdf',
      downloadUrl: '/documents/resilience-framework-guide.pdf',
      tags: ['Framework', 'Implementation', 'Community']
    },
    {
      id: 'ref-3',
      title: 'Data Collection Methodology: Case Study Template',
      type: 'Methodology',
      year: '2024',
      authors: 'Research Team',
      description: 'Standardized template and methodology for collecting and analyzing community resilience case studies.',
      downloadUrl: '/documents/case-study-template.pdf',
      tags: ['Methodology', 'Template', 'Research']
    },
    {
      id: 'ref-4',
      title: 'Policy Brief: Strengthening Pandemic Preparedness',
      type: 'Policy Brief',
      year: '2024',
      authors: 'Policy Working Group',
      description: 'Key policy recommendations for enhancing societal resilience to future pandemic threats.',
      downloadUrl: '/documents/policy-brief-preparedness.pdf',
      tags: ['Policy', 'Preparedness', 'Recommendations']
    }
  ];

  // Filter and sort functions
  useEffect(() => {
    let filtered = papers;
    
    if (bibliographySearchTerm) {
      filtered = filtered.filter(paper =>
        paper.Name?.toLowerCase().includes(bibliographySearchTerm.toLowerCase()) ||
        paper.Title?.toLowerCase().includes(bibliographySearchTerm.toLowerCase()) ||
        paper.Authors?.toLowerCase().includes(bibliographySearchTerm.toLowerCase()) ||
        paper.Abstract?.toLowerCase().includes(bibliographySearchTerm.toLowerCase()) ||
        paper.Keywords?.toLowerCase().includes(bibliographySearchTerm.toLowerCase())
      );
    }
    
    if (filterYear !== 'all') {
      filtered = filtered.filter(paper => paper.Year === filterYear);
    }
    
    if (filterDimension !== 'all') {
      filtered = filtered.filter(paper => paper.Dimension === filterDimension);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(paper => paper.Type === filterType);
    }
    
    // Sort bibliography
    filtered = sortBibliography(filtered, bibliographySortBy);
    
    setFilteredPapers(filtered);
  }, [papers, bibliographySearchTerm, filterYear, filterDimension, filterType, bibliographySortBy]);

  useEffect(() => {
    let filtered = references;
    
    if (referencesSearchTerm) {
      filtered = filtered.filter(ref =>
        ref.title?.toLowerCase().includes(referencesSearchTerm.toLowerCase()) ||
        ref.authors?.toLowerCase().includes(referencesSearchTerm.toLowerCase()) ||
        ref.description?.toLowerCase().includes(referencesSearchTerm.toLowerCase())
      );
    }
    
    if (referencesFilterType !== 'all') {
      filtered = filtered.filter(ref => ref.type === referencesFilterType);
    }
    
    // Sort references
    filtered = sortReferences(filtered, referencesSortBy);
    
    setFilteredReferences(filtered);
  }, [references, referencesSearchTerm, referencesFilterType, referencesSortBy]);

  const sortBibliography = (papers, sortBy) => {
    return [...papers].sort((a, b) => {
      switch (sortBy) {
        case 'year-desc':
          return (b.Year || 0) - (a.Year || 0);
        case 'year-asc':
          return (a.Year || 0) - (b.Year || 0);
        case 'title':
          return (a.Name || a.Title || '').localeCompare(b.Name || b.Title || '');
        case 'author':
          return (a.Authors || '').localeCompare(b.Authors || '');
        default:
          return 0;
      }
    });
  };

  const sortReferences = (refs, sortBy) => {
    return [...refs].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'year-desc':
          return (b.year || 0) - (a.year || 0);
        case 'year-asc':
          return (a.year || 0) - (b.year || 0);
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return <LoadingState message="Loading Bibliography and Documents..." />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={fetchData} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    // <ErrorBoundary>
      <div className={styles.container}>
        <div style={{ color: 'white', padding: '1rem' }}>Debug: Page loaded, {papers.length} papers found</div>
        {/* <AnimatedSection> */}
          <div className={styles.header}>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Bibliography & Documents
            </motion.h1>
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Comprehensive collection of research papers, reports, and supporting documents
            </motion.p>
          </div>

          {/* Main Tabs */}
          <div className={styles.mainTabs}>
            <button
              className={`${styles.mainTab} ${activeMainTab === 'bibliography' ? styles.activeMainTab : ''}`}
              onClick={() => setActiveMainTab('bibliography')}
            >
              <FaBookOpen />
              Bibliography ({papers.length})
            </button>
            <button
              className={`${styles.mainTab} ${activeMainTab === 'documents' ? styles.activeMainTab : ''}`}
              onClick={() => setActiveMainTab('documents')}
            >
              <FaFileAlt />
              Documents ({references.length})
            </button>
          </div>

          {/* Bibliography Content */}
          {activeMainTab === 'bibliography' && (
            <div className={styles.bibliographyContent}>
              {/* Bibliography Controls */}
              <div className={styles.controls}>
                <div className={styles.searchControls}>
                  <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search papers by title, author, or abstract..."
                      value={bibliographySearchTerm}
                      onChange={(e) => setBibliographySearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                </div>

                <div className={styles.filters}>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterDimension}
                    onChange={(e) => setFilterDimension(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {dimensions.map(dim => (
                      <option key={dim} value={dim}>
                        {dim === 'all' ? 'All Dimensions' : dim}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>

                  <select
                    value={bibliographySortBy}
                    onChange={(e) => setBibliographySortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="year-desc">Newest First</option>
                    <option value="year-asc">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="author">Author A-Z</option>
                  </select>
                </div>
              </div>

              {/* Bibliography Results */}
              <div className={styles.resultsHeader}>
                <h3>
                  {filteredPapers.length} papers found
                  {bibliographySearchTerm && ` for "${bibliographySearchTerm}"`}
                </h3>
              </div>

              <div className={styles.papersGrid}>
                {filteredPapers.map((paper, index) => {
                  // Debug log for first paper
                  if (index === 0) console.log('First paper structure:', paper);
                  
                  return (
                    <motion.div
                      key={paper.id || paper.Name || index}
                      className={styles.paperCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 1) }}
                      onClick={() => setSelectedPaper(paper)}
                      style={{ cursor: 'pointer' }}
                    >
                    <div className={styles.paperHeader}>
                      <h3 className={styles.paperTitle}>{paper.Name || paper.Title}</h3>
                      <div className={styles.paperMeta}>
                        <span className={styles.paperYear}><FaCalendarAlt /> {paper.Year}</span>
                        {paper.Dimension && (
                          <span className={styles.paperDimension}><FaTags /> {paper.Dimension}</span>
                        )}
                        {paper.Type && (
                          <span className={styles.paperType}>{paper.Type}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.paperContent}>
                      {paper.Authors && (
                        <p className={styles.paperAuthors}>
                          <FaUser /> {paper.Authors}
                        </p>
                      )}
                      
                      {paper.Abstract && (
                        <p className={styles.paperAbstract}>
                          {paper.Abstract.length > 300 
                            ? `${paper.Abstract.substring(0, 300)}...`
                            : paper.Abstract
                          }
                        </p>
                      )}
                      
                      {(paper.Journal || paper.Publication) && (
                        <p className={styles.paperJournal}>
                          <em>{paper.Journal || paper.Publication}</em>
                        </p>
                      )}
                    </div>

                    <div className={styles.paperFooter}>
                      {paper.URL && (
                        <a
                          href={paper.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.paperLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt /> View Paper
                        </a>
                      )}
                      <button className={styles.citeButton}>
                        <FaQuoteRight /> Cite
                      </button>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documents Content */}
          {activeMainTab === 'documents' && (
            <div className={styles.documentsContent}>
              {/* Documents Controls */}
              <div className={styles.controls}>
                <div className={styles.searchControls}>
                  <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search documents by title, author, or description..."
                      value={referencesSearchTerm}
                      onChange={(e) => setReferencesSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                </div>

                <div className={styles.filters}>
                  <select
                    value={referencesFilterType}
                    onChange={(e) => setReferencesFilterType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {referencesTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Document Types' : type}
                      </option>
                    ))}
                  </select>

                  <select
                    value={referencesSortBy}
                    onChange={(e) => setReferencesSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="title">Title A-Z</option>
                    <option value="type">Type</option>
                    <option value="year-desc">Newest First</option>
                    <option value="year-asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Documents Results */}
              <div className={styles.resultsHeader}>
                <h3>
                  {filteredReferences.length} documents found
                  {referencesSearchTerm && ` for "${referencesSearchTerm}"`}
                </h3>
              </div>

              <div className={styles.documentsGrid}>
                {filteredReferences.map((doc, index) => (
                  <motion.div
                    key={doc.id || index}
                    className={styles.documentCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 1) }}
                  >
                    <div className={styles.documentHeader}>
                      <h3 className={styles.documentTitle}>{doc.title}</h3>
                      <div className={styles.documentMeta}>
                        <span className={styles.documentType}>{doc.type}</span>
                        <span className={styles.documentYear}>{doc.year}</span>
                      </div>
                    </div>

                    <div className={styles.documentContent}>
                      {doc.authors && (
                        <p className={styles.documentAuthors}>
                          <FaUser /> {doc.authors}
                        </p>
                      )}
                      
                      <p className={styles.documentDescription}>
                        {doc.description}
                      </p>
                      
                      {doc.tags && doc.tags.length > 0 && (
                        <div className={styles.documentTags}>
                          {doc.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.documentFooter}>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.documentLink}
                        >
                          <FaExternalLinkAlt /> View Online
                        </a>
                      )}
                      {doc.downloadUrl && (
                        <a
                          href={doc.downloadUrl}
                          download
                          className={styles.downloadButton}
                        >
                          <FaDownload /> Download
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        {/* </AnimatedSection> */}

        {/* Paper Detail Modal */}
        {selectedPaper && (
          <div className={styles.modalOverlay} onClick={() => setSelectedPaper(null)}>
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.modalClose}
                onClick={() => setSelectedPaper(null)}
              >
                &times;
              </button>
              
              <h2>{selectedPaper.Name || selectedPaper.Title}</h2>
              
              <div className={styles.modalMeta}>
                {selectedPaper.Authors && <p><strong>Authors:</strong> {selectedPaper.Authors}</p>}
                {selectedPaper.Year && <p><strong>Year:</strong> {selectedPaper.Year}</p>}
                {(selectedPaper.Journal || selectedPaper.Publication) && <p><strong>Publication:</strong> {selectedPaper.Journal || selectedPaper.Publication}</p>}
                {selectedPaper.Dimension && <p><strong>Dimension:</strong> {selectedPaper.Dimension}</p>}
                {selectedPaper.Type && <p><strong>Type:</strong> {selectedPaper.Type}</p>}
              </div>
              
              {selectedPaper.Abstract && (
                <div className={styles.modalAbstract}>
                  <h3>Abstract</h3>
                  <p>{selectedPaper.Abstract}</p>
                </div>
              )}
              
              {selectedPaper.Keywords && (
                <div className={styles.modalKeywords}>
                  <h3>Keywords</h3>
                  <p>{selectedPaper.Keywords}</p>
                </div>
              )}
              
              <div className={styles.modalActions}>
                {selectedPaper.URL && (
                  <a
                    href={selectedPaper.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalLink}
                  >
                    <FaExternalLinkAlt /> View Full Paper
                  </a>
                )}
                {selectedPaper.DOI && (
                  <a
                    href={`https://doi.org/${selectedPaper.DOI}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalLink}
                  >
                    DOI: {selectedPaper.DOI}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    // </ErrorBoundary>
  );
}