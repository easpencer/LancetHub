-- Pandemic Resilience Hub SQLite Database Schema
-- This schema extends the original Airtable structure with additional fields for enhanced functionality

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Case Studies table (enhanced from Airtable)
CREATE TABLE IF NOT EXISTS case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airtable_id TEXT UNIQUE, -- Original Airtable ID for reference
    
    -- Core fields from Airtable
    name TEXT, -- Author/submitter name
    section TEXT, -- Section category
    title TEXT NOT NULL, -- Case Study Title
    study_focus TEXT, -- Study Focus
    short_description TEXT, -- Short Description
    relevance TEXT, -- Relevance to Community/Societal Resilience
    study_type TEXT, -- Study Type
    dimensions TEXT, -- Resilient Dimensions (comma-separated)
    keywords TEXT, -- Key Words (comma-separated)
    date DATE,
    people_ids TEXT, -- People IDs (comma-separated)
    
    -- Legacy fields for compatibility
    description TEXT, -- Maps to short_description
    institution TEXT,
    type TEXT, -- Maps to study_type
    methodology TEXT,
    findings TEXT,
    recommendations TEXT,
    
    -- Additional enhanced fields
    country TEXT,
    region TEXT,
    impact_metrics JSON,
    implementation_status TEXT,
    funding_amount REAL,
    beneficiaries_count INTEGER,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_source TEXT DEFAULT 'airtable',
    is_verified BOOLEAN DEFAULT FALSE
);

-- People table (enhanced)
CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    title TEXT,
    institution TEXT,
    bio TEXT,
    photo_url TEXT,
    
    -- New fields
    email TEXT,
    orcid TEXT,
    expertise_areas TEXT,
    country TEXT,
    linkedin_url TEXT,
    publications_count INTEGER,
    h_index INTEGER,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dimensions table (normalized from Airtable)
CREATE TABLE IF NOT EXISTS dimensions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    parent_dimension_id INTEGER,
    
    -- New fields
    icon TEXT,
    color TEXT,
    weight REAL DEFAULT 1.0,
    
    FOREIGN KEY (parent_dimension_id) REFERENCES dimensions(id)
);

-- Papers/Bibliography table (enhanced)
CREATE TABLE IF NOT EXISTS papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airtable_id TEXT UNIQUE,
    title TEXT NOT NULL,
    authors TEXT,
    year INTEGER,
    journal TEXT,
    doi TEXT,
    url TEXT,
    abstract TEXT,
    
    -- New fields
    citation_count INTEGER,
    keywords TEXT,
    methodology TEXT,
    key_findings TEXT,
    pdf_url TEXT,
    open_access BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metrics table
CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT,
    category TEXT,
    
    -- New fields
    calculation_method TEXT,
    data_source TEXT,
    update_frequency TEXT,
    baseline_value REAL,
    target_value REAL
);

-- Many-to-many relationship tables
CREATE TABLE IF NOT EXISTS case_study_dimensions (
    case_study_id INTEGER,
    dimension_id INTEGER,
    relevance_score REAL DEFAULT 1.0,
    PRIMARY KEY (case_study_id, dimension_id),
    FOREIGN KEY (case_study_id) REFERENCES case_studies(id),
    FOREIGN KEY (dimension_id) REFERENCES dimensions(id)
);

CREATE TABLE IF NOT EXISTS case_study_people (
    case_study_id INTEGER,
    person_id INTEGER,
    role TEXT, -- 'author', 'contributor', 'reviewer', etc.
    PRIMARY KEY (case_study_id, person_id),
    FOREIGN KEY (case_study_id) REFERENCES case_studies(id),
    FOREIGN KEY (person_id) REFERENCES people(id)
);

CREATE TABLE IF NOT EXISTS case_study_metrics (
    case_study_id INTEGER,
    metric_id INTEGER,
    value REAL,
    measurement_date DATE,
    notes TEXT,
    PRIMARY KEY (case_study_id, metric_id),
    FOREIGN KEY (case_study_id) REFERENCES case_studies(id),
    FOREIGN KEY (metric_id) REFERENCES metrics(id)
);

-- New tables for enhanced functionality

-- Geographic data
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT, -- 'country', 'region', 'city'
    parent_location_id INTEGER,
    latitude REAL,
    longitude REAL,
    population INTEGER,
    healthcare_index REAL,
    vulnerability_score REAL,
    geojson TEXT, -- Store boundary data
    
    FOREIGN KEY (parent_location_id) REFERENCES locations(id)
);

-- Outbreak data
CREATE TABLE IF NOT EXISTS outbreaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pathogen TEXT,
    start_date DATE,
    end_date DATE,
    location_id INTEGER,
    cases_count INTEGER,
    deaths_count INTEGER,
    economic_impact REAL,
    description TEXT,
    data_source TEXT,
    
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Insights and patterns (ML-generated)
CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT, -- 'pattern', 'trend', 'anomaly', 'recommendation'
    title TEXT,
    description TEXT,
    confidence_score REAL,
    related_entities JSON, -- IDs of related case studies, dimensions, etc.
    visualization_config JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interactions (for learning and personalization)
CREATE TABLE IF NOT EXISTS user_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    interaction_type TEXT, -- 'view', 'search', 'filter', 'export'
    entity_type TEXT,
    entity_id INTEGER,
    metadata JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_case_studies_date ON case_studies(date);
CREATE INDEX idx_case_studies_type ON case_studies(type);
CREATE INDEX idx_case_studies_country ON case_studies(country);
CREATE INDEX idx_papers_year ON papers(year);
CREATE INDEX idx_people_name ON people(name);
CREATE INDEX idx_outbreaks_date ON outbreaks(start_date);

-- Create full-text search tables
CREATE VIRTUAL TABLE case_studies_fts USING fts5(
    title, description, methodology, findings, recommendations,
    content=case_studies
);

CREATE VIRTUAL TABLE papers_fts USING fts5(
    title, authors, abstract, key_findings,
    content=papers
);

-- Triggers to keep FTS tables in sync
CREATE TRIGGER case_studies_ai AFTER INSERT ON case_studies BEGIN
    INSERT INTO case_studies_fts(rowid, title, description, methodology, findings, recommendations)
    VALUES (new.id, new.title, new.description, new.methodology, new.findings, new.recommendations);
END;

CREATE TRIGGER case_studies_ad AFTER DELETE ON case_studies BEGIN
    DELETE FROM case_studies_fts WHERE rowid = old.id;
END;

CREATE TRIGGER case_studies_au AFTER UPDATE ON case_studies BEGIN
    UPDATE case_studies_fts 
    SET title = new.title, description = new.description, methodology = new.methodology,
        findings = new.findings, recommendations = new.recommendations
    WHERE rowid = new.id;
END;

-- Similar triggers for papers_fts...

-- Views for common queries
CREATE VIEW case_study_overview AS
SELECT 
    cs.id,
    cs.title,
    cs.date,
    cs.type,
    cs.institution,
    cs.country,
    GROUP_CONCAT(DISTINCT d.name) as dimensions,
    COUNT(DISTINCT csp.person_id) as contributors_count,
    AVG(csm.value) as avg_metric_value
FROM case_studies cs
LEFT JOIN case_study_dimensions csd ON cs.id = csd.case_study_id
LEFT JOIN dimensions d ON csd.dimension_id = d.id
LEFT JOIN case_study_people csp ON cs.id = csp.case_study_id
LEFT JOIN case_study_metrics csm ON cs.id = csm.case_study_id
GROUP BY cs.id;