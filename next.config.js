/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'lancethub.org',
      'dl.airtable.com', // For Airtable images
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/webp'],
  },
  eslint: {
    dirs: ['pages', 'components', 'app', 'utils'],
  },
  poweredByHeader: false, // Don't send X-Powered-By header
  productionBrowserSourceMaps: false, // Disable source maps in production
  // Add headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production' 
              ? "default-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://raw.githubusercontent.com https://*.basemaps.cartocdn.com; font-src 'self' https://cdnjs.cloudflare.com; frame-ancestors 'none'; upgrade-insecure-requests;"
              : ''
          }
        ],
      },
    ];
  },
  // Add production URL redirects as needed
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: true,
      },
    ];
  },
  // Webpack config to handle Leaflet
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  }
};

module.exports = nextConfig;
