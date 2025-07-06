// Script to help debug Netlify environment issues
console.log('🔍 Netlify Environment Check\n');

// Check Node version
console.log('Node.js Version:', process.version);
console.log('Expected: v18.x.x\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('NETLIFY:', process.env.NETLIFY || 'not set');
console.log('USE_MOCK_DATA:', process.env.USE_MOCK_DATA || 'not set');

// Check required variables
console.log('\nRequired Variables:');
const required = [
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

required.forEach(key => {
  const value = process.env[key];
  console.log(`${key}:`, value ? '✅ Set' : '❌ Missing');
});

// Check if running in Netlify
if (process.env.NETLIFY === 'true') {
  console.log('\n✅ Running in Netlify environment');
} else {
  console.log('\n⚠️  Not running in Netlify environment');
}

// Instructions
console.log('\n📝 To fix 500 errors on Netlify:');
console.log('1. Ensure all required environment variables are set in Netlify dashboard');
console.log('2. Check Netlify Function logs for detailed error messages');
console.log('3. Visit /api/health endpoint to see environment status');
console.log('4. Ensure Node version matches local development (18.x)');