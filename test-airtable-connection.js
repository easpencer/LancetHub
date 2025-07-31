// Test Airtable connection directly
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🔍 Testing Airtable Connection\n');

console.log('Environment Variables:');
console.log(`  AIRTABLE_API_KEY: ${process.env.AIRTABLE_API_KEY ? 'Set (' + process.env.AIRTABLE_API_KEY.substring(0, 10) + '...)' : 'Not set'}`);
console.log(`  AIRTABLE_BASE_ID: ${process.env.AIRTABLE_BASE_ID || 'Not set'}`);
console.log(`  USE_AIRTABLE: ${process.env.USE_AIRTABLE}`);

// Test Airtable connection
async function testConnection() {
  try {
    console.log('\n🔄 Importing Airtable...');
    const { fetchCaseStudies } = await import('./utils/airtable.js');
    
    console.log('✅ Airtable module imported successfully');
    
    console.log('\n🔄 Fetching case studies...');
    const caseStudies = await fetchCaseStudies({ 
      maxRecords: 5,
      view: 'Grid view'
    });
    
    console.log(`\n📊 Results:`);
    console.log(`  Count: ${caseStudies.length}`);
    
    if (caseStudies.length > 0) {
      console.log(`\n📋 First case study:`);
      console.log(`  Title: ${caseStudies[0]['Case Study Title'] || caseStudies[0].Title || 'No title'}`);
      console.log(`  Fields available: ${Object.keys(caseStudies[0]).join(', ')}`);
    } else {
      console.log('\n❌ No case studies returned');
      console.log('This could mean:');
      console.log('  1. Wrong table name');
      console.log('  2. Wrong view name');
      console.log('  3. API key/base ID incorrect');
      console.log('  4. No records in table');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

testConnection();