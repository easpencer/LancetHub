/**
 * Airtable loader using .mjs extension for explicit ES module
 * This provides a clean way to load the CommonJS Airtable module
 */

async function loadAirtableModule() {
  try {
    // Use import() which handles CommonJS modules properly in .mjs files
    const module = await import('airtable');
    
    // CommonJS modules are wrapped in default export
    return module.default;
  } catch (error) {
    console.error('Failed to load Airtable module:', error);
    throw error;
  }
}

// Create a singleton instance
let airtableInstance = null;

export async function getAirtableInstance() {
  if (!airtableInstance) {
    airtableInstance = await loadAirtableModule();
  }
  return airtableInstance;
}

// Export a configured base getter
export async function getAirtableBase() {
  const Airtable = await getAirtableInstance();
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    throw new Error('Airtable credentials not configured');
  }
  
  // Clean base ID
  const cleanBaseId = baseId.includes('/') ? baseId.split('/')[0] : baseId;
  
  // Configure and return base
  Airtable.configure({ apiKey });
  return Airtable.base(cleanBaseId);
}