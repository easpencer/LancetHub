import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const steps = [];
  
  try {
    steps.push('Starting Airtable test');
    
    // Test 1: Try direct import
    try {
      steps.push('Attempting direct dynamic import...');
      const airtableModule = await import('airtable');
      steps.push(`Direct import successful. Type: ${typeof airtableModule}`);
      steps.push(`Has default: ${!!airtableModule.default}`);
      steps.push(`Keys: ${Object.keys(airtableModule).join(', ')}`);
    } catch (importError) {
      steps.push(`Direct import failed: ${importError.message}`);
    }
    
    // Test 2: Try using the compatibility layer
    try {
      steps.push('Attempting compatibility layer import...');
      const { getAirtable } = await import('../../../utils/airtable-compat.js');
      const Airtable = await getAirtable();
      steps.push(`Compatibility layer successful. Type: ${typeof Airtable}`);
      steps.push(`Airtable constructor name: ${Airtable.name}`);
    } catch (compatError) {
      steps.push(`Compatibility layer failed: ${compatError.message}`);
      steps.push(`Stack: ${compatError.stack}`);
    }
    
    // Test 3: Check environment
    steps.push('Environment check:');
    steps.push(`Platform: ${process.platform}`);
    steps.push(`Node version: ${process.version}`);
    steps.push(`Serverless: ${!!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.NETLIFY}`);
    
    return NextResponse.json({
      status: 'completed',
      steps,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        steps,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}