import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../utils/airtable-config.js';

async function testAirtableDirect() {
  console.log('Testing direct Airtable access...\n');
  
  try {
    // Configure Airtable
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    const base = Airtable.base(AIRTABLE_CONFIG.baseId);
    
    // Try to list known tables
    const knownTables = [
      'Case study forms',
      'People', 
      'Papers',
      'Landscape topics',
      'Resilience Dimensions',
      'Metrics',
      'Dimensions',
      'Frameworks'
    ];
    
    for (const tableName of knownTables) {
      try {
        console.log(`\nTrying table: "${tableName}"...`);
        const records = await base(tableName).select({ maxRecords: 1 }).firstPage();
        console.log(`✅ SUCCESS: "${tableName}" exists with ${records.length} record(s)`);
        if (records.length > 0) {
          console.log('   Fields:', Object.keys(records[0].fields));
        }
      } catch (error) {
        console.log(`❌ FAILED: "${tableName}" - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('General error:', error.message);
  }
}

// Run the test
testAirtableDirect();