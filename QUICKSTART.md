# 🚀 Quick Start Guide - Firewood USA

Get your e-commerce platform running in **5 minutes**!

---

## ⚡ Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free tier works)
- Code editor (VS Code recommended)

---

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, React, Supabase, Tailwind CSS, and testing libraries.

---

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new organization (if needed)
4. Create new project:
   - **Name:** firewoodusa
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
5. Wait 1-2 minutes for project setup

---

### 3. Get Supabase Credentials

In your Supabase project dashboard:

1. Click **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (under "Project API keys")
   - **anon public** key
   - **service_role** key (keep secret!)

---

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Firewood USA

# Business Location (Your coordinates - use Google Maps)
NEXT_PUBLIC_BUSINESS_LAT=37.7749
NEXT_PUBLIC_BUSINESS_LNG=-122.4194

# Delivery Settings
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50
NEXT_PUBLIC_BASE_DELIVERY_FEE=15
NEXT_PUBLIC_PER_MILE_FEE=2

# Admin Email
ADMIN_EMAIL=admin@firewoodusa.com
```

---

### 5. Run Database Migrations

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
npx supabase login

# Link project
npx supabase link --project-ref your-project-ref

# Run migrations
npx supabase db push
```

**Option B: Manual SQL Execution**

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Paste and run
4. Copy contents of `supabase/migrations/20240101000001_seed_data.sql`
5. Paste and run

---

### 6. Configure Storage Buckets

1. Go to Supabase Dashboard → **Storage**
2. Create two buckets:
   - `product-images` (public)
   - `payment-qr-codes` (public)
3. Set both to **Public** in bucket settings

---

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🎉 You're Done! Now What?

### Create Your First Admin User

1. Visit http://localhost:3000/auth/register
2. Register with your email
3. Check email and verify account
4. Open Supabase Dashboard → **Table Editor** → **profiles**
5. Find your user and change `role` from `customer` to `admin`
6. Logout and login again
7. You now have access to `/admin`!

---

### Add Your First Product

1. Login as admin
2. Go to http://localhost:3000/admin/products
3. Click "Add Product"
4. Fill in details:
   - Name: "Premium Oak Firewood"
   - Price: 350
   - Wood Type: Oak
   - Unit: cord
   - Stock: 100
   - Description: "Premium seasoned oak firewood..."
5. Upload product image
6. Save

---

### Test the Shopping Flow

1. Logout (or open incognito)
2. Browse products at http://localhost:3000/products
3. Click a product → Add to cart
4. Go to cart → Proceed to checkout
5. Enter delivery address with ZIP code
6. Watch delivery fee calculate automatically!
7. Complete order
8. Check order in admin dashboard

---

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- delivery.test.ts
```

---

## 🔧 Common Issues & Solutions

### Issue: Dependencies won't install

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Database connection error

**Solutions:**
1. Check `.env.local` has correct Supabase URL and keys
2. Verify project is not paused in Supabase dashboard
3. Check internet connection
4. Try restarting dev server

---

### Issue: Images not uploading

**Solutions:**
1. Verify storage buckets exist and are public
2. Check bucket names match exactly: `product-images`, `payment-qr-codes`
3. Verify RLS policies allow uploads

---

### Issue: Can't access admin dashboard

**Solutions:**
1. Verify user role is `admin` in profiles table
2. Logout and login again after changing role
3. Check middleware is not blocking route
4. Clear browser cookies and cache

---

### Issue: Delivery fee not calculating

**Solutions:**
1. Check environment variables are set for business coordinates
2. Verify ZIP code is valid 5-digit US ZIP
3. Check browser console for API errors
4. Try different ZIP code

---

## 📚 What's Included?

✅ **8 sample products** (Oak, Cherry, Maple, Hickory, Ash, Pine, Cedar, Mixed)
✅ **5 categories** (Hardwood, Softwood, Bundles, Seasoned, Kiln-Dried)
✅ **7 payment methods** (PayPal, Venmo, Cash App, Zelle, Bank Transfer, COD, Check)
✅ **Complete admin dashboard** (products, orders, users, payments)
✅ **User dashboard** (order history, profile)
✅ **Authentication** (login, register, password reset, magic links)
✅ **Shopping cart** with session persistence
✅ **Checkout** with delivery calculation
✅ **Responsive design** (mobile, tablet, desktop)
✅ **SEO ready** (sitemap, robots.txt, metadata)
✅ **Tests** (unit tests for critical logic)

---

## 🚢 Ready to Deploy?

See `DEPLOYMENT.md` for complete Vercel deployment instructions!

---

## 📖 Additional Resources

- **Full Documentation:** `README.md`
- **Project Summary:** `PROJECT_SUMMARY.md`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Database Schema:** `supabase/migrations/`

---

## 🆘 Need Help?

1. Check error messages in browser console
2. Check terminal for server errors
3. Review `README.md` for detailed docs
4. Check Supabase Dashboard → Logs
5. Verify all environment variables are set

---

**Happy coding! 🔥🪵**
