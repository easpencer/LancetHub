import { fetchCaseStudies, fetchPeopleData } from '../utils/airtable';

export default async function sitemap() {
  // Base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandemic-resilience-hub.org';
  
  // Static routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/commission`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/commission/members`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/landscape`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/people`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bibliography`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/documents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/join-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/manifest`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/commission-announcement`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ];
  
  // Try to fetch dynamic case studies with timeout
  let caseStudyRoutes = [];
  try {
    // Add timeout to prevent hanging builds
    const fetchWithTimeout = async (fetchFn, timeoutMs = 5000) => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)
      );
      return Promise.race([fetchFn(), timeoutPromise]);
    };
    
    const caseStudies = await fetchWithTimeout(() => fetchCaseStudies(), 5000);
    
    // Check if we got the comprehensive fallback indicator
    if (caseStudies?.useComprehensiveFallback) {
      console.log('Using static routes for case studies in sitemap');
    } else if (Array.isArray(caseStudies)) {
      caseStudyRoutes = caseStudies.map(caseStudy => ({
        url: `${baseUrl}/case-studies/${caseStudy.id}`,
        lastModified: new Date(caseStudy.Date) || new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap for case studies:', error.message);
    // Continue with static routes only
  }
  
  // Try to fetch dynamic people profiles with timeout
  let peopleRoutes = [];
  try {
    const fetchWithTimeout = async (fetchFn, timeoutMs = 5000) => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)
      );
      return Promise.race([fetchFn(), timeoutPromise]);
    };
    
    const people = await fetchWithTimeout(() => fetchPeopleData(), 5000);
    
    if (Array.isArray(people)) {
      peopleRoutes = people
        .filter(person => person.Name)
        .map(person => ({
          url: `${baseUrl}/people/${encodeURIComponent(person.Name.toLowerCase().replace(/\s+/g, '-'))}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        }));
    }
  } catch (error) {
    console.error('Error generating sitemap for people:', error.message);
    // Continue with static routes only
  }
  
  return [...routes, ...caseStudyRoutes, ...peopleRoutes];
}
