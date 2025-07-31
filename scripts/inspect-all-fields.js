import { fetchRecords } from '../utils/airtable.js';
import dotenv from 'dotenv';

dotenv.config();

async function inspectAllFields() {
  console.log('🔍 Attempting to fetch ALL fields from Airtable...\n');
  
  try {
    // Try fetching without specifying a view
    console.log('1️⃣ Fetching without view specification:');
    const withoutView = await fetchRecords('Case study forms', { 
      maxRecords: 1,
      // Don't specify view to get all fields
    });
    
    if (withoutView.length > 0) {
      console.log('Fields found:', Object.keys(withoutView[0]).length);
      console.log('Field names:', Object.keys(withoutView[0]));
    }
    
    // Try with different view names
    const viewNames = ['All', 'All fields', 'Complete view', 'Full view', 'Main view'];
    
    for (const viewName of viewNames) {
      console.log(`\n2️⃣ Trying view: "${viewName}"`);
      try {
        const records = await fetchRecords('Case study forms', { 
          maxRecords: 1,
          view: viewName
        });
        
        if (records.length > 0) {
          console.log(`✅ Success! Found ${Object.keys(records[0]).length} fields`);
          console.log('Field names:', Object.keys(records[0]));
          break;
        }
      } catch (e) {
        console.log(`❌ View "${viewName}" not found`);
      }
    }
    
    // Try to get table metadata
    console.log('\n3️⃣ Attempting to list all available views and fields...');
    // Note: This would require additional Airtable API permissions
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

inspectAllFields();