/**
 * Script to verify Airtable connection and display information about the base
 * Usage: node scripts/verify-airtable.js
 */

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function verifyAirtable() {
  console.log('\n📊 AIRTABLE CONNECTION VERIFIER 📊\n');
  
  // Check environment variables
  console.log('🔍 Checking environment variables...');
  
  // Get API key from environment
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: AIRTABLE_API_KEY not found in environment variables.');
    console.error('   Make sure to create a .env.local file with your Airtable API key.');
    process.exit(1);
  }
  console.log('✅ AIRTABLE_API_KEY found');
  
  // Get base ID from environment
  let baseId = process.env.AIRTABLE_BASE_ID;
  if (!baseId) {
    console.error('❌ Error: AIRTABLE_BASE_ID not found in environment variables.');
    console.error('   Make sure to create a .env.local file with your Airtable base ID.');
    process.exit(1);
  }
  
  // Check if the base ID has extra segments and trim if necessary
  if (baseId.includes('/')) {
    console.log('⚠️  Warning: AIRTABLE_BASE_ID contains extra segments - cleaning...');
    baseId = baseId.split('/')[0];
    console.log(`   Using base ID: ${baseId}`);
  }
  console.log('✅ AIRTABLE_BASE_ID found');
  
  // Try connecting to Airtable
  console.log('\n🔌 Connecting to Airtable...');
  try {
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    console.log('✅ Connected to Airtable successfully!');
    
    // List tables in the base
    console.log('\n📋 Fetching tables from the base...');
    
    // Define tables to check - using the correct table names
    const requiredTables = [
      'Papers',
      'Case study forms',
      'People',
      'Landscape topics'
    ];
    
    // Fetch tables through the Schema API
    try {
      for (const tableName of requiredTables) {
        try {
          console.log(`   Checking table: ${tableName}`);
          const records = await base(tableName).select({ maxRecords: 1 }).firstPage();
          console.log(`   ✅ Table "${tableName}" exists with ${records.length} sample records`);
          
          // If we have a record, show the field names
          if (records.length > 0) {
            const fields = Object.keys(records[0].fields);
            console.log(`      Fields: ${fields.join(', ')}`);
          }
        } catch (error) {
          console.error(`   ❌ Error: Table "${tableName}" - ${error.message}`);
          console.error('      Make sure the table name is spelled exactly as in Airtable (case-sensitive)');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching tables:', error.message);
    }
    
    console.log('\n✨ Verification complete!');
    if (process.env.USE_MOCK_DATA === 'true') {
      console.log('⚠️  Note: Your app is currently using mock data (USE_MOCK_DATA=true)');
      console.log('   Change this to false in .env.local when ready to use real Airtable data.');
    }
    
  } catch (error) {
    console.error(`❌ Error connecting to Airtable: ${error.message}`);
    console.error('\nPossible reasons:');
    console.error('1. Invalid API key');
    console.error('2. Invalid base ID');
    console.error('3. Network connectivity issues');
    console.error('\nPlease check your credentials and try again.');
    process.exit(1);
  }
}

// Run the verification
verifyAirtable();
