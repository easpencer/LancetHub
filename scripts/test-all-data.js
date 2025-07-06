// Test script to check all Airtable data
require('dotenv').config({ path: '.env.local' });

async function testAllData() {
  try {
    // Import the config
    const { AIRTABLE_CONFIG } = await import('../utils/airtable-config.js');
    console.log('Using Airtable config:', {
      hasApiKey: !!AIRTABLE_CONFIG.apiKey,
      baseId: AIRTABLE_CONFIG.baseId
    });

    // Import Airtable functions
    const { 
      fetchCaseStudies, 
      fetchPeopleData, 
      fetchLandscapeData,
      fetchPapers 
    } = await import('../utils/airtable.js');

    console.log('\n📊 Testing all Airtable tables:\n');

    // Test Case Studies
    console.log('1. Case Studies:');
    try {
      const caseStudies = await fetchCaseStudies({ maxRecords: 10 });
      console.log(`   ✅ Found ${caseStudies.length} case studies`);
      if (caseStudies.length > 0) {
        console.log('   Fields:', Object.keys(caseStudies[0]));
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test People
    console.log('\n2. People:');
    try {
      const people = await fetchPeopleData({ maxRecords: 10 });
      console.log(`   ✅ Found ${people.length} people`);
      if (people.length > 0) {
        console.log('   Fields:', Object.keys(people[0]));
        console.log('   First person:', people[0].Name, '- Has Image:', !!people[0].Image);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test Landscape Topics
    console.log('\n3. Landscape Topics:');
    try {
      const topics = await fetchLandscapeData({ maxRecords: 10 });
      console.log(`   ✅ Found ${topics.length} landscape topics`);
      if (topics.length > 0) {
        console.log('   Fields:', Object.keys(topics[0]));
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test Papers
    console.log('\n4. Papers/Bibliography:');
    try {
      const papers = await fetchPapers({ maxRecords: 10 });
      console.log(`   ✅ Found ${papers.length} papers`);
      if (papers.length > 0) {
        console.log('   Fields:', Object.keys(papers[0]));
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAllData();