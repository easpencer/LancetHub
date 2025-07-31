import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const DB_PATH = path.join(__dirname, '../database/pandemic-resilience.db');
// In production, always use Airtable since SQLite database isn't deployed
const isProduction = process.env.NODE_ENV === 'production';
const USE_AIRTABLE = isProduction || process.env.USE_AIRTABLE === 'true';

let db = null;

// Initialize database connection
export function initDatabase() {
  if (db) return db;
  
  // Check if database exists, if not, run migration first
  if (!fs.existsSync(DB_PATH)) {
    console.warn('Database not found. Please run: npm run migrate-db');
    return null;
  }
  
  db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  
  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  
  return db;
}

// Get database instance
export function getDb() {
  if (!db) initDatabase();
  return db;
}

// Data source abstraction layer
export const dataSource = {
  // Fetch case studies with all related data
  async fetchCaseStudies(options = {}) {
    if (USE_AIRTABLE) {
      const { fetchCaseStudies } = await import('./airtable.js');
      return fetchCaseStudies(options);
    }
    
    const db = getDb();
    if (!db) return [];
    
    const limit = options.maxRecords || 1000;
    const offset = options.offset || 0;
    
    try {
      const query = `
        SELECT 
          cs.*,
          GROUP_CONCAT(DISTINCT d.name) as dimension_names,
          GROUP_CONCAT(DISTINCT p.name || '|' || csp.role) as contributors,
          COUNT(DISTINCT csm.metric_id) as metrics_count
        FROM case_studies cs
        LEFT JOIN case_study_dimensions csd ON cs.id = csd.case_study_id
        LEFT JOIN dimensions d ON csd.dimension_id = d.id
        LEFT JOIN case_study_people csp ON cs.id = csp.case_study_id
        LEFT JOIN people p ON csp.person_id = p.id
        LEFT JOIN case_study_metrics csm ON cs.id = csm.case_study_id
        GROUP BY cs.id
        ORDER BY cs.date DESC
        LIMIT ? OFFSET ?
      `;
      
      const rows = db.prepare(query).all(limit, offset);
      
      // Get people data from Airtable for the most up-to-date information
      let allPeople = [];
      let peopleMap = new Map();
      
      try {
        // Fetch fresh people data from Airtable for author information
        const { fetchPeopleData } = await import('./airtable.js');
        allPeople = await fetchPeopleData({ maxRecords: 100 });
        
        allPeople.forEach(person => {
          peopleMap.set(person.id, {
            id: person.id,
            name: person.Name || person['Full Name'] || 'Unknown',
            institution: person.Affiliation || person.Institution || '',
            role: person.Role || person.Position || '',
            expertise: person.Expertise || '',
            email: person.Email || ''
          });
        });
      } catch (error) {
        console.warn('Could not fetch people data from Airtable, using SQLite fallback:', error.message);
        // Fallback to SQLite if Airtable fails
        allPeople = db.prepare('SELECT * FROM people').all();
        allPeople.forEach(person => {
          peopleMap.set(person.id, {
            id: person.id,
            name: person.name || person.full_name || 'Unknown',
            institution: person.institution || '',
            role: person.role || person.position || '',
            expertise: person.expertise || '',
            email: person.email || ''
          });
        });
      }

      return rows.map(row => {
        // Parse authors from the name field and try to match with people data
        const authorNames = row.name ? row.name.split(',').map(name => name.trim()).filter(Boolean) : [];
        
        // Get structured author data by matching names with people database
        const authors = authorNames.map(authorName => {
          // Clean up the author name for better matching
          const cleanAuthorName = authorName.trim();
          
          // Find matching person by name (improved matching)
          const person = allPeople.find(p => {
            const pName = (p.Name || p['Full Name'] || '').trim().toLowerCase();
            const searchName = cleanAuthorName.toLowerCase();
            
            // Exact match first
            if (pName === searchName) return true;
            
            // Check if names contain each other (for partial matches)
            if (pName.includes(searchName) || searchName.includes(pName)) return true;
            
            // Check individual words (for name variations)
            const pWords = pName.split(/\s+/);
            const sWords = searchName.split(/\s+/);
            return pWords.some(pw => sWords.some(sw => pw === sw && pw.length > 2));
          });
          
          if (person) {
            return peopleMap.get(person.id);
          } else {
            // Return basic author info if no match found
            return { 
              name: cleanAuthorName, 
              institution: '', 
              role: '', 
              expertise: '', 
              email: '' 
            };
          }
        });

        return {
          // Original Airtable field names
          id: row.airtable_id || `cs_${row.id}`,
          Name: row.name,
          Section: row.section,
          'Case Study Title': row.title,
          'Study Focus': row.study_focus,
          'Short Description': row.short_description,
          'Relevance to Community/Societal Resilience': row.relevance,
          'Study Type ': row.study_type, // Keep the trailing space for compatibility
          'Resilient Dimensions ': row.dimensions, // Keep the trailing space
          'Key Words ': row.keywords, // Keep the trailing space
          Date: row.date,
          People: row.people_ids ? row.people_ids.split(', ') : [],
          
          // Enhanced author data
          Authors: authors,
          AuthorNames: authors.map(a => a.name).join(', ') || row.name || '',
          AuthorInstitutions: [...new Set(authors.map(a => a.institution).filter(Boolean))].join(', '),
          
          // Also provide cleaner field names for easier access
          Title: row.title,
        Description: row.short_description,
        StudyFocus: row.study_focus,
        Relevance: row.relevance,
        Institution: row.institution,
        Type: row.study_type,
        Dimensions: row.dimension_names || row.dimensions,
        Keywords: row.keywords,
        Methodology: row.methodology,
        Findings: row.findings,
        Recommendations: row.recommendations,
        Country: row.country,
        Region: row.region,
        ImpactMetrics: row.impact_metrics ? JSON.parse(row.impact_metrics) : null,
        Contributors: row.contributors ? row.contributors.split(',').map(c => {
          const [name, role] = c.split('|');
          return { name, role };
        }) : [],
        MetricsCount: row.metrics_count,
        // Parse dimensions from the grouped field
        dimensionsList: row.dimension_names ? row.dimension_names.split(',').map(d => d.trim()).filter(Boolean) : []
        };
      });
    } catch (error) {
      console.error('Error fetching case studies from SQLite:', error);
      return [];
    }
  },
  
  // Fetch people with enhanced data
  async fetchPeople(options = {}) {
    if (USE_AIRTABLE) {
      const { fetchPeopleData } = await import('./airtable.js');
      return fetchPeopleData(options);
    }
    
    const db = getDb();
    if (!db) return [];
    
    try {
      const query = `
        SELECT 
          p.*,
          COUNT(DISTINCT csp.case_study_id) as case_studies_count
        FROM people p
        LEFT JOIN case_study_people csp ON p.id = csp.person_id
        GROUP BY p.id
        ORDER BY p.name
      `;
      
      const rows = db.prepare(query).all();
      
      return rows.map(row => ({
        id: row.airtable_id || `person_${row.id}`,
        Name: row.name,
        Title: row.title,
        Institution: row.institution,
        Bio: row.bio,
        Photo: row.photo_url ? [{ url: row.photo_url }] : [],
        Email: row.email,
        ORCID: row.orcid,
        ExpertiseAreas: row.expertise_areas,
        Country: row.country,
        LinkedIn: row.linkedin_url,
        PublicationsCount: row.publications_count,
        HIndex: row.h_index,
        CaseStudiesCount: row.case_studies_count
      }));
    } catch (error) {
      console.error('Error fetching people from SQLite:', error);
      return [];
    }
  },
  
  // Fetch papers/bibliography
  async fetchPapers(options = {}) {
    if (USE_AIRTABLE) {
      const { fetchPapers } = await import('./airtable.js');
      return fetchPapers(options);
    }
    
    const db = getDb();
    if (!db) return [];
    
    try {
      const papers = db.prepare('SELECT * FROM papers ORDER BY year DESC, title').all();
      
      return papers.map(row => ({
        id: row.airtable_id || `paper_${row.id}`,
        Title: row.title,
        Authors: row.authors,
        Year: row.year,
        Journal: row.journal,
        DOI: row.doi,
        URL: row.url,
        Abstract: row.abstract,
        CitationCount: row.citation_count,
        Keywords: row.keywords,
        Methodology: row.methodology,
        KeyFindings: row.key_findings,
        PDFUrl: row.pdf_url,
        OpenAccess: row.open_access
      }));
    } catch (error) {
      console.error('Error fetching papers from SQLite:', error);
      return [];
    }
  },
  
  // Fetch dimensions
  async fetchDimensions(options = {}) {
    if (USE_AIRTABLE) {
      const { fetchResilienceDimensions } = await import('./airtable.js');
      return fetchResilienceDimensions(options);
    }
    
    const db = getDb();
    if (!db) return [];
    
    try {
      const dimensions = db.prepare(`
        SELECT 
          d.*,
          COUNT(DISTINCT csd.case_study_id) as case_study_count
        FROM dimensions d
        LEFT JOIN case_study_dimensions csd ON d.id = csd.dimension_id
        GROUP BY d.id
        ORDER BY d.category, d.name
      `).all();
      
      return dimensions.map(row => ({
        id: `dim_${row.id}`,
        Name: row.name,
        Description: row.description,
        Category: row.category,
        Icon: row.icon,
        Color: row.color,
        Weight: row.weight,
        CaseStudyCount: row.case_study_count
      }));
    } catch (error) {
      console.error('Error fetching dimensions from SQLite:', error);
      return [];
    }
  },
  
  // New: Fetch locations with outbreak data
  async fetchLocations() {
    const db = getDb();
    if (!db) return [];
    
    try {
      const locations = db.prepare(`
        SELECT 
          l.*,
          COUNT(DISTINCT o.id) as outbreak_count,
          SUM(o.cases_count) as total_cases,
          SUM(o.deaths_count) as total_deaths
        FROM locations l
        LEFT JOIN outbreaks o ON l.id = o.location_id
        GROUP BY l.id
        ORDER BY l.name
      `).all();
      
      return locations.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        latitude: row.latitude,
        longitude: row.longitude,
        population: row.population,
        healthcareIndex: row.healthcare_index,
        vulnerabilityScore: row.vulnerability_score,
        outbreakCount: row.outbreak_count,
        totalCases: row.total_cases,
        totalDeaths: row.total_deaths,
        geojson: row.geojson ? JSON.parse(row.geojson) : null
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },
  
  // New: Fetch outbreak data
  async fetchOutbreaks() {
    const db = getDb();
    if (!db) return [];
    
    try {
      const outbreaks = db.prepare(`
        SELECT 
          o.*,
          l.name as location_name,
          l.latitude,
          l.longitude
        FROM outbreaks o
        LEFT JOIN locations l ON o.location_id = l.id
        ORDER BY o.start_date DESC
      `).all();
      
      return outbreaks;
    } catch (error) {
      console.error('Error fetching outbreaks:', error);
      return [];
    }
  },
  
  // Search functionality using FTS
  async search(query, options = {}) {
    const db = getDb();
    if (!db) return { caseStudies: [], papers: [] };
    
    try {
      const caseStudies = db.prepare(`
        SELECT cs.*, snippet(case_studies_fts, -1, '<mark>', '</mark>', '...', 32) as snippet
        FROM case_studies cs
        JOIN case_studies_fts ON cs.id = case_studies_fts.rowid
        WHERE case_studies_fts MATCH ?
        ORDER BY rank
        LIMIT 20
      `).all(query);
      
      const papers = db.prepare(`
        SELECT p.*, snippet(papers_fts, -1, '<mark>', '</mark>', '...', 32) as snippet
        FROM papers p
        JOIN papers_fts ON p.id = papers_fts.rowid
        WHERE papers_fts MATCH ?
        ORDER BY rank
        LIMIT 20
      `).all(query);
      
      return {
        caseStudies: caseStudies.map(cs => ({
          ...cs,
          id: cs.airtable_id || `cs_${cs.id}`
        })),
        papers: papers.map(p => ({
          ...p,
          id: p.airtable_id || `paper_${p.id}`
        }))
      };
    } catch (error) {
      console.error('Error searching:', error);
      return { caseStudies: [], papers: [] };
    }
  },
  
  // Get insights
  async fetchInsights(type = null) {
    const db = getDb();
    if (!db) return [];
    
    try {
      let query = 'SELECT * FROM insights';
      const params = [];
      
      if (type) {
        query += ' WHERE type = ?';
        params.push(type);
      }
      
      query += ' ORDER BY generated_at DESC LIMIT 50';
      
      const insights = db.prepare(query).all(...params);
      
      return insights.map(row => ({
        ...row,
        relatedEntities: row.related_entities ? JSON.parse(row.related_entities) : [],
        visualizationConfig: row.visualization_config ? JSON.parse(row.visualization_config) : null
      }));
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }
};

// CRUD operations
export const dbOperations = {
  // Create operations
  async createCaseStudy(data) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');
    
    const stmt = db.prepare(`
      INSERT INTO case_studies (
        title, description, institution, type, date, dimensions, keywords,
        methodology, findings, recommendations, country, region, impact_metrics
      ) VALUES (
        @title, @description, @institution, @type, @date, @dimensions, @keywords,
        @methodology, @findings, @recommendations, @country, @region, @impact_metrics
      )
    `);
    
    const result = stmt.run({
      ...data,
      impact_metrics: data.impact_metrics ? JSON.stringify(data.impact_metrics) : null
    });
    
    return result.lastInsertRowid;
  },
  
  // Update operations
  async updateCaseStudy(id, data) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');
    
    const fields = Object.keys(data).map(key => `${key} = @${key}`).join(', ');
    const stmt = db.prepare(`
      UPDATE case_studies 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id OR airtable_id = @id
    `);
    
    return stmt.run({ id, ...data });
  },
  
  // Delete operations
  async deleteCaseStudy(id) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');
    
    const stmt = db.prepare('DELETE FROM case_studies WHERE id = ? OR airtable_id = ?');
    return stmt.run(id, id);
  },
  
  // Log user interaction
  async logInteraction(sessionId, type, entityType, entityId, metadata = {}) {
    const db = getDb();
    if (!db) return;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO user_interactions (session_id, interaction_type, entity_type, entity_id, metadata)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(sessionId, type, entityType, entityId, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }
};

// Export convenience functions
export const {
  fetchCaseStudies,
  fetchPeople,
  fetchPapers,
  fetchDimensions,
  fetchLocations,
  fetchOutbreaks,
  search,
  fetchInsights
} = dataSource;

export const {
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  logInteraction
} = dbOperations;