import { NextResponse } from 'next/server';
import { fetchCaseStudies, fetchPeopleData, fetchLandscapeData } from '../../../../utils/airtable';
import { createInsightsEngine } from '../../../../utils/insights-engine';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const sections = searchParams.get('sections')?.split(',') || ['all'];
    const limit = parseInt(searchParams.get('limit') || '100');
    
    console.log('📄 Generating comprehensive insights report...');
    
    // Fetch all relevant data
    const [caseStudies, people, landscapeData] = await Promise.all([
      fetchCaseStudies({ maxRecords: limit }),
      fetchPeopleData({ maxRecords: 50 }),
      fetchLandscapeData({ maxRecords: 50 })
    ]);
    
    if (caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No case studies found for report generation'
      });
    }
    
    // Generate comprehensive report using insights engine
    const engine = await createInsightsEngine(caseStudies);
    const fullReport = engine.generateInsightsReport();
    
    // Add additional context
    fullReport.context = {
      commissionMembers: people.filter(p => 
        p.Role && (p.Role.includes('Co-Chair') || p.Role.includes('Commissioner'))
      ).length,
      totalExperts: people.length,
      landscapeTopics: landscapeData.length,
      dataCollectionPeriod: getDataCollectionPeriod(caseStudies)
    };
    
    // Filter sections if requested
    let report = fullReport;
    if (!sections.includes('all')) {
      report = {
        metadata: fullReport.metadata,
        context: fullReport.context
      };
      
      sections.forEach(section => {
        if (fullReport[section]) {
          report[section] = fullReport[section];
        }
      });
    }
    
    // Format response based on requested format
    if (format === 'html') {
      const htmlReport = generateHTMLReport(report);
      return new Response(htmlReport, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': 'attachment; filename="resilience-insights-report.html"'
        }
      });
    } else if (format === 'markdown') {
      const markdownReport = generateMarkdownReport(report);
      return new Response(markdownReport, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': 'attachment; filename="resilience-insights-report.md"'
        }
      });
    }
    
    // Default JSON response
    return NextResponse.json({
      success: true,
      format: 'json',
      report,
      exportOptions: {
        available: ['json', 'html', 'markdown'],
        sections: Object.keys(fullReport).filter(key => key !== 'metadata' && key !== 'context')
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error generating report:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Helper function to determine data collection period
function getDataCollectionPeriod(caseStudies) {
  const dates = caseStudies
    .filter(cs => cs.Date)
    .map(cs => new Date(cs.Date));
  
  if (dates.length === 0) return 'Unknown';
  
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  return `${minDate.getFullYear()} - ${maxDate.getFullYear()}`;
}

// Generate HTML report
function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resilience Insights Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2, h3 {
            color: #1a1a1a;
        }
        h1 {
            border-bottom: 3px solid #007bff;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            color: #007bff;
        }
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .key-finding {
            background: #e3f2fd;
            padding: 15px;
            border-left: 4px solid #2196f3;
            margin: 15px 0;
        }
        .insight {
            background: #fff3e0;
            padding: 15px;
            border-left: 4px solid #ff9800;
            margin: 15px 0;
        }
        .recommendation {
            background: #e8f5e9;
            padding: 15px;
            border-left: 4px solid #4caf50;
            margin: 15px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .chart-container {
            margin: 20px 0;
            padding: 20px;
            background: #fafafa;
            border-radius: 5px;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Resilience Insights Report</h1>
        
        <div class="metadata">
            <strong>Generated:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>Case Studies Analyzed:</strong> ${report.metadata.totalCaseStudies}<br>
            <strong>Data Collection Period:</strong> ${report.context.dataCollectionPeriod}<br>
            <strong>Commission Members:</strong> ${report.context.commissionMembers}
        </div>
        
        ${report.summary ? generateHTMLSummary(report.summary) : ''}
        ${report.thematicAnalysis ? generateHTMLThematic(report.thematicAnalysis) : ''}
        ${report.patternAnalysis ? generateHTMLPatterns(report.patternAnalysis) : ''}
        ${report.outcomeAnalysis ? generateHTMLOutcomes(report.outcomeAnalysis) : ''}
        ${report.recommendations ? generateHTMLRecommendations(report.recommendations) : ''}
        
        <div class="footer">
            <p>Report generated by the Resilience Insights Engine</p>
            <p>© ${new Date().getFullYear()} The Lancet Commission on Pandemic Resilience</p>
        </div>
    </div>
</body>
</html>
  `;
  
  return html;
}

function generateHTMLSummary(summary) {
  return `
    <h2>Executive Summary</h2>
    <p>${summary.overview}</p>
    
    <h3>Key Findings</h3>
    ${summary.keyFindings.map(finding => 
      `<div class="key-finding">${finding}</div>`
    ).join('')}
    
    ${summary.implications && summary.implications.length > 0 ? `
    <h3>Implications</h3>
    ${summary.implications.map(implication => 
      `<div class="insight">${implication}</div>`
    ).join('')}
    ` : ''}
  `;
}

function generateHTMLThematic(thematic) {
  return `
    <h2>Thematic Analysis</h2>
    
    <h3>Top Themes</h3>
    <table>
      <tr>
        <th>Theme</th>
        <th>Frequency</th>
        <th>Percentage</th>
      </tr>
      ${thematic.topThemes.slice(0, 10).map(([theme, count]) => `
      <tr>
        <td>${theme}</td>
        <td>${count}</td>
        <td>${((count / thematic.topThemes[0][1]) * 100).toFixed(1)}%</td>
      </tr>
      `).join('')}
    </table>
    
    ${thematic.emergingThemes && thematic.emergingThemes.length > 0 ? `
    <h3>Emerging Themes</h3>
    <div class="chart-container">
      ${thematic.emergingThemes.map(theme => 
        `<div class="insight">
          <strong>${theme.theme}</strong>: 
          ${theme.growthFactor === 'new' ? 'New theme' : `${theme.growthFactor}x growth`}
          (${theme.recentCount} recent studies)
        </div>`
      ).join('')}
    </div>
    ` : ''}
  `;
}

function generateHTMLPatterns(patterns) {
  return `
    <h2>Pattern Analysis</h2>
    
    ${patterns.geographic ? `
    <h3>Geographic Distribution</h3>
    <p>Research spans ${patterns.geographic.diversity} countries with the following distribution:</p>
    <table>
      <tr>
        <th>Country</th>
        <th>Studies</th>
      </tr>
      ${patterns.geographic.topCountries.slice(0, 10).map(([country, count]) => `
      <tr>
        <td>${country}</td>
        <td>${count}</td>
      </tr>
      `).join('')}
    </table>
    ` : ''}
    
    ${patterns.temporal ? `
    <h3>Temporal Trends</h3>
    <div class="insight">
      <strong>Growth Rate:</strong> ${patterns.temporal.trends.growthRate}%<br>
      <strong>Peak Year:</strong> ${patterns.temporal.trends.peakYear}
    </div>
    ` : ''}
  `;
}

function generateHTMLOutcomes(outcomes) {
  return `
    <h2>Outcome Analysis</h2>
    
    <h3>Performance Metrics</h3>
    <div class="key-finding">
      <strong>Average Improvement:</strong> ${outcomes.metrics.average.toFixed(1)}%<br>
      <strong>Median Improvement:</strong> ${outcomes.metrics.median.toFixed(1)}%<br>
      <strong>Range:</strong> ${outcomes.metrics.range.min.toFixed(1)}% - ${outcomes.metrics.range.max.toFixed(1)}%
    </div>
    
    ${outcomes.topPerformers && outcomes.topPerformers.length > 0 ? `
    <h3>Top Performing Interventions</h3>
    <table>
      <tr>
        <th>Case Study</th>
        <th>Improvement</th>
        <th>Indicator</th>
      </tr>
      ${outcomes.topPerformers.map(performer => `
      <tr>
        <td>${performer.caseStudy}</td>
        <td>${performer.improvement}%</td>
        <td>${performer.indicator}</td>
      </tr>
      `).join('')}
    </table>
    ` : ''}
  `;
}

function generateHTMLRecommendations(recommendations) {
  return `
    <h2>Recommendations</h2>
    ${recommendations.map(rec => `
    <div class="recommendation">
      <h3>${rec.title}</h3>
      <p><strong>Type:</strong> ${rec.type} | <strong>Priority:</strong> ${rec.priority}</p>
      <p>${rec.description}</p>
      <p><em>Rationale: ${rec.rationale}</em></p>
    </div>
    `).join('')}
  `;
}

// Generate Markdown report
function generateMarkdownReport(report) {
  let markdown = `# Resilience Insights Report

Generated: ${new Date().toLocaleDateString()}

## Metadata
- **Case Studies Analyzed:** ${report.metadata.totalCaseStudies}
- **Data Collection Period:** ${report.context.dataCollectionPeriod}
- **Commission Members:** ${report.context.commissionMembers}
- **Total Experts:** ${report.context.totalExperts}

---

`;

  if (report.summary) {
    markdown += `## Executive Summary

${report.summary.overview}

### Key Findings
${report.summary.keyFindings.map(finding => `- ${finding}`).join('\n')}

${report.summary.implications && report.summary.implications.length > 0 ? `
### Implications
${report.summary.implications.map(impl => `- ${impl}`).join('\n')}
` : ''}

---

`;
  }

  if (report.thematicAnalysis) {
    markdown += `## Thematic Analysis

### Top Themes
| Theme | Frequency | Percentage |
|-------|-----------|------------|
${report.thematicAnalysis.topThemes.slice(0, 10).map(([theme, count]) => 
  `| ${theme} | ${count} | ${((count / report.thematicAnalysis.topThemes[0][1]) * 100).toFixed(1)}% |`
).join('\n')}

${report.thematicAnalysis.emergingThemes && report.thematicAnalysis.emergingThemes.length > 0 ? `
### Emerging Themes
${report.thematicAnalysis.emergingThemes.map(theme => 
  `- **${theme.theme}**: ${theme.growthFactor === 'new' ? 'New theme' : `${theme.growthFactor}x growth`} (${theme.recentCount} recent studies)`
).join('\n')}
` : ''}

---

`;
  }

  if (report.recommendations) {
    markdown += `## Recommendations

${report.recommendations.map((rec, idx) => `
### ${idx + 1}. ${rec.title}
- **Type:** ${rec.type}
- **Priority:** ${rec.priority}
- **Description:** ${rec.description}
- **Rationale:** ${rec.rationale}
`).join('\n')}

---

`;
  }

  markdown += `
## About This Report

This report was generated by the Resilience Insights Engine, a comprehensive analysis system 
developed for The Lancet Commission on Pandemic Resilience. The analysis uses advanced 
natural language processing and pattern recognition techniques to extract insights from 
case studies and research data.

© ${new Date().getFullYear()} The Lancet Commission on Pandemic Resilience
`;

  return markdown;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      caseStudyIds, 
      format = 'json', 
      sections = ['all'],
      customTitle,
      customSummary 
    } = body;
    
    // Fetch specific case studies if IDs provided
    let caseStudies;
    if (caseStudyIds && Array.isArray(caseStudyIds)) {
      const allCaseStudies = await fetchCaseStudies({ maxRecords: 200 });
      caseStudies = allCaseStudies.filter(cs => caseStudyIds.includes(cs.id));
    } else {
      caseStudies = await fetchCaseStudies({ maxRecords: 100 });
    }
    
    if (caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No case studies found for report generation'
      }, { status: 400 });
    }
    
    // Generate report
    const engine = await createInsightsEngine(caseStudies);
    const report = engine.generateInsightsReport();
    
    // Add custom elements if provided
    if (customTitle) {
      report.title = customTitle;
    }
    if (customSummary) {
      report.customSummary = customSummary;
    }
    
    // Format and return based on requested format
    if (format === 'html') {
      const htmlReport = generateHTMLReport(report);
      return new Response(htmlReport, {
        headers: {
          'Content-Type': 'text/html'
        }
      });
    } else if (format === 'markdown') {
      const markdownReport = generateMarkdownReport(report);
      return new Response(markdownReport, {
        headers: {
          'Content-Type': 'text/markdown'
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      format: 'json',
      report,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error generating custom report:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}