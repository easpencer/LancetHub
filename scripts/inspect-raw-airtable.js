import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

async function inspectRawAirtable() {
  console.log('🔍 Inspecting RAW Airtable data...\n');
  
  try {
    // Configure Airtable
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Try to get raw record data
    const records = await base('Case study forms').select({
      maxRecords: 1,
      // Don't specify view or fields to get everything
    }).all();
    
    if (records.length > 0) {
      const record = records[0];
      console.log('📄 RAW RECORD OBJECT:');
      console.log('====================');
      
      // Inspect the raw record structure
      console.log('\n1️⃣ Record ID:', record.id);
      console.log('\n2️⃣ Record fields object keys:');
      console.log(Object.keys(record.fields));
      
      console.log('\n3️⃣ ALL FIELDS (including empty):');
      for (const [key, value] of Object.entries(record.fields)) {
        console.log(`\n🔸 "${key}" [${typeof value}]:`);
        if (value === null || value === undefined) {
          console.log('   [empty]');
        } else if (typeof value === 'string' && value.length > 200) {
          console.log('   ' + value.substring(0, 200) + '...');
          console.log(`   [Total length: ${value.length} characters]`);
        } else {
          console.log('   ', value);
        }
      }
      
      // Check for any hidden properties
      console.log('\n4️⃣ Checking for non-enumerable properties:');
      const allProps = Object.getOwnPropertyNames(record.fields);
      console.log('All property names:', allProps);
      
      // Try to access by index (in case there are unnamed columns)
      console.log('\n5️⃣ Attempting to access fields by various methods:');
      
      // Try common field name variations
      const variations = [
        'Methodology', 'methodology', 'Methods',
        'Findings', 'findings', 'Key Findings',
        'Recommendations', 'recommendations',
        'Results', 'results',
        'Implementation', 'implementation',
        'Details', 'Full Text', 'Content',
        'Description', 'Full Description',
        'Column 13', 'Column 14', 'Column 15' // In case they're numbered
      ];
      
      for (const fieldName of variations) {
        if (record.fields[fieldName]) {
          console.log(`✅ Found field "${fieldName}":`, 
            record.fields[fieldName].substring(0, 100) + '...');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

inspectRawAirtable();