const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function testPeople() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  console.log('Testing People table:');
  
  try {
    const records = await base('People').select({ maxRecords: 3 }).firstPage();
    
    console.log(`Found ${records.length} people`);
    
    records.forEach((record, i) => {
      console.log(`\nPerson ${i + 1}:`);
      console.log('ID:', record.id);
      console.log('Fields:', Object.keys(record.fields));
      console.log('Full record:', JSON.stringify(record.fields, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPeople();