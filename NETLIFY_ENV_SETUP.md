# CRITICAL: Netlify Environment Variables Setup

## You MUST set these environment variables in Netlify for authentication to work\!

### Step 1: Go to Netlify Dashboard
1. Log into Netlify
2. Select your site
3. Go to **Site configuration** → **Environment variables**

### Step 2: Add These Variables

Click "Add a variable" and add each of these:

#### 1. NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: Your exact Netlify URL (e.g., `https://your-site-name.netlify.app`)
- **Scopes**: All (Production, Preview, Branch deploys)

#### 2. NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate a secure secret using:
  ```bash
  openssl rand -base64 32
  ```
  Example output: `Thpu0oUe7O/4ZhSjeF6zXwPuSHGYVKqTS7DaLkqKHBY=`
- **Scopes**: All (Production, Preview, Branch deploys)

### Step 3: Redeploy
After adding the variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

### Test with this endpoint:
Visit: `https://your-site.netlify.app/api/auth-debug`

Should show:
- environment.hasSecret: true
- environment.NEXTAUTH_URL: your URL
EOF < /dev/null