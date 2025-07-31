import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function listAllBases() {
  console.log('🔍 Listing all accessible Airtable bases...\n');
  
  try {
    // Use the Airtable Meta API to list bases
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.bases.length} bases:\n`);
    
    for (const base of data.bases) {
      console.log(`📊 Base: ${base.name}`);
      console.log(`   ID: ${base.id}`);
      console.log(`   Permission: ${base.permissionLevel}`);
      console.log('');
    }
    
    // Now check tables in the current base
    console.log('\n📋 Checking tables in current base...');
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tablesResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    
    if (tablesResponse.ok) {
      const tablesData = await tablesResponse.json();
      console.log(`\nTables in base ${baseId}:`);
      
      for (const table of tablesData.tables) {
        console.log(`\n📊 Table: ${table.name} (${table.id})`);
        console.log(`   Fields: ${table.fields.length}`);
        
        // List all fields
        console.log('   Field names:');
        for (const field of table.fields) {
          console.log(`     - ${field.name} (${field.type})`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listAllBases();