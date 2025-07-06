const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function testLandscapeAccess() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  console.log('Testing "Landscape" table access:\n');
  
  try {
    console.log('Attempting to access "Landscape" table...');
    const records = await base('Landscape').select({ maxRecords: 10 }).firstPage();
    
    console.log(`✅ SUCCESS: Found ${records.length} records in Landscape table`);
    
    if (records.length > 0) {
      console.log('\nFirst record:');
      console.log('Fields:', Object.keys(records[0].fields));
      console.log('Data:', JSON.stringify(records[0].fields, null, 2));
      
      console.log('\nAll records:');
      records.forEach((record, i) => {
        console.log(`Record ${i + 1}:`, JSON.stringify(record.fields, null, 2));
      });
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('Full error:', error);
    
    // Check if it's a permissions issue
    if (error.message.includes('not authorized')) {
      console.log('\n🔒 This appears to be a permissions issue.');
      console.log('The table exists but the API key may not have access to it.');
      console.log('Please check the Airtable permissions for this base.');
    }
  }
}

testLandscapeAccess();