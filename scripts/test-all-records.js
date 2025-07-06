import { fetchCaseStudies, fetchPeopleData, fetchPapers } from '../utils/airtable.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function testAllRecords() {
  console.log('Testing fetching ALL records from Airtable...\n');
  
  // Test Case Studies - fetch ALL
  try {
    console.log('1. Fetching ALL Case Studies...');
    const caseStudies = await fetchCaseStudies({ maxRecords: 1000 }); // High limit to get all
    console.log(`✅ Case Studies: Retrieved ${caseStudies.length} total records`);
    console.log('   Field names from first record:', Object.keys(caseStudies[0] || {}));
  } catch (error) {
    console.log(`❌ Case Studies error: ${error.message}`);
  }
  
  console.log('\n---\n');
  
  // Test People - fetch ALL
  try {
    console.log('2. Fetching ALL People...');
    const people = await fetchPeopleData({ maxRecords: 1000 }); // High limit to get all
    console.log(`✅ People: Retrieved ${people.length} total records`);
    console.log('   Field names from first record:', Object.keys(people[0] || {}));
    
    // Show all names to verify we're getting everyone
    console.log('\n   All people names:');
    people.forEach((person, index) => {
      console.log(`   ${index + 1}. ${person.Name} - ${person.Affiliation}`);
    });
  } catch (error) {
    console.log(`❌ People error: ${error.message}`);
  }
  
  console.log('\n---\n');
  
  // Test Papers - fetch ALL
  try {
    console.log('3. Fetching ALL Papers...');
    const papers = await fetchPapers({ maxRecords: 1000 }); // High limit to get all
    console.log(`✅ Papers: Retrieved ${papers.length} total records`);
    console.log('   Field names from first record:', Object.keys(papers[0] || {}));
    
    // Show all paper titles
    console.log('\n   All paper titles:');
    papers.forEach((paper, index) => {
      console.log(`   ${index + 1}. ${paper['Paper title']}`);
    });
  } catch (error) {
    console.log(`❌ Papers error: ${error.message}`);
  }
}

// Run the test
testAllRecords();