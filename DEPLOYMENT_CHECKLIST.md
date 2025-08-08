# Deployment Checklist for Authentication Fix

## Critical Environment Variables for Netlify

You MUST set these environment variables in your Netlify dashboard:

### 1. Go to Netlify Dashboard > Site Settings > Environment Variables

Add these variables:

```
NEXTAUTH_URL=https://your-actual-domain.netlify.app
NEXTAUTH_SECRET=generate-a-secure-32-character-string
```

To generate a secure secret, run:
```bash
openssl rand -base64 32
```

### 2. Important Notes:

- `NEXTAUTH_URL` must be your EXACT production URL (including https://)
- `NEXTAUTH_SECRET` must be at least 32 characters
- DO NOT use the default/fallback secret in production
- The secret must be the same across all deployments

## What Was Fixed

### 1. Session Cookie Configuration
- Fixed cookie naming for production (uses `__Secure-` prefix in production)
- Proper secure cookie settings for HTTPS
- Consistent cookie configuration between middleware and NextAuth

### 2. URL Handling
- Added proper URL detection for various hosting platforms
- Added trustHost configuration for production
- Fixed redirect callbacks

### 3. Middleware Improvements
- Better error handling in authentication checks
- Proper cookie name detection based on environment
- Skip middleware for static files and Next.js internals

### 4. Session Management
- Session persists for 30 days
- Automatic session refresh every 5 minutes
- Session refresh on window focus

## Testing the Fix

### Local Testing (Port 3003)
1. Visit http://localhost:3003
2. Click on a protected tab (e.g., Case Studies)
3. Login with:
   - Email: `ResilientUser@lancethub.org`
   - Password: `WeAreResilient1s`
4. Navigate between tabs - should NOT ask for login again

### Production Testing
After deploying with proper environment variables:

1. Clear browser cookies for your domain
2. Visit your production URL
3. Navigate to a protected page
4. Login with test credentials
5. Navigate between pages - session should persist

## Debug Endpoint

Visit `/api/auth-debug` to check:
- Current session status
- Cookie presence
- Environment configuration

## Common Issues and Solutions

### Issue: Still getting login loops in production
**Solution**: 
1. Verify `NEXTAUTH_URL` matches your exact production URL
2. Check that `NEXTAUTH_SECRET` is set in Netlify environment variables
3. Clear browser cookies and try again

### Issue: Session not persisting
**Solution**:
1. Check browser console for cookie warnings
2. Ensure your site is using HTTPS in production
3. Verify cookies are not being blocked by browser settings

### Issue: "NEXTAUTH_URL" mismatch error
**Solution**:
Set `NEXTAUTH_URL` to your exact production URL in Netlify environment variables

## Deployment Steps

1. **Commit these changes** to your repository
2. **Set environment variables** in Netlify (CRITICAL!)
3. **Deploy** to Netlify
4. **Clear browser cache** and cookies
5. **Test** authentication flow

## Security Reminders

- Never commit `NEXTAUTH_SECRET` to your repository
- Use a unique, strong secret for production
- Regularly rotate your authentication secrets
- Monitor authentication logs for suspicious activity