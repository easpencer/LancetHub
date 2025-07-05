import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would properly handle Airtable file attachments
    // For now, we'll return a placeholder PDF
    return NextResponse.redirect('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
