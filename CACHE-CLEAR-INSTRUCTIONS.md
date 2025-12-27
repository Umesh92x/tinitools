# Cache Clearing Instructions for Production Issues

## Problem
The site works on localhost but shows errors on production (tinitools.com) on mobile Chrome.

## Solution Steps

### 1. Clear Browser Cache on Mobile Chrome

**Android Chrome:**
1. Open Chrome
2. Tap the three dots menu (⋮) in the top right
3. Go to **Settings** → **Privacy and security**
4. Tap **Clear browsing data**
5. Select:
   - ✅ Cached images and files
   - ✅ Cookies and site data
6. Select **All time** from the time range
7. Tap **Clear data**

**Alternative Method (Faster):**
1. Open Chrome
2. Go to `chrome://settings/clearBrowserData`
3. Select **Cached images and files** and **Cookies and site data**
4. Select **All time**
5. Tap **Clear data**

### 2. Hard Refresh on Mobile Chrome

**Method 1:**
1. Open the site (tinitools.com)
2. Tap and hold the refresh button
3. Select **Hard reload** or **Empty Cache and Hard Reload**

**Method 2:**
1. Open Chrome DevTools (if available)
2. Long press the refresh button
3. Select **Empty Cache and Hard Reload**

### 3. Clear Site Data (Most Effective)

1. Open Chrome
2. Go to `chrome://settings/siteData`
3. Search for `tinitools.com`
4. Tap on the site
5. Tap **Clear & Reset**

### 4. Verify Deployment

**Check Vercel Dashboard:**
1. Go to your Vercel dashboard
2. Check the latest deployment
3. Verify it completed successfully
4. Check the deployment logs for any errors

**Check Build Hash:**
1. Open the site in Chrome
2. Open DevTools (F12 or right-click → Inspect)
3. Go to **Network** tab
4. Reload the page
5. Look for `_next/static/chunks/` files
6. Check the file names - they should have new hashes after deployment

### 5. Force New Deployment

If cache persists, trigger a new deployment:

```bash
# Make a small change to force rebuild
# Or use Vercel CLI:
vercel --prod
```

### 6. Add Cache-Busting Query Parameter (Temporary)

As a workaround, you can add a query parameter to force fresh load:
- Visit: `https://tinitools.com/?v=2` or `https://tinitools.com/?nocache=1`

### 7. Check Service Workers

If you have a service worker:
1. Open Chrome DevTools
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** if any service workers are registered
5. Reload the page

### 8. Verify JavaScript Files Are Updated

1. Open Chrome DevTools
2. Go to **Network** tab
3. Check **Disable cache** checkbox
4. Reload the page
5. Look for JavaScript files in `_next/static/chunks/`
6. Check the file sizes and timestamps

## Expected Behavior After Fix

After clearing cache, you should see:
- ✅ No "client-side exception" errors
- ✅ Tools load and work correctly
- ✅ Console shows no hydration errors
- ✅ JSON-LD scripts are injected properly

## If Issue Persists

1. **Check Vercel Deployment:**
   - Verify the latest commit is deployed
   - Check deployment logs for errors
   - Ensure build completed successfully

2. **Check Environment Variables:**
   - Verify `NEXT_PUBLIC_SITE_URL` is set correctly in Vercel
   - Should be: `https://tinitools.com`

3. **Check Browser Console:**
   - Open DevTools on mobile (Chrome → Settings → Developer tools)
   - Check for any JavaScript errors
   - Look for hydration mismatch warnings

4. **Test in Incognito:**
   - Open Chrome in Incognito mode
   - Visit tinitools.com
   - This bypasses all cache

## Quick Test

To verify the fix is deployed:
1. Open Chrome DevTools
2. Go to **Console** tab
3. Type: `window.__NEXT_DATA__`
4. Check the `buildId` - it should match your latest deployment

## Contact

If the issue persists after all these steps, check:
- Vercel deployment logs
- Browser console errors
- Network tab for failed requests

