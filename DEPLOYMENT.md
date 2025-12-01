# Deployment Guide - Firewood USA

## Vercel Deployment

### Prerequisites
1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. Supabase project set up and configured

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repository
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Configure Environment Variables

Add all environment variables from `.env.local` to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Firewood USA
NEXT_PUBLIC_BUSINESS_LAT=your_latitude
NEXT_PUBLIC_BUSINESS_LNG=your_longitude
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50
NEXT_PUBLIC_BASE_DELIVERY_FEE=15
NEXT_PUBLIC_PER_MILE_FEE=2
ADMIN_EMAIL=admin@firewoodusa.com
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

### Step 5: Configure Custom Domain (Optional)

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Step 6: Update Supabase URL Redirect

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Redirect URLs":
   - `https://your-app.vercel.app/**`
   - `https://your-custom-domain.com/**`

---

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Create first admin user
- [ ] Upload product images to Supabase Storage
- [ ] Test checkout flow
- [ ] Configure payment methods
- [ ] Set up email notifications (optional)
- [ ] Configure monitoring and analytics
- [ ] Test on mobile devices
- [ ] Verify SEO metadata

---

## Environment-Specific Configurations

### Production
- Use production Supabase project
- Enable Supabase RLS policies
- Set secure CORS policies
- Configure proper error tracking

### Staging
- Use separate Supabase project
- Enable debug logging
- Test with sample data

---

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Commits to `main` branch
- **Preview:** Pull requests and other branches

---

## Monitoring

### Recommended Tools
- **Vercel Analytics:** Built-in performance monitoring
- **Sentry:** Error tracking
- **Google Analytics:** User behavior
- **Supabase Dashboard:** Database monitoring

---

## Rollback

If deployment fails:
1. Go to Vercel Dashboard
2. Select "Deployments"
3. Find last working deployment
4. Click "Promote to Production"

---

## Performance Optimization

### Already Implemented
- ✅ Next.js Image optimization
- ✅ Server-side rendering
- ✅ Static page generation where possible
- ✅ Database indexes on frequently queried fields

### Recommended Additions
- [ ] CDN for static assets
- [ ] Image optimization service
- [ ] Database connection pooling
- [ ] Redis for caching

---

## Security Checklist

- [x] RLS policies enabled on all tables
- [x] Service role key in environment variables only
- [x] HTTPS enforced
- [ ] Rate limiting on API routes
- [ ] CORS configured properly
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using Supabase ORM)

---

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify all dependencies are in package.json
- Review build logs for errors

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure migrations are run

### Authentication Problems
- Verify redirect URLs in Supabase
- Check email templates
- Confirm user roles in database

---

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/support](https://supabase.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
