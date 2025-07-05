#!/usr/bin/env node

/**
 * Debug script to check build environment and potential issues
 */

console.log('=== Build Environment Debug ===\n');

// Check Node version
console.log('Node Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Check environment variables
console.log('\n=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('NETLIFY:', process.env.NETLIFY);
console.log('USE_MOCK_DATA:', process.env.USE_MOCK_DATA);
console.log('FORCE_CASE_STUDY_FALLBACK:', process.env.FORCE_CASE_STUDY_FALLBACK);
console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'Set (hidden)' : 'Not set');
console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? 'Set (hidden)' : 'Not set');

// Check if we're in a CI environment
console.log('\n=== CI Environment ===');
console.log('CI:', process.env.CI);
console.log('CONTINUOUS_INTEGRATION:', process.env.CONTINUOUS_INTEGRATION);
console.log('NETLIFY:', process.env.NETLIFY);
console.log('DEPLOY_URL:', process.env.DEPLOY_URL);

// Test Airtable connection
console.log('\n=== Testing Airtable Connection ===');
if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
  console.log('Airtable credentials are configured');
  
  // Try to initialize Airtable
  try {
    const Airtable = require('airtable');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    console.log('Airtable initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Airtable:', error.message);
  }
} else {
  console.log('Airtable credentials are NOT configured');
  console.log('The build will use mock data');
}

// Check network connectivity
console.log('\n=== Network Connectivity ===');
const https = require('https');
const checkUrl = (url, name) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`${name}: ${res.statusCode === 200 ? 'OK' : 'Failed'} (Status: ${res.statusCode})`);
      resolve();
    }).on('error', (err) => {
      console.log(`${name}: Failed (${err.message})`);
      resolve();
    });
  });
};

Promise.all([
  checkUrl('https://api.airtable.com/v0/', 'Airtable API'),
  checkUrl('https://www.google.com', 'General Internet'),
]).then(() => {
  console.log('\n=== Debug Complete ===');
  process.exit(0);
});