# Authentication Setup Guide

## Overview
This application uses NextAuth.js for authentication with a shared team password system.

## Key Components

### 1. Authentication Configuration (`/utils/auth-config.js`)
- Centralized configuration for authentication
- Ensures consistent secret usage across all components
- Configures session persistence for 30 days

### 2. NextAuth Setup (`/app/api/auth/[...nextauth]/route.js`)
- Handles credential-based authentication
- Team password: `WeAreResilient1s`
- Special login: `ResilientUser@lancethub.org` with team password
- Admin login: Uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables

### 3. Middleware (`/middleware.js`)
- Protects routes requiring authentication
- Public pages: Home (`/`) and Interactive Visualization (`/landscape-interactive`)
- All other pages require authentication

### 4. Session Provider (`/app/providers.js`)
- Wraps the application with NextAuth SessionProvider
- Refreshes session every 5 minutes
- Refreshes on window focus

## Environment Variables

### For Local Development (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=lancethub_secure_nextauth_secret_key_replace_this
```

### For Production (Set in Netlify Dashboard)
1. Go to Site Settings > Environment Variables in Netlify
2. Add these variables:
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-domain.netlify.app`)
   - `NEXTAUTH_SECRET`: A secure random string (generate with: `openssl rand -base64 32`)

**IMPORTANT**: The `NEXTAUTH_SECRET` must be the same in all environments to maintain session persistence.

## How Authentication Works

1. **User Login Flow**:
   - User visits a protected page
   - Middleware checks for valid session
   - If no session, redirects to `/login`
   - User enters email and password
   - On successful login, redirected back to original page

2. **Session Management**:
   - Sessions persist for 30 days
   - JWT tokens are used for stateless authentication
   - Sessions refresh automatically every 5 minutes
   - Sessions refresh when window regains focus

3. **Protected Pages**:
   - Use the `ProtectedPage` component wrapper
   - Automatically handles authentication checks
   - Shows loading state while verifying session

## Troubleshooting

### Issue: Users asked to login repeatedly
**Solution**: Ensure `NEXTAUTH_SECRET` is set correctly in production environment variables

### Issue: Session not persisting after login
**Solution**: Check that cookies are enabled and the domain is correctly configured

### Issue: Login works locally but not in production
**Solution**: Verify `NEXTAUTH_URL` matches your production URL exactly

## Testing Authentication

1. **Test Login**:
   - Email: `ResilientUser@lancethub.org`
   - Password: `WeAreResilient1s`

2. **Verify Session Persistence**:
   - Login once
   - Navigate to different protected pages
   - Session should persist without re-login

3. **Test Logout**:
   - Click "Sign Out" button
   - Should redirect to home page
   - Protected pages should redirect to login

## Security Notes

1. Always use HTTPS in production
2. Generate a strong, unique `NEXTAUTH_SECRET` for production
3. Never commit secrets to version control
4. Regularly rotate the team password
5. Monitor authentication logs for suspicious activity