import { fetchCaseStudies } from '../utils/airtable.js';
import dotenv from 'dotenv';

dotenv.config();

async function inspectAirtableFields() {
  console.log('🔍 Inspecting Airtable fields...\n');
  
  try {
    // Fetch just a few records to inspect
    const caseStudies = await fetchCaseStudies({ maxRecords: 2 });
    
    if (caseStudies.length > 0) {
      console.log(`Found ${caseStudies.length} case studies\n`);
      
      // Show all field names
      const allFields = Object.keys(caseStudies[0]);
      console.log('📋 All available fields:', allFields);
      console.log(`Total fields: ${allFields.length}\n`);
      
      // Show first record with all fields
      console.log('📄 First case study - ALL DATA:');
      console.log('================================');
      
      const firstStudy = caseStudies[0];
      for (const [key, value] of Object.entries(firstStudy)) {
        console.log(`\n🔸 ${key}:`);
        if (typeof value === 'string' && value.length > 200) {
          console.log(value.substring(0, 200) + '...');
          console.log(`   [Total length: ${value.length} characters]`);
        } else {
          console.log(value);
        }
      }
      
      // Look for fields that might contain the rich text
      console.log('\n\n🔍 Searching for fields with long text content:');
      console.log('================================================');
      
      for (const [key, value] of Object.entries(firstStudy)) {
        if (typeof value === 'string' && value.length > 500) {
          console.log(`\n📝 ${key} (${value.length} chars):`);
          console.log('First 500 chars:', value.substring(0, 500));
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

inspectAirtableFields();