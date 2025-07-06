const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function testAllTables() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  // Comprehensive list of possible table names
  const possibleTables = [
    'People', 'Case study forms', 'Papers', 'Bibliography',
    'Landscape', 'Landscape topics', 'Landscapes', 'Framework', 'Frameworks',
    'Resilience', 'Resilience Framework', 'Resilience Dimensions', 'Dimensions',
    'Topics', 'Research Topics', 'Key Topics', 'Themes', 'Categories',
    'Metrics', 'Indicators', 'Measures', 'Data', 'Resources',
    'Working Groups', 'Groups', 'Teams', 'Organizations',
    'Studies', 'Research', 'Projects', 'Cases', 'Examples',
    'Interventions', 'Strategies', 'Approaches', 'Methods',
    'Outcomes', 'Results', 'Findings', 'Evidence',
    'Taxonomy', 'Classification', 'Structure', 'Hierarchy',
    'Grid view', 'Main', 'Master', 'Primary', 'Core'
  ];

  console.log('Testing all possible table names:\n');
  
  for (const table of possibleTables) {
    try {
      const records = await base(table).select({ maxRecords: 1 }).firstPage();
      console.log(`✅ "${table}" - ${records.length} records`);
      if (records.length > 0) {
        console.log(`   Fields: ${Object.keys(records[0].fields).join(', ')}`);
        console.log(`   Sample: ${JSON.stringify(records[0].fields, null, 2)}`);
      }
    } catch (error) {
      console.log(`❌ "${table}" - ${error.message}`);
    }
  }
}

testAllTables();