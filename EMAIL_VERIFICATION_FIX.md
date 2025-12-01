# Email Verification Fix Guide

## Problem
Error: `"error":"Requested path is invalid"` when clicking email verification links.

## Root Cause
The redirect URL used in email verification is not whitelisted in Supabase configuration.

---

## Solution Steps

### 1. Configure Supabase Authentication URLs

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**

### 2. Add Redirect URLs

In the **Redirect URLs** section, add ALL of these:

```
http://localhost:3000/auth/callback
https://your-production-domain.vercel.app/auth/callback
https://usafirewood.com/auth/callback
```

**Note:** Replace with your actual domain names. Add one URL per line.

### 3. Configure Site URL

Set the **Site URL** to your main production domain:

```
https://usafirewood.com
```

Or if deploying to Vercel first:
```
https://your-app-name.vercel.app
```

### 4. Save Configuration

Click **Save** at the bottom of the page.

---

## Testing Email Verification

### Test Signup Flow:

1. **Register a new account** at `/auth/register`
2. **Check your email** for verification link
3. **Click the verification link** in the email
4. You should be redirected to:
   - Regular users → Home page (`/`)
   - Admin users → Admin dashboard (`/admin`)

### What Happens:

1. User clicks email verification link
2. Link contains a `code` parameter: `?code=xxxxx`
3. Browser redirects to: `/auth/callback?code=xxxxx`
4. Callback route exchanges code for session
5. Checks user role in `profiles` table
6. Redirects based on role:
   - `admin` → `/admin`
   - `user` → `/`

---

## Common Issues

### Issue: Still getting "Requested path is invalid"

**Solutions:**
- Double-check URLs are added correctly (no typos)
- Make sure you clicked **Save** in Supabase Dashboard
- Wait 1-2 minutes for changes to propagate
- Clear browser cache and try again
- Check that protocol matches exactly (http vs https)

### Issue: "Email not confirmed" error

**Solutions:**
- Check if email confirmation is required in Supabase settings
- Go to: **Authentication** → **Settings** → **Enable email confirmations**
- For testing, you can disable this temporarily

### Issue: Redirects to wrong page

**Solutions:**
- Check callback route logic in `/src/app/auth/callback/route.ts`
- Verify user role in `profiles` table matches expected value
- Check browser console for errors

---

## Development vs Production

### Local Development (localhost:3000)
```typescript
// This works automatically in development
emailRedirectTo: `${window.location.origin}/auth/callback`
// Result: http://localhost:3000/auth/callback
```

### Production (Vercel/Custom Domain)
```typescript
// Same code works in production
emailRedirectTo: `${window.location.origin}/auth/callback`
// Result: https://your-domain.com/auth/callback
```

**Important:** Both URLs must be whitelisted in Supabase!

---

## Environment Variables

Make sure your `.env.local` has correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pnqgzqzznesgamlwwcez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Quick Checklist

- [ ] Redirect URLs added to Supabase Dashboard
- [ ] Site URL configured in Supabase Dashboard
- [ ] Changes saved in Supabase Dashboard
- [ ] Waited 1-2 minutes for propagation
- [ ] Tested signup with real email
- [ ] Received verification email
- [ ] Clicked verification link
- [ ] Successfully redirected and logged in

---

## Need More Help?

1. Check Supabase logs: **Authentication** → **Logs**
2. Check browser console for errors (F12)
3. Verify callback route is working: Visit `/auth/callback` directly (should redirect)
4. Test with different email addresses
5. Try incognito/private browsing mode

---

## Production Deployment Checklist

Before deploying to production:

1. **Supabase Configuration**
   - [ ] Production domain added to Redirect URLs
   - [ ] Site URL set to production domain
   - [ ] Email templates customized (optional)

2. **Environment Variables**
   - [ ] Vercel environment variables set
   - [ ] Supabase URL correct
   - [ ] Supabase Anon Key correct

3. **DNS & Domain**
   - [ ] Custom domain pointed to Vercel
   - [ ] SSL certificate active
   - [ ] Domain added to Supabase config

4. **Testing**
   - [ ] Test signup on production
   - [ ] Test email verification on production
   - [ ] Test admin redirect on production
   - [ ] Test forgot password on production
   - [ ] Test reset password on production
