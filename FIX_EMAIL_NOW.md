# 🚨 URGENT: Fix "Requested path is invalid" Error

## The Problem You're Seeing

```
{"error":"Requested path is invalid"}
```

This error appears when clicking the email verification link.

---

## ✅ THE FIX (5 Minutes)

### Step 1: Open Supabase Dashboard
Go to: **https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez**

### Step 2: Navigate to URL Configuration
Click: **Authentication** (left sidebar) → **URL Configuration**

### Step 3: Add Redirect URLs

Find the section labeled: **"Redirect URLs"**

Add these URLs (one per line, click "Add URL" for each):

```
http://localhost:3000/auth/callback
https://usafirewood.vercel.app/auth/callback
```

If you have a custom domain, also add:
```
https://yourdomain.com/auth/callback
```

### Step 4: Set Site URL

Find: **"Site URL"**

Set it to your production URL:
```
https://usafirewood.vercel.app
```

(Or your custom domain if you have one)

### Step 5: Save Changes

1. Click the **"Save"** button at the bottom
2. Wait 1-2 minutes for changes to propagate

---

## ✅ Test It Works

1. Register a new account at your site
2. Check your email for verification link
3. Click the verification link
4. Should now redirect successfully! ✨

---

## Why This Happens

Supabase **blocks** any redirect URLs that aren't whitelisted for security. 

Your email verification links contain:
```
?redirect_to=http://localhost:3000/auth/callback
```

Until you whitelist this URL in Supabase, it will reject the verification.

---

## Visual Guide

```
Supabase Dashboard
  └── Authentication
       └── URL Configuration
            ├── Site URL: https://usafirewood.vercel.app
            └── Redirect URLs:
                 ├── http://localhost:3000/auth/callback
                 └── https://usafirewood.vercel.app/auth/callback
```

---

## Still Not Working?

1. **Double-check spelling** - URLs must be EXACT
2. **Check protocol** - `http://` vs `https://`
3. **Wait 2 minutes** - Changes take time to propagate
4. **Clear cache** - Ctrl+Shift+Delete in browser
5. **Try incognito mode** - To rule out caching issues

---

## Quick Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Opened project: pnqgzqzznesgamlwwcez
- [ ] Went to Authentication → URL Configuration
- [ ] Added `http://localhost:3000/auth/callback` to Redirect URLs
- [ ] Added production URL to Redirect URLs
- [ ] Set Site URL to production domain
- [ ] Clicked "Save"
- [ ] Waited 2 minutes
- [ ] Tested signup + verification

---

## After This Works

Once email verification works, you should also add the reset password URL:

```
http://localhost:3000/auth/reset-password
https://usafirewood.vercel.app/auth/reset-password
```

This ensures forgot password emails work too!

---

**Need more help?** Check `EMAIL_VERIFICATION_FIX.md` for detailed troubleshooting.
