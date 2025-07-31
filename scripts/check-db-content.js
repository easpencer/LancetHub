import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../database/pandemic-resilience.db'));

console.log('🔍 Checking database content...\n');

// Check case studies with rich content
const richStudies = db.prepare(`
  SELECT title, name, findings, recommendations, methodology
  FROM case_studies 
  WHERE (findings IS NOT NULL AND findings != '') 
     OR (recommendations IS NOT NULL AND recommendations != '')
     OR (methodology IS NOT NULL AND methodology != '')
`).all();

console.log(`Found ${richStudies.length} case studies with rich content:\n`);

for (const study of richStudies) {
  console.log(`📄 ${study.title}`);
  console.log(`   Author: ${study.name}`);
  
  if (study.findings) {
    console.log(`   Findings: ${study.findings.substring(0, 100)}...`);
  }
  if (study.recommendations) {
    console.log(`   Recommendations: ${study.recommendations.substring(0, 100)}...`);
  }
  if (study.methodology) {
    console.log(`   Methodology: ${study.methodology.substring(0, 100)}...`);
  }
  console.log('');
}

db.close();