# Orders Showing Zero/Empty Values - Complete Fix Guide

## 🐛 Problem Description

User reported: **"Orders are saved in database but user dashboard shows every record as zero"**

This could mean:
1. Orders exist but display $0.00 for total
2. Orders exist but show blank/null values
3. Orders exist in database but dashboard shows "No orders"
4. RLS (Row Level Security) is blocking access

---

## 🔍 Root Causes & Solutions

### **Issue 1: Delivery Fee Calculation Using Removed Variables**

**Problem:**
The `createOrder` function was still trying to calculate delivery fees using business location coordinates that were removed when location restrictions were eliminated.

**BEFORE (Broken):**
```typescript
// Calculate delivery fee
let deliveryFee = 0;
let deliveryDistance = null;

if (orderData.delivery_type === 'delivery' && orderData.delivery_latitude && orderData.delivery_longitude) {
  const businessLat = parseFloat(process.env.NEXT_PUBLIC_BUSINESS_LAT || '0');  // ❌ Doesn't exist
  const businessLng = parseFloat(process.env.NEXT_PUBLIC_BUSINESS_LNG || '0');  // ❌ Doesn't exist

  deliveryDistance = calculateDistance(businessLat, businessLng, ...);  // ❌ Would return 0
  deliveryFee = calculateDeliveryFee(deliveryDistance);  // ❌ Would return 0
}
```

**Result**: Orders were created with `delivery_fee: 0` and `total: subtotal + 0 + 0`

**AFTER (Fixed):**
```typescript
// Calculate delivery fee (flat rate)
const deliveryFee = orderData.delivery_type === 'delivery' 
  ? parseFloat(process.env.NEXT_PUBLIC_FLAT_DELIVERY_FEE || '25')  // ✅ Uses flat fee
  : 0;

const tax = 0;
const total = subtotal + deliveryFee + tax;  // ✅ Correct total
```

### **Issue 2: Custom Order Number Generator**

**Problem:**
The code was generating custom order numbers instead of using the database's `generate_order_number()` function.

**BEFORE:**
```typescript
const orderNumber = `FW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
```

**AFTER:**
```typescript
// Get next order number from database function
const { data: orderNumberData } = await supabase.rpc('generate_order_number');
const orderNumber = orderNumberData || `FW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
```

### **Issue 3: delivery_distance_miles Reference**

**Problem:**
The code was trying to insert `deliveryDistance` which was removed.

**BEFORE:**
```typescript
delivery_distance_miles: deliveryDistance,  // ❌ Variable doesn't exist
```

**AFTER:**
```typescript
delivery_distance_miles: null,  // ✅ Set to null (not used with flat fee)
```

---

## 🔧 Files Modified

### **1. src/app/actions/orders.ts**

**Changes Made:**
- ✅ Replaced distance-based delivery fee with flat fee
- ✅ Use database's `generate_order_number()` function
- ✅ Set `delivery_distance_miles` to null
- ✅ Fixed delivery fee calculation to use `NEXT_PUBLIC_FLAT_DELIVERY_FEE`

**Complete Fixed Section:**
```typescript
// Calculate totals
let subtotal = 0;
const orderItems = cart.cart_items.map((item: any) => {
  const itemTotal = item.quantity * item.price_at_add;
  subtotal += itemTotal;
  return {
    product_id: item.product_id,
    product_name: item.products.name,
    product_sku: item.products.sku,
    wood_type: item.products.wood_type,
    unit_type: item.products.unit_type,
    is_heat_treated: item.products.is_heat_treated,
    quantity: item.quantity,
    unit_price: item.price_at_add,
    total_price: itemTotal,
  };
});

// Calculate delivery fee (flat rate)
const deliveryFee = orderData.delivery_type === 'delivery' 
  ? parseFloat(process.env.NEXT_PUBLIC_FLAT_DELIVERY_FEE || '25')
  : 0;

const tax = 0;
const total = subtotal + deliveryFee + tax;

// Get next order number from database function
const { data: orderNumberData } = await supabase.rpc('generate_order_number');
const orderNumber = orderNumberData || `FW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// Create order
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert({
    order_number: orderNumber,
    user_id: user.id,
    customer_email: orderData.customer_email,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    shipping_address_line1: orderData.shipping_address_line1,
    shipping_address_line2: orderData.shipping_address_line2,
    shipping_city: orderData.shipping_city,
    shipping_state: orderData.shipping_state,
    shipping_zip: orderData.shipping_zip,
    delivery_type: orderData.delivery_type,
    delivery_distance_miles: null,  // ✅ Null for flat fee system
    delivery_latitude: orderData.delivery_latitude,
    delivery_longitude: orderData.delivery_longitude,
    subtotal,
    delivery_fee: deliveryFee,  // ✅ Flat $25 fee
    tax,
    total,  // ✅ Correct total = subtotal + $25
    payment_method_id: orderData.payment_method_id,
    customer_notes: orderData.customer_notes,
    status: 'pending',
    payment_status: 'pending',
  })
  .select()
  .single();
```

### **2. src/app/dashboard/orders/page.tsx**

**Changes Made:**
- ✅ Added debug logging to identify issues
- ✅ Added error handling
- ✅ Log user ID, error, orders data, and first order

**Debug Section Added:**
```typescript
const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    id,
    order_number,
    total,
    status,
    payment_status,
    created_at
  `)
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Debug logging
console.log('User ID:', user.id);
console.log('Orders query error:', error);
console.log('Orders data:', orders);
console.log('Number of orders:', orders?.length || 0);
if (orders && orders.length > 0) {
  console.log('First order:', JSON.stringify(orders[0], null, 2));
}
```

---

## 🧪 Testing & Verification

### **Step 1: Test Order Creation**

1. Add a product to cart (e.g., Premium Oak Full Cord - $350)
2. Go to checkout
3. Fill in delivery details
4. Select payment method
5. Submit order
6. **Check terminal logs for:**
   ```
   Creating order...
   Subtotal: 350
   Delivery fee: 25
   Total: 375
   Order number: FW-20251128-0001
   ```

### **Step 2: Check Database**

Open Supabase Table Editor:
1. Go to `orders` table
2. Find your order
3. **Verify these fields are NOT zero/null:**
   ```
   subtotal: 350.00
   delivery_fee: 25.00
   total: 375.00
   order_number: FW-20251128-0001
   status: pending
   payment_status: pending
   ```

### **Step 3: Check Dashboard Display**

1. Go to `/dashboard/orders`
2. **Check browser console (F12) for logs:**
   ```
   User ID: [your-user-id]
   Orders query error: null
   Orders data: [{...}]
   Number of orders: 1
   First order: {
     "id": "...",
     "order_number": "FW-20251128-0001",
     "total": 375,
     "status": "pending",
     "payment_status": "pending",
     "created_at": "..."
   }
   ```
3. **Verify table shows:**
   - Order Number: #FW-20251128-0001
   - Total: $375.00
   - Status: pending (yellow badge)
   - Payment: pending (yellow badge)

---

## 🔍 Debugging Checklist

If orders still show zero or don't appear:

### **A. Check Environment Variables**
```bash
# .env.local MUST have:
NEXT_PUBLIC_FLAT_DELIVERY_FEE=25
```

### **B. Check RLS Policies**

Run this in Supabase SQL Editor:
```sql
-- Check if user can see their orders
SELECT 
  id, 
  order_number, 
  total, 
  status, 
  payment_status,
  user_id
FROM orders 
WHERE user_id = auth.uid();
```

If this returns empty, RLS is blocking. Fix:
```sql
-- Ensure this policy exists:
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

### **C. Check User ID Mismatch**

Run in Supabase SQL Editor:
```sql
-- Get your auth user ID
SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- Check if orders have correct user_id
SELECT id, order_number, user_id FROM orders;
```

Make sure the `user_id` in orders matches your auth user ID.

### **D. Check Server Logs**

In your terminal running `npm run dev`, look for:
```
Creating order...
Cart items: 1
Subtotal: 350
Delivery fee: 25
Total: 375
Order created: FW-20251128-0001
```

If you see `Delivery fee: 0`, the environment variable isn't set.

### **E. Hard Refresh Browser**

After fixes:
1. Stop dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R
4. Clear browser cache if needed

---

## 📋 Expected Behavior After Fix

### **Order Creation:**
```
Product: Premium Oak Full Cord
Price: $350.00
Quantity: 1
Subtotal: $350.00
Delivery Fee: $25.00
Tax: $0.00
Total: $375.00
```

### **Dashboard Display:**
```
┌──────────────────────────────────────────────────────────┐
│ Order Number │ Date        │ Total    │ Status  │ Payment│
├──────────────┼─────────────┼──────────┼─────────┼────────┤
│ #FW-202511...│ Nov 28,2025 │ $375.00  │ pending │ pending│
└──────────────────────────────────────────────────────────┘
```

### **Order Detail Page:**
```
Order #FW-20251128-0001

Order Items:
  Premium Oak Full Cord
  Wood Type: Oak
  Quantity: 1 cord
  $350.00

Subtotal:      $350.00
Delivery Fee:  $25.00
Total:         $375.00
```

---

## 🎯 Summary of Fixes

1. ✅ **Delivery Fee:** Changed from distance-based (which was broken) to flat $25 fee
2. ✅ **Order Number:** Use database `generate_order_number()` function
3. ✅ **Distance Field:** Set to null (not needed for flat fee)
4. ✅ **Debug Logging:** Added console logs to identify issues
5. ✅ **Error Handling:** Capture and log query errors

---

## 🚀 What to Do Now

1. **Stop your dev server** (Ctrl+C)
2. **Restart**: `npm run dev`
3. **Test order creation:**
   - Add product to cart
   - Go to checkout
   - Complete order
4. **Check terminal logs** for delivery fee and total
5. **Go to dashboard** (`/dashboard/orders`)
6. **Check browser console** (F12) for debug logs
7. **Verify order shows correct total**

If you still see issues, **send me the console logs** from:
- Terminal (server-side)
- Browser console (client-side)

The fixes ensure orders are created with correct totals and displayed properly! 🎉
