# Vercel Environment Variables Setup

## Issue
The error "Missing required environment variable: NEXT_PUBLIC_SITE_URL" occurs because the environment variable is not set in Vercel.

## Solution

### Option 1: Set Environment Variable in Vercel (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your project (tinitools)

2. **Navigate to Settings:**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Environment Variable:**
   - Click **Add New**
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://tinitools.com`
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots (⋮) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

### Option 2: Use Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variable
vercel env add NEXT_PUBLIC_SITE_URL production
# When prompted, enter: https://tinitools.com

# Set for all environments
vercel env add NEXT_PUBLIC_SITE_URL preview
vercel env add NEXT_PUBLIC_SITE_URL development

# Redeploy
vercel --prod
```

### Option 3: Use vercel.json (Not Recommended)

You can also add it to `vercel.json`, but environment variables in dashboard are preferred.

## Verification

After setting the environment variable:

1. **Check Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Verify `NEXT_PUBLIC_SITE_URL` is listed with value `https://tinitools.com`

2. **Check Deployment Logs:**
   - Go to Deployments
   - Click on the latest deployment
   - Check the build logs - should not show the error

3. **Test the Site:**
   - Visit https://tinitools.com
   - Open browser console
   - Should not see "Missing required environment variable" error

## Current Fix

The code has been updated to:
- ✅ Use `window.location` as fallback on client-side if env var is missing
- ✅ Use `https://tinitools.com` as fallback on server-side
- ✅ Not throw errors on client-side (only warns on server)

However, **it's still recommended to set the environment variable** for:
- Proper canonical URLs
- Correct Open Graph tags
- Accurate structured data URLs

## Additional Environment Variables

You may also want to set:
- `NEXT_PUBLIC_GA_ID` - Your Google Analytics ID (if using analytics)

## After Setting Environment Variable

1. Wait for the new deployment to complete (2-3 minutes)
2. Clear browser cache on mobile
3. Test the site - should work without errors

