import Airtable from 'airtable';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function testAirtableConnection() {
  console.log('Testing Airtable connection...\n');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('❌ Missing Airtable credentials in .env.local');
    return;
  }
  
  console.log('✅ Credentials found');
  console.log(`Base ID: ${baseId}`);
  console.log(`API Key: ${apiKey.substring(0, 10)}...`);
  
  try {
    // Configure Airtable
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    console.log('\n🔍 Testing common table names...\n');
    
    // List of possible table names to test
    const tableNamesToTest = [
      'Case study forms',
      'Case Study Forms',
      'case study forms',
      'Case Studies',
      'case-studies',
      'People',
      'people',
      'Landscape topics',
      'Landscape Topics',
      'landscape topics',
      'Papers',
      'papers',
      'Bibliography',
      'bibliography',
      'Metrics',
      'metrics'
    ];
    
    for (const tableName of tableNamesToTest) {
      try {
        console.log(`Testing table: "${tableName}"...`);
        const records = await base(tableName).select({
          maxRecords: 1,
          view: 'Grid view'
        }).firstPage();
        
        console.log(`✅ Table "${tableName}" exists! Found ${records.length} record(s)`);
        
        if (records.length > 0) {
          console.log('   Fields found:', Object.keys(records[0].fields));
        }
      } catch (error) {
        if (error.message.includes('Could not find table')) {
          console.log(`❌ Table "${tableName}" not found`);
        } else {
          console.log(`❌ Error accessing "${tableName}": ${error.message}`);
        }
      }
    }
    
    console.log('\n📋 Summary: Check the successful table names above and update your code accordingly.');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Run the test
testAirtableConnection();