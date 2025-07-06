/**
 * Airtable compatibility layer for serverless environments
 * This handles the CommonJS/ESM interoperability issues
 */

// Export a function that returns properly loaded Airtable
export const getAirtable = async () => {
  try {
    console.log('🔄 Loading Airtable module...');
    
    // Dynamic import with proper handling for CommonJS default export
    const airtableModule = await import('airtable');
    
    // The airtable package exports as CommonJS, so we need to handle it properly
    // In Node.js ES modules, CommonJS default exports are available as .default
    const Airtable = airtableModule.default;
    
    if (!Airtable) {
      throw new Error('Airtable module loaded but no default export found');
    }
    
    console.log('✅ Airtable module loaded successfully');
    return Airtable;
  } catch (error) {
    console.error('🔴 Failed to load Airtable module:', error);
    console.error('🔴 Error stack:', error.stack);
    throw new Error(`Could not load Airtable module: ${error.message}`);
  }
};