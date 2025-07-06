#\!/usr/bin/env node

// Simple script to verify Airtable connection and show what data is available
require('dotenv').config({ path: '.env.local' });

const Airtable = require('airtable');

async function verifyAirtableConnection() {
  console.log('🔍 Verifying Airtable connection...\n');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (\!apiKey || \!baseId) {
    console.error('❌ Missing Airtable credentials in .env.local');
    console.log('   AIRTABLE_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
    console.log('   AIRTABLE_BASE_ID:', baseId ? '✅ Set' : '❌ Missing');
    return;
  }
  
  console.log('✅ Airtable credentials found');
  console.log('   Base ID:', baseId);
  
  try {
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    // Test each table
    const tables = [
      { name: 'Case study forms', display: 'Case Studies' },
      { name: 'People', display: 'People' },
      { name: 'Landscape topics', display: 'Landscape Topics' },
      { name: 'Papers', display: 'Bibliography/Papers' }
    ];
    
    console.log('\n📊 Testing Airtable tables:\n');
    
    for (const table of tables) {
      try {
        const records = await base(table.name)
          .select({ maxRecords: 3, view: 'Grid view' })
          .all();
        
        console.log(`✅ ${table.display}: ${records.length} records found`);
        
        if (records.length > 0) {
          console.log(`   Fields: ${Object.keys(records[0].fields).join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ ${table.display}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Airtable connection failed:', error.message);
  }
}

verifyAirtableConnection();
EOF < /dev/null