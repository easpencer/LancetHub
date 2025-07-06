import { fetchLandscapeData } from '../utils/airtable.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function testLandscape() {
  console.log('Testing Landscape data from Airtable...\n');
  
  try {
    console.log('Fetching Landscape Topics...');
    const landscape = await fetchLandscapeData({ maxRecords: 10 });
    console.log(`✅ Landscape: Retrieved ${landscape.length} records`);
    
    if (landscape.length > 0) {
      console.log('   Field names from first record:', Object.keys(landscape[0] || {}));
      console.log('\n   First record data:', JSON.stringify(landscape[0], null, 2));
    }
  } catch (error) {
    console.log(`❌ Landscape error: ${error.message}`);
    console.log('   Full error:', error);
  }
}

// Run the test
testLandscape();