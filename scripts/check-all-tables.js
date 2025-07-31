import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

async function checkAllTables() {
  console.log('🔍 Checking all possible Airtable tables...\n');
  
  try {
    // Configure Airtable
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Try different table name variations
    const tableNames = [
      'Case study forms',
      'Case Studies',
      'Case Study Details',
      'Case Study Content',
      'Case Study Extended',
      'Extended Fields',
      'Rich Text',
      'Methodology',
      'Findings',
      'Recommendations',
      'Full Case Studies',
      'Complete Case Studies'
    ];
    
    for (const tableName of tableNames) {
      try {
        console.log(`\n📊 Trying table: "${tableName}"`);
        const records = await base(tableName).select({
          maxRecords: 1
        }).all();
        
        if (records.length > 0) {
          console.log(`✅ SUCCESS! Found table "${tableName}"`);
          console.log('   Fields:', Object.keys(records[0].fields));
          
          // Check if this table has the rich content
          const richFields = ['Methodology', 'Findings', 'Recommendations', 'Results'];
          const hasRichContent = richFields.some(field => 
            Object.keys(records[0].fields).some(key => 
              key.toLowerCase().includes(field.toLowerCase())
            )
          );
          
          if (hasRichContent) {
            console.log('   🎯 This table contains rich text content!');
          }
        }
      } catch (error) {
        if (!error.message.includes('NOT_FOUND')) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }
    
    // Also check if the main table has hidden/extended views
    console.log('\n\n📋 Checking different views in Case study forms:');
    const viewNames = [
      'Grid view',
      'All fields',
      'Extended view',
      'Complete view',
      'Full view',
      'Details view',
      'Rich text view'
    ];
    
    for (const viewName of viewNames) {
      try {
        console.log(`\n👁️ Trying view: "${viewName}"`);
        const records = await base('Case study forms').select({
          maxRecords: 1,
          view: viewName
        }).all();
        
        if (records.length > 0) {
          console.log(`✅ Found view "${viewName}"`);
          console.log('   Fields:', Object.keys(records[0].fields).length);
          console.log('   Field names:', Object.keys(records[0].fields));
        }
      } catch (error) {
        if (!error.message.includes('NOT_FOUND')) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllTables();