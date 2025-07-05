// Enhanced country resilience data with expanded country coverage
export const countryResilienceData = {
  'United States': {
    name: 'United States',
    overallScore: 72,
    dimensions: {
      healthcare: 78,
      information: 65,
      social: 70,
      economic: 75,
      governance: 71,
      infrastructure: 82,
      environmental: 68
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.8,
      'ICU Capacity': '85%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 67,
      'Emergency Response Time': '8 mins'
    },
    vulnerabilities: ['Information trust', 'Health disparities', 'Political polarization'],
    strengths: ['Medical technology', 'Research capacity', 'Economic resources']
  },
  'China': {
    name: 'China',
    overallScore: 74,
    dimensions: {
      healthcare: 72,
      information: 55,
      social: 68,
      economic: 80,
      governance: 75,
      infrastructure: 85,
      environmental: 60
    },
    keyMetrics: {
      'Hospital Beds per 1000': 4.3,
      'ICU Capacity': '78%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 72,
      'Emergency Response Time': '10 mins'
    },
    vulnerabilities: ['Environmental health', 'Information transparency'],
    strengths: ['Infrastructure development', 'Central coordination', 'Manufacturing capacity']
  },
  'Brazil': {
    name: 'Brazil',
    overallScore: 58,
    dimensions: {
      healthcare: 55,
      information: 60,
      social: 52,
      economic: 58,
      governance: 56,
      infrastructure: 62,
      environmental: 65
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.2,
      'ICU Capacity': '72%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 58,
      'Emergency Response Time': '15 mins'
    },
    vulnerabilities: ['Healthcare access inequality', 'Economic disparities'],
    strengths: ['Natural resources', 'Community resilience', 'Biodiversity']
  },
  'Germany': {
    name: 'Germany',
    overallScore: 81,
    dimensions: {
      healthcare: 85,
      information: 78,
      social: 82,
      economic: 84,
      governance: 80,
      infrastructure: 88,
      environmental: 75
    },
    keyMetrics: {
      'Hospital Beds per 1000': 8.0,
      'ICU Capacity': '90%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 78,
      'Emergency Response Time': '6 mins'
    },
    vulnerabilities: ['Aging population', 'Supply chain dependencies'],
    strengths: ['Healthcare system', 'Industrial capacity', 'Social welfare']
  },
  'India': {
    name: 'India',
    overallScore: 54,
    dimensions: {
      healthcare: 48,
      information: 58,
      social: 55,
      economic: 60,
      governance: 52,
      infrastructure: 56,
      environmental: 50
    },
    keyMetrics: {
      'Hospital Beds per 1000': 0.5,
      'ICU Capacity': '65%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Rapidly Developing',
      'Social Cohesion Index': 62,
      'Emergency Response Time': '20 mins'
    },
    vulnerabilities: ['Healthcare infrastructure', 'Urban density', 'Rural access'],
    strengths: ['Pharmaceutical industry', 'Digital innovation', 'Community networks']
  },
  'South Africa': {
    name: 'South Africa',
    overallScore: 56,
    dimensions: {
      healthcare: 52,
      information: 58,
      social: 48,
      economic: 55,
      governance: 54,
      infrastructure: 60,
      environmental: 62
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.3,
      'ICU Capacity': '70%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 52,
      'Emergency Response Time': '18 mins'
    },
    vulnerabilities: ['Income inequality', 'HIV/TB burden', 'Infrastructure gaps'],
    strengths: ['Regional leadership', 'Research capacity', 'Natural resources']
  },
  'United Kingdom': {
    name: 'United Kingdom',
    overallScore: 78,
    dimensions: {
      healthcare: 82,
      information: 75,
      social: 78,
      economic: 76,
      governance: 79,
      infrastructure: 80,
      environmental: 72
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.5,
      'ICU Capacity': '88%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 73,
      'Emergency Response Time': '7 mins'
    },
    vulnerabilities: ['NHS capacity', 'Brexit impacts', 'Regional disparities'],
    strengths: ['Scientific research', 'Public health tradition', 'Global connections']
  },
  'France': {
    name: 'France',
    overallScore: 77,
    dimensions: {
      healthcare: 83,
      information: 74,
      social: 76,
      economic: 75,
      governance: 77,
      infrastructure: 81,
      environmental: 73
    },
    keyMetrics: {
      'Hospital Beds per 1000': 6.0,
      'ICU Capacity': '87%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 71,
      'Emergency Response Time': '8 mins'
    },
    vulnerabilities: ['Social tensions', 'Bureaucracy', 'Rural healthcare'],
    strengths: ['Healthcare system', 'Research institutes', 'Social safety net']
  },
  'Canada': {
    name: 'Canada',
    overallScore: 83,
    coordinates: [56.1304, -106.3468],
    dimensions: {
      healthcare: 84,
      information: 82,
      social: 85,
      economic: 81,
      governance: 83,
      infrastructure: 86,
      environmental: 80
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.5,
      'ICU Capacity': '89%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 82,
      'Emergency Response Time': '7 mins'
    },
    vulnerabilities: ['Rural access', 'Climate exposure', 'Healthcare workforce'],
    strengths: ['Universal healthcare', 'Social cohesion', 'Resource wealth']
  },
  'Japan': {
    name: 'Japan',
    overallScore: 85,
    coordinates: [36.2048, 138.2529],
    dimensions: {
      healthcare: 88,
      information: 83,
      social: 84,
      economic: 85,
      governance: 86,
      infrastructure: 90,
      environmental: 78
    },
    keyMetrics: {
      'Hospital Beds per 1000': 13.1,
      'ICU Capacity': '92%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 86,
      'Emergency Response Time': '5 mins'
    },
    vulnerabilities: ['Aging population', 'Natural disasters', 'Workforce shortage'],
    strengths: ['Technology', 'Social discipline', 'Healthcare quality']
  },
  'Australia': {
    name: 'Australia',
    overallScore: 80,
    coordinates: [-25.2744, 133.7751],
    dimensions: {
      healthcare: 82,
      information: 79,
      social: 81,
      economic: 78,
      governance: 80,
      infrastructure: 83,
      environmental: 77
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.8,
      'ICU Capacity': '86%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 78,
      'Emergency Response Time': '9 mins'
    },
    vulnerabilities: ['Remote populations', 'Climate vulnerability', 'Resource dependence'],
    strengths: ['Healthcare system', 'Border control', 'Research capacity']
  },
  'Italy': {
    name: 'Italy',
    overallScore: 73,
    coordinates: [41.8719, 12.5674],
    dimensions: {
      healthcare: 78,
      information: 71,
      social: 70,
      economic: 68,
      governance: 72,
      infrastructure: 76,
      environmental: 74
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.2,
      'ICU Capacity': '82%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 69,
      'Emergency Response Time': '10 mins'
    },
    vulnerabilities: ['Aging population', 'North-South divide', 'Economic stress'],
    strengths: ['Healthcare tradition', 'Community bonds', 'Cultural resilience']
  },
  'Spain': {
    name: 'Spain',
    overallScore: 75,
    coordinates: [40.4637, -3.7492],
    dimensions: {
      healthcare: 80,
      information: 73,
      social: 74,
      economic: 71,
      governance: 74,
      infrastructure: 78,
      environmental: 75
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.0,
      'ICU Capacity': '84%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 72,
      'Emergency Response Time': '9 mins'
    },
    vulnerabilities: ['Regional disparities', 'Tourism dependence', 'Youth unemployment'],
    strengths: ['Healthcare system', 'Social networks', 'EU integration']
  },
  'Mexico': {
    name: 'Mexico',
    overallScore: 59,
    coordinates: [23.6345, -102.5528],
    dimensions: {
      healthcare: 54,
      information: 61,
      social: 57,
      economic: 60,
      governance: 56,
      infrastructure: 63,
      environmental: 62
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.0,
      'ICU Capacity': '68%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 60,
      'Emergency Response Time': '16 mins'
    },
    vulnerabilities: ['Healthcare access', 'Income inequality', 'Informal economy'],
    strengths: ['Manufacturing base', 'Young population', 'Cultural cohesion']
  },
  'Argentina': {
    name: 'Argentina',
    overallScore: 61,
    coordinates: [-38.4161, -63.6167],
    dimensions: {
      healthcare: 63,
      information: 64,
      social: 59,
      economic: 56,
      governance: 58,
      infrastructure: 65,
      environmental: 68
    },
    keyMetrics: {
      'Hospital Beds per 1000': 5.0,
      'ICU Capacity': '73%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 62,
      'Emergency Response Time': '14 mins'
    },
    vulnerabilities: ['Economic instability', 'Political polarization', 'Rural-urban divide'],
    strengths: ['Education levels', 'Healthcare coverage', 'Agricultural resources']
  },
  'South Korea': {
    name: 'South Korea',
    overallScore: 84,
    coordinates: [35.9078, 127.7669],
    dimensions: {
      healthcare: 86,
      information: 88,
      social: 82,
      economic: 84,
      governance: 83,
      infrastructure: 89,
      environmental: 76
    },
    keyMetrics: {
      'Hospital Beds per 1000': 12.3,
      'ICU Capacity': '91%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'World-leading',
      'Social Cohesion Index': 79,
      'Emergency Response Time': '5 mins'
    },
    vulnerabilities: ['Aging society', 'Mental health', 'Regional tensions'],
    strengths: ['Technology adoption', 'Testing capacity', 'Social compliance']
  },
  'Russia': {
    name: 'Russia',
    overallScore: 62,
    coordinates: [61.5240, 105.3188],
    dimensions: {
      healthcare: 60,
      information: 54,
      social: 58,
      economic: 62,
      governance: 59,
      infrastructure: 68,
      environmental: 71
    },
    keyMetrics: {
      'Hospital Beds per 1000': 8.1,
      'ICU Capacity': '75%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 58,
      'Emergency Response Time': '12 mins'
    },
    vulnerabilities: ['Geographic dispersion', 'Trust deficit', 'Economic sanctions'],
    strengths: ['Resource base', 'Scientific heritage', 'Central control']
  },
  'Saudi Arabia': {
    name: 'Saudi Arabia',
    overallScore: 68,
    coordinates: [23.8859, 45.0792],
    dimensions: {
      healthcare: 71,
      information: 62,
      social: 65,
      economic: 73,
      governance: 68,
      infrastructure: 75,
      environmental: 62
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.7,
      'ICU Capacity': '80%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 65,
      'Emergency Response Time': '10 mins'
    },
    vulnerabilities: ['Water scarcity', 'Oil dependence', 'Regional conflicts'],
    strengths: ['Financial resources', 'Healthcare investment', 'Young population']
  },
  'Indonesia': {
    name: 'Indonesia',
    overallScore: 52,
    coordinates: [-0.7893, 113.9213],
    dimensions: {
      healthcare: 48,
      information: 54,
      social: 53,
      economic: 55,
      governance: 51,
      infrastructure: 52,
      environmental: 56
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.0,
      'ICU Capacity': '62%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 58,
      'Emergency Response Time': '22 mins'
    },
    vulnerabilities: ['Island geography', 'Healthcare capacity', 'Natural disasters'],
    strengths: ['Community networks', 'Resource wealth', 'Young demographics']
  },
  'Nigeria': {
    name: 'Nigeria',
    overallScore: 45,
    coordinates: [9.0820, 8.6753],
    dimensions: {
      healthcare: 38,
      information: 48,
      social: 46,
      economic: 50,
      governance: 42,
      infrastructure: 45,
      environmental: 48
    },
    keyMetrics: {
      'Hospital Beds per 1000': 0.5,
      'ICU Capacity': '55%',
      'Vaccine Distribution': 'Low',
      'Digital Infrastructure': 'Emerging',
      'Social Cohesion Index': 50,
      'Emergency Response Time': '30 mins'
    },
    vulnerabilities: ['Healthcare infrastructure', 'Security challenges', 'Corruption'],
    strengths: ['Economic potential', 'Youth population', 'Entrepreneurship']
  },
  'Egypt': {
    name: 'Egypt',
    overallScore: 57,
    coordinates: [26.8206, 30.8025],
    dimensions: {
      healthcare: 55,
      information: 56,
      social: 58,
      economic: 57,
      governance: 56,
      infrastructure: 61,
      environmental: 56
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.6,
      'ICU Capacity': '70%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 61,
      'Emergency Response Time': '18 mins'
    },
    vulnerabilities: ['Healthcare quality', 'Political tensions', 'Water resources'],
    strengths: ['Strategic location', 'Healthcare expansion', 'Youth workforce']
  },
  'Turkey': {
    name: 'Turkey',
    overallScore: 65,
    coordinates: [38.9637, 35.2433],
    dimensions: {
      healthcare: 68,
      information: 62,
      social: 63,
      economic: 66,
      governance: 64,
      infrastructure: 70,
      environmental: 62
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.8,
      'ICU Capacity': '78%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 64,
      'Emergency Response Time': '11 mins'
    },
    vulnerabilities: ['Refugee burden', 'Earthquake risk', 'Regional conflicts'],
    strengths: ['Healthcare modernization', 'Strategic geography', 'Manufacturing base']
  },
  'Thailand': {
    name: 'Thailand',
    overallScore: 69,
    coordinates: [15.8700, 100.9925],
    dimensions: {
      healthcare: 71,
      information: 68,
      social: 70,
      economic: 69,
      governance: 66,
      infrastructure: 72,
      environmental: 67
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.1,
      'ICU Capacity': '82%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 70,
      'Emergency Response Time': '10 mins'
    },
    vulnerabilities: ['Tourism dependence', 'Political instability', 'Aging population'],
    strengths: ['Medical tourism', 'Public health system', 'Regional hub']
  },
  'Vietnam': {
    name: 'Vietnam',
    overallScore: 66,
    coordinates: [14.0583, 108.2772],
    dimensions: {
      healthcare: 63,
      information: 65,
      social: 71,
      economic: 70,
      governance: 64,
      infrastructure: 65,
      environmental: 64
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.6,
      'ICU Capacity': '75%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Rapidly Developing',
      'Social Cohesion Index': 72,
      'Emergency Response Time': '13 mins'
    },
    vulnerabilities: ['Healthcare quality', 'Climate vulnerability', 'Urban-rural gap'],
    strengths: ['Community mobilization', 'Economic growth', 'Disease control experience']
  },
  'Philippines': {
    name: 'Philippines',
    overallScore: 55,
    coordinates: [12.8797, 121.7740],
    dimensions: {
      healthcare: 52,
      information: 58,
      social: 56,
      economic: 54,
      governance: 53,
      infrastructure: 56,
      environmental: 56
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.0,
      'ICU Capacity': '68%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 60,
      'Emergency Response Time': '20 mins'
    },
    vulnerabilities: ['Natural disasters', 'Healthcare access', 'Income inequality'],
    strengths: ['Healthcare workers', 'English proficiency', 'Diaspora support']
  },
  'Malaysia': {
    name: 'Malaysia',
    overallScore: 71,
    coordinates: [4.2105, 101.9758],
    dimensions: {
      healthcare: 73,
      information: 72,
      social: 69,
      economic: 72,
      governance: 70,
      infrastructure: 75,
      environmental: 68
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.9,
      'ICU Capacity': '83%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 68,
      'Emergency Response Time': '9 mins'
    },
    vulnerabilities: ['Political divisions', 'Migrant health', 'Climate risks'],
    strengths: ['Healthcare system', 'Economic diversity', 'Regional connectivity']
  },
  'Singapore': {
    name: 'Singapore',
    overallScore: 89,
    coordinates: [1.3521, 103.8198],
    dimensions: {
      healthcare: 92,
      information: 90,
      social: 86,
      economic: 91,
      governance: 89,
      infrastructure: 94,
      environmental: 81
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.4,
      'ICU Capacity': '95%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'World-leading',
      'Social Cohesion Index': 84,
      'Emergency Response Time': '4 mins'
    },
    vulnerabilities: ['Limited space', 'Import dependence', 'Aging population'],
    strengths: ['Healthcare excellence', 'Governance efficiency', 'Technology adoption']
  },
  'Netherlands': {
    name: 'Netherlands',
    overallScore: 82,
    coordinates: [52.1326, 5.2913],
    dimensions: {
      healthcare: 84,
      information: 83,
      social: 83,
      economic: 82,
      governance: 81,
      infrastructure: 85,
      environmental: 76
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.3,
      'ICU Capacity': '88%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 80,
      'Emergency Response Time': '6 mins'
    },
    vulnerabilities: ['Population density', 'Climate vulnerability', 'Housing shortage'],
    strengths: ['Healthcare innovation', 'Social solidarity', 'Infrastructure quality']
  },
  'Belgium': {
    name: 'Belgium',
    overallScore: 76,
    coordinates: [50.5039, 4.4699],
    dimensions: {
      healthcare: 79,
      information: 75,
      social: 74,
      economic: 76,
      governance: 75,
      infrastructure: 80,
      environmental: 73
    },
    keyMetrics: {
      'Hospital Beds per 1000': 5.7,
      'ICU Capacity': '86%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 72,
      'Emergency Response Time': '7 mins'
    },
    vulnerabilities: ['Political complexity', 'Urban density', 'Linguistic divisions'],
    strengths: ['Healthcare access', 'EU institutions', 'Research capacity']
  },
  'Switzerland': {
    name: 'Switzerland',
    overallScore: 86,
    coordinates: [46.8182, 8.2275],
    dimensions: {
      healthcare: 90,
      information: 85,
      social: 87,
      economic: 88,
      governance: 86,
      infrastructure: 88,
      environmental: 82
    },
    keyMetrics: {
      'Hospital Beds per 1000': 4.5,
      'ICU Capacity': '93%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 85,
      'Emergency Response Time': '5 mins'
    },
    vulnerabilities: ['High costs', 'Aging population', 'Canton variations'],
    strengths: ['Healthcare quality', 'Economic stability', 'Research excellence']
  },
  'Sweden': {
    name: 'Sweden',
    overallScore: 79,
    coordinates: [60.1282, 18.6435],
    dimensions: {
      healthcare: 81,
      information: 82,
      social: 80,
      economic: 78,
      governance: 79,
      infrastructure: 82,
      environmental: 77
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.2,
      'ICU Capacity': '87%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 81,
      'Emergency Response Time': '7 mins'
    },
    vulnerabilities: ['Rural healthcare', 'Immigration integration', 'Housing costs'],
    strengths: ['Social trust', 'Innovation ecosystem', 'Environmental leadership']
  },
  'Norway': {
    name: 'Norway',
    overallScore: 85,
    coordinates: [60.4720, 8.4689],
    dimensions: {
      healthcare: 86,
      information: 87,
      social: 88,
      economic: 85,
      governance: 85,
      infrastructure: 86,
      environmental: 82
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.6,
      'ICU Capacity': '90%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 86,
      'Emergency Response Time': '6 mins'
    },
    vulnerabilities: ['Geographic dispersion', 'Oil dependence', 'Arctic challenges'],
    strengths: ['Sovereign wealth', 'Social cohesion', 'Healthcare quality']
  },
  'Denmark': {
    name: 'Denmark',
    overallScore: 84,
    coordinates: [56.2639, 9.5018],
    dimensions: {
      healthcare: 85,
      information: 86,
      social: 87,
      economic: 83,
      governance: 84,
      infrastructure: 85,
      environmental: 80
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.6,
      'ICU Capacity': '89%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 85,
      'Emergency Response Time': '6 mins'
    },
    vulnerabilities: ['Small size', 'Healthcare workforce', 'Climate exposure'],
    strengths: ['Social trust', 'Digital government', 'Green transition']
  },
  'Finland': {
    name: 'Finland',
    overallScore: 83,
    coordinates: [61.9241, 25.7482],
    dimensions: {
      healthcare: 84,
      information: 85,
      social: 86,
      economic: 81,
      governance: 83,
      infrastructure: 84,
      environmental: 81
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.3,
      'ICU Capacity': '88%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 84,
      'Emergency Response Time': '7 mins'
    },
    vulnerabilities: ['Aging population', 'Rural healthcare', 'Border security'],
    strengths: ['Education system', 'Technology sector', 'Crisis preparedness']
  },
  'Poland': {
    name: 'Poland',
    overallScore: 67,
    coordinates: [51.9194, 19.1451],
    dimensions: {
      healthcare: 65,
      information: 68,
      social: 66,
      economic: 69,
      governance: 65,
      infrastructure: 71,
      environmental: 65
    },
    keyMetrics: {
      'Hospital Beds per 1000': 6.6,
      'ICU Capacity': '79%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 66,
      'Emergency Response Time': '11 mins'
    },
    vulnerabilities: ['Healthcare workforce', 'Political polarization', 'Air quality'],
    strengths: ['Economic growth', 'EU membership', 'Education levels']
  },
  'Ukraine': {
    name: 'Ukraine',
    overallScore: 48,
    coordinates: [48.3794, 31.1656],
    dimensions: {
      healthcare: 42,
      information: 50,
      social: 48,
      economic: 45,
      governance: 46,
      infrastructure: 52,
      environmental: 53
    },
    keyMetrics: {
      'Hospital Beds per 1000': 7.5,
      'ICU Capacity': '60%',
      'Vaccine Distribution': 'Low',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 52,
      'Emergency Response Time': '25 mins'
    },
    vulnerabilities: ['Conflict impact', 'Healthcare reform', 'Economic stress'],
    strengths: ['Medical education', 'Agricultural base', 'IT sector']
  },
  'Israel': {
    name: 'Israel',
    overallScore: 81,
    coordinates: [31.0461, 34.8516],
    dimensions: {
      healthcare: 84,
      information: 82,
      social: 78,
      economic: 83,
      governance: 80,
      infrastructure: 85,
      environmental: 75
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.0,
      'ICU Capacity': '90%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 74,
      'Emergency Response Time': '6 mins'
    },
    vulnerabilities: ['Security concerns', 'Social divisions', 'Water scarcity'],
    strengths: ['Innovation ecosystem', 'Healthcare technology', 'Crisis experience']
  },
  'Iran': {
    name: 'Iran',
    overallScore: 60,
    coordinates: [32.4279, 53.6880],
    dimensions: {
      healthcare: 62,
      information: 55,
      social: 60,
      economic: 58,
      governance: 57,
      infrastructure: 65,
      environmental: 63
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.5,
      'ICU Capacity': '72%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 61,
      'Emergency Response Time': '15 mins'
    },
    vulnerabilities: ['Sanctions impact', 'Information control', 'Economic pressure'],
    strengths: ['Medical education', 'Domestic production', 'Young population']
  },
  'Pakistan': {
    name: 'Pakistan',
    overallScore: 49,
    coordinates: [30.3753, 69.3451],
    dimensions: {
      healthcare: 44,
      information: 52,
      social: 50,
      economic: 48,
      governance: 47,
      infrastructure: 51,
      environmental: 51
    },
    keyMetrics: {
      'Hospital Beds per 1000': 0.6,
      'ICU Capacity': '62%',
      'Vaccine Distribution': 'Low',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 54,
      'Emergency Response Time': '22 mins'
    },
    vulnerabilities: ['Healthcare access', 'Political instability', 'Climate risks'],
    strengths: ['Young demographics', 'Community networks', 'Military capacity']
  },
  'Bangladesh': {
    name: 'Bangladesh',
    overallScore: 50,
    coordinates: [23.6850, 90.3563],
    dimensions: {
      healthcare: 45,
      information: 53,
      social: 52,
      economic: 52,
      governance: 48,
      infrastructure: 50,
      environmental: 50
    },
    keyMetrics: {
      'Hospital Beds per 1000': 0.8,
      'ICU Capacity': '64%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Emerging',
      'Social Cohesion Index': 56,
      'Emergency Response Time': '24 mins'
    },
    vulnerabilities: ['Population density', 'Climate vulnerability', 'Healthcare gaps'],
    strengths: ['Community resilience', 'Economic growth', 'Textile industry']
  },
  'Ethiopia': {
    name: 'Ethiopia',
    overallScore: 43,
    coordinates: [9.1450, 40.4897],
    dimensions: {
      healthcare: 38,
      information: 45,
      social: 44,
      economic: 45,
      governance: 42,
      infrastructure: 43,
      environmental: 46
    },
    keyMetrics: {
      'Hospital Beds per 1000': 0.3,
      'ICU Capacity': '52%',
      'Vaccine Distribution': 'Low',
      'Digital Infrastructure': 'Basic',
      'Social Cohesion Index': 48,
      'Emergency Response Time': '35 mins'
    },
    vulnerabilities: ['Healthcare infrastructure', 'Conflict zones', 'Food security'],
    strengths: ['Economic growth', 'Regional leadership', 'Young population']
  },
  'Kenya': {
    name: 'Kenya',
    overallScore: 53,
    coordinates: [-0.0236, 37.9062],
    dimensions: {
      healthcare: 50,
      information: 56,
      social: 54,
      economic: 55,
      governance: 52,
      infrastructure: 53,
      environmental: 51
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.4,
      'ICU Capacity': '66%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 57,
      'Emergency Response Time': '20 mins'
    },
    vulnerabilities: ['Healthcare quality', 'Corruption', 'Climate variability'],
    strengths: ['Tech innovation', 'Regional hub', 'Tourism potential']
  },
  'Morocco': {
    name: 'Morocco',
    overallScore: 63,
    coordinates: [31.7917, -7.0926],
    dimensions: {
      healthcare: 61,
      information: 64,
      social: 62,
      economic: 65,
      governance: 61,
      infrastructure: 66,
      environmental: 62
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.1,
      'ICU Capacity': '74%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 63,
      'Emergency Response Time': '14 mins'
    },
    vulnerabilities: ['Rural healthcare', 'Youth unemployment', 'Water stress'],
    strengths: ['Political stability', 'Tourism sector', 'Renewable energy']
  },
  'Peru': {
    name: 'Peru',
    overallScore: 57,
    coordinates: [-9.1900, -75.0152],
    dimensions: {
      healthcare: 54,
      information: 58,
      social: 56,
      economic: 58,
      governance: 55,
      infrastructure: 60,
      environmental: 58
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.6,
      'ICU Capacity': '70%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 59,
      'Emergency Response Time': '17 mins'
    },
    vulnerabilities: ['Healthcare inequality', 'Informal economy', 'Natural disasters'],
    strengths: ['Economic growth', 'Mining resources', 'Cultural heritage']
  },
  'Chile': {
    name: 'Chile',
    overallScore: 72,
    coordinates: [-35.6751, -71.5430],
    dimensions: {
      healthcare: 74,
      information: 73,
      social: 70,
      economic: 73,
      governance: 71,
      infrastructure: 76,
      environmental: 69
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.1,
      'ICU Capacity': '82%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 68,
      'Emergency Response Time': '9 mins'
    },
    vulnerabilities: ['Social inequality', 'Natural disasters', 'Water scarcity'],
    strengths: ['Healthcare reform', 'Economic stability', 'Vaccination success']
  },
  'Colombia': {
    name: 'Colombia',
    overallScore: 61,
    coordinates: [4.5709, -74.2973],
    dimensions: {
      healthcare: 60,
      information: 62,
      social: 58,
      economic: 62,
      governance: 59,
      infrastructure: 64,
      environmental: 63
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.7,
      'ICU Capacity': '75%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 60,
      'Emergency Response Time': '15 mins'
    },
    vulnerabilities: ['Rural access', 'Violence legacy', 'Income inequality'],
    strengths: ['Healthcare expansion', 'Biodiversity', 'Economic growth']
  },
  'Venezuela': {
    name: 'Venezuela',
    overallScore: 38,
    coordinates: [6.4238, -66.5897],
    dimensions: {
      healthcare: 32,
      information: 40,
      social: 38,
      economic: 35,
      governance: 36,
      infrastructure: 42,
      environmental: 43
    },
    keyMetrics: {
      'Hospital Beds per 1000': 0.8,
      'ICU Capacity': '45%',
      'Vaccine Distribution': 'Very Low',
      'Digital Infrastructure': 'Deteriorating',
      'Social Cohesion Index': 42,
      'Emergency Response Time': '40 mins'
    },
    vulnerabilities: ['Economic collapse', 'Healthcare crisis', 'Political instability'],
    strengths: ['Oil reserves', 'Education legacy', 'Regional ties']
  },
  'New Zealand': {
    name: 'New Zealand',
    overallScore: 87,
    coordinates: [-40.9006, 174.8860],
    dimensions: {
      healthcare: 88,
      information: 89,
      social: 90,
      economic: 85,
      governance: 88,
      infrastructure: 86,
      environmental: 83
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.6,
      'ICU Capacity': '91%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 87,
      'Emergency Response Time': '7 mins'
    },
    vulnerabilities: ['Geographic isolation', 'Small population', 'Natural disasters'],
    strengths: ['Social cohesion', 'Governance quality', 'Border control']
  },
  'Austria': {
    name: 'Austria',
    overallScore: 80,
    coordinates: [47.5162, 14.5501],
    dimensions: {
      healthcare: 83,
      information: 79,
      social: 81,
      economic: 80,
      governance: 79,
      infrastructure: 83,
      environmental: 77
    },
    keyMetrics: {
      'Hospital Beds per 1000': 7.4,
      'ICU Capacity': '88%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 78,
      'Emergency Response Time': '6 mins'
    },
    vulnerabilities: ['Aging population', 'Tourism dependence', 'Regional variations'],
    strengths: ['Healthcare system', 'Social insurance', 'Quality of life']
  },
  'Czech Republic': {
    name: 'Czech Republic',
    overallScore: 70,
    coordinates: [49.8175, 15.4730],
    dimensions: {
      healthcare: 72,
      information: 70,
      social: 68,
      economic: 71,
      governance: 69,
      infrastructure: 74,
      environmental: 66
    },
    keyMetrics: {
      'Hospital Beds per 1000': 6.6,
      'ICU Capacity': '81%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 67,
      'Emergency Response Time': '8 mins'
    },
    vulnerabilities: ['Political divisions', 'Aging society', 'Air pollution'],
    strengths: ['Industrial base', 'EU membership', 'Healthcare access']
  },
  'Portugal': {
    name: 'Portugal',
    overallScore: 74,
    coordinates: [39.3999, -8.2245],
    dimensions: {
      healthcare: 77,
      information: 74,
      social: 75,
      economic: 71,
      governance: 73,
      infrastructure: 76,
      environmental: 72
    },
    keyMetrics: {
      'Hospital Beds per 1000': 3.4,
      'ICU Capacity': '83%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 73,
      'Emergency Response Time': '8 mins'
    },
    vulnerabilities: ['Economic constraints', 'Aging population', 'Fire risks'],
    strengths: ['Healthcare quality', 'Social cohesion', 'EU integration']
  },
  'Greece': {
    name: 'Greece',
    overallScore: 68,
    coordinates: [39.0742, 21.8243],
    dimensions: {
      healthcare: 70,
      information: 67,
      social: 66,
      economic: 64,
      governance: 67,
      infrastructure: 72,
      environmental: 70
    },
    keyMetrics: {
      'Hospital Beds per 1000': 4.2,
      'ICU Capacity': '79%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 65,
      'Emergency Response Time': '10 mins'
    },
    vulnerabilities: ['Economic recovery', 'Migration pressure', 'Bureaucracy'],
    strengths: ['Healthcare tradition', 'Tourism recovery', 'Maritime access']
  },
  'Romania': {
    name: 'Romania',
    overallScore: 64,
    coordinates: [45.9432, 24.9668],
    dimensions: {
      healthcare: 62,
      information: 65,
      social: 63,
      economic: 65,
      governance: 62,
      infrastructure: 67,
      environmental: 64
    },
    keyMetrics: {
      'Hospital Beds per 1000': 6.9,
      'ICU Capacity': '76%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 62,
      'Emergency Response Time': '13 mins'
    },
    vulnerabilities: ['Healthcare workforce', 'Rural-urban divide', 'Corruption'],
    strengths: ['IT sector', 'EU membership', 'Agricultural base']
  },
  'Hungary': {
    name: 'Hungary',
    overallScore: 69,
    coordinates: [47.1625, 19.5033],
    dimensions: {
      healthcare: 70,
      information: 68,
      social: 67,
      economic: 70,
      governance: 68,
      infrastructure: 73,
      environmental: 67
    },
    keyMetrics: {
      'Hospital Beds per 1000': 7.0,
      'ICU Capacity': '80%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 65,
      'Emergency Response Time': '9 mins'
    },
    vulnerabilities: ['Political tensions', 'Aging population', 'Healthcare reform'],
    strengths: ['Manufacturing base', 'EU membership', 'Strategic location']
  },
  'Bulgaria': {
    name: 'Bulgaria',
    overallScore: 62,
    coordinates: [42.7339, 25.4858],
    dimensions: {
      healthcare: 60,
      information: 63,
      social: 61,
      economic: 62,
      governance: 60,
      infrastructure: 65,
      environmental: 63
    },
    keyMetrics: {
      'Hospital Beds per 1000': 7.5,
      'ICU Capacity': '74%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 60,
      'Emergency Response Time': '14 mins'
    },
    vulnerabilities: ['Population decline', 'Healthcare quality', 'Corruption'],
    strengths: ['EU membership', 'IT growth', 'Tourism potential']
  },
  'Serbia': {
    name: 'Serbia',
    overallScore: 65,
    coordinates: [44.0165, 21.0059],
    dimensions: {
      healthcare: 66,
      information: 64,
      social: 64,
      economic: 65,
      governance: 63,
      infrastructure: 68,
      environmental: 65
    },
    keyMetrics: {
      'Hospital Beds per 1000': 5.6,
      'ICU Capacity': '77%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 63,
      'Emergency Response Time': '12 mins'
    },
    vulnerabilities: ['EU integration', 'Brain drain', 'Air pollution'],
    strengths: ['Regional position', 'Agriculture', 'IT sector growth']
  },
  'Croatia': {
    name: 'Croatia',
    overallScore: 71,
    coordinates: [45.1000, 15.2000],
    dimensions: {
      healthcare: 73,
      information: 71,
      social: 70,
      economic: 69,
      governance: 70,
      infrastructure: 74,
      environmental: 72
    },
    keyMetrics: {
      'Hospital Beds per 1000': 5.5,
      'ICU Capacity': '82%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 68,
      'Emergency Response Time': '9 mins'
    },
    vulnerabilities: ['Population aging', 'Tourism dependence', 'Regional disparities'],
    strengths: ['EU membership', 'Tourism infrastructure', 'Healthcare access']
  },
  'Uruguay': {
    name: 'Uruguay',
    overallScore: 73,
    coordinates: [-32.5228, -55.7658],
    dimensions: {
      healthcare: 75,
      information: 74,
      social: 76,
      economic: 71,
      governance: 74,
      infrastructure: 73,
      environmental: 70
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.8,
      'ICU Capacity': '83%',
      'Vaccine Distribution': 'Very High',
      'Digital Infrastructure': 'Advanced',
      'Social Cohesion Index': 74,
      'Emergency Response Time': '8 mins'
    },
    vulnerabilities: ['Small market', 'Regional dependence', 'Climate exposure'],
    strengths: ['Social policies', 'Political stability', 'Education system']
  },
  'Costa Rica': {
    name: 'Costa Rica',
    overallScore: 70,
    coordinates: [9.7489, -83.7534],
    dimensions: {
      healthcare: 73,
      information: 71,
      social: 72,
      economic: 68,
      governance: 70,
      infrastructure: 69,
      environmental: 71
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.2,
      'ICU Capacity': '80%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 72,
      'Emergency Response Time': '10 mins'
    },
    vulnerabilities: ['Natural disasters', 'Income inequality', 'Fiscal pressure'],
    strengths: ['Healthcare system', 'Environmental leadership', 'Political stability']
  },
  'Panama': {
    name: 'Panama',
    overallScore: 66,
    coordinates: [8.5380, -80.7821],
    dimensions: {
      healthcare: 67,
      information: 68,
      social: 64,
      economic: 70,
      governance: 64,
      infrastructure: 69,
      environmental: 65
    },
    keyMetrics: {
      'Hospital Beds per 1000': 2.3,
      'ICU Capacity': '78%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Developed',
      'Social Cohesion Index': 64,
      'Emergency Response Time': '11 mins'
    },
    vulnerabilities: ['Income inequality', 'Canal dependence', 'Climate risks'],
    strengths: ['Strategic location', 'Financial sector', 'Economic growth']
  },
  'Cuba': {
    name: 'Cuba',
    overallScore: 68,
    coordinates: [21.5218, -77.7812],
    dimensions: {
      healthcare: 78,
      information: 58,
      social: 70,
      economic: 55,
      governance: 62,
      infrastructure: 65,
      environmental: 68
    },
    keyMetrics: {
      'Hospital Beds per 1000': 5.2,
      'ICU Capacity': '76%',
      'Vaccine Distribution': 'High',
      'Digital Infrastructure': 'Limited',
      'Social Cohesion Index': 71,
      'Emergency Response Time': '12 mins'
    },
    vulnerabilities: ['Economic constraints', 'Infrastructure aging', 'Information access'],
    strengths: ['Healthcare system', 'Medical education', 'Vaccine development']
  },
  'Jamaica': {
    name: 'Jamaica',
    overallScore: 58,
    coordinates: [18.1096, -77.2975],
    dimensions: {
      healthcare: 56,
      information: 60,
      social: 57,
      economic: 56,
      governance: 58,
      infrastructure: 61,
      environmental: 59
    },
    keyMetrics: {
      'Hospital Beds per 1000': 1.7,
      'ICU Capacity': '71%',
      'Vaccine Distribution': 'Moderate',
      'Digital Infrastructure': 'Developing',
      'Social Cohesion Index': 60,
      'Emergency Response Time': '16 mins'
    },
    vulnerabilities: ['Crime impact', 'Hurricane exposure', 'Brain drain'],
    strengths: ['Tourism sector', 'English speaking', 'Cultural influence']
  }
};

// Add regional groupings
export const regionalGroups = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay'],
  'Europe': ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Austria', 'Czech Republic', 'Portugal', 'Greece', 'Romania', 'Hungary', 'Bulgaria', 'Serbia', 'Croatia'],
  'Asia': ['China', 'Japan', 'South Korea', 'India', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia', 'Singapore', 'Pakistan', 'Bangladesh', 'Iran'],
  'Africa': ['South Africa', 'Nigeria', 'Egypt', 'Ethiopia', 'Kenya', 'Morocco'],
  'Middle East': ['Saudi Arabia', 'Israel', 'Turkey'],
  'Oceania': ['Australia', 'New Zealand'],
  'Central America & Caribbean': ['Costa Rica', 'Panama', 'Cuba', 'Jamaica']
};

// Calculate regional averages
export const calculateRegionalScores = () => {
  const regionalScores = {};
  
  Object.entries(regionalGroups).forEach(([region, countries]) => {
    const regionData = countries
      .map(country => countryResilienceData[country])
      .filter(data => data);
    
    if (regionData.length > 0) {
      const avgScore = Math.round(
        regionData.reduce((sum, country) => sum + country.overallScore, 0) / regionData.length
      );
      
      const dimensions = {};
      Object.keys(regionData[0].dimensions).forEach(dim => {
        dimensions[dim] = Math.round(
          regionData.reduce((sum, country) => sum + country.dimensions[dim], 0) / regionData.length
        );
      });
      
      regionalScores[region] = {
        name: region,
        overallScore: avgScore,
        dimensions,
        countriesCount: regionData.length
      };
    }
  });
  
  return regionalScores;
};