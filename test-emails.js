// Test script to check what email data we're getting from Airtable
import fetch from 'node-fetch';

async function checkEmails() {
  try {
    const response = await fetch('http://localhost:3000/api/people');
    const data = await response.json();
    
    console.log(`Total people: ${data.people.length}`);
    console.log('\nChecking for email fields in first 5 records:\n');
    
    data.people.slice(0, 5).forEach((person, index) => {
      console.log(`Person ${index + 1}:`);
      console.log(`  Name: ${person.Name || 'N/A'}`);
      console.log(`  Email: ${person.Email || 'N/A'}`);
      console.log(`  Email Address: ${person['Email Address'] || 'N/A'}`);
      console.log(`  All fields:`, Object.keys(person));
      console.log('---');
    });
    
    // Check if your email exists
    const yourEmail = 'earonoffspencer@health.ucsd.edu';
    const found = data.people.find(p => 
      (p.Email && p.Email.toLowerCase() === yourEmail.toLowerCase()) ||
      (p['Email Address'] && p['Email Address'].toLowerCase() === yourEmail.toLowerCase())
    );
    
    if (found) {
      console.log(`\nFound your record:`);
      console.log(`  Name: ${found.Name}`);
      console.log(`  Email: ${found.Email || found['Email Address']}`);
    } else {
      console.log(`\nYour email (${yourEmail}) was not found in the records.`);
      console.log('\nSearching for Spencer in names:');
      const spencer = data.people.filter(p => 
        p.Name && p.Name.toLowerCase().includes('spencer')
      );
      spencer.forEach(p => {
        console.log(`  - ${p.Name}: Email="${p.Email || 'none'}", Email Address="${p['Email Address'] || 'none'}"`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkEmails();