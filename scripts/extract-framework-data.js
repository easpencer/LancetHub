const { AIRTABLE_CONFIG } = require('../utils/airtable-config.js');
const Airtable = require('airtable');

async function extractFrameworkData() {
  Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
  const base = Airtable.base(AIRTABLE_CONFIG.baseId);

  console.log('Looking for framework/resilience data in accessible tables...\n');
  
  // Check Case study forms for framework-related entries
  console.log('=== CASE STUDY FORMS ===');
  try {
    const caseStudies = await base('Case study forms').select({ maxRecords: 100 }).all();
    console.log(`Found ${caseStudies.length} case studies\n`);
    
    // Look for framework-related case studies
    const frameworkStudies = caseStudies.filter(record => {
      const fields = record.fields;
      const title = fields['Case Study Title'] || '';
      const focus = fields['Study Focus'] || '';
      const keywords = fields['Key Words '] || [];
      const keywordString = Array.isArray(keywords) ? keywords.join(' ') : keywords;
      
      return title.toLowerCase().includes('framework') || 
             focus.toLowerCase().includes('framework') ||
             keywordString.toLowerCase().includes('framework') ||
             title.toLowerCase().includes('resilience') ||
             focus.toLowerCase().includes('resilience');
    });
    
    console.log(`Found ${frameworkStudies.length} framework-related studies:`);
    frameworkStudies.forEach((record, i) => {
      console.log(`\nFramework Study ${i + 1}:`);
      console.log('Title:', record.fields['Case Study Title']);
      console.log('Focus:', record.fields['Study Focus']);
      console.log('Dimensions:', record.fields['Resilient Dimensions ']);
      console.log('Keywords:', record.fields['Key Words ']);
    });
    
  } catch (error) {
    console.log('Error accessing Case study forms:', error.message);
  }
  
  // Check Papers for framework-related content
  console.log('\n\n=== PAPERS ===');
  try {
    const papers = await base('Papers').select({ maxRecords: 100 }).all();
    console.log(`Found ${papers.length} papers\n`);
    
    // Look for framework-related papers
    const frameworkPapers = papers.filter(record => {
      const title = record.fields['Paper title'] || '';
      const notes = record.fields['Notes'] || '';
      
      return title.toLowerCase().includes('framework') || 
             notes.toLowerCase().includes('framework') ||
             title.toLowerCase().includes('resilience') ||
             notes.toLowerCase().includes('resilience');
    });
    
    console.log(`Found ${frameworkPapers.length} framework-related papers:`);
    frameworkPapers.forEach((record, i) => {
      console.log(`\nFramework Paper ${i + 1}:`);
      console.log('Title:', record.fields['Paper title']);
      console.log('Notes:', record.fields['Notes']);
    });
    
  } catch (error) {
    console.log('Error accessing Papers:', error.message);
  }
  
  // Check if there's any pattern to extract framework dimensions
  console.log('\n\n=== DIMENSION EXTRACTION ===');
  try {
    const caseStudies = await base('Case study forms').select({ maxRecords: 100 }).all();
    
    // Extract all unique dimensions
    const allDimensions = new Set();
    caseStudies.forEach(record => {
      const dims = record.fields['Resilient Dimensions '] || [];
      if (Array.isArray(dims)) {
        dims.forEach(d => allDimensions.add(d));
      }
    });
    
    console.log('Unique Resilient Dimensions found across all case studies:');
    Array.from(allDimensions).forEach(dim => {
      console.log(`- ${dim}`);
    });
    
  } catch (error) {
    console.log('Error extracting dimensions:', error.message);
  }
}

extractFrameworkData();