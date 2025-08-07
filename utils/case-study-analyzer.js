/**
 * Rigorous Case Study Analysis Module
 * Extracts factual patterns without interpretation or bias
 * All methods are transparent and reproducible
 */

class CaseStudyAnalyzer {
  constructor(caseStudies) {
    this.studies = caseStudies || [];
  }

  /**
   * 1. DESCRIPTIVE STATISTICS - Pure facts, no interpretation
   */
  getDescriptiveStats() {
    const stats = {
      totalStudies: this.studies.length,
      studyTypes: this.countFrequencies('Study Type '),
      dimensions: this.countFrequencies('Resilient Dimensions ', true),
      temporalDistribution: this.getTemporalDistribution(),
      geographicDistribution: this.extractGeographicData(),
      dataCompleteness: this.assessDataCompleteness()
    };
    
    return stats;
  }

  /**
   * 2. RESEARCH QUESTION EXTRACTION - What are studies actually asking?
   */
  extractResearchQuestions() {
    const questions = this.studies.map(study => {
      const focus = study['Study Focus'] || '';
      
      // Extract key question indicators
      const questionIndicators = {
        examining: this.extractPhrase(focus, /examin\w+\s+(.+?)(?:\.|,|;|$)/gi),
        exploring: this.extractPhrase(focus, /explor\w+\s+(.+?)(?:\.|,|;|$)/gi),
        assessing: this.extractPhrase(focus, /assess\w+\s+(.+?)(?:\.|,|;|$)/gi),
        evaluating: this.extractPhrase(focus, /evaluat\w+\s+(.+?)(?:\.|,|;|$)/gi),
        understanding: this.extractPhrase(focus, /understand\w+\s+(.+?)(?:\.|,|;|$)/gi),
        measuring: this.extractPhrase(focus, /measur\w+\s+(.+?)(?:\.|,|;|$)/gi),
        analyzing: this.extractPhrase(focus, /analyz\w+\s+(.+?)(?:\.|,|;|$)/gi),
        investigating: this.extractPhrase(focus, /investigat\w+\s+(.+?)(?:\.|,|;|$)/gi)
      };
      
      return {
        studyId: study.id,
        title: study['Case Study Title'],
        rawFocus: focus,
        extractedQuestions: questionIndicators,
        hasExplicitQuestion: focus.includes('?')
      };
    });
    
    // Categorize question types
    const questionTypes = {
      descriptive: questions.filter(q => 
        q.extractedQuestions.understanding.length > 0 || 
        q.extractedQuestions.exploring.length > 0
      ).length,
      evaluative: questions.filter(q => 
        q.extractedQuestions.evaluating.length > 0 || 
        q.extractedQuestions.assessing.length > 0
      ).length,
      analytical: questions.filter(q => 
        q.extractedQuestions.analyzing.length > 0 || 
        q.extractedQuestions.investigating.length > 0
      ).length,
      measurement: questions.filter(q => 
        q.extractedQuestions.measuring.length > 0
      ).length
    };
    
    return {
      questions,
      questionTypes,
      totalWithExplicitQuestion: questions.filter(q => q.hasExplicitQuestion).length
    };
  }

  /**
   * 3. METHODOLOGICAL MAPPING - What methods are actually being used?
   */
  extractMethodologies() {
    const methodIndicators = {
      // Data collection methods
      surveys: ['survey', 'questionnaire', 'poll'],
      interviews: ['interview', 'discussion', 'conversation'],
      focusGroups: ['focus group', 'group discussion'],
      observation: ['observation', 'ethnograph', 'fieldwork'],
      documentAnalysis: ['document analysis', 'archival', 'records'],
      
      // Study designs
      experimental: ['experiment', 'RCT', 'randomized', 'control group'],
      quasiExperimental: ['quasi-experiment', 'comparison group', 'matched'],
      longitudinal: ['longitudinal', 'follow-up', 'panel', 'cohort'],
      crossSectional: ['cross-sectional', 'snapshot', 'point-in-time'],
      caseStudy: ['case study', 'in-depth', 'detailed examination'],
      
      // Analysis approaches
      qualitative: ['qualitative', 'thematic', 'content analysis', 'grounded theory'],
      quantitative: ['quantitative', 'statistical', 'regression', 'correlation'],
      mixedMethods: ['mixed method', 'mixed-method', 'quali-quant', 'triangulation']
    };
    
    const methodologies = this.studies.map(study => {
      const description = (study['Short Description'] || '').toLowerCase();
      const studyType = (study['Study Type '] || '').toLowerCase();
      const combined = `${description} ${studyType}`;
      
      const detectedMethods = {};
      
      // Check for each method type
      for (const [method, indicators] of Object.entries(methodIndicators)) {
        detectedMethods[method] = indicators.some(indicator => 
          combined.includes(indicator.toLowerCase())
        );
      }
      
      return {
        studyId: study.id,
        title: study['Case Study Title'],
        statedType: study['Study Type '],
        detectedMethods,
        methodCount: Object.values(detectedMethods).filter(v => v).length
      };
    });
    
    // Aggregate methodology stats
    const methodStats = {};
    for (const method of Object.keys(methodIndicators)) {
      methodStats[method] = methodologies.filter(m => m.detectedMethods[method]).length;
    }
    
    return {
      individualStudies: methodologies,
      aggregateStats: methodStats,
      averageMethodsPerStudy: (
        methodologies.reduce((sum, m) => sum + m.methodCount, 0) / methodologies.length
      ).toFixed(2)
    };
  }

  /**
   * 4. POPULATION & CONTEXT EXTRACTION - Who is being studied?
   */
  extractPopulations() {
    const populationIndicators = {
      // Age groups
      children: ['child', 'pediatric', 'youth', 'adolescent', 'student'],
      adults: ['adult', 'working age', 'employee', 'worker'],
      elderly: ['elderly', 'senior', 'older adult', 'aging'],
      
      // Vulnerability indicators
      pregnant: ['pregnant', 'maternal', 'prenatal', 'antenatal'],
      chronic: ['chronic disease', 'chronic condition', 'diabetes', 'hypertension'],
      mental: ['mental health', 'depression', 'anxiety', 'psychological'],
      disabled: ['disability', 'disabled', 'special needs'],
      
      // Socioeconomic
      lowIncome: ['low-income', 'poverty', 'disadvantaged', 'underserved'],
      minority: ['minority', 'ethnic', 'racial', 'indigenous'],
      rural: ['rural', 'remote', 'agricultural'],
      urban: ['urban', 'city', 'metropolitan'],
      
      // Settings
      healthcare: ['hospital', 'clinic', 'health facility', 'healthcare worker'],
      community: ['community', 'neighborhood', 'local'],
      workplace: ['workplace', 'occupational', 'employee', 'industry'],
      school: ['school', 'education', 'academic', 'university']
    };
    
    const populations = this.studies.map(study => {
      const text = `${study['Study Focus'] || ''} ${study['Short Description'] || ''} ${study['Relevance to Community/Societal Resilience'] || ''}`.toLowerCase();
      
      const detectedPopulations = {};
      for (const [population, indicators] of Object.entries(populationIndicators)) {
        detectedPopulations[population] = indicators.some(indicator => 
          text.includes(indicator.toLowerCase())
        );
      }
      
      return {
        studyId: study.id,
        title: study['Case Study Title'],
        detectedPopulations,
        populationCount: Object.values(detectedPopulations).filter(v => v).length
      };
    });
    
    // Aggregate population stats
    const populationStats = {};
    for (const population of Object.keys(populationIndicators)) {
      populationStats[population] = populations.filter(p => 
        p.detectedPopulations[population]
      ).length;
    }
    
    return {
      individualStudies: populations,
      aggregateStats: populationStats,
      averagePopulationsPerStudy: (
        populations.reduce((sum, p) => sum + p.populationCount, 0) / populations.length
      ).toFixed(2)
    };
  }

  /**
   * 5. RESILIENCE MECHANISM EXTRACTION - What resilience factors are studied?
   */
  extractResilienceMechanisms() {
    const mechanismIndicators = {
      // Individual level
      adaptation: ['adapt', 'flexibility', 'adjust', 'cope', 'coping'],
      preparedness: ['prepared', 'readiness', 'planning', 'anticipat'],
      knowledge: ['knowledge', 'awareness', 'education', 'literacy', 'understanding'],
      behavior: ['behavior', 'practice', 'action', 'uptake', 'compliance'],
      
      // Community level
      socialCapital: ['social capital', 'social network', 'social support', 'cohesion'],
      communication: ['communication', 'messaging', 'information', 'dissemination'],
      collaboration: ['collaboration', 'partnership', 'cooperation', 'coordination'],
      trust: ['trust', 'confidence', 'credibility', 'legitimacy'],
      
      // System level
      capacity: ['capacity', 'capability', 'resource', 'infrastructure'],
      governance: ['governance', 'policy', 'leadership', 'decision'],
      equity: ['equity', 'equality', 'disparity', 'access', 'inclusion'],
      sustainability: ['sustainab', 'long-term', 'maintenance', 'continuity']
    };
    
    const mechanisms = this.studies.map(study => {
      const relevance = (study['Relevance to Community/Societal Resilience'] || '').toLowerCase();
      const description = (study['Short Description'] || '').toLowerCase();
      const combined = `${relevance} ${description}`;
      
      const detectedMechanisms = {};
      for (const [mechanism, indicators] of Object.entries(mechanismIndicators)) {
        detectedMechanisms[mechanism] = indicators.some(indicator => 
          combined.includes(indicator.toLowerCase())
        );
      }
      
      return {
        studyId: study.id,
        title: study['Case Study Title'],
        detectedMechanisms,
        mechanismCount: Object.values(detectedMechanisms).filter(v => v).length,
        explicitRelevance: relevance.length > 50 // Has substantial relevance description
      };
    });
    
    // Aggregate mechanism stats
    const mechanismStats = {};
    for (const mechanism of Object.keys(mechanismIndicators)) {
      mechanismStats[mechanism] = mechanisms.filter(m => 
        m.detectedMechanisms[mechanism]
      ).length;
    }
    
    return {
      individualStudies: mechanisms,
      aggregateStats: mechanismStats,
      averageMechanismsPerStudy: (
        mechanisms.reduce((sum, m) => sum + m.mechanismCount, 0) / mechanisms.length
      ).toFixed(2),
      studiesWithExplicitRelevance: mechanisms.filter(m => m.explicitRelevance).length
    };
  }

  /**
   * 6. CO-OCCURRENCE ANALYSIS - What patterns appear together?
   */
  analyzeCoOccurrences() {
    const dimensionPairs = {};
    const methodPairs = {};
    
    this.studies.forEach(study => {
      // Dimension co-occurrences
      const dimensions = study['Resilient Dimensions '] || [];
      if (Array.isArray(dimensions) && dimensions.length > 1) {
        for (let i = 0; i < dimensions.length; i++) {
          for (let j = i + 1; j < dimensions.length; j++) {
            const pair = [dimensions[i], dimensions[j]].sort().join(' + ');
            dimensionPairs[pair] = (dimensionPairs[pair] || 0) + 1;
          }
        }
      }
    });
    
    return {
      dimensionPairs: Object.entries(dimensionPairs)
        .sort((a, b) => b[1] - a[1])
        .map(([pair, count]) => ({ pair, count, percentage: ((count / this.studies.length) * 100).toFixed(1) }))
    };
  }

  /**
   * 7. TEMPORAL ANALYSIS - How has research evolved?
   */
  analyzeTemporalPatterns() {
    const studiesByYear = {};
    const dimensionsByYear = {};
    const methodsByYear = {};
    
    this.studies.forEach(study => {
      if (study.Date) {
        const year = new Date(study.Date).getFullYear();
        
        // Studies per year
        studiesByYear[year] = (studiesByYear[year] || 0) + 1;
        
        // Dimensions per year
        const dimensions = study['Resilient Dimensions '] || [];
        if (!dimensionsByYear[year]) dimensionsByYear[year] = {};
        dimensions.forEach(dim => {
          if (!dimensionsByYear[year][dim]) dimensionsByYear[year][dim] = 0;
          dimensionsByYear[year][dim]++;
        });
        
        // Study types per year
        const studyType = study['Study Type '] || 'Unknown';
        if (!methodsByYear[year]) methodsByYear[year] = {};
        methodsByYear[year][studyType] = (methodsByYear[year][studyType] || 0) + 1;
      }
    });
    
    return {
      studiesByYear,
      dimensionsByYear,
      methodsByYear,
      yearsActive: Object.keys(studiesByYear).sort(),
      averageStudiesPerYear: (
        this.studies.length / Object.keys(studiesByYear).length
      ).toFixed(1)
    };
  }

  // UTILITY METHODS
  
  countFrequencies(field, isArray = false) {
    const counts = {};
    
    this.studies.forEach(study => {
      const value = study[field];
      if (value) {
        if (isArray && Array.isArray(value)) {
          value.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
          });
        } else {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([item, count]) => ({
        item,
        count,
        percentage: ((count / this.studies.length) * 100).toFixed(1)
      }));
  }
  
  getTemporalDistribution() {
    const years = {};
    
    this.studies.forEach(study => {
      if (study.Date) {
        const year = new Date(study.Date).getFullYear();
        years[year] = (years[year] || 0) + 1;
      }
    });
    
    return years;
  }
  
  extractGeographicData() {
    const geoTerms = {
      'United States': ['united states', 'usa', 'u.s.', 'america'],
      'Africa': ['africa', 'african'],
      'Asia': ['asia', 'asian'],
      'Europe': ['europe', 'european'],
      'Latin America': ['latin america', 'south america', 'central america'],
      'Global': ['global', 'worldwide', 'international'],
      'Local': ['local', 'community', 'neighborhood']
    };
    
    const geoCounts = {};
    
    this.studies.forEach(study => {
      const keywords = study['Key Words '] || [];
      const text = `${study['Study Focus'] || ''} ${study['Short Description'] || ''} ${keywords.join(' ')}`.toLowerCase();
      
      for (const [region, terms] of Object.entries(geoTerms)) {
        if (terms.some(term => text.includes(term))) {
          geoCounts[region] = (geoCounts[region] || 0) + 1;
        }
      }
    });
    
    return geoCounts;
  }
  
  assessDataCompleteness() {
    const fields = [
      'Case Study Title',
      'Study Focus',
      'Short Description',
      'Relevance to Community/Societal Resilience',
      'Study Type ',
      'Resilient Dimensions ',
      'Key Words ',
      'Date'
    ];
    
    const completeness = {};
    
    fields.forEach(field => {
      const filled = this.studies.filter(study => {
        const value = study[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.length > 0);
      }).length;
      
      completeness[field] = {
        filled,
        missing: this.studies.length - filled,
        percentComplete: ((filled / this.studies.length) * 100).toFixed(1)
      };
    });
    
    return completeness;
  }
  
  extractPhrase(text, pattern) {
    const matches = [];
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    
    return matches;
  }
  
  /**
   * MASTER ANALYSIS - Run all analyses and return comprehensive results
   */
  runComprehensiveAnalysis() {
    return {
      metadata: {
        analysisDate: new Date().toISOString(),
        totalStudies: this.studies.length,
        analysisVersion: '1.0',
        methods: 'Transparent pattern extraction without interpretation'
      },
      descriptiveStats: this.getDescriptiveStats(),
      researchQuestions: this.extractResearchQuestions(),
      methodologies: this.extractMethodologies(),
      populations: this.extractPopulations(),
      resilienceMechanisms: this.extractResilienceMechanisms(),
      coOccurrences: this.analyzeCoOccurrences(),
      temporalPatterns: this.analyzeTemporalPatterns()
    };
  }
}

export default CaseStudyAnalyzer;