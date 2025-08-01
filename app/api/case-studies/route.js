import { NextResponse } from 'next/server';
import { dataSource } from '../../../utils/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // In production (Netlify), always use Airtable since SQLite database isn't deployed
    const isProduction = process.env.NODE_ENV === 'production';
    const useAirtable = isProduction || process.env.USE_AIRTABLE === 'true';
    
    if (useAirtable) {
      console.log('🔄 Fetching case studies from Airtable...');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Is Netlify:', !!process.env.NETLIFY);
      
      // Check for required environment variables
      const apiKey = process.env.AIRTABLE_API_KEY;
      const baseId = process.env.AIRTABLE_BASE_ID;
      
      console.log('Credentials check - API Key length:', apiKey ? apiKey.length : 0);
      console.log('Credentials check - Base ID:', baseId || 'missing');
      
      if (!apiKey || !baseId) {
        console.error('Missing Airtable credentials');
        console.error('AIRTABLE_API_KEY exists:', !!apiKey);
        console.error('AIRTABLE_BASE_ID exists:', !!baseId);
        
        return NextResponse.json(
          { 
            error: 'Configuration Error', 
            details: 'Airtable API credentials are not configured. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.',
            hasApiKey: !!apiKey,
            hasBaseId: !!baseId,
            environment: process.env.NODE_ENV,
            isNetlify: !!process.env.NETLIFY
          },
          { status: 500 }
        );
      }
      
      console.log('Loading Airtable module...');
      let fetchCaseStudies, fetchPeopleData;
      
      try {
        const airtableModule = await import('../../../utils/airtable');
        fetchCaseStudies = airtableModule.fetchCaseStudies;
        fetchPeopleData = airtableModule.fetchPeopleData;
        console.log('Airtable module loaded successfully');
      } catch (importError) {
        console.error('Failed to import Airtable module:', importError);
        return NextResponse.json(
          { 
            error: 'Module Import Error',
            details: 'Failed to load Airtable module',
            errorMessage: importError.message
          },
          { status: 500 }
        );
      }
      
      console.log('Fetching data from Airtable...');
      let caseStudies, peopleData;
      
      try {
        // Fetch both case studies and people data
        [caseStudies, peopleData] = await Promise.all([
          fetchCaseStudies({ 
            maxRecords: 200,
            view: 'Grid view'
          }),
          fetchPeopleData({
            maxRecords: 100,
            view: 'Grid view'
          })
        ]);
        console.log(`Fetched ${caseStudies?.length || 0} case studies and ${peopleData?.length || 0} people`);
      } catch (fetchError) {
        console.error('Failed to fetch from Airtable:', fetchError);
        return NextResponse.json(
          { 
            error: 'Airtable Fetch Error',
            details: 'Failed to fetch data from Airtable',
            errorMessage: fetchError.message,
            errorStack: process.env.NODE_ENV !== 'production' ? fetchError.stack : undefined
          },
          { status: 500 }
        );
      }
      
      // Create a map of people by ID for quick lookup
      const peopleMap = new Map();
      peopleData.forEach(person => {
        peopleMap.set(person.id, {
          id: person.id,
          name: person.Name || person['Full Name'] || 'Unknown',
          institution: person.Affiliation || person.Institution || '',
          role: person.Role || person.Position || '',
          expertise: person.Expertise || '',
          email: person.Email || ''
        });
      });
    
    console.log(`✅ Retrieved ${caseStudies.length} case studies from Airtable`);
    
    // Log the first record to see available fields
    if (caseStudies.length > 0) {
      console.log('First case study fields:', Object.keys(caseStudies[0]));
      console.log('First case study data:', caseStudies[0]);
    }
    
    // Process records - map Airtable field names to expected field names
    const processedRecords = caseStudies.map((record) => {
      // Get associated people data
      const peopleIds = record.People || [];
      const authors = peopleIds.map(personId => peopleMap.get(personId)).filter(Boolean);
      
      return {
        ...record,
        // Map the actual Airtable field names (note the trailing spaces in some field names!)
        Title: record['Case Study Title'] || record.Title || record.Name || 'Untitled',
        Type: record['Study Type '] || record.Type || 'Research', // Note the trailing space!
        Description: record['Short Description'] || record.Description || '',
        Focus: record['Study Focus'] || record.Focus || '',
        Relevance: record['Relevance to Community/Societal Resilience'] || record.Relevance || '',
        // Include structured author data
        Authors: authors,
        AuthorNames: authors.map(a => a.name).join(', ') || record.Name || record.Author || '',
        AuthorInstitutions: [...new Set(authors.map(a => a.institution).filter(Boolean))].join(', '),
        // New fields
        Results: record.Results || record.results || record['Study Results'] || '',
        Methods: record.Methods || record.methods || record.Methodology || record['Study Methods'] || '',
        Insights: record.Insights || record.insights || record['Key Insights'] || '',
        References: record.References || record.references || record['Study References'] || '',
        Findings: record.Findings || record.findings || record['Key Findings'] || '',
        Recommendations: record.Recommendations || record.recommendations || record['Study Recommendations'] || '',
        Challenges: record.Challenges || record.challenges || record['Implementation Challenges'] || '',
        Context: record.Context || record.context || record['Study Context'] || '',
        Impact: record.Impact || record.impact || record['Potential Impact'] || '',
        DataSources: record['Data Sources'] || record.DataSources || '',
        Limitations: record.Limitations || record.limitations || record['Study Limitations'] || '',
        FutureWork: record['Future Work'] || record.FutureWork || record['Next Steps'] || '',
        // Keep existing fields
        Dimensions: (() => {
          const dims = record['Resilient Dimensions '] || record.Dimensions || [];
          if (Array.isArray(dims)) {
            return dims.join(', ');
          }
          return dims;
        })(), // Note the trailing space!
        Keywords: (() => {
          const kw = record['Key Words '] || record.Keywords || [];
          if (Array.isArray(kw)) {
            return kw.join(', ');
          }
          return kw;
        })(), // Note the trailing space!
        Author: record.Name || record.People || record.Author || '',
        // Format date
        formattedDate: record.Date ? new Date(record.Date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : null,
        // Create dimensions list - handle both string and array formats
        dimensionsList: (() => {
          const dims = record['Resilient Dimensions '] || record.Dimensions || [];
          if (Array.isArray(dims)) {
            return dims.map(d => d.trim()).filter(Boolean);
          }
          return dims.split(',').map(d => d.trim()).filter(Boolean);
        })()
      };
    });
    
      return NextResponse.json({ 
        caseStudies: processedRecords,
        source: 'airtable',
        count: processedRecords.length
      });
    }
    
    // Use SQLite database
    console.log('🔄 Fetching case studies from SQLite database...');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let caseStudies;
    if (search) {
      const results = await dataSource.search(search);
      caseStudies = results.caseStudies;
    } else {
      caseStudies = await dataSource.fetchCaseStudies({
        maxRecords: parseInt(searchParams.get('limit') || '200'),
        offset: parseInt(searchParams.get('offset') || '0')
      });
    }
    
    console.log(`✅ Retrieved ${caseStudies.length} case studies from database`);
    
    // Debug: Log first case study to see what fields are available
    if (caseStudies.length > 0) {
      console.log('Sample case study data:', JSON.stringify(caseStudies[0], null, 2));
      console.log('Available case study fields:', Object.keys(caseStudies[0]));
    }
    
    return NextResponse.json({ 
      caseStudies,
      source: 'database',
      count: caseStudies.length
    });
  } catch (error) {
    console.error('🔴 Error in case studies route:', error);
    
    // Provide more detailed error information
    const errorResponse = {
      error: 'Failed to load case studies',
      details: error.message,
      type: error.name,
      source: useAirtable ? 'airtable' : 'database',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        USE_AIRTABLE: process.env.USE_AIRTABLE,
        hasApiKey: !!process.env.AIRTABLE_API_KEY,
        hasBaseId: !!process.env.AIRTABLE_BASE_ID
      }
    };
    
    // In production, don't expose full error details
    if (process.env.NODE_ENV === 'production') {
      delete errorResponse.environment;
      errorResponse.details = 'An error occurred while loading case studies. Please check server logs.';
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}