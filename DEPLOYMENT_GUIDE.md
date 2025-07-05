# Deployment Guide for Netlify

## Case Studies Display Issue Fix

If you're only seeing 2 case studies on your Netlify deployment despite having 15 in the fallback data, follow these steps:

### Quick Fix

Add the following environment variable to your Netlify site:

1. Go to your Netlify dashboard
2. Navigate to Site settings → Environment variables
3. Add:
   - Key: `FORCE_CASE_STUDY_FALLBACK`
   - Value: `true`
4. Redeploy your site

This will force the application to use the comprehensive fallback data with 15 case studies.

### Understanding the Issue

The application has multiple layers of data fetching:

1. **Primary**: Airtable API (requires proper configuration)
2. **Fallback**: Mock data in `utils/airtable.js` (only has 2 case studies)
3. **Comprehensive Fallback**: Full dataset in `app/api/case-studies/route.js` (has 15 case studies)

When Airtable isn't properly configured, the system falls back to the mock data which only contains 2 case studies. The comprehensive fallback with 15 entries is only used when explicitly triggered.

### Long-term Solution

To properly configure Airtable:

1. Ensure these environment variables are set in Netlify:
   ```
   AIRTABLE_API_KEY=your_actual_api_key
   AIRTABLE_BASE_ID=appyi4hm7RK1inUnq
   USE_MOCK_DATA=false
   ```

2. Verify your Airtable base has the correct table name: `Case study forms`

3. Check that the Airtable API key has read permissions for the base

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AIRTABLE_API_KEY` | Your Airtable API key | Yes (unless using mock data) | - |
| `AIRTABLE_BASE_ID` | Your Airtable base ID | Yes (unless using mock data) | - |
| `USE_MOCK_DATA` | Use mock data instead of Airtable | No | `false` |
| `FORCE_CASE_STUDY_FALLBACK` | Force comprehensive fallback for case studies | No | `false` |
| `NEXTAUTH_URL` | Your site URL for authentication | Yes | - |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes | - |
| `ADMIN_EMAIL` | Admin login email | Yes | - |
| `ADMIN_PASSWORD` | Admin login password | Yes | - |

### Debugging Steps

1. Check the browser console for any errors
2. Look at the Network tab to see the `/api/case-studies` response
3. Check Netlify function logs for server-side errors
4. Verify environment variables are properly set in Netlify

### Additional Notes

- The application automatically detects production environments and applies special handling for case studies
- If Airtable returns 2 or fewer records in production, it automatically switches to the comprehensive fallback
- The `FORCE_CASE_STUDY_FALLBACK` variable bypasses all checks and immediately uses the full dataset