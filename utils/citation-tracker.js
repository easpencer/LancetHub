// Citation and source tracking system
// Ensures all data points can be traced back to authoritative sources

export class CitationTracker {
  constructor() {
    this.citations = new Map();
    this.citationFormats = {
      apa: this.formatAPA.bind(this),
      mla: this.formatMLA.bind(this),
      chicago: this.formatChicago.bind(this),
      harvard: this.formatHarvard.bind(this)
    };
  }

  // Add a citation for a data point
  addCitation(dataKey, citation) {
    const citationId = this.generateCitationId(citation);
    
    const fullCitation = {
      id: citationId,
      ...citation,
      timestamp: new Date().toISOString(),
      dataKeys: [dataKey]
    };

    if (this.citations.has(citationId)) {
      // Update existing citation with new data key
      const existing = this.citations.get(citationId);
      existing.dataKeys.push(dataKey);
    } else {
      this.citations.set(citationId, fullCitation);
    }

    return citationId;
  }

  // Generate unique citation ID
  generateCitationId(citation) {
    const key = `${citation.author || citation.organization}_${citation.year}_${citation.title?.slice(0, 20)}`;
    return key.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  // Get citation for a data point
  getCitation(dataKey) {
    for (const [id, citation] of this.citations) {
      if (citation.dataKeys.includes(dataKey)) {
        return citation;
      }
    }
    return null;
  }

  // Get all citations for a dataset
  getDatasetCitations(dataKeys) {
    const citations = new Set();
    
    dataKeys.forEach(key => {
      const citation = this.getCitation(key);
      if (citation) {
        citations.add(citation);
      }
    });

    return Array.from(citations);
  }

  // Format citation in specified style
  formatCitation(citation, style = 'apa') {
    const formatter = this.citationFormats[style];
    if (!formatter) {
      throw new Error(`Unknown citation style: ${style}`);
    }
    return formatter(citation);
  }

  // APA format
  formatAPA(citation) {
    let formatted = '';

    if (citation.author) {
      formatted += `${citation.author} `;
    } else if (citation.organization) {
      formatted += `${citation.organization}. `;
    }

    formatted += `(${citation.year}). `;
    formatted += `${citation.title}. `;

    if (citation.journal) {
      formatted += `${citation.journal}`;
      if (citation.volume) {
        formatted += `, ${citation.volume}`;
        if (citation.issue) {
          formatted += `(${citation.issue})`;
        }
      }
      if (citation.pages) {
        formatted += `, ${citation.pages}`;
      }
      formatted += '. ';
    } else if (citation.publisher) {
      formatted += `${citation.publisher}. `;
    }

    if (citation.url) {
      formatted += `${citation.url}`;
    }

    if (citation.doi) {
      formatted += ` https://doi.org/${citation.doi}`;
    }

    return formatted;
  }

  // MLA format
  formatMLA(citation) {
    let formatted = '';

    if (citation.author) {
      const names = citation.author.split(', ');
      if (names.length > 1) {
        formatted += `${names[1]}, ${names[0]}. `;
      } else {
        formatted += `${citation.author}. `;
      }
    }

    formatted += `"${citation.title}." `;

    if (citation.journal) {
      formatted += `${citation.journal}, `;
      if (citation.volume) {
        formatted += `vol. ${citation.volume}, `;
      }
      if (citation.issue) {
        formatted += `no. ${citation.issue}, `;
      }
      formatted += `${citation.year}, `;
      if (citation.pages) {
        formatted += `pp. ${citation.pages}`;
      }
    } else if (citation.publisher) {
      formatted += `${citation.publisher}, ${citation.year}`;
    }

    if (citation.url) {
      formatted += `. Web. ${new Date().toLocaleDateString()}`;
    }

    return formatted;
  }

  // Chicago format
  formatChicago(citation) {
    let formatted = '';

    if (citation.author) {
      formatted += `${citation.author}. `;
    }

    formatted += `"${citation.title}." `;

    if (citation.journal) {
      formatted += `${citation.journal} `;
      if (citation.volume) {
        formatted += `${citation.volume}, `;
      }
      if (citation.issue) {
        formatted += `no. ${citation.issue} `;
      }
      formatted += `(${citation.year})`;
      if (citation.pages) {
        formatted += `: ${citation.pages}`;
      }
    } else if (citation.publisher) {
      formatted += `${citation.publisher}, ${citation.year}`;
    }

    if (citation.doi) {
      formatted += `. https://doi.org/${citation.doi}`;
    }

    return formatted;
  }

  // Harvard format
  formatHarvard(citation) {
    let formatted = '';

    if (citation.author) {
      formatted += `${citation.author} `;
    } else if (citation.organization) {
      formatted += `${citation.organization} `;
    }

    formatted += `${citation.year}, `;
    formatted += `'${citation.title}', `;

    if (citation.journal) {
      formatted += `${citation.journal}, `;
      if (citation.volume) {
        formatted += `vol. ${citation.volume}, `;
      }
      if (citation.issue) {
        formatted += `no. ${citation.issue}, `;
      }
      if (citation.pages) {
        formatted += `pp. ${citation.pages}`;
      }
    } else if (citation.publisher) {
      formatted += citation.publisher;
    }

    if (citation.url) {
      formatted += `, viewed ${new Date().toLocaleDateString()}, <${citation.url}>`;
    }

    return formatted;
  }

  // Generate bibliography
  generateBibliography(style = 'apa', filter = null) {
    const citations = filter 
      ? Array.from(this.citations.values()).filter(filter)
      : Array.from(this.citations.values());

    // Sort by author/organization and year
    citations.sort((a, b) => {
      const authorA = a.author || a.organization || '';
      const authorB = b.author || b.organization || '';
      
      if (authorA !== authorB) {
        return authorA.localeCompare(authorB);
      }
      return a.year - b.year;
    });

    return citations.map(citation => ({
      id: citation.id,
      formatted: this.formatCitation(citation, style),
      dataKeys: citation.dataKeys,
      raw: citation
    }));
  }

  // Track data lineage
  trackDataLineage(derivedDataKey, sourceDataKeys, transformation) {
    const lineage = {
      derived: derivedDataKey,
      sources: sourceDataKeys,
      transformation: transformation,
      timestamp: new Date().toISOString()
    };

    // Get all source citations
    const sourceCitations = sourceDataKeys
      .map(key => this.getCitation(key))
      .filter(Boolean);

    // Create a derived citation
    const derivedCitation = {
      type: 'derived',
      title: `Derived from: ${sourceCitations.map(c => c.title).join(', ')}`,
      year: new Date().getFullYear(),
      organization: 'Analysis based on multiple sources',
      sourceIds: sourceCitations.map(c => c.id),
      transformation: transformation
    };

    this.addCitation(derivedDataKey, derivedCitation);

    return lineage;
  }

  // Export citations for a report
  exportCitations(dataKeys, format = 'json', style = 'apa') {
    const citations = this.getDatasetCitations(dataKeys);
    
    switch (format) {
      case 'json':
        return JSON.stringify(citations, null, 2);
      
      case 'bibtex':
        return this.exportBibtex(citations);
      
      case 'text':
        return citations
          .map(c => this.formatCitation(c, style))
          .join('\n\n');
      
      case 'html':
        return this.exportHTML(citations, style);
      
      default:
        throw new Error(`Unknown export format: ${format}`);
    }
  }

  // Export as BibTeX
  exportBibtex(citations) {
    return citations.map(citation => {
      const type = citation.journal ? '@article' : '@book';
      const key = citation.id;
      
      let bibtex = `${type}{${key},\n`;
      
      if (citation.author) {
        bibtex += `  author = {${citation.author}},\n`;
      }
      bibtex += `  title = {${citation.title}},\n`;
      bibtex += `  year = {${citation.year}},\n`;
      
      if (citation.journal) {
        bibtex += `  journal = {${citation.journal}},\n`;
        if (citation.volume) bibtex += `  volume = {${citation.volume}},\n`;
        if (citation.issue) bibtex += `  number = {${citation.issue}},\n`;
        if (citation.pages) bibtex += `  pages = {${citation.pages}},\n`;
      }
      
      if (citation.publisher) {
        bibtex += `  publisher = {${citation.publisher}},\n`;
      }
      
      if (citation.doi) {
        bibtex += `  doi = {${citation.doi}},\n`;
      }
      
      if (citation.url) {
        bibtex += `  url = {${citation.url}},\n`;
      }
      
      bibtex += '}';
      
      return bibtex;
    }).join('\n\n');
  }

  // Export as HTML
  exportHTML(citations, style) {
    const formatted = citations.map(c => this.formatCitation(c, style));
    
    return `
      <div class="citations">
        <h2>References</h2>
        <ol>
          ${formatted.map(f => `<li>${f}</li>`).join('\n')}
        </ol>
      </div>
    `;
  }

  // Get citation statistics
  getStatistics() {
    const stats = {
      totalCitations: this.citations.size,
      byType: {},
      byYear: {},
      bySource: {}
    };

    for (const citation of this.citations.values()) {
      // By type
      const type = citation.journal ? 'journal' : citation.publisher ? 'book' : 'other';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // By year
      stats.byYear[citation.year] = (stats.byYear[citation.year] || 0) + 1;

      // By source
      const source = citation.organization || citation.author || 'Unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    }

    return stats;
  }
}

// Pre-loaded authoritative citations for pandemic resilience
export const authoritativeCitations = {
  who_pandemic_preparedness: {
    organization: 'World Health Organization',
    year: 2023,
    title: 'Pandemic prevention, preparedness and response accord',
    url: 'https://www.who.int/news-room/questions-and-answers/item/pandemic-prevention--preparedness-and-response-accord',
    type: 'report'
  },
  
  lancet_covid_commission: {
    author: 'Sachs, J.D., Karim, S.S.A., Aknin, L., et al.',
    year: 2022,
    title: 'The Lancet Commission on lessons for the future from the COVID-19 pandemic',
    journal: 'The Lancet',
    volume: 400,
    issue: 10359,
    pages: '1224-1280',
    doi: '10.1016/S0140-6736(22)01585-9'
  },
  
  world_bank_pandemic_fund: {
    organization: 'World Bank',
    year: 2023,
    title: 'Pandemic Fund: Financial Intermediary Fund for Pandemic Prevention, Preparedness and Response',
    url: 'https://www.worldbank.org/en/programs/financial-intermediary-fund-for-pandemic-prevention-preparedness-and-response-ppr-fif',
    type: 'report'
  },
  
  ghs_index: {
    organization: 'Nuclear Threat Initiative, Johns Hopkins Center for Health Security',
    year: 2021,
    title: 'Global Health Security Index: Advancing Collective Action and Accountability Amid Global Crisis',
    url: 'https://www.ghsindex.org/',
    type: 'report'
  },
  
  cdc_social_vulnerability: {
    organization: 'Centers for Disease Control and Prevention',
    year: 2023,
    title: 'CDC/ATSDR Social Vulnerability Index',
    url: 'https://www.atsdr.cdc.gov/placeandhealth/svi/index.html',
    type: 'database'
  },
  
  bea_foreign_investment: {
    organization: 'U.S. Bureau of Economic Analysis',
    year: 2024,
    title: 'Foreign Direct Investment in the United States',
    url: 'https://www.bea.gov/international/foreign-direct-investment-united-states',
    type: 'database'
  }
};

// Export singleton instance
export const citationTracker = new CitationTracker();

// Initialize with authoritative citations
Object.entries(authoritativeCitations).forEach(([key, citation]) => {
  citationTracker.addCitation(key, citation);
});