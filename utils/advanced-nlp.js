// Advanced NLP utilities for next-gen insights
// Browser-compatible implementation using lightweight libraries

class AdvancedNLP {
  constructor() {
    this.stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'of', 
      'in', 'for', 'with', 'as', 'by', 'that', 'this', 'it', 'from',
      'or', 'but', 'not', 'are', 'was', 'were', 'been', 'be', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
    ]);
    
    // Common entity patterns
    this.entityPatterns = {
      organization: /\b(?:[A-Z][a-z]+\s)+(?:Institute|University|Organization|Foundation|Agency|Department|Ministry|Hospital|Center|Centre|School|College|Corporation|Company|Inc|Ltd|LLC)\b/g,
      person: /\b(?:Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)?\s*[A-Z][a-z]+\s+(?:[A-Z]\.\s*)?[A-Z][a-z]+\b/g,
      location: /\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g,
      methodology: /\b(?:randomized|controlled|trial|study|survey|analysis|assessment|evaluation|intervention|program|approach|framework|model|method)\b/gi,
      outcome: /\b(?:increase|decrease|improve|reduce|enhance|strengthen|weaken|impact|effect|change|result|outcome|finding)\b/gi
    };
  }

  // Enhanced TF-IDF with n-grams
  calculateEnhancedTFIDF(documents, options = {}) {
    const { 
      ngramRange = [1, 3], 
      maxFeatures = 100,
      minDocFreq = 2 
    } = options;
    
    // Extract n-grams from documents
    const allNgrams = new Map();
    const docNgrams = documents.map(doc => {
      const ngrams = this.extractNgrams(doc, ngramRange[0], ngramRange[1]);
      const ngramCounts = new Map();
      
      ngrams.forEach(ngram => {
        ngramCounts.set(ngram, (ngramCounts.get(ngram) || 0) + 1);
        allNgrams.set(ngram, (allNgrams.get(ngram) || 0) + 1);
      });
      
      return ngramCounts;
    });
    
    // Filter by document frequency
    const validNgrams = Array.from(allNgrams.entries())
      .filter(([_, freq]) => freq >= minDocFreq)
      .map(([ngram, _]) => ngram);
    
    // Calculate TF-IDF scores
    const tfidfScores = documents.map((doc, docIdx) => {
      const scores = new Map();
      const docLength = doc.split(/\s+/).length;
      
      validNgrams.forEach(ngram => {
        const tf = (docNgrams[docIdx].get(ngram) || 0) / docLength;
        const df = allNgrams.get(ngram);
        const idf = Math.log(documents.length / df);
        scores.set(ngram, tf * idf);
      });
      
      return scores;
    });
    
    // Get top features
    const avgScores = new Map();
    validNgrams.forEach(ngram => {
      const avg = tfidfScores.reduce((sum, scores) => 
        sum + scores.get(ngram), 0
      ) / documents.length;
      avgScores.set(ngram, avg);
    });
    
    return Array.from(avgScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxFeatures);
  }

  // Extract n-grams from text
  extractNgrams(text, minN = 1, maxN = 3) {
    const words = this.tokenize(text);
    const ngrams = [];
    
    for (let n = minN; n <= maxN; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        const ngram = words.slice(i, i + n).join(' ');
        if (this.isValidNgram(ngram, n)) {
          ngrams.push(ngram);
        }
      }
    }
    
    return ngrams;
  }

  // Named Entity Recognition
  extractEntities(text) {
    const entities = {
      organizations: [],
      people: [],
      locations: [],
      methodologies: [],
      outcomes: []
    };
    
    // Extract organizations
    const orgMatches = text.match(this.entityPatterns.organization) || [];
    entities.organizations = [...new Set(orgMatches)];
    
    // Extract people (improved pattern)
    const personMatches = text.match(this.entityPatterns.person) || [];
    entities.people = personMatches
      .filter(name => {
        const words = name.trim().split(/\s+/);
        return words.length >= 2 && words.length <= 4;
      })
      .filter(name => !this.isCommonPhrase(name));
    
    // Extract methodologies
    const methodMatches = text.match(this.entityPatterns.methodology) || [];
    entities.methodologies = [...new Set(methodMatches.map(m => m.toLowerCase()))];
    
    // Extract outcomes
    const outcomeMatches = text.match(this.entityPatterns.outcome) || [];
    entities.outcomes = [...new Set(outcomeMatches.map(o => o.toLowerCase()))];
    
    return entities;
  }

  // Topic modeling using simple LDA-like approach
  extractTopics(documents, numTopics = 5, numWords = 10) {
    // Calculate document-term matrix
    const vocabulary = new Set();
    const docTermMatrix = documents.map(doc => {
      const terms = this.extractKeyPhrases(doc);
      terms.forEach(term => vocabulary.add(term));
      return terms;
    });
    
    const vocabArray = Array.from(vocabulary);
    
    // Simple topic assignment based on co-occurrence
    const topics = [];
    for (let t = 0; t < numTopics; t++) {
      const topicWords = new Map();
      
      // Assign documents to topics randomly initially
      docTermMatrix.forEach((terms, docIdx) => {
        if (docIdx % numTopics === t) {
          terms.forEach(term => {
            topicWords.set(term, (topicWords.get(term) || 0) + 1);
          });
        }
      });
      
      // Get top words for this topic
      const sortedWords = Array.from(topicWords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, numWords)
        .map(([word, _]) => word);
      
      topics.push({
        id: t,
        words: sortedWords,
        documents: docTermMatrix
          .map((_, idx) => idx)
          .filter(idx => idx % numTopics === t)
      });
    }
    
    return topics;
  }

  // Sentiment analysis
  analyzeSentiment(text) {
    const positiveWords = new Set([
      'improve', 'increase', 'enhance', 'success', 'effective', 'positive',
      'benefit', 'achievement', 'growth', 'progress', 'advance', 'gain'
    ]);
    
    const negativeWords = new Set([
      'decrease', 'reduce', 'failure', 'challenge', 'barrier', 'negative',
      'problem', 'issue', 'concern', 'risk', 'threat', 'loss'
    ]);
    
    const words = this.tokenize(text.toLowerCase());
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.has(word)) positiveScore++;
      if (negativeWords.has(word)) negativeScore++;
    });
    
    const totalSentimentWords = positiveScore + negativeScore;
    if (totalSentimentWords === 0) {
      return { sentiment: 'neutral', confidence: 0 };
    }
    
    const sentiment = positiveScore > negativeScore ? 'positive' : 
                     negativeScore > positiveScore ? 'negative' : 'neutral';
    const confidence = Math.abs(positiveScore - negativeScore) / totalSentimentWords;
    
    return { sentiment, confidence, positiveScore, negativeScore };
  }

  // Automatic summarization using extractive method
  summarize(text, numSentences = 3) {
    const sentences = this.splitSentences(text);
    if (sentences.length <= numSentences) return text;
    
    // Score sentences based on word frequency and position
    const wordFreq = new Map();
    const words = this.tokenize(text.toLowerCase());
    words.forEach(word => {
      if (!this.stopWords.has(word) && word.length > 3) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    const sentenceScores = sentences.map((sentence, idx) => {
      const sentWords = this.tokenize(sentence.toLowerCase());
      let score = 0;
      
      sentWords.forEach(word => {
        if (wordFreq.has(word)) {
          score += wordFreq.get(word);
        }
      });
      
      // Boost score for sentences at beginning and end
      if (idx === 0 || idx === sentences.length - 1) {
        score *= 1.2;
      }
      
      return { sentence, score, index: idx };
    });
    
    // Select top sentences maintaining order
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentences)
      .sort((a, b) => a.index - b.index)
      .map(item => item.sentence);
    
    return topSentences.join(' ');
  }

  // Relationship extraction
  extractRelationships(text, entities) {
    const relationships = [];
    const sentences = this.splitSentences(text);
    
    sentences.forEach(sentence => {
      // Look for entities in the same sentence
      const foundEntities = [];
      
      Object.entries(entities).forEach(([type, entityList]) => {
        entityList.forEach(entity => {
          if (sentence.includes(entity)) {
            foundEntities.push({ type, name: entity });
          }
        });
      });
      
      // If multiple entities in same sentence, they might be related
      if (foundEntities.length >= 2) {
        for (let i = 0; i < foundEntities.length - 1; i++) {
          for (let j = i + 1; j < foundEntities.length; j++) {
            relationships.push({
              source: foundEntities[i],
              target: foundEntities[j],
              context: sentence,
              type: this.inferRelationType(sentence, foundEntities[i], foundEntities[j])
            });
          }
        }
      }
    });
    
    return relationships;
  }

  // Helper methods
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  splitSentences(text) {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  }

  isValidNgram(ngram, n) {
    const words = ngram.split(' ');
    if (n === 1) {
      return !this.stopWords.has(words[0]) && words[0].length > 2;
    }
    // For multi-word ngrams, at least one word should not be a stop word
    return words.some(word => !this.stopWords.has(word) && word.length > 2);
  }

  isCommonPhrase(text) {
    const commonPhrases = new Set([
      'United States', 'New York', 'Case Study', 'Research Study'
    ]);
    return commonPhrases.has(text);
  }

  inferRelationType(sentence, entity1, entity2) {
    const collaborativeWords = ['collaborate', 'partner', 'work with', 'joint'];
    const impactWords = ['impact', 'affect', 'influence', 'change'];
    
    const lowerSentence = sentence.toLowerCase();
    
    if (collaborativeWords.some(word => lowerSentence.includes(word))) {
      return 'collaborates_with';
    }
    if (impactWords.some(word => lowerSentence.includes(word))) {
      return 'impacts';
    }
    
    return 'related_to';
  }

  // Extract key phrases using RAKE-like algorithm
  extractKeyPhrases(text, maxPhrases = 10) {
    const sentences = this.splitSentences(text);
    const phrases = [];
    
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      let currentPhrase = [];
      
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (!this.stopWords.has(cleanWord) && cleanWord.length > 2) {
          currentPhrase.push(cleanWord);
        } else if (currentPhrase.length > 0) {
          if (currentPhrase.length <= 3) {
            phrases.push(currentPhrase.join(' '));
          }
          currentPhrase = [];
        }
      });
      
      if (currentPhrase.length > 0 && currentPhrase.length <= 3) {
        phrases.push(currentPhrase.join(' '));
      }
    });
    
    // Score phrases
    const phraseScores = new Map();
    phrases.forEach(phrase => {
      const words = phrase.split(' ');
      const score = words.length * words.reduce((sum, word) => sum + word.length, 0);
      phraseScores.set(phrase, (phraseScores.get(phrase) || 0) + score);
    });
    
    return Array.from(phraseScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxPhrases)
      .map(([phrase, _]) => phrase);
  }
}

// Singleton instance
const advancedNLP = new AdvancedNLP();

export default advancedNLP;