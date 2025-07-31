# Netlify Environment Variables Setup

To ensure the case studies and other data load correctly on Netlify, you need to set up the following environment variables in your Netlify dashboard:

## Required Environment Variables

1. **AIRTABLE_API_KEY**
   - Your Airtable API key
   - Get it from: https://airtable.com/account

2. **AIRTABLE_BASE_ID**
   - Your Airtable base ID
   - Find it in your Airtable base URL or API documentation

## How to Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to Site Settings > Environment Variables
4. Click "Add variable"
5. Add each variable with its value
6. Save and redeploy

## Additional Configuration

The following variables are already set in netlify.toml but can be overridden:
- `USE_AIRTABLE=true` (ensures Airtable is used in production)
- `NODE_ENV=production` (automatically set by Netlify)
- `USE_MOCK_DATA=false` (ensures real data is used)

## Testing

After setting up the environment variables:
1. Trigger a new deploy
2. Check the deploy logs for any errors
3. Visit /case-studies to verify data is loading