/**
 * Script to initialize an Airtable base with the required tables and fields
 * for LancetHub
 * 
 * Usage: node scripts/init-airtable-base.js
 */

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function initAirtableBase() {
  console.log('⏳ Initializing Airtable base structure for LancetHub...\n');
  
  // Check environment variables
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.error('❌ Error: Airtable API key or base ID not found in environment variables');
    process.exit(1);
  }
  
  // Clean the base ID if needed
  const cleanBaseId = baseId.split('/')[0];
  
  try {
    // Configure Airtable
    Airtable.configure({ apiKey });
    const base = Airtable.base(cleanBaseId);
    
    // Define required tables and their fields
    const requiredTables = [
      {
        name: 'Resilience Dimensions',
        fields: [
          { name: 'Name', type: 'singleLineText' },
          { name: 'Description', type: 'multilineText' },
          { name: 'Metrics', type: 'multilineText' },
          { name: 'Category', type: 'singleSelect', options: ['Social', 'Environmental', 'Economic', 'Governance', 'Infrastructure', 'Cultural'] },
          { name: 'Priority', type: 'number' }
        ],
        sampleData: [
          {
            'Name': 'Social Equity & Well-being',
            'Description': 'Systems and practices that ensure fair distribution of resources, opportunities, and outcomes',
            'Metrics': 'Healthcare access, Education equity, Income distribution',
            'Category': 'Social',
            'Priority': 1
          },
          {
            'Name': 'Environmental Stewardship',
            'Description': 'Sustainable management and protection of ecological resources',
            'Metrics': 'Air quality, Water security, Land conservation',
            'Category': 'Environmental',
            'Priority': 2
          }
        ]
      },
      {
        name: 'Case Studies',
        fields: [
          { name: 'Case Study Title', type: 'singleLineText' },
          { name: 'Name', type: 'singleLineText' },
          { name: 'Section', type: 'singleLineText' },
          { name: 'Date', type: 'date' },
          { name: 'Resilient Dimensions', type: 'multilineText' },
          { name: 'Short Description', type: 'multilineText' },
          { name: 'Study Focus', type: 'multilineText' },
          { name: 'Relevance to Community/Societal Resilience', type: 'multilineText' }
        ],
        sampleData: [
          {
            'Case Study Title': 'Building Equity in Rural Healthcare Access',
            'Name': 'Dr. Maria Chen',
            'Section': 'Case Study',
            'Date': '2023-09-15',
            'Resilient Dimensions': 'Social Equity & Well-being',
            'Short Description': 'Analysis of community health worker programs in rural communities',
            'Study Focus': 'This study examines how rural communities have developed sustainable healthcare access programs through community health worker initiatives.',
            'Relevance to Community/Societal Resilience': 'Demonstrates how local training and community-based care models can address healthcare disparities in underserved areas.'
          }
        ]
      },
      {
        name: 'People',
        fields: [
          { name: 'Name', type: 'singleLineText' },
          { name: 'Affiliation', type: 'singleLineText' },
          { name: 'Role', type: 'singleLineText' },
          { name: 'Contact', type: 'email' },
          { name: 'Expertise', type: 'multilineText' },
          { name: 'Bio', type: 'multilineText' }
        ],
        sampleData: [
          {
            'Name': 'Dr. Maria Chen',
            'Affiliation': 'Community Health Foundation',
            'Role': 'Research Director',
            'Contact': 'maria.chen@example.org',
            'Expertise': 'Public Health, Rural Healthcare',
            'Bio': 'Dr. Chen has 15 years of experience developing community health programs in underserved areas.'
          }
        ]
      },
      {
        name: 'Metrics',
        fields: [
          { name: 'Name', type: 'singleLineText' },
          { name: 'Value', type: 'singleLineText' },
          { name: 'ChangePercent', type: 'singleLineText' },
          { name: 'Dimension', type: 'singleLineText' },
          { name: 'Trend', type: 'singleSelect', options: ['Positive', 'Negative', 'Neutral'] },
          { name: 'Source', type: 'singleLineText' }
        ],
        sampleData: [
          {
            'Name': 'Healthcare Access Index',
            'Value': '68/100',
            'ChangePercent': '3.5',
            'Dimension': 'Social Equity & Well-being',
            'Trend': 'Positive',
            'Source': 'Health Equity Report 2023'
          }
        ]
      },
      {
        name: 'Bibliography',
        fields: [
          { name: 'Title', type: 'singleLineText' },
          { name: 'Authors', type: 'singleLineText' },
          { name: 'Year', type: 'singleLineText' },
          { name: 'Publication', type: 'singleLineText' },
          { name: 'DOI', type: 'singleLineText' },
          { name: 'URL', type: 'url' },
          { name: 'Abstract', type: 'multilineText' },
          { name: 'Keywords', type: 'multilineText' }
        ],
        sampleData: [
          {
            'Title': 'Resilience Frameworks for Public Health Emergencies',
            'Authors': 'Johnson, A., & Smith, B.',
            'Year': '2022',
            'Publication': 'Journal of Community Resilience',
            'DOI': '10.1234/jcr.2022.1234',
            'URL': 'https://example.org/article',
            'Abstract': 'This paper reviews various frameworks for understanding and building community resilience during public health emergencies.',
            'Keywords': 'resilience, public health, emergency response, community'
          }
        ]
      },
      {
        name: 'Landscape',
        fields: [
          { name: 'Dimension', type: 'singleLineText' },
          { name: 'Topic', type: 'singleLineText' },
          { name: 'Context', type: 'multilineText' },
          { name: 'Leadership', type: 'multilineText' },
          { name: 'Teamwork', type: 'multilineText' },
          { name: 'Data', type: 'multilineText' },
          { name: 'Resources', type: 'multilineText' }
        ],
        sampleData: [
          {
            'Dimension': 'Social Equity & Well-being',
            'Topic': 'Healthcare Access',
            'Context': 'Systems and infrastructure for accessing health services',
            'Leadership': 'Community health workers, local health committees',
            'Teamwork': 'Rural health networks, public-private partnerships',
            'Data': 'Health outcomes tracking, service availability mapping',
            'Resources': 'Mobile clinics, telehealth platforms'
          }
        ]
      },
      {
        name: 'Network Members',
        fields: [
          { name: 'Name', type: 'singleLineText' },
          { name: 'Email', type: 'email' },
          { name: 'Organization', type: 'singleLineText' },
          { name: 'Role', type: 'singleLineText' },
          { name: 'Interests', type: 'multilineText' },
          { name: 'Message', type: 'multilineText' },
          { name: 'Submission Date', type: 'dateTime' }
        ],
        sampleData: []
      }
    ];

    // Initialize tables and sample data
    for (const tableConfig of requiredTables) {
      console.log(`Creating/updating table: ${tableConfig.name}`);
      
      try {
        // We can't actually create tables via the Airtable API,
        // so this script assumes the base exists and you have proper permissions
        
        // Check if table exists by trying to fetch records
        try {
          await base(tableConfig.name).select({ maxRecords: 1 }).firstPage();
          console.log(`Table "${tableConfig.name}" already exists`);
        } catch (error) {
          if (error.message.includes('could not be found')) {
            console.log(`Table "${tableConfig.name}" doesn't exist - please create it manually in the Airtable interface`);
            continue;
          } else {
            throw error;
          }
        }
        
        // If the table has sample data and is empty, add the sample data
        const existingRecords = await base(tableConfig.name).select().firstPage();
        if (existingRecords.length === 0 && tableConfig.sampleData.length > 0) {
          console.log(`Adding sample data to ${tableConfig.name}`);
          await base(tableConfig.name).create(tableConfig.sampleData.map(data => ({ fields: data })));
          console.log(`✅ Added ${tableConfig.sampleData.length} sample records to ${tableConfig.name}`);
        } else {
          console.log(`Table ${tableConfig.name} already has data (${existingRecords.length} records)`);
        }
      } catch (error) {
        console.error(`Error with table ${tableConfig.name}:`, error);
      }
    }

    console.log('\n✅ Airtable base initialization complete!');
    console.log('\nIMPORTANT: This script cannot create tables via the API.');
    console.log('If any tables were missing, please create them manually in the Airtable interface.');
    console.log('Use the table names and field definitions provided in this script.');

  } catch (error) {
    console.error('❌ Error initializing Airtable base:', error);
  }
}

// Run the initialization
initAirtableBase();
