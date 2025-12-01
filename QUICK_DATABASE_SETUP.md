# 🚀 Quick Database Setup - 5 Minutes

Your database needs to be set up. Follow these simple steps:

---

## Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez/sql/new**

2. You should see a SQL editor screen

---

## Step 2: Run the Schema Migration

1. **Open this file:** `supabase/migrations/20240101000000_initial_schema.sql`

2. **Copy ALL the contents** (Ctrl+A, then Ctrl+C)

3. **Paste into Supabase SQL Editor**

4. **Click "RUN"** (or press F5)

5. **Wait 5-10 seconds** - You should see: ✅ Success. No rows returned

This creates:
- ✅ All 12 database tables
- ✅ Security policies (RLS)
- ✅ Database functions
- ✅ Indexes

---

## Step 3: Load Sample Data

1. **Open this file:** `supabase/migrations/20240101000001_seed_data.sql`

2. **Copy ALL the contents** (Ctrl+A, then Ctrl+C)

3. **Paste into Supabase SQL Editor** (clear previous SQL first)

4. **Click "RUN"**

5. **Wait a few seconds** - You should see: ✅ Success

This creates:
- ✅ 5 categories
- ✅ 7 payment methods
- ✅ 8 sample firewood products

---

## Step 4: Refresh Your Website

1. Go back to: **http://localhost:3000**

2. **Refresh the page** (F5)

3. **You should now see:**
   - ✅ Homepage with 8 featured products
   - ✅ No errors in console
   - ✅ Working navigation

---

## ✅ Done!

If you see products on the homepage, you're all set!

### Next Steps:

1. **Register an account:** http://localhost:3000/auth/register
   
2. **Make yourself admin:**
   - Go to Supabase Dashboard
   - Click **Table Editor** → **profiles**
   - Find your profile
   - Change `role` from `customer` to `admin`
   - Click Save

3. **Access admin dashboard:** http://localhost:3000/admin

---

## 🚨 Troubleshooting

**Still seeing errors?**

1. Check Supabase SQL Editor shows "Success" after running migrations
2. Go to **Table Editor** and verify these tables exist:
   - products
   - categories
   - payment_methods
   - profiles
3. Refresh your browser (Ctrl+Shift+R for hard refresh)
4. Check browser console for specific error messages

**Tables don't exist?**

- Make sure you copied the ENTIRE migration file
- Run the migration again (it's safe to run multiple times)
- Check for any red error messages in SQL Editor

---

## 📋 Quick Links

- **Supabase SQL Editor:** https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez/sql/new
- **Supabase Table Editor:** https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez/editor
- **Your App:** http://localhost:3000

---

**Go ahead and run those migrations now! Takes less than 2 minutes.** 🚀
