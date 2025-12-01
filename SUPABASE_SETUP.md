# 🚀 Supabase Database Setup Guide

Your Supabase credentials have been configured in `.env.local`! Now let's set up your database.

---

## 📋 Step 1: Run Database Migrations

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
   - Click **SQL Editor** in the left sidebar

2. **Run Migration Files in Order**

### Migration 1: Initial Schema (20240101000000_initial_schema.sql)

Click **New Query** and paste the contents of:
```
supabase/migrations/20240101000000_initial_schema.sql
```

This creates:
- ✅ 12 tables (profiles, products, product_images, categories, payment_methods, carts, cart_items, orders, order_items, deliveries, audit_logs, product_categories)
- ✅ Row Level Security (RLS) policies
- ✅ Database functions (generate_order_number)
- ✅ Triggers (update_updated_at_column)
- ✅ Indexes for performance

Click **Run** (or press F5)

### Migration 2: Seed Data (20240101000001_seed_data.sql)

Click **New Query** and paste the contents of:
```
supabase/migrations/20240101000001_seed_data.sql
```

This creates:
- ✅ 5 product categories (Hardwood, Softwood, Bundles, Seasoned, Kiln-Dried)
- ✅ 7 payment methods (PayPal, Venmo, Cash App, Zelle, Bank Transfer, COD, Check)
- ✅ 8 sample products (Oak, Cherry, Maple, Hickory, Ash, Pine, Cedar, Mixed hardwood)

Click **Run**

---

## 📦 Step 2: Create Storage Buckets

1. **Go to Storage**
   - In Supabase dashboard, click **Storage** in the left sidebar
   - Click **Create a new bucket**

2. **Create product-images bucket**
   - Name: `product-images`
   - Toggle **Public bucket** ON
   - Click **Create bucket**

3. **Set Storage Policies**

Click on the `product-images` bucket, then click **Policies** tab.

Click **New policy** and add these three policies:

**Policy 1: Allow public to view images**
```sql
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

**Policy 2: Allow authenticated users to upload**
```sql
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

**Policy 3: Allow admins to delete**
```sql
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
```

---

## 🔐 Step 3: Configure Authentication

1. **Go to Authentication Settings**
   - Click **Authentication** → **URL Configuration**

2. **Add Redirect URLs**
   - Add: `http://localhost:3001/**`
   - Add: `http://localhost:3000/**`
   - (Add your production domain later)

3. **Email Templates** (Optional)
   - Click **Email Templates** to customize registration/reset emails
   - Update with your branding

---

## 👤 Step 4: Create Your Admin Account

1. **Restart Your Dev Server** (to load new environment variables)
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Register Your Account**
   - Go to: http://localhost:3001/auth/register
   - Fill in your details:
     - Full Name: Your Name
     - Email: admin@firewoodusa.com (or your email)
     - Password: Create a strong password
   - Click **Create account**
   - Check your email for verification link
   - Click the verification link

3. **Promote Yourself to Admin**
   - Go to Supabase Dashboard → **Table Editor**
   - Click on **profiles** table
   - Find your profile row
   - Click to edit the row
   - Change `role` from `customer` to `admin`
   - Click **Save**

4. **Logout and Login Again**
   - Logout from http://localhost:3001
   - Login again with your credentials
   - You now have admin access!

---

## ✅ Step 5: Verify Setup

**Test the Homepage:**
- Visit: http://localhost:3001
- You should see 8 featured products
- Navigation bar should show "Login" or your name if logged in

**Test Admin Access:**
- Login with your admin account
- Visit: http://localhost:3001/admin
- You should see the admin dashboard with stats

**Test Product Management:**
- Go to: http://localhost:3001/admin/products
- You should see all 8 sample products
- Try editing one

**Test Shopping:**
- Go to: http://localhost:3001/products
- Click on a product
- Add to cart
- Proceed to checkout

---

## 🎉 You're Done!

Your Firewood USA e-commerce platform is now fully configured!

### What's Available:

✅ **8 Sample Products** ready to view/edit
✅ **5 Product Categories** for organization
✅ **7 Payment Methods** configured
✅ **Complete Admin Dashboard** for management
✅ **User Dashboard** for customers
✅ **Shopping Cart & Checkout** flow
✅ **Authentication** system
✅ **Delivery Calculation** based on ZIP codes

---

## 🚨 Troubleshooting

### Issue: Can't see products on homepage

**Solution:**
- Check that migrations ran successfully in SQL Editor
- Verify products exist: Go to Table Editor → products table
- Make sure `is_active` and `is_featured` are TRUE for some products

### Issue: Can't access admin dashboard

**Solution:**
- Verify your role is `admin` in profiles table
- Logout and login again after changing role
- Clear browser cache/cookies

### Issue: Images not uploading

**Solution:**
- Verify `product-images` bucket exists and is public
- Check storage policies are created correctly
- Make sure you're logged in as admin

### Issue: Delivery fee not calculating

**Solution:**
- Check `.env.local` has business coordinates set
- Verify ZIP code is valid US 5-digit ZIP
- Check browser console for errors

---

## 📚 Next Steps

1. **Update Business Location**
   - Edit `.env.local`
   - Set `NEXT_PUBLIC_BUSINESS_LAT` and `NEXT_PUBLIC_BUSINESS_LNG` to your actual coordinates
   - Use Google Maps to find your coordinates

2. **Customize Products**
   - Go to Admin → Products
   - Edit sample products with your actual inventory
   - Upload real product images

3. **Configure Payment Methods**
   - Go to Admin → Payment Methods
   - Update with your actual PayPal, Venmo, etc. account details

4. **Customize Branding**
   - Update site name in `.env.local`
   - Modify colors in `tailwind.config.ts`
   - Update content in homepage (`src/app/page.tsx`)

5. **Deploy to Production**
   - See `DEPLOYMENT.md` for Vercel deployment guide
   - Update environment variables in Vercel
   - Add production URLs to Supabase auth settings

---

## 🆘 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project README:** See `README.md` for complete documentation
- **Deployment Guide:** See `DEPLOYMENT.md`

---

**Your firewood business is ready to go online! 🔥🪵**
