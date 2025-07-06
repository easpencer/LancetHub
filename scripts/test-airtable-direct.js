// Test Airtable connection directly
require('dotenv').config({ path: '.env.local' });

const Airtable = require('airtable');

async function testAirtable() {
  console.log('Testing direct Airtable connection...\n');
  
  const apiKey = process.env.AIRTABLE_API_KEY || require('../utils/airtable-config.js').AIRTABLE_CONFIG.apiKey;
  const baseId = process.env.AIRTABLE_BASE_ID || require('../utils/airtable-config.js').AIRTABLE_CONFIG.baseId;
  
  console.log('Credentials:', {
    hasApiKey: !!apiKey,
    apiKeyStart: apiKey?.substring(0, 10) + '...',
    baseId: baseId
  });
  
  try {
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    // Test Case study forms specifically
    console.log('\nTesting "Case study forms" table:');
    const caseStudies = await base('Case study forms')
      .select({ 
        maxRecords: 5,
        view: 'Grid view'
      })
      .all();
    
    console.log(`Found ${caseStudies.length} case studies\n`);
    
    caseStudies.forEach((record, i) => {
      console.log(`\nRecord ${i + 1}:`);
      console.log('ID:', record.id);
      console.log('Fields:', Object.keys(record.fields));
      console.log('Title:', record.fields['Case Study Title'] || 'No title');
      console.log('Name:', record.fields['Name'] || 'No name');
      console.log('Full record:', JSON.stringify(record.fields, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testAirtable();