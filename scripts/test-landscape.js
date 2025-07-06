// Test different table names
require('dotenv').config({ path: '.env.local' });

const Airtable = require('airtable');

async function testTables() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  Airtable.configure({ apiKey });
  const base = Airtable.base(baseId);
  
  const tablesToTest = [
    'Landscape',
    'Landscape topics', 
    'Landscapes',
    'Resilience Dimensions',
    'Dimensions',
    'Framework',
    'Topics'
  ];
  
  console.log('Testing possible table names:\n');
  
  for (const tableName of tablesToTest) {
    try {
      const records = await base(tableName)
        .select({ maxRecords: 1 })
        .firstPage();
      
      console.log(`✅ "${tableName}" - Found ${records.length} records`);
      if (records.length > 0) {
        console.log(`   Fields: ${Object.keys(records[0].fields).join(', ')}`);
      }
    } catch (error) {
      console.log(`❌ "${tableName}" - ${error.message}`);
    }
  }
}

testTables();