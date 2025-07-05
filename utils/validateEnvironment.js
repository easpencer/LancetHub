/**
 * Utility to validate required environment variables and provide helpful logs
 */

export function checkRequiredEnvVars() {
  const requiredVars = {
    // Airtable configuration
    'AIRTABLE_API_KEY': process.env.AIRTABLE_API_KEY,
    'AIRTABLE_BASE_ID': process.env.AIRTABLE_BASE_ID,
    
    // NextAuth configuration
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
    
    // Admin credentials
    'ADMIN_EMAIL': process.env.ADMIN_EMAIL,
    'ADMIN_PASSWORD': process.env.ADMIN_PASSWORD,
  };
  
  const missingVars = [];
  
  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) {
      missingVars.push(name);
    }
  }
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some functionality may be limited. Using mock data where applicable.');
    
    if (missingVars.includes('AIRTABLE_API_KEY') || missingVars.includes('AIRTABLE_BASE_ID')) {
      console.warn('Airtable integration disabled - using mock data instead.');
    }
    
    if (missingVars.includes('NEXTAUTH_SECRET')) {
      console.error('WARNING: NEXTAUTH_SECRET is required for secure sessions!');
    }
  } else {
    console.log('✓ All required environment variables are configured');
  }
  
  return {
    isConfigValid: missingVars.length === 0,
    missingVars,
  };
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 
    process.env.NEXTAUTH_URL || 
    'http://localhost:3000';
}
