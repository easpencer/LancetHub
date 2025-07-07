// Browser-compatible NLP and theme extraction utilities
// Uses TF-IDF, keyword extraction, and entity recognition without external dependencies

/**
 * Calculate term frequency for a document
 */
function calculateTermFrequency(doc) {
  const words = doc.toLowerCase().match(/\b\w+\b/g) || [];
  const termFreq = {};
  
  words.forEach(word => {
    termFreq[word] = (termFreq[word] || 0) + 1;
  });
  
  // Normalize by document length
  const totalWords = words.length;
  Object.keys(termFreq).forEach(term => {
    termFreq[term] = termFreq[term] / totalWords;
  });
  
  return termFreq;
}

/**
 * Calculate inverse document frequency
 */
function calculateIDF(documents) {
  const N = documents.length;
  const documentFrequency = {};
  const idf = {};
  
  // Count document frequency for each term
  documents.forEach(doc => {
    const uniqueTerms = new Set(doc.toLowerCase().match(/\b\w+\b/g) || []);
    uniqueTerms.forEach(term => {
      documentFrequency[term] = (documentFrequency[term] || 0) + 1;
    });
  });
  
  // Calculate IDF
  Object.keys(documentFrequency).forEach(term => {
    idf[term] = Math.log(N / documentFrequency[term]);
  });
  
  return idf;
}

/**
 * Calculate TF-IDF scores for a document
 */
export function calculateTFIDF(doc, documents) {
  const tf = calculateTermFrequency(doc);
  const idf = calculateIDF(documents);
  const tfidf = {};
  
  Object.keys(tf).forEach(term => {
    tfidf[term] = tf[term] * (idf[term] || 0);
  });
  
  return tfidf;
}

/**
 * Extract top keywords from a document using TF-IDF
 */
export function extractKeywords(doc, documents, topN = 10) {
  const tfidf = calculateTFIDF(doc, documents);
  
  // Filter out common stop words
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of',
    'in', 'for', 'with', 'by', 'from', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'and', 'or', 'but', 'if',
    'so', 'than', 'too', 'very', 'just', 'that', 'this', 'these', 'those',
    'their', 'there', 'here', 'where', 'when', 'what', 'who', 'why', 'how'
  ]);
  
  const filteredTFIDF = Object.entries(tfidf)
    .filter(([term]) => !stopWords.has(term) && term.length > 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN);
  
  return filteredTFIDF.map(([term, score]) => ({ term, score }));
}

/**
 * Extract named entities using pattern matching
 */
export function extractEntities(text) {
  const entities = {
    organizations: [],
    locations: [],
    concepts: [],
    dates: []
  };
  
  // Simple pattern matching for organizations (capitalized multi-word phrases)
  const orgPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const organizations = text.match(orgPattern) || [];
  entities.organizations = [...new Set(organizations)];
  
  // Date patterns
  const datePattern = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi;
  const dates = text.match(datePattern) || [];
  entities.dates = [...new Set(dates)];
  
  // Common location indicators
  const locationIndicators = ['City', 'Country', 'State', 'Province', 'Region'];
  locationIndicators.forEach(indicator => {
    const pattern = new RegExp(`\\b[A-Z][a-z]+\\s+${indicator}\\b`, 'g');
    const matches = text.match(pattern) || [];
    entities.locations.push(...matches);
  });
  entities.locations = [...new Set(entities.locations)];
  
  return entities;
}

/**
 * Extract themes from case study data
 */
export function extractThemes(caseStudy, allCaseStudies = []) {
  const themes = {
    primaryThemes: [],
    keywords: [],
    entities: {},
    concepts: [],
    methodologies: [],
    outcomes: []
  };
  
  // Combine relevant text fields
  const fullText = [
    caseStudy.Title || '',
    caseStudy.Description || '',
    caseStudy.Abstract || '',
    caseStudy.Methodology || '',
    caseStudy.Outcomes || '',
    caseStudy.Keywords || ''
  ].join(' ');
  
  // Extract keywords using TF-IDF
  if (allCaseStudies.length > 0) {
    const allTexts = allCaseStudies.map(cs => 
      `${cs.Title || ''} ${cs.Description || ''} ${cs.Abstract || ''}`
    );
    themes.keywords = extractKeywords(fullText, allTexts, 15);
  }
  
  // Extract entities
  themes.entities = extractEntities(fullText);
  
  // Extract methodologies
  const methodologyKeywords = [
    'qualitative', 'quantitative', 'mixed-methods', 'survey', 'interview',
    'ethnographic', 'case study', 'experimental', 'observational',
    'longitudinal', 'cross-sectional', 'participatory', 'action research'
  ];
  
  methodologyKeywords.forEach(method => {
    if (fullText.toLowerCase().includes(method)) {
      themes.methodologies.push(method);
    }
  });
  
  // Extract resilience concepts
  const resilienceConceptMap = {
    'adaptive capacity': ['adaptive', 'adaptation', 'flexibility', 'agility'],
    'social cohesion': ['community', 'social capital', 'networks', 'trust'],
    'economic resilience': ['economic', 'financial', 'livelihood', 'income'],
    'infrastructure': ['infrastructure', 'systems', 'services', 'utilities'],
    'governance': ['governance', 'policy', 'leadership', 'coordination'],
    'health systems': ['health', 'healthcare', 'medical', 'wellbeing'],
    'information systems': ['information', 'communication', 'data', 'knowledge'],
    'environmental': ['environment', 'climate', 'sustainability', 'ecology']
  };
  
  Object.entries(resilienceConceptMap).forEach(([concept, keywords]) => {
    const conceptScore = keywords.reduce((score, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = fullText.match(regex) || [];
      return score + matches.length;
    }, 0);
    
    if (conceptScore > 0) {
      themes.concepts.push({ concept, score: conceptScore });
    }
  });
  
  themes.concepts.sort((a, b) => b.score - a.score);
  
  // Extract primary themes based on top concepts and keywords
  themes.primaryThemes = themes.concepts
    .slice(0, 3)
    .map(c => c.concept);
  
  // Extract outcomes
  const outcomeIndicators = [
    'increased', 'decreased', 'improved', 'reduced', 'enhanced',
    'strengthened', 'weakened', 'achieved', 'resulted', 'led to'
  ];
  
  const sentences = fullText.split(/[.!?]+/);
  themes.outcomes = sentences
    .filter(sentence => 
      outcomeIndicators.some(indicator => 
        sentence.toLowerCase().includes(indicator)
      )
    )
    .slice(0, 5)
    .map(s => s.trim())
    .filter(s => s.length > 20);
  
  return themes;
}

/**
 * Generate theme summary
 */
export function generateThemeSummary(themes) {
  const summary = {
    mainTopics: themes.primaryThemes,
    keyFindings: [],
    methodology: themes.methodologies.join(', '),
    impact: []
  };
  
  // Create key findings from top keywords
  if (themes.keywords.length > 0) {
    summary.keyFindings = themes.keywords
      .slice(0, 5)
      .map(k => k.term);
  }
  
  // Extract impact from outcomes
  summary.impact = themes.outcomes.slice(0, 3);
  
  return summary;
}

/**
 * Compare themes across multiple case studies
 */
export function compareThemes(caseStudies) {
  const themeFrequency = {};
  const keywordFrequency = {};
  const methodologyFrequency = {};
  
  caseStudies.forEach(study => {
    const themes = extractThemes(study, caseStudies);
    
    // Count theme frequency
    themes.primaryThemes.forEach(theme => {
      themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
    });
    
    // Count keyword frequency
    themes.keywords.forEach(({ term }) => {
      keywordFrequency[term] = (keywordFrequency[term] || 0) + 1;
    });
    
    // Count methodology frequency
    themes.methodologies.forEach(method => {
      methodologyFrequency[method] = (methodologyFrequency[method] || 0) + 1;
    });
  });
  
  return {
    commonThemes: Object.entries(themeFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10),
    commonKeywords: Object.entries(keywordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20),
    methodologies: Object.entries(methodologyFrequency)
      .sort(([, a], [, b]) => b - a)
  };
}

/**
 * Generate theme-based recommendations
 */
export function generateRecommendations(themes, caseStudy) {
  const recommendations = [];
  
  // Based on identified concepts
  themes.concepts.forEach(({ concept, score }) => {
    if (score > 5) {
      switch (concept) {
        case 'adaptive capacity':
          recommendations.push({
            area: 'Adaptive Capacity',
            suggestion: 'Consider expanding research on flexibility mechanisms and rapid response systems',
            priority: 'high'
          });
          break;
        case 'social cohesion':
          recommendations.push({
            area: 'Social Capital',
            suggestion: 'Explore community network strengthening and trust-building interventions',
            priority: 'medium'
          });
          break;
        case 'information systems':
          recommendations.push({
            area: 'Information Resilience',
            suggestion: 'Investigate information verification systems and communication channels',
            priority: 'high'
          });
          break;
      }
    }
  });
  
  // Based on gaps in methodologies
  if (!themes.methodologies.includes('longitudinal')) {
    recommendations.push({
      area: 'Research Design',
      suggestion: 'Consider longitudinal studies to track resilience changes over time',
      priority: 'medium'
    });
  }
  
  return recommendations;
}