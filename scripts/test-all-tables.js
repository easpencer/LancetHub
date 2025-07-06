const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function testTables() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  // Test commonly accessible tables
  const commonTables = [
    'People', 'Case study forms', 'Papers', 'Bibliography', 'Metrics', 'Research', 'Studies', 'Projects', 'Framework', 'Topics'
  ];

  console.log('Testing accessible tables:');
  for (const table of commonTables) {
    try {
      const records = await base(table).select({ maxRecords: 1 }).firstPage();
      console.log(`✅ ${table} - ${records.length} records`);
    } catch (error) {
      console.log(`❌ ${table} - ${error.message}`);
    }
  }
}

testTables();