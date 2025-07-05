import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper function to get fallback bibliography data
function getFallbackBibliography() {
  return [
    // User-provided core references
    {
      id: 'bib-1',
      Name: 'Are we entering a new age of pandemics?',
      Authors: 'Kenny, C',
      Publication: 'Center for Global Development',
      Year: '2021',
      Month: 'October',
      URL: 'https://www.cgdev.org/publication/are-we-entering-new-age-pandemics',
      Type: 'Report',
      Keywords: 'pandemics, global health, infectious diseases, prevention',
      Abstract: 'Analysis of pandemic frequency and factors contributing to increased pandemic risk in the 21st century.',
      Field: 'Global Health Policy'
    },
    {
      id: 'bib-2',
      Name: 'The Lancet Commission on lessons for the future from the COVID-19 pandemic',
      Authors: 'Sachs, JD, Karim, SSA, Aknin, L, et al.',
      Publication: 'The Lancet',
      Year: '2022',
      Volume: '400',
      Pages: '1224-1280',
      URL: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(22)01585-9/fulltext',
      DOI: '10.1016/S0140-6736(22)01585-9',
      PMID: '36115368',
      Citations: '354',
      Type: 'Commission Report',
      Keywords: 'COVID-19, pandemic preparedness, global health security, One Health, spillover prevention',
      Abstract: 'The COVID-19 pandemic has been a preventable disaster. This Commission presents evidence and recommendations for strengthening pandemic preparedness and response.',
      Field: 'Global Health, Pandemic Preparedness',
      OpenAccess: 'Yes'
    },
    {
      id: 'bib-3',
      Name: 'The Lancet–PPATS Commission on Prevention of Viral Spillover',
      Authors: 'Vora, NM, Hassan, L, Plowright, RK, et al.',
      Publication: 'The Lancet',
      Year: '2024',
      Volume: '403',
      Pages: '597-599',
      DOI: '10.1016/S0140-6736(24)00147-9',
      Type: 'Commission Report',
      Keywords: 'viral spillover, pandemic prevention, One Health, zoonoses',
      Abstract: 'Commission focusing on primary prevention strategies to reduce viral spillover from animals to humans.',
      Field: 'One Health, Infectious Disease Prevention'
    },
    {
      id: 'bib-4',
      Name: 'Implementation of the 7-1-7 target for detection, notification, and response',
      Authors: 'Bochner, AF, Makumbi, I, Aderinola, OA, et al.',
      Publication: 'The Lancet Global Health',
      Year: '2023',
      Volume: '11',
      Pages: 'e871-e879',
      Type: 'Research Article',
      Keywords: 'pandemic preparedness, surveillance, early detection, global health security',
      Abstract: 'Evaluation of the WHO 7-1-7 target implementation for rapid detection and response to public health emergencies.',
      Field: 'Global Health Security'
    },
    {
      id: 'bib-5',
      Name: 'Health system resilience: a critical review and reconceptualisation',
      Authors: 'Witter, S, Thomas, S, Topp, SM, et al.',
      Publication: 'The Lancet Global Health',
      Year: '2023',
      Volume: '11',
      Pages: 'e1454-e1458',
      Type: 'Review',
      Keywords: 'health system resilience, healthcare systems, pandemic preparedness',
      Abstract: 'Critical review and reconceptualization of health system resilience frameworks.',
      Field: 'Health Systems Research'
    },
    {
      id: 'bib-6',
      Name: 'The Lancet Commission on diagnostics: transforming access to diagnostics',
      Authors: 'Fleming, KA, Horton, S, Wilson, ML, et al.',
      Publication: 'The Lancet',
      Year: '2021',
      Volume: '398',
      Pages: '1997-2050',
      Citations: '171',
      Type: 'Commission Report',
      Keywords: 'diagnostics, global health, healthcare access, medical technology',
      Abstract: 'Comprehensive analysis of global diagnostic capacity and recommendations for improving access.',
      Field: 'Global Health, Medical Diagnostics'
    },
    {
      id: 'bib-7',
      Name: 'Developing therapeutic approaches for twenty-first-century emerging infectious viral diseases',
      Authors: 'Meganck, RM, Baric, RS',
      Publication: 'Nature Medicine',
      Year: '2021',
      Volume: '27',
      Pages: '401-410',
      Citations: '129',
      Type: 'Review',
      Keywords: 'emerging infectious diseases, antivirals, drug development, viral diseases',
      Abstract: 'Review of therapeutic development approaches for emerging viral infectious diseases.',
      Field: 'Infectious Disease Medicine'
    },
    {
      id: 'bib-8',
      Name: 'After 2 years of the COVID-19 pandemic, translating One Health into action is urgent',
      Authors: 'Lefrançois, T, Malvy, D, Atlani-Duault, L, et al.',
      Publication: 'The Lancet',
      Year: '2023',
      Volume: '401',
      Pages: '789-794',
      Type: 'Perspective',
      Keywords: 'One Health, pandemic prevention, zoonoses, interdisciplinary approach',
      Abstract: 'Call to action for implementing One Health approaches in pandemic prevention and response.',
      Field: 'One Health, Public Health Policy'
    },
    {
      id: 'bib-9',
      Name: 'Digital exposure notification tools: a global landscape analysis',
      Authors: 'Nebeker, C, Kareem, D, Yong, A, et al.',
      Publication: 'PLOS Digital Health',
      Year: '2023',
      Volume: '2',
      Pages: 'e0000287',
      Citations: '2',
      Type: 'Research Article',
      Keywords: 'digital health, contact tracing, COVID-19, exposure notification, technology',
      Abstract: 'Global analysis of digital exposure notification tools used during the COVID-19 pandemic.',
      Field: 'Digital Health, Public Health Technology'
    },
    {
      id: 'bib-10',
      Name: 'Equitable pandemic preparedness and rapid response',
      Authors: 'Alberti, PM, Lantz, PM, Wilkins, CH',
      Publication: 'Journal of Health Politics, Policy and Law',
      Year: '2020',
      Volume: '45',
      Pages: '921-935',
      Type: 'Research Article',
      Keywords: 'health equity, pandemic preparedness, social determinants, COVID-19',
      Abstract: 'Analysis of equity considerations in pandemic preparedness and response planning.',
      Field: 'Health Policy, Health Equity'
    },
    {
      id: 'bib-11',
      Name: 'Confronting the evolution and expansion of anti-vaccine activism in the USA',
      Authors: 'Carpiano, RM, Callaghan, T, DiResta, R, et al.',
      Publication: 'The Lancet',
      Year: '2023',
      Volume: '401',
      Pages: '967-970',
      Citations: '28',
      Type: 'Perspective',
      Keywords: 'vaccine hesitancy, misinformation, public health communication, COVID-19',
      Abstract: 'Analysis of anti-vaccine activism and strategies for addressing vaccine hesitancy.',
      Field: 'Public Health Communication'
    },
    {
      id: 'bib-12',
      Name: 'Beyond misinformation: developing a public health prevention framework',
      Authors: 'Ishizumi, A, Kolis, J, Abad, N, et al.',
      Publication: 'The Lancet Public Health',
      Year: '2024',
      Volume: '9',
      Pages: 'e397-e406',
      Type: 'Framework',
      Keywords: 'misinformation, information ecosystems, public health communication, infodemic',
      Abstract: 'Framework for managing information ecosystems to prevent health misinformation.',
      Field: 'Health Communication, Information Science'
    },
    {
      id: 'bib-13',
      Name: 'Community resilience to pandemics: an assessment framework',
      Authors: 'Suleimany, M, Mokhtarzadeh, S, Sharifi, A',
      Publication: 'International Journal of Disaster Risk Reduction',
      Year: '2022',
      Volume: '80',
      Pages: '103248',
      Citations: '56',
      Type: 'Research Article',
      Keywords: 'community resilience, pandemic preparedness, COVID-19, assessment framework',
      Abstract: 'Development of an assessment framework for community resilience to pandemics.',
      Field: 'Disaster Risk Reduction, Community Resilience'
    },
    {
      id: 'bib-14',
      Name: 'Community resilience',
      Authors: 'National Institute of Standards and Technology',
      Publication: 'NIST',
      Year: '2024',
      URL: 'https://www.nist.gov/community-resilience',
      Type: 'Government Resource',
      Keywords: 'community resilience, disaster preparedness, infrastructure resilience',
      Abstract: 'NIST framework and resources for building community resilience to disasters.',
      Field: 'Disaster Preparedness, Infrastructure'
    },
    {
      id: 'bib-15',
      Name: 'Building community resilience in a context of climate change',
      Authors: 'Carmen, E, Fazey, I, Ross, H, et al.',
      Publication: 'Ambio',
      Year: '2022',
      Volume: '51',
      Pages: '1371-1387',
      Citations: '86',
      Type: 'Research Article',
      Keywords: 'community resilience, climate change, social capital, adaptation',
      Abstract: 'Analysis of how social capital contributes to community resilience in climate change.',
      Field: 'Climate Adaptation, Social Science'
    },
    {
      id: 'bib-16',
      Name: 'A safe operating space for humanity',
      Authors: 'Rockström, J, Steffen, W, Noone, K, et al.',
      Publication: 'Nature',
      Year: '2009',
      Volume: '461',
      Pages: '472-475',
      Citations: '8090',
      DOI: '10.1038/461472a',
      Type: 'Research Article',
      Keywords: 'planetary boundaries, sustainability, earth system, global change',
      Abstract: 'Identification of nine planetary boundaries within which humanity can operate safely.',
      Field: 'Earth System Science, Sustainability'
    },
    {
      id: 'bib-17',
      Name: 'Design for a better world: meaningful, sustainable, humanity centered',
      Authors: 'Norman, DA',
      Publication: 'MIT Press',
      Year: '2023',
      Citations: '2',
      Type: 'Book',
      Keywords: 'design, sustainability, human-centered design, social impact',
      Abstract: 'Framework for designing systems that prioritize human well-being and sustainability.',
      Field: 'Design, Sustainability'
    },
    {
      id: 'bib-18',
      Name: 'Resilience, civil preparedness and Article 3',
      Authors: 'NATO',
      Publication: 'NATO',
      Year: '2024',
      URL: 'https://www.nato.int/cps/en/natohq/topics_132722.htm',
      Type: 'Policy Document',
      Keywords: 'resilience, civil preparedness, national security, NATO',
      Abstract: 'NATO framework for building resilience and civil preparedness capabilities.',
      Field: 'National Security, Resilience Policy'
    },
    {
      id: 'bib-19',
      Name: 'An operational framework for resilience',
      Authors: 'Kahan, JH, Allen, AC, George, JK',
      Publication: 'Journal of Homeland Security and Emergency Management',
      Year: '2009',
      Volume: '6',
      Issue: '1',
      Type: 'Research Article',
      Keywords: 'resilience framework, homeland security, emergency management',
      Abstract: 'Operational framework for implementing resilience concepts in homeland security.',
      Field: 'Emergency Management, Homeland Security'
    },
    {
      id: 'bib-20',
      Name: 'Pandemic preparedness in the 21st century: which way forward?',
      Authors: 'Khor, SK, Heymann, DL',
      Publication: 'The Lancet Public Health',
      Year: '2021',
      Volume: '6',
      Pages: 'e357-e358',
      Type: 'Commentary',
      Keywords: 'pandemic preparedness, global health security, COVID-19',
      Abstract: 'Commentary on future directions for pandemic preparedness in the 21st century.',
      Field: 'Global Health Security'
    },
    {
      id: 'bib-21',
      Name: 'COVID-19—how a pandemic reveals that everything is connected',
      Authors: 'Sturmberg, JP, Martin, CM',
      Publication: 'Journal of Evaluation in Clinical Practice',
      Year: '2020',
      Volume: '26',
      Pages: '1361',
      Citations: '33',
      Type: 'Editorial',
      Keywords: 'systems thinking, pandemic response, interconnectedness, complexity',
      Abstract: 'Analysis of how COVID-19 revealed the interconnected nature of global systems.',
      Field: 'Systems Science, Public Health'
    },
    {
      id: 'bib-22',
      Name: 'Nested ecology and emergence in pandemics',
      Authors: 'Jenkins, A, Jupiter, SD, Capon, A, et al.',
      Publication: 'The Lancet Planetary Health',
      Year: '2020',
      Volume: '4',
      Pages: 'e302',
      Type: 'Correspondence',
      Keywords: 'ecological health, emergence, pandemic ecology, One Health',
      Abstract: 'Discussion of nested ecological systems and their role in pandemic emergence.',
      Field: 'Planetary Health, Ecology'
    },
    {
      id: 'bib-23',
      Name: 'Impact of COVID-19 pandemic and anti-pandemic measures',
      Authors: 'Kessel, B, Heinsohn, T, Ott, JJ, et al.',
      Publication: 'PLOS Global Public Health',
      Year: '2023',
      Volume: '3',
      Pages: 'e0001018',
      Citations: '10',
      Type: 'Systematic Review',
      Keywords: 'COVID-19, tuberculosis, HIV, malaria, pandemic impact',
      Abstract: 'Review of how COVID-19 measures affected other infectious disease programs.',
      Field: 'Infectious Disease, Global Health'
    },
    {
      id: 'bib-24',
      Name: 'Reimagining health security and preventing future pandemics',
      Authors: 'Legido-Quigley, H, Clark, H, Nishtar, S, et al.',
      Publication: 'The Lancet',
      Year: '2023',
      Volume: '401',
      Pages: '2021-2023',
      Type: 'Commission Report',
      Keywords: 'pandemic readiness, health security, implementation, evaluation',
      Abstract: 'Commission report on reimagining health security and pandemic prevention.',
      Field: 'Global Health Security'
    },
    {
      id: 'bib-25',
      Name: 'Enhancing defence contribution to societal resilience in the UK',
      Authors: 'Caves, B, Lucas, R, Dewaele, L, et al.',
      Publication: 'RAND Corporation',
      Year: '2021',
      URL: 'https://www.rand.org/pubs/research_reports/RRA1113-1.html',
      Type: 'Research Report',
      Keywords: 'societal resilience, defense, national security, UK policy',
      Abstract: 'Analysis of defense capabilities contribution to societal resilience.',
      Field: 'National Security, Resilience Policy'
    },
    {
      id: 'bib-26',
      Name: 'Community resilience: measuring a community ability to withstand',
      Authors: 'Collins, M, Carlson, J, Petit, F',
      Publication: 'Disaster Management and Human Health Risk',
      Year: '2011',
      Volume: '119',
      Pages: '111-123',
      Type: 'Research Article',
      Keywords: 'community resilience, disaster preparedness, measurement, assessment',
      Abstract: 'Framework for measuring community resilience and ability to withstand disasters.',
      Field: 'Disaster Management, Community Resilience'
    }
  ];
}

export async function GET() {
  try {
    console.log('📚 Loading comprehensive bibliography...');
    
    // Always use the comprehensive bibliography data
    const bibliographyData = getFallbackBibliography();
    
    console.log(`✅ Loaded ${bibliographyData.length} bibliography entries`);
    
    return NextResponse.json({ 
      papers: bibliographyData,
      source: 'comprehensive',
      total: bibliographyData.length
    });
  } catch (error) {
    console.error('🔴 Error loading bibliography data:', error);
    
    // Fallback to empty array if something goes wrong
    return NextResponse.json({ 
      papers: [],
      source: 'error',
      error: error.message 
    });
  }
}