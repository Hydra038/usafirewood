# Cart Issues - Quick Fix Guide

## Problem
Cart count showing 0 even after adding items. This is because there are likely orphaned cart items in the database pointing to products that don't exist.

## Solution: Run Database Reset

### Step 1: Go to Supabase
1. Open https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run the Database Setup
1. Open the file `CLEAN_RESET_DATABASE.sql` in your project
2. Copy ALL 467 lines (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click **RUN** button (or press Ctrl+Enter)

### Step 3: Verify Success
You should see: `Success. No rows returned`

This will:
- ✅ Drop all existing tables
- ✅ Create fresh tables with proper structure
- ✅ Add RLS policies
- ✅ Insert 8 products with images
- ✅ Insert 7 payment methods
- ✅ Insert 5 categories
- ✅ Create your user profile automatically

### Step 4: Test
1. Refresh your browser at http://localhost:3000
2. Go to /products
3. Click on a product
4. Add to cart
5. You should see:
   - ✅ Large green success message at the top
   - ✅ "View Cart" and "Continue Shopping" buttons
   - ✅ Button changes to "This item is already in your cart"
   - ✅ Cart count in navbar updates to 1
   - ✅ Cart page shows the product with images

## What I Fixed

### 1. ✅ Large, Visible Success Message
- Moved success message to TOP of the form (not bottom)
- Made it LARGE with green background
- Added checkmark icon
- Added "View Cart" and "Continue Shopping" buttons
- Message stays for 5 seconds (was 3)
- Smooth fade-in animation

### 2. ✅ Disable Add to Cart When Item Already in Cart
- Component now checks if product is in cart on load
- If in cart:
  - Shows blue "Already in your cart" message
  - Disables quantity selector
  - Changes button to "Go to Cart"
  - Prevents duplicate additions

### 3. ✅ Better Error Messages
- Larger error messages with red styling
- Better visibility with icons
- Login/Register buttons for auth errors

## Files Modified
1. `src/app/products/[slug]/AddToCartButton.tsx` - Complete rewrite
2. `src/app/globals.css` - Added fade-in animation
3. `src/app/actions/cart.ts` - Better logging and null product filtering
4. `src/app/cart/page.tsx` - Added debug logging
5. `src/app/products/page.tsx` - Fixed Next.js 15 async searchParams
6. `src/app/checkout/success/[orderId]/page.tsx` - Fixed Next.js 15 async params

## Next Steps
After running the database setup:
1. ✅ Register a new account (or login if you already have one)
2. ✅ Browse products at /products
3. ✅ Add items to cart - see the new success message!
4. ✅ Try adding same item again - button will be disabled
5. ✅ Go to cart - should show all items with images
6. ✅ Proceed to checkout - flat $25 delivery fee for any ZIP

## Troubleshooting

### If cart count still shows 0:
1. Check browser console for errors
2. Look at terminal logs for "Cart items fetched: X"
3. Make sure you're logged in
4. Try clearing browser cache and hard refresh (Ctrl+Shift+R)

### If products don't show:
1. Verify database setup ran successfully
2. Check Supabase Table Editor - products table should have 8 rows
3. Check product_images table should have 8 rows

### If "Already in cart" doesn't work:
1. Check browser console for errors
2. Verify RLS policies are set correctly in Supabase
3. Try logging out and back in
