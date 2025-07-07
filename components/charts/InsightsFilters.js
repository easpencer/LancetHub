'use client';

import { useState } from 'react';
import { FaFilter, FaCalendarAlt, FaTags, FaLayerGroup } from 'react-icons/fa';
import styles from './InsightsFilters.module.css';

export default function InsightsFilters({ onFilterChange, dimensions, studyTypes }) {
  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'all',
    dimension: 'all',
    studyType: 'all',
    priority: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  const priorityLevels = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(v => v !== 'all').length;
  };

  const resetFilters = () => {
    const resetState = {
      dateRange: 'all',
      dimension: 'all',
      studyType: 'all',
      priority: 'all'
    };
    setActiveFilters(resetState);
    onFilterChange(resetState);
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterHeader}>
        <button 
          className={styles.filterToggle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaFilter />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className={styles.filterBadge}>{getActiveFilterCount()}</span>
          )}
        </button>
        
        {getActiveFilterCount() > 0 && (
          <button 
            className={styles.clearButton}
            onClick={resetFilters}
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.filterContent}>
          {/* Date Range Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <FaCalendarAlt /> Time Period
            </label>
            <div className={styles.filterOptions}>
              {dateRanges.map(range => (
                <button
                  key={range.value}
                  className={`${styles.filterOption} ${
                    activeFilters.dateRange === range.value ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('dateRange', range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <FaLayerGroup /> Dimension
            </label>
            <div className={styles.filterOptions}>
              <button
                className={`${styles.filterOption} ${
                  activeFilters.dimension === 'all' ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('dimension', 'all')}
              >
                All Dimensions
              </button>
              {dimensions && dimensions.map(dim => (
                <button
                  key={dim}
                  className={`${styles.filterOption} ${
                    activeFilters.dimension === dim ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('dimension', dim)}
                >
                  {dim}
                </button>
              ))}
            </div>
          </div>

          {/* Study Type Filter */}
          {studyTypes && studyTypes.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <FaTags /> Study Type
              </label>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterOption} ${
                    activeFilters.studyType === 'all' ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('studyType', 'all')}
                >
                  All Types
                </button>
                {studyTypes.map(type => (
                  <button
                    key={type}
                    className={`${styles.filterOption} ${
                      activeFilters.studyType === type ? styles.active : ''
                    }`}
                    onClick={() => handleFilterChange('studyType', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priority Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <FaFilter /> Priority Level
            </label>
            <div className={styles.filterOptions}>
              {priorityLevels.map(level => (
                <button
                  key={level.value}
                  className={`${styles.filterOption} ${
                    activeFilters.priority === level.value ? styles.active : ''
                  }`}
                  onClick={() => handleFilterChange('priority', level.value)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}