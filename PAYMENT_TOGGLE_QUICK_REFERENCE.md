# Payment Method Toggle - Quick Reference

## Admin Dashboard View

### Payment Methods List Page
**URL**: `/admin/payment-methods`

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Payment Methods                                         [+ Add Payment Method]  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Name      Account/Username  Status    Visible to Clients    Order   Actions   │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  Venmo     @fireusa          Active    [🟢 ON] Enabled         1      Edit     │
│  Zelle     usa@fire.com      Active    [🟢 ON] Enabled         2      Edit     │
│  Cash      -                 Inactive  [⚪ OFF] Disabled       3      Edit     │
│  PayPal    fireusa@gmail     Active    [🟢 ON] Enabled         4      Edit     │
│  Cash App  $FireUSA          Inactive  [⚪ OFF] Disabled       5      Edit     │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## Toggle Switch States

### Enabled (Green - Clients Can See)
```
┌─────────┐
│ ●───────│  OFF (gray)
└─────────┘

         ↓ Click

┌─────────┐
│───────● │  ON (green) ✓
└─────────┘
```

### Visual Representation
```css
OFF State:
- Background: Gray (#D1D5DB)
- Switch Position: Left
- Text: "Disabled"
- Client Visibility: Hidden

ON State:
- Background: Green (#16A34A)
- Switch Position: Right
- Text: "Enabled"
- Client Visibility: Visible
```

## Confirmation Dialogs

### Disabling a Payment Method
```
┌─────────────────────────────────────────────┐
│  Confirm                                    │
├─────────────────────────────────────────────┤
│                                             │
│  Disable "Venmo"? Clients will not see     │
│  this payment option.                       │
│                                             │
│          [Cancel]      [OK]                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Enabling a Payment Method
```
┌─────────────────────────────────────────────┐
│  Confirm                                    │
├─────────────────────────────────────────────┤
│                                             │
│  Enable "Cash"? Clients will see this      │
│  payment option.                            │
│                                             │
│          [Cancel]      [OK]                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Client Checkout View

### When Payment Method is ENABLED
```
Checkout Page
┌─────────────────────────────────────┐
│ Payment Method                      │
│ ┌─────────────────────────────────┐ │
│ │ Select Payment Method       ▼   │ │
│ └─────────────────────────────────┘ │
│   ├─ Venmo                          │
│   ├─ Zelle                          │
│   └─ PayPal                         │
└─────────────────────────────────────┘
```

### When Payment Method is DISABLED
```
Checkout Page
┌─────────────────────────────────────┐
│ Payment Method                      │
│ ┌─────────────────────────────────┐ │
│ │ Select Payment Method       ▼   │ │
│ └─────────────────────────────────┘ │
│   ├─ Venmo                          │
│   └─ PayPal                         │
│                                     │
│ (Zelle is hidden - disabled)        │
└─────────────────────────────────────┘
```

## Usage Flow

### Quick Enable/Disable Flow
```
1. Admin visits /admin/payment-methods
   ↓
2. Sees list of all payment methods
   ↓
3. Clicks toggle switch
   ↓
4. Confirmation dialog appears
   ↓
5. Admin clicks OK
   ↓
6. Toggle animates to new state
   ↓
7. Status badge updates
   ↓
8. Change reflects immediately in checkout
```

### Example: Disabling Venmo
```
Before:
┌──────────────────────────────────────┐
│ Venmo  [🟢 ON] Enabled         Edit │
└──────────────────────────────────────┘
Clients see: Venmo in dropdown

After:
┌──────────────────────────────────────┐
│ Venmo  [⚪ OFF] Disabled        Edit │
└──────────────────────────────────────┘
Clients see: Venmo NOT in dropdown
```

## Color Coding

### Admin Table
- **Active Badge**: Green background, dark green text
  - `bg-green-100 text-green-800`
  
- **Inactive Badge**: Gray background, dark gray text
  - `bg-gray-100 text-gray-800`

- **Toggle ON**: Bright green
  - `bg-green-600`

- **Toggle OFF**: Light gray
  - `bg-gray-300`

### Status Indicators
```
✓ Active + Enabled    = Clients can select
✓ Active + Disabled   = Hidden from clients
✗ Inactive + Disabled = Hidden from clients
✗ Inactive + Enabled  = Hidden from clients (inactive takes precedence)
```

## Keyboard & Accessibility

### Toggle Button
- **Role**: `button`
- **Label**: "Enable/Disable payment method"
- **Title**: "Click to enable/disable"
- **Keyboard**: Space or Enter to activate
- **Focus**: Blue ring on focus

### Screen Reader
```
"Toggle button, Venmo payment method, currently enabled, click to disable"
```

## Mobile Responsive

### Desktop View (>1024px)
```
Full table with all columns visible
Toggle switches in dedicated column
```

### Tablet View (768px - 1024px)
```
Table scrolls horizontally if needed
Toggle switches remain visible
```

### Mobile View (<768px)
```
Consider card-based layout
Toggle at top of each card
```

## Quick Actions Reference

| Action | Result | Client Impact |
|--------|--------|---------------|
| Toggle ON | Green switch, "Enabled" | Method appears in checkout |
| Toggle OFF | Gray switch, "Disabled" | Method hidden from checkout |
| Edit | Navigate to edit page | Full configuration options |
| Add New | Navigate to new page | Create new payment method |

## Status Combinations

| Status Badge | Toggle State | Client View |
|--------------|--------------|-------------|
| Active | Enabled | ✅ Visible |
| Active | Disabled | ❌ Hidden |
| Inactive | Enabled | ❌ Hidden |
| Inactive | Disabled | ❌ Hidden |

**Note**: Both `is_active` must be `true` AND toggle must be enabled for clients to see the method.

## Common Scenarios

### 1. New Payment Method
```
Create → Leave Toggle OFF → Test Internally → Toggle ON → Live
```

### 2. Temporary Disable
```
Issue Detected → Toggle OFF → Fix Issue → Toggle ON → Resolved
```

### 3. Seasonal Promotion
```
Promo Starts → Toggle ON → Promo Ends → Toggle OFF → Next Year
```

### 4. A/B Testing
```
Week 1: Method A ON, Method B OFF
Week 2: Method A OFF, Method B ON
Compare results
```

## Developer Notes

### Component Structure
```
PaymentMethodsPage (Server Component)
└── AdminLayout
    └── Table
        └── PaymentMethodToggle (Client Component)
            └── Toggle Switch
```

### State Management
- Client-side: Local state for UI feedback
- Server-side: Database update via server action
- Cache: Auto-revalidation after changes

### API Flow
```
Click Toggle
  → togglePaymentMethodStatus(id, status)
    → Update database
      → Revalidate cache
        → Return success
          → Update UI
```

---

**Quick Tips**:
- ✅ Always confirm before toggling
- ✅ Keep at least 2 methods enabled
- ✅ Test disabled state in incognito
- ✅ Check client view after changes
- ✅ Use for seasonal adjustments
