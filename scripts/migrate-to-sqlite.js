import Database from 'better-sqlite3';
import { fetchCaseStudies, fetchPeopleData, fetchLandscapeData, fetchPapers, fetchResilienceDimensions, fetchResilienceMetrics } from '../utils/airtable.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Initialize SQLite database
const db = new Database(path.join(dbDir, 'pandemic-resilience.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Read and execute schema
try {
  const schema = fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf8');
  db.exec(schema);
} catch (error) {
  if (error.code === 'SQLITE_ERROR' && error.message.includes('already exists')) {
    console.log('📋 Database schema already exists, continuing with data migration...');
  } else {
    throw error;
  }
}

console.log('✅ Database schema created');

// Migration functions
async function migrateCaseStudies() {
  console.log('\n📊 Migrating Case Studies...');
  
  try {
    const caseStudies = await fetchCaseStudies({ maxRecords: 1000 });
    console.log(`Found ${caseStudies.length} case studies`);
    
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO case_studies (
        airtable_id, name, section, title, study_focus, short_description,
        relevance, study_type, dimensions, keywords, date, people_ids,
        description, type, institution, methodology, findings, recommendations,
        data_source
      ) VALUES (
        @id, @name, @section, @title, @study_focus, @short_description,
        @relevance, @study_type, @dimensions, @keywords, @date, @people_ids,
        @description, @type, @institution, @methodology, @findings, @recommendations,
        'airtable'
      )
    `);
    
    const insertMany = db.transaction((studies) => {
      for (const study of studies) {
        // Map all Airtable fields
        const name = study.Name || '';
        const section = study.Section || '';
        const title = study['Case Study Title'] || '';
        const study_focus = study['Study Focus'] || '';
        const short_description = study['Short Description'] || '';
        const relevance = study['Relevance to Community/Societal Resilience'] || '';
        const study_type = study['Study Type '] || ''; // Note the trailing space!
        
        // Handle arrays by converting to comma-separated strings
        let dimensions = study['Resilient Dimensions '] || ''; // Note the trailing space!
        if (Array.isArray(dimensions)) {
          dimensions = dimensions.join(', ');
        }
        
        let keywords = study['Key Words '] || ''; // Note the trailing space!
        if (Array.isArray(keywords)) {
          keywords = keywords.join(', ');
        }
        
        let people_ids = study.People || '';
        if (Array.isArray(people_ids)) {
          people_ids = people_ids.join(', ');
        }
        
        const date = study.Date || null;
        
        // Legacy fields for compatibility
        const description = short_description; // Map to short_description
        const type = study_type; // Map to study_type
        const institution = study.Institution || '';
        
        // Rich text fields - using correct field names
        const methodology = study.Methods || study.Methodology || '';
        const findings = study.Results || study.Findings || study['Key Findings'] || '';
        const recommendations = study.Insights || study['Initial Lessons (What kind of actions do we need to be taking now)'] || study.Recommendations || '';
        
        console.log(`Migrating case study: ${title} by ${name}`);
        
        insertStmt.run({
          id: study.id,
          name: name,
          section: section,
          title: title,
          study_focus: study_focus,
          short_description: short_description,
          relevance: relevance,
          study_type: study_type,
          dimensions: dimensions,
          keywords: keywords,
          date: date,
          people_ids: people_ids,
          description: description,
          type: type,
          institution: institution,
          methodology: methodology,
          findings: findings,
          recommendations: recommendations
        });
      }
    });
    
    insertMany(caseStudies);
    console.log('✅ Case studies migrated');
    
    // Normalize dimensions
    await normalizeDimensions();
    
  } catch (error) {
    console.error('❌ Error migrating case studies:', error);
  }
}

async function migratePeople() {
  console.log('\n👥 Migrating People...');
  
  try {
    const people = await fetchPeopleData({ maxRecords: 1000 });
    console.log(`Found ${people.length} people`);
    
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO people (
        airtable_id, name, title, institution, bio, photo_url
      ) VALUES (
        @id, @name, @title, @institution, @bio, @photo_url
      )
    `);
    
    const insertMany = db.transaction((people) => {
      for (const person of people) {
        // Handle photo which might be an array of objects
        let photoUrl = '';
        if (person.Photo && Array.isArray(person.Photo) && person.Photo.length > 0) {
          photoUrl = person.Photo[0].url || '';
        } else if (person.photo_url) {
          photoUrl = person.photo_url;
        }
        
        insertStmt.run({
          id: person.id,
          name: person.Name || person.name || '',
          title: person.Title || person.title || '',
          institution: person.Institution || person.institution || '',
          bio: person.Bio || person.bio || '',
          photo_url: photoUrl
        });
      }
    });
    
    insertMany(people);
    console.log('✅ People migrated');
    
  } catch (error) {
    console.error('❌ Error migrating people:', error);
  }
}

async function migratePapers() {
  console.log('\n📚 Migrating Papers/Bibliography...');
  
  try {
    const papers = await fetchPapers({ maxRecords: 1000 });
    console.log(`Found ${papers.length} papers`);
    
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO papers (
        airtable_id, title, authors, year, journal, doi, url, abstract
      ) VALUES (
        @id, @title, @authors, @year, @journal, @doi, @url, @abstract
      )
    `);
    
    const insertMany = db.transaction((papers) => {
      for (const paper of papers) {
        insertStmt.run({
          id: paper.id,
          title: paper.Title || paper.title || '',
          authors: paper.Authors || paper.authors || '',
          year: paper.Year || paper.year || null,
          journal: paper.Journal || paper.journal || '',
          doi: paper.DOI || paper.doi || '',
          url: paper.URL || paper.url || '',
          abstract: paper.Abstract || paper.abstract || ''
        });
      }
    });
    
    insertMany(papers);
    console.log('✅ Papers migrated');
    
  } catch (error) {
    console.error('❌ Error migrating papers:', error);
  }
}

async function normalizeDimensions() {
  console.log('\n🔄 Normalizing dimensions...');
  
  // Get all unique dimensions from case studies
  const dimensions = db.prepare(`
    SELECT DISTINCT TRIM(value) as dimension
    FROM case_studies, json_each('["' || REPLACE(dimensions, ',', '","') || '"]')
    WHERE TRIM(value) != ''
  `).all();
  
  const insertDimension = db.prepare(`
    INSERT OR IGNORE INTO dimensions (name, category) VALUES (?, ?)
  `);
  
  // Insert dimensions with basic categorization
  for (const { dimension } of dimensions) {
    const category = categorizeDimension(dimension);
    insertDimension.run(dimension, category);
  }
  
  // Create relationships between case studies and dimensions
  const getDimensionId = db.prepare('SELECT id FROM dimensions WHERE name = ?');
  const insertRelation = db.prepare(`
    INSERT OR IGNORE INTO case_study_dimensions (case_study_id, dimension_id)
    VALUES (?, ?)
  `);
  
  const caseStudies = db.prepare('SELECT id, dimensions FROM case_studies WHERE dimensions IS NOT NULL').all();
  
  for (const study of caseStudies) {
    const dims = study.dimensions.split(',').map(d => d.trim()).filter(d => d);
    for (const dim of dims) {
      const dimension = getDimensionId.get(dim);
      if (dimension) {
        insertRelation.run(study.id, dimension.id);
      }
    }
  }
  
  console.log('✅ Dimensions normalized');
}

function categorizeDimension(dimension) {
  const lowerDim = dimension.toLowerCase();
  
  if (lowerDim.includes('health') || lowerDim.includes('medical')) return 'Health Systems';
  if (lowerDim.includes('govern') || lowerDim.includes('policy')) return 'Governance';
  if (lowerDim.includes('social') || lowerDim.includes('community')) return 'Social';
  if (lowerDim.includes('economic') || lowerDim.includes('financ')) return 'Economic';
  if (lowerDim.includes('tech') || lowerDim.includes('digital')) return 'Technology';
  if (lowerDim.includes('environment') || lowerDim.includes('climate')) return 'Environmental';
  
  return 'Other';
}

// Add sample geographic data
async function addGeographicData() {
  console.log('\n🌍 Adding geographic data...');
  
  const countries = [
    { name: 'United States', type: 'country', latitude: 37.0902, longitude: -95.7129, population: 331002651, healthcare_index: 69.2 },
    { name: 'United Kingdom', type: 'country', latitude: 55.3781, longitude: -3.4360, population: 67886011, healthcare_index: 78.9 },
    { name: 'China', type: 'country', latitude: 35.8617, longitude: 104.1954, population: 1439323776, healthcare_index: 64.8 },
    { name: 'India', type: 'country', latitude: 20.5937, longitude: 78.9629, population: 1380004385, healthcare_index: 65.2 },
    { name: 'Brazil', type: 'country', latitude: -14.2350, longitude: -51.9253, population: 212559417, healthcare_index: 64.7 },
    { name: 'Germany', type: 'country', latitude: 51.1657, longitude: 10.4515, population: 83783942, healthcare_index: 83.9 },
    { name: 'Japan', type: 'country', latitude: 36.2048, longitude: 138.2529, population: 126476461, healthcare_index: 85.6 },
    { name: 'South Africa', type: 'country', latitude: -30.5595, longitude: 22.9375, population: 59308690, healthcare_index: 63.4 }
  ];
  
  const insertLocation = db.prepare(`
    INSERT OR IGNORE INTO locations (name, type, latitude, longitude, population, healthcare_index)
    VALUES (@name, @type, @latitude, @longitude, @population, @healthcare_index)
  `);
  
  const insertMany = db.transaction((locations) => {
    for (const location of locations) {
      insertLocation.run(location);
    }
  });
  
  insertMany(countries);
  console.log('✅ Geographic data added');
}

// Add sample outbreak data
async function addOutbreakData() {
  console.log('\n🦠 Adding outbreak data...');
  
  const outbreaks = [
    { name: 'COVID-19', pathogen: 'SARS-CoV-2', start_date: '2019-12-01', location: 'China', cases_count: 695000000, deaths_count: 6900000 },
    { name: 'Ebola (West Africa)', pathogen: 'Ebola virus', start_date: '2014-03-23', end_date: '2016-06-09', location: 'Guinea', cases_count: 28652, deaths_count: 11325 },
    { name: 'H1N1 Influenza', pathogen: 'H1N1 virus', start_date: '2009-04-15', end_date: '2010-08-10', location: 'Mexico', cases_count: 1632710, deaths_count: 284000 },
    { name: 'SARS', pathogen: 'SARS-CoV', start_date: '2002-11-16', end_date: '2003-07-31', location: 'China', cases_count: 8098, deaths_count: 774 },
    { name: 'MERS', pathogen: 'MERS-CoV', start_date: '2012-06-01', location: 'Saudi Arabia', cases_count: 2600, deaths_count: 935 }
  ];
  
  const getLocationId = db.prepare('SELECT id FROM locations WHERE name = ?');
  const insertOutbreak = db.prepare(`
    INSERT OR IGNORE INTO outbreaks (name, pathogen, start_date, end_date, location_id, cases_count, deaths_count)
    VALUES (@name, @pathogen, @start_date, @end_date, @location_id, @cases_count, @deaths_count)
  `);
  
  for (const outbreak of outbreaks) {
    const location = getLocationId.get(outbreak.location);
    if (location) {
      insertOutbreak.run({
        name: outbreak.name,
        pathogen: outbreak.pathogen,
        start_date: outbreak.start_date,
        end_date: outbreak.end_date || null,
        location_id: location.id,
        cases_count: outbreak.cases_count,
        deaths_count: outbreak.deaths_count
      });
    }
  }
  
  console.log('✅ Outbreak data added');
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Airtable to SQLite migration...\n');
  
  try {
    await migrateCaseStudies();
    await migratePeople();
    await migratePapers();
    await addGeographicData();
    await addOutbreakData();
    
    // Get statistics
    const stats = {
      caseStudies: db.prepare('SELECT COUNT(*) as count FROM case_studies').get().count,
      people: db.prepare('SELECT COUNT(*) as count FROM people').get().count,
      papers: db.prepare('SELECT COUNT(*) as count FROM papers').get().count,
      dimensions: db.prepare('SELECT COUNT(*) as count FROM dimensions').get().count,
      locations: db.prepare('SELECT COUNT(*) as count FROM locations').get().count,
      outbreaks: db.prepare('SELECT COUNT(*) as count FROM outbreaks').get().count
    };
    
    console.log('\n📈 Migration Statistics:');
    console.log(`   Case Studies: ${stats.caseStudies}`);
    console.log(`   People: ${stats.people}`);
    console.log(`   Papers: ${stats.papers}`);
    console.log(`   Dimensions: ${stats.dimensions}`);
    console.log(`   Locations: ${stats.locations}`);
    console.log(`   Outbreaks: ${stats.outbreaks}`);
    
    console.log('\n✅ Migration complete!');
    console.log('📁 Database saved to:', path.join(dbDir, 'pandemic-resilience.db'));
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    db.close();
  }
}

// Run migration
migrate();