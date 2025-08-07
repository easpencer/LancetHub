// Sample case studies data for when Airtable is not configured
export const sampleCaseStudies = [
  {
    id: 'sample-1',
    Title: 'Community Health Workers in Rural Kenya',
    Type: 'Research',
    Description: 'A comprehensive study on the effectiveness of community health worker programs in improving maternal and child health outcomes in rural Kenya.',
    Focus: 'Community Health',
    Relevance: 'Demonstrates how community-based interventions can build resilience in healthcare systems with limited resources.',
    Authors: [],
    AuthorNames: 'Dr. Sarah Johnson, Dr. Michael Chen',
    AuthorInstitutions: 'Johns Hopkins Bloomberg School of Public Health',
    Results: 'Significant reduction in maternal mortality (45%) and improved vaccination rates (78%) in participating communities.',
    Methods: 'Mixed-methods approach combining quantitative health outcome data with qualitative interviews of community members and health workers.',
    Dimensions: 'Health Systems, Community Engagement, Resource Optimization',
    dimensionsList: ['Health Systems', 'Community Engagement', 'Resource Optimization'],
    Keywords: 'community health, maternal health, Kenya, resilience',
    formattedDate: 'January 15, 2024'
  },
  {
    id: 'sample-2',
    Title: 'Digital Disease Surveillance in Southeast Asia',
    Type: 'Implementation',
    Description: 'Implementation and evaluation of a digital disease surveillance system across five Southeast Asian countries to detect and respond to emerging infectious diseases.',
    Focus: 'Disease Surveillance',
    Relevance: 'Shows how digital technologies can enhance pandemic preparedness and early warning systems in resource-constrained settings.',
    Authors: [],
    AuthorNames: 'Dr. Wei Zhang, Dr. Priya Patel',
    AuthorInstitutions: 'WHO Regional Office for Southeast Asia',
    Results: 'Early detection of 3 potential disease outbreaks, with response time reduced by 60% compared to traditional surveillance methods.',
    Methods: 'Real-time data collection from healthcare facilities, machine learning algorithms for anomaly detection, and stakeholder engagement analysis.',
    Dimensions: 'Technology Innovation, Early Warning Systems, Regional Cooperation',
    dimensionsList: ['Technology Innovation', 'Early Warning Systems', 'Regional Cooperation'],
    Keywords: 'surveillance, digital health, Southeast Asia, early warning',
    formattedDate: 'December 10, 2023'
  },
  {
    id: 'sample-3',
    Title: 'Urban Resilience During COVID-19: New York City Case Study',
    Type: 'Case Study',
    Description: 'An in-depth analysis of New York City\'s response to the COVID-19 pandemic, examining both successes and failures in urban pandemic management.',
    Focus: 'Urban Health Systems',
    Relevance: 'Provides critical lessons for building resilient urban health systems capable of responding to large-scale public health emergencies.',
    Authors: [],
    AuthorNames: 'Dr. Maria Rodriguez, Dr. James Thompson',
    AuthorInstitutions: 'Columbia University Mailman School of Public Health',
    Results: 'Identified key factors in NYC\'s eventual recovery, including community mobilization, adaptive healthcare capacity, and public-private partnerships.',
    Methods: 'Retrospective analysis of health system data, policy documents, and interviews with 150+ stakeholders including healthcare workers and community leaders.',
    Dimensions: 'Urban Planning, Healthcare Capacity, Community Resilience',
    dimensionsList: ['Urban Planning', 'Healthcare Capacity', 'Community Resilience'],
    Keywords: 'COVID-19, urban health, New York City, pandemic response',
    formattedDate: 'March 22, 2024'
  }
];

export const sampleResponse = {
  caseStudies: sampleCaseStudies,
  source: 'sample',
  count: sampleCaseStudies.length,
  note: 'This is sample data. To see real case studies, please configure Airtable credentials.'
};