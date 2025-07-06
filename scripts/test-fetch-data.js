import { fetchCaseStudies, fetchPeopleData, fetchLandscapeData, fetchPapers } from '../utils/airtable.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function testFetchData() {
  console.log('Testing data fetching from Airtable...\n');
  
  // Test Case Studies
  try {
    console.log('1. Testing Case Studies fetch...');
    const caseStudies = await fetchCaseStudies({ maxRecords: 5 });
    console.log(`✅ Case Studies: Retrieved ${caseStudies.length} records`);
    if (caseStudies.length > 0) {
      console.log('   First record:', JSON.stringify(caseStudies[0], null, 2));
    }
  } catch (error) {
    console.log(`❌ Case Studies error: ${error.message}`);
  }
  
  console.log('\n---\n');
  
  // Test People
  try {
    console.log('2. Testing People fetch...');
    const people = await fetchPeopleData({ maxRecords: 5 });
    console.log(`✅ People: Retrieved ${people.length} records`);
    if (people.length > 0) {
      console.log('   First record:', JSON.stringify(people[0], null, 2));
    }
  } catch (error) {
    console.log(`❌ People error: ${error.message}`);
  }
  
  console.log('\n---\n');
  
  // Test Landscape Topics
  try {
    console.log('3. Testing Landscape Topics fetch...');
    const landscapeTopics = await fetchLandscapeData({ maxRecords: 5 });
    console.log(`✅ Landscape Topics: Retrieved ${landscapeTopics.length} records`);
    if (landscapeTopics.length > 0) {
      console.log('   First record:', JSON.stringify(landscapeTopics[0], null, 2));
    }
  } catch (error) {
    console.log(`❌ Landscape Topics error: ${error.message}`);
  }
  
  console.log('\n---\n');
  
  // Test Papers
  try {
    console.log('4. Testing Papers fetch...');
    const papers = await fetchPapers({ maxRecords: 5 });
    console.log(`✅ Papers: Retrieved ${papers.length} records`);
    if (papers.length > 0) {
      console.log('   First record:', JSON.stringify(papers[0], null, 2));
    }
  } catch (error) {
    console.log(`❌ Papers error: ${error.message}`);
  }
}

// Run the test
testFetchData();