const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function testAllLanscape() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  console.log('Fetching ALL records from "lanscape" table:\n');
  
  try {
    const records = await base('lanscape').select({ maxRecords: 100 }).all();
    console.log(`✅ SUCCESS: Found ${records.length} total records in "lanscape" table`);
    
    // Count by dimension
    const dimensionCounts = {};
    records.forEach(record => {
      const dimension = record.fields.Dimension;
      dimensionCounts[dimension] = (dimensionCounts[dimension] || 0) + 1;
    });
    
    console.log('\nRecords by Dimension:');
    Object.entries(dimensionCounts).forEach(([dim, count]) => {
      console.log(`- ${dim}: ${count} records`);
    });
    
    console.log(`\nTotal: ${records.length} records`);
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

testAllLanscape();