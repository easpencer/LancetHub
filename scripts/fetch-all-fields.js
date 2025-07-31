import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

async function fetchAllFields() {
  console.log('🔍 Fetching ALL fields from Case study forms...\n');
  
  try {
    // Configure Airtable
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Specify ALL fields we want to fetch
    const allFields = [
      'Case Study Title',
      'Name',
      'Section',
      'Study Focus',
      'Short Description',
      'Relevance to Community/Societal Resilience',
      'Study Type ',
      'Resilient Dimensions ',
      'Key Words ',
      'Keywords (other)',
      'Date',
      'Lanscape topics',
      'References',
      'Key authors (from References)',
      'Add Reference',
      'Results',
      'Insights',
      'Next steps',
      'People',
      'Reviewers',
      'Reviewer Notes',
      'Resilience Factors (positive and negative)',
      'Initial Lessons (What kind of actions do we need to be taking now)',
      'Audience (who are the people these lessons are directed to)',
      'Potential next steps (expansion) of the topic',
      'Documents',
      'Field 27',
      'Methods'
    ];
    
    // Fetch with all fields specified
    const records = await base('Case study forms').select({
      maxRecords: 2,
      fields: allFields
    }).all();
    
    console.log(`Found ${records.length} case studies\n`);
    
    if (records.length > 0) {
      const record = records[0];
      console.log('📄 First case study - ALL FIELDS:');
      console.log('=====================================');
      
      // Show all fields, including empty ones
      for (const fieldName of allFields) {
        const value = record.get(fieldName);
        console.log(`\n🔸 ${fieldName}:`);
        
        if (value === undefined || value === null || value === '') {
          console.log('   [empty]');
        } else if (typeof value === 'string' && value.length > 200) {
          console.log('   ' + value.substring(0, 200) + '...');
          console.log(`   [Total length: ${value.length} characters]`);
        } else {
          console.log('   ', value);
        }
      }
      
      // Count non-empty fields
      const nonEmptyFields = allFields.filter(field => {
        const val = record.get(field);
        return val !== undefined && val !== null && val !== '';
      });
      
      console.log(`\n\n📊 Summary: ${nonEmptyFields.length} of ${allFields.length} fields have values`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

fetchAllFields();