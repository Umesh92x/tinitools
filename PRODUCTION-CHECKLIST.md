# Production Deployment Checklist

## Environment Setup
- [ ] Create `.env.local` file with development variables
- [ ] Create `.env.production` file with the following variables:
  ```
  NEXT_PUBLIC_SITE_URL=https://your-domain.com
  NEXT_PUBLIC_GA_ID=your-google-analytics-id
  ```

## Pre-deployment Tasks
1. Build and Test
   - [ ] Run `npm run build` to verify production build
   - [ ] Test the production build locally with `npm run start`
   - [ ] Fix any console errors or warnings
   - [ ] Test all tools in production mode
   - [ ] Verify all pages load correctly
   - [ ] Check mobile responsiveness

2. Performance
   - [ ] Run Lighthouse audit
   - [ ] Optimize images
   - [ ] Verify lazy loading works
   - [ ] Check bundle sizes
   - [ ] Test load times

3. SEO
   - [ ] Verify meta tags on all pages
   - [ ] Check robots.txt configuration
   - [ ] Validate sitemap.xml
   - [ ] Test social media cards
   - [ ] Verify canonical URLs

4. Security
   - [ ] Security headers are configured (in next.config.mjs)
   - [ ] CSP headers are set up
   - [ ] Sensitive data is not exposed
   - [ ] API endpoints are protected
   - [ ] Rate limiting is implemented where needed

## Post-Domain Tasks
Once you have your domain:

1. DNS Setup
   - [ ] Configure A records
   - [ ] Set up CNAME records if needed
   - [ ] Enable HTTPS/SSL
   - [ ] Update NEXT_PUBLIC_SITE_URL

2. Analytics and Monitoring
   - [ ] Set up Google Analytics
   - [ ] Add Google Search Console
   - [ ] Configure error monitoring
   - [ ] Set up uptime monitoring

3. Final Checks
   - [ ] Test all features with production domain
   - [ ] Verify SSL certificate
   - [ ] Check all external links
   - [ ] Test contact forms if any
   - [ ] Verify API integrations

## Regular Maintenance
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Update dependencies
- [ ] Backup data
- [ ] Review security headers
- [ ] Test performance
- [ ] Update content 