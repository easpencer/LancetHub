// Airtable configuration
// Uses environment variables for security
// Ensure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set in your environment

export const AIRTABLE_CONFIG = {
  apiKey: process.env.AIRTABLE_API_KEY || '',
  baseId: process.env.AIRTABLE_BASE_ID || ''
};