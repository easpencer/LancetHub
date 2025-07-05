export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandemic-resilience-hub.org';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/'
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
