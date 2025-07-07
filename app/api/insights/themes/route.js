import { NextResponse } from 'next/server';
import { fetchCaseStudies } from '../../../../utils/airtable';
import { extractThemes, compareThemes, generateThemeSummary } from '../../../../utils/theme-extractor';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseStudyId = searchParams.get('caseStudyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    console.log('🎯 Extracting themes from case studies...');
    
    // Fetch case studies
    const caseStudies = await fetchCaseStudies({ maxRecords: limit });
    
    if (caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No case studies found'
      });
    }
    
    // If specific case study requested
    if (caseStudyId) {
      const caseStudy = caseStudies.find(cs => cs.id === caseStudyId);
      if (!caseStudy) {
        return NextResponse.json({
          success: false,
          error: 'Case study not found'
        });
      }
      
      const themes = extractThemes(caseStudy, caseStudies);
      const summary = generateThemeSummary(themes);
      
      return NextResponse.json({
        success: true,
        caseStudy: {
          id: caseStudy.id,
          title: caseStudy.Title
        },
        themes,
        summary,
        timestamp: new Date().toISOString()
      });
    }
    
    // Extract themes for all case studies
    const allThemes = caseStudies.map(cs => ({
      caseStudyId: cs.id,
      title: cs.Title,
      themes: extractThemes(cs, caseStudies),
      summary: generateThemeSummary(extractThemes(cs, caseStudies))
    }));
    
    // Compare themes across all studies
    const comparison = compareThemes(caseStudies);
    
    // Generate insights
    const insights = [];
    
    if (comparison.commonThemes.length > 0) {
      insights.push({
        type: 'dominant-themes',
        title: 'Most Common Themes',
        data: comparison.commonThemes.slice(0, 5),
        message: `The most prevalent themes across ${caseStudies.length} case studies are ${comparison.commonThemes.slice(0, 3).map(([theme]) => theme).join(', ')}`
      });
    }
    
    if (comparison.methodologies.length > 0) {
      const totalMethods = comparison.methodologies.reduce((sum, [, count]) => sum + count, 0);
      insights.push({
        type: 'methodology-distribution',
        title: 'Research Methodologies',
        data: comparison.methodologies,
        message: `${comparison.methodologies.length} different methodological approaches identified across studies`
      });
    }
    
    return NextResponse.json({
      success: true,
      summary: {
        totalCaseStudies: caseStudies.length,
        themesExtracted: allThemes.length,
        commonThemes: comparison.commonThemes.slice(0, 10),
        commonKeywords: comparison.commonKeywords.slice(0, 20),
        methodologies: comparison.methodologies
      },
      insights,
      themes: allThemes.slice(0, 10), // Return first 10 for preview
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error extracting themes:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, title, context } = body;
    
    if (!text) {
      return NextResponse.json({
        success: false,
        error: 'Text content is required'
      }, { status: 400 });
    }
    
    // Create a temporary case study object
    const tempCaseStudy = {
      id: 'temp_' + Date.now(),
      Title: title || 'Untitled',
      Description: text,
      Abstract: text.slice(0, 500),
      Keywords: context?.keywords || ''
    };
    
    // Extract themes
    const themes = extractThemes(tempCaseStudy, []);
    const summary = generateThemeSummary(themes);
    
    return NextResponse.json({
      success: true,
      themes,
      summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error in theme extraction:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}