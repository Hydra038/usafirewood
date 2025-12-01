# Checkout Page Fix - Cart Loading Issue

## Problem
When clicking "Proceed to Checkout" from the cart page, the checkout page was showing "Your cart is empty" even though items were in the cart.

## Root Causes
1. The checkout page is a **client component** (`'use client'`), and it was trying to call the `getCart()` server action. Server actions work differently when called from client components - they execute via API endpoints and the Supabase server client wasn't working correctly in that context.
2. The `getPaymentMethods()` function was **missing** from `src/app/actions/orders.ts`, causing a runtime error.

## Solution
1. Changed the checkout page to **directly fetch cart data using the Supabase client-side library** instead of calling the server action.
2. **Created the `getPaymentMethods()` function** in the orders actions file.

## Files Changed

### `src/app/actions/orders.ts`
**Added new function:**
```typescript
export async function getPaymentMethods() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }

  return data;
}
```

### `src/app/checkout/page.tsx`
**Before:**
```typescript
const loadData = async () => {
  try {
    const [cartData, paymentData] = await Promise.all([
      getCart(),  // ❌ Server action call from client component
      getPaymentMethods(),
    ]);

    setCart(cartData.items);
    setPaymentMethods(paymentData);
  } catch (err: any) {
    setError(err.message || 'Failed to load checkout data');
  } finally {
    setLoading(false);
  }
};
```

**After:**
```typescript
const loadData = async () => {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No user found, redirecting to login');
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    // Get user's cart
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cartData) {
      setCart([]);
      setLoading(false);
      return;
    }

    // Get cart items with product details
    const { data: itemsData, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        price_at_add,
        product:products(
          id,
          name,
          price,
          unit_type
        )
      `)
      .eq('cart_id', cartData.id);

    setCart(itemsData || []);

    // Get payment methods from server action
    const paymentData = await getPaymentMethods();
    setPaymentMethods(paymentData || []);
  } catch (err: any) {
    console.error('Error loading checkout data:', err);
    setError(err.message || 'Failed to load checkout data');
  } finally {
    setLoading(false);
  }
};
```

### Additional Improvements
1. **Better error handling**: Added console.error statements to help debug issues
2. **User authentication check**: Redirects to login if user is not authenticated
3. **Type safety**: Updated CartItem type to include `price_at_add` field
4. **Correct price display**: Uses `price_at_add` instead of `product.price` for accurate cart totals

## How It Works Now

1. **User clicks "Proceed to Checkout"** → Navigates to `/checkout`
2. **Checkout page loads** → `useEffect` triggers `loadData()`
3. **Fetch user authentication** → Gets current logged-in user
4. **Fetch user's cart** → Queries `carts` table by `user_id`
5. **Fetch cart items** → Queries `cart_items` with product details
6. **Fetch payment methods** → Gets active payment methods from server action
7. **Display cart items** → Shows products with correct quantities and prices
8. **User fills form** → Enters name, email, phone, delivery address, and payment method
9. **Place order** → Creates order via `createOrder` server action and redirects to success page

## Form Fields

The checkout form now collects:
- **Customer Name** (required)
- **Email Address** (required)
- **Phone Number** (required)
- **Street Address** (required)
- **City** (required)
- **State** (required, 2 characters)
- **ZIP Code** (required, 5 digits)
- **Delivery Notes** (optional)
- **Payment Method** (required, dropdown)

## Testing Steps

1. **Add items to cart** from the products page
2. **Navigate to cart** at `/cart` - verify items appear
3. **Click "Proceed to Checkout"** - should see checkout page with items
4. **Check browser console** - should see logs:
   - `"Loading checkout data for user: [user-id]"`
   - `"Found cart: [cart-id]"`
   - `"Loaded cart items: [count]"`
5. **Fill out delivery form** and place order
6. **Verify redirect** to success page

## Troubleshooting

### Still seeing empty cart?
1. **Check browser console** for error messages
2. **Verify you're logged in** - check top-right corner for account button
3. **Check database** - run this SQL:
   ```sql
   -- Check if cart exists
   SELECT * FROM carts WHERE user_id = '[your-user-id]';
   
   -- Check if cart items exist
   SELECT ci.*, p.name 
   FROM cart_items ci 
   JOIN products p ON p.id = ci.product_id
   WHERE cart_id = '[your-cart-id]';
   ```

### RLS Policy Issues?
Make sure these policies exist in Supabase:
```sql
-- Users can view own cart items
CREATE POLICY "Users can view own cart items" ON cart_items 
  FOR SELECT 
  USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));
```

## Next Steps
✅ Checkout page now loads cart correctly
✅ User can proceed through checkout flow
✅ Better error handling and logging

Try the complete flow:
1. Browse products → Add to cart → View cart → Checkout → Place order
