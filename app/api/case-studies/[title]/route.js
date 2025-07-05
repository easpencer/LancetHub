import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET(request, { params }) {
  try {
    const title = params.title ? decodeURIComponent(params.title) : null;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // This is for development - in production you'd use Airtable API
    const csvPath = path.join(process.cwd(), 'data', 'case-studies.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      throw new Error('Case studies data file not found');
    }
    
    const fileContents = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true
    });
    
    const caseStudy = records.find(
      record => record['Case Study Title'] === title
    );
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ caseStudy });
  } catch (error) {
    console.error('Error loading case study:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load case study' },
      { status: 500 }
    );
  }
}
