import { fetchPeopleData } from './utils/airtable.js';

async function debugPeople() {
  try {
    console.log('Fetching people data...');
    const people = await fetchPeopleData({ maxRecords: 5 });
    
    console.log(`Found ${people.length} people`);
    
    if (people.length > 0) {
      console.log('\n=== FIRST PERSON RECORD ===');
      console.log('Available fields:', Object.keys(people[0]));
      console.log('\nFirst person data:');
      console.log(JSON.stringify(people[0], null, 2));
      
      console.log('\n=== SEARCHING FOR YOUR EMAIL ===');
      const yourEmail = 'earonoffspencer@health.ucsd.edu';
      
      people.forEach((person, index) => {
        const allValues = Object.values(person).join(' ').toLowerCase();
        if (allValues.includes('spencer') || allValues.includes('ucsd') || allValues.includes(yourEmail.toLowerCase())) {
          console.log(`\nPOSSIBLE MATCH - Person ${index + 1}:`);
          console.log(JSON.stringify(person, null, 2));
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugPeople();