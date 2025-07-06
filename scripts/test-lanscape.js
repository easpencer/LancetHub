const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function testLanscape() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  console.log('Testing "lanscape" table (note the spelling):\n');
  
  try {
    const records = await base('lanscape').select({ maxRecords: 10 }).firstPage();
    console.log(`✅ SUCCESS: Found ${records.length} records in "lanscape" table`);
    
    if (records.length > 0) {
      console.log('\nFirst record:');
      console.log('Fields:', Object.keys(records[0].fields));
      console.log('Data:', JSON.stringify(records[0].fields, null, 2));
      
      console.log('\nAll records:');
      records.forEach((record, i) => {
        console.log(`\nRecord ${i + 1}:`, JSON.stringify(record.fields, null, 2));
      });
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

testLanscape();