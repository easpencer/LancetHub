import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would properly handle Airtable attachments
    // For now, we'll return a placeholder image
    return NextResponse.redirect('https://via.placeholder.com/300x200?text=Image');
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
