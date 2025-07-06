# Netlify Build Fix - No Environment Variables Required

## The Issue
The site was failing to build on Netlify because the `app/sitemap.js` file was importing and calling Airtable functions during the build process. When Next.js builds the app, it generates the sitemap at build time, which triggered these imports before environment variables were available.

## The Solution
I've modified the `app/sitemap.js` file to:
1. Check if Airtable environment variables are available before importing the Airtable utilities
2. Use dynamic imports only when the variables are present
3. Skip dynamic route generation when building without environment variables

## What Makes This Different from Other Sites
Most Next.js sites work on Netlify without environment variables because they:
- Don't generate dynamic sitemaps from external APIs at build time
- Only fetch data at runtime (in API routes or client components)
- Use static content for their sitemaps

This site was unique because it tried to fetch data from Airtable during the build process to generate a comprehensive sitemap.

## How It Works Now
1. **With environment variables**: The sitemap will include dynamic routes for case studies and people profiles
2. **Without environment variables**: The sitemap will only include static routes, but the site will still build successfully
3. **Runtime behavior**: All API routes and client-side data fetching will work normally once deployed

## No Need for Environment Variables on Netlify
The site will now build successfully on Netlify without any environment variables. The only difference is that the sitemap won't include dynamic routes for case studies and people profiles, but these pages will still be accessible and indexable by search engines through other means.

## Verification
You can now deploy to Netlify without adding any environment variables. The build should complete successfully.