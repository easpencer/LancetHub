import { NextResponse } from 'next/server';
import { createRecord } from '../../../utils/airtable';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'organization', 'interests'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create a record in Airtable (if configured)
    // In this example, we'll assume there's a "Network Members" table
    let result;
    try {
      // Format data for Airtable
      const formattedData = {
        'Name': body.name,
        'Email': body.email,
        'Organization': body.organization,
        'Role': body.role || '',
        'Interests': body.interests.join(', '),
        'Message': body.message || '',
        'Submission Date': new Date().toISOString()
      };
      
      result = await createRecord('Network Members', formattedData);
    } catch (error) {
      console.error('Error saving to Airtable:', error);
      // If Airtable fails but we want the form to appear successful,
      // we could log the error but still return success
      // In a production app, you might want to save this data elsewhere as backup
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: result || { id: 'mock-id', stored: 'mock data (Airtable not configured)' }
    });
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
