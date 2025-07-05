export function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env.local file');
    return false;
  }
  
  return true;
}
