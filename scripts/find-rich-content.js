import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

async function findRichContent() {
  console.log('🔍 Searching for case studies with rich content...\n');
  
  try {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Get ALL records to find ones with rich content
    const records = await base('Case study forms').select({
      maxRecords: 100,
      fields: [
        'Case Study Title',
        'Name',
        'Results',
        'Insights',
        'Methods',
        'Resilience Factors (positive and negative)',
        'Initial Lessons (What kind of actions do we need to be taking now)'
      ]
    }).all();
    
    console.log(`Checking ${records.length} case studies...\n`);
    
    let foundRichContent = false;
    
    for (const record of records) {
      const title = record.get('Case Study Title');
      const hasRichContent = 
        record.get('Results') || 
        record.get('Insights') || 
        record.get('Methods') ||
        record.get('Resilience Factors (positive and negative)') ||
        record.get('Initial Lessons (What kind of actions do we need to be taking now)');
      
      if (hasRichContent) {
        foundRichContent = true;
        console.log(`\n✅ Found rich content in: ${title}`);
        console.log('   Author:', record.get('Name'));
        
        if (record.get('Results')) {
          console.log('\n   📊 Results:', record.get('Results').substring(0, 200) + '...');
        }
        if (record.get('Insights')) {
          console.log('\n   💡 Insights:', record.get('Insights').substring(0, 200) + '...');
        }
        if (record.get('Methods')) {
          console.log('\n   🔬 Methods:', record.get('Methods').substring(0, 200) + '...');
        }
        if (record.get('Resilience Factors (positive and negative)')) {
          console.log('\n   🌟 Resilience Factors:', record.get('Resilience Factors (positive and negative)').substring(0, 200) + '...');
        }
        if (record.get('Initial Lessons (What kind of actions do we need to be taking now)')) {
          console.log('\n   📚 Initial Lessons:', record.get('Initial Lessons (What kind of actions do we need to be taking now)').substring(0, 200) + '...');
        }
      }
    }
    
    if (!foundRichContent) {
      console.log('❌ No case studies found with rich content in the expected fields.');
      console.log('\nChecking if the rich content might be in the main description fields...');
      
      // Check if rich content is embedded in other fields
      for (const record of records) {
        const title = record.get('Case Study Title');
        const shortDesc = record.get('Short Description') || '';
        
        // Look for keywords that suggest rich content
        if (shortDesc.includes('Results:') || 
            shortDesc.includes('Methods:') || 
            shortDesc.includes('Findings:') ||
            shortDesc.includes('Recommendations:')) {
          console.log(`\n🔍 ${title} has structured content in Short Description`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findRichContent();