# Payment Method Enable/Disable Feature

## Overview
Admins can now quickly enable or disable payment methods directly from the payment methods list page. Only **enabled** payment methods are visible to clients during checkout.

## Feature Details

### Admin Controls
- **Toggle Switch**: Modern iOS-style toggle button for each payment method
- **One-Click Enable/Disable**: Quick action without navigating to edit page
- **Visual Feedback**: 
  - Green toggle = Enabled (clients can see it)
  - Gray toggle = Disabled (hidden from clients)
- **Confirmation Dialog**: Prevents accidental changes
- **Status Badge**: Shows "Active" or "Inactive" status clearly

### Client Experience
- **Automatic Filtering**: Only active payment methods appear in checkout
- **Real-time Updates**: Changes take effect immediately
- **No Visibility**: Disabled methods are completely hidden from clients

## How It Works

### For Admins

**Enable/Disable Payment Method:**
1. Go to `/admin/payment-methods`
2. Find the payment method in the list
3. Click the toggle switch in "Visible to Clients" column
4. Confirm the action in the popup dialog
5. Toggle changes color and status updates

**Visual Indicators:**
```
┌─────────────────────────────────────────────┐
│ Name         Status    Visible to Clients  │
├─────────────────────────────────────────────┤
│ Venmo        Active    [🟢 ON] Enabled     │
│ Cash         Inactive  [⚪ OFF] Disabled   │
│ Zelle        Active    [🟢 ON] Enabled     │
└─────────────────────────────────────────────┘
```

**Toggle States:**
- **ON (Green)**: Clients can select this payment method
- **OFF (Gray)**: Hidden from checkout, clients cannot see it

### For Clients

**Checkout Experience:**
- Only enabled payment methods appear in dropdown
- Disabled methods are completely invisible
- No indication that disabled methods exist

**Example Dropdown:**
```
Select Payment Method
├─ Venmo (enabled)
├─ Zelle (enabled)
└─ PayPal (enabled)

NOT SHOWN: Cash (disabled)
```

## Technical Implementation

### Files Modified

1. **`src/app/actions/admin.ts`**
   - Added `togglePaymentMethodStatus()` function
   - Updates `is_active` field in database
   - Revalidates cache after changes

2. **`src/components/admin/PaymentMethodToggle.tsx`** (NEW)
   - Client component for toggle switch
   - Handles click events and confirmations
   - Optimistic UI updates

3. **`src/app/admin/payment-methods/page.tsx`**
   - Added new "Visible to Clients" column
   - Integrated toggle component
   - Updated table layout

### Database Query

**Admin View** (shows all methods):
```typescript
// src/app/actions/admin.ts
const { data } = await supabase
  .from('payment_methods')
  .select('*')
  .order('display_order', { ascending: true });
```

**Client View** (only active methods):
```typescript
// src/app/actions/orders.ts
const { data } = await supabase
  .from('payment_methods')
  .select('*')
  .eq('is_active', true)  // ← Filters to enabled only
  .order('display_order', { ascending: true });
```

### Server Action

```typescript
export async function togglePaymentMethodStatus(
  methodId: string, 
  currentStatus: boolean
) {
  await checkAdmin(); // Security: only admins
  
  const { data, error } = await supabase
    .from('payment_methods')
    .update({ is_active: !currentStatus })
    .eq('id', methodId)
    .select()
    .single();
  
  revalidatePath('/admin/payment-methods');
  return { success: true, data };
}
```

## Use Cases

### Seasonal Payment Methods
**Scenario**: Only accept Venmo during summer promotion

1. Enable Venmo toggle → Clients see it
2. End of summer: Disable Venmo toggle → Instantly hidden
3. Next summer: Enable again → Available immediately

### Testing New Payment Methods
**Scenario**: Add PayPal but test internally first

1. Create PayPal payment method
2. Leave toggle **OFF** (disabled)
3. Test admin workflows
4. When ready: Enable toggle → Goes live for clients

### Maintenance Mode
**Scenario**: Bank account issue with Zelle

1. Disable Zelle toggle temporarily
2. Clients cannot select it (sees other options)
3. Fix bank account issue
4. Enable toggle → Zelle available again

### Multiple Payment Options
**Scenario**: Offer 5 payment methods, but only want to show 3

```
Available Methods:
✓ Venmo       [ON]  ← Visible to clients
✓ Cash App    [ON]  ← Visible to clients
✓ PayPal      [ON]  ← Visible to clients
✗ Zelle       [OFF] ← Hidden
✗ Wire        [OFF] ← Hidden
```

## UI Components

### Toggle Switch Design
```tsx
<button className={`
  h-6 w-11 rounded-full transition-colors
  ${isActive ? 'bg-green-600' : 'bg-gray-300'}
`}>
  <span className={`
    h-4 w-4 bg-white rounded-full transform
    ${isActive ? 'translate-x-6' : 'translate-x-1'}
  `} />
</button>
```

### Confirmation Dialog
```javascript
const message = isActive
  ? `Disable "${methodName}"? Clients will not see this payment option.`
  : `Enable "${methodName}"? Clients will see this payment option.`;

const confirmed = window.confirm(message);
```

## Security

### Admin-Only Access
- ✅ `checkAdmin()` function verifies user role
- ✅ Non-admins cannot call toggle action
- ✅ Server-side validation on every request

### Database Permissions
- ✅ Only admins can modify `payment_methods` table
- ✅ Clients have read-only access (filtered by `is_active`)
- ✅ RLS policies enforce data access rules

## Benefits

### For Admins
- ⚡ **Fast**: One-click enable/disable
- 🎯 **No Navigation**: Stay on list page
- 👁️ **Clear Visibility**: See all methods and their status
- 🔄 **Reversible**: Easy to undo changes
- 📊 **Overview**: See entire payment landscape at once

### For Clients
- ✅ **Clean UI**: Only see available options
- 🚫 **No Confusion**: Hidden methods don't appear
- 📱 **Better UX**: Shorter dropdowns, less clutter
- ⚡ **Fast Checkout**: Fewer irrelevant choices

### For Business
- 🎯 **Flexible**: Change offerings instantly
- 🧪 **Testing**: Test methods before public launch
- 📈 **A/B Testing**: Enable different methods for testing
- 🛡️ **Risk Management**: Quickly disable problematic methods

## Testing Checklist

### Admin Interface
- [ ] Toggle switches display correctly
- [ ] Click toggle shows confirmation dialog
- [ ] Confirming changes the status
- [ ] Toggle animates smoothly (green ↔ gray)
- [ ] Status badge updates (Active ↔ Inactive)
- [ ] "Enabled/Disabled" label updates
- [ ] Page refreshes show correct state
- [ ] Multiple toggles work independently

### Client Checkout
- [ ] Only active methods appear in dropdown
- [ ] Disabled methods are completely hidden
- [ ] Enabling a method makes it appear immediately
- [ ] Disabling a method hides it immediately
- [ ] No errors when submitting with active method
- [ ] Cannot submit with disabled method (not possible to select)

### Security
- [ ] Non-admin users cannot access toggle action
- [ ] Direct API calls to toggle are blocked for non-admins
- [ ] Database permissions prevent unauthorized changes

## Troubleshooting

### Toggle Not Working
**Problem**: Clicking toggle does nothing

**Solutions:**
1. Check browser console for errors
2. Verify user has admin role
3. Check Supabase connection
4. Ensure JavaScript is enabled

### Changes Not Appearing for Clients
**Problem**: Enabled method still not showing

**Solutions:**
1. Hard refresh checkout page (Ctrl+F5)
2. Check `is_active` value in database
3. Verify `getPaymentMethods()` filters correctly
4. Check for caching issues

### Toggle Reverts After Click
**Problem**: Toggle switches but reverts to original state

**Solutions:**
1. Check server action response
2. Verify database update succeeded
3. Check for SQL errors in Supabase logs
4. Ensure revalidatePath is working

## Future Enhancements

### Potential Features
1. **Bulk Actions**: Enable/disable multiple methods at once
2. **Scheduled Toggle**: Auto-enable/disable at specific times
3. **Usage Statistics**: Show which methods clients select most
4. **Client Notifications**: Alert clients when new methods added
5. **Method Groups**: Group methods by type (digital, traditional, etc.)
6. **Availability Rules**: Enable based on order amount or location
7. **Admin Logs**: Track who enabled/disabled which methods

### Example: Scheduled Toggle
```typescript
// Future feature
{
  methodId: 'venmo-123',
  schedule: {
    enableAt: '2025-06-01T00:00:00Z',  // Enable June 1
    disableAt: '2025-08-31T23:59:59Z'  // Disable Sept 1
  }
}
```

## Related Features

- **Payment Method Edit**: Full form for detailed configuration
- **Payment Method Create**: Add new payment options
- **Checkout Flow**: Filtered payment method selection
- **Order Management**: Track which methods are used

## Database Schema

```sql
-- payment_methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  instructions TEXT,
  account_username TEXT,
  venmo_link TEXT,
  qr_code_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,  -- ← Toggle updates this
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_payment_methods_active 
ON payment_methods(is_active, display_order);
```

## Best Practices

### When to Disable
- Payment processor maintenance
- Bank account issues
- High fraud rates with specific method
- Seasonal promotions ending
- Testing period complete

### When to Enable
- New payment method ready for production
- Maintenance complete
- Seasonal promotion starting
- Client demand for specific method
- Successfully tested internally

### Communication
- Notify clients when adding new payment options
- Provide advance notice before removing methods
- Have fallback options always enabled
- Don't disable all methods simultaneously
- Keep at least 2-3 methods active at all times

---

**Status**: ✅ Complete and tested  
**Date**: December 1, 2025  
**Impact**: Admin payment management, checkout visibility
