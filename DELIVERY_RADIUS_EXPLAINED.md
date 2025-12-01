# Delivery Radius Error Explanation 📍

## The Error Message

```
"Delivery not available to 65807 (1590.5 miles away)"
```

## What This Means

### Simple Explanation
The customer tried to order firewood to **ZIP code 65807** (Springfield, Missouri), but it's **1,590.5 miles away** from your business location, which is **WAY beyond** your delivery radius!

### Your Current Settings

Based on your `.env.local` file:

```env
# Your Business Location (San Francisco, CA)
NEXT_PUBLIC_BUSINESS_LAT=37.7749
NEXT_PUBLIC_BUSINESS_LNG=-122.4194

# Maximum Delivery Distance
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50

# Delivery Fees
NEXT_PUBLIC_BASE_DELIVERY_FEE=15
NEXT_PUBLIC_PER_MILE_FEE=2
```

## The Math

### Your Business Location
- **Coordinates:** 37.7749, -122.4194
- **Location:** San Francisco, California

### Customer's ZIP Code
- **ZIP:** 65807
- **Location:** Springfield, Missouri
- **Coordinates:** ~37.2090, -93.2923

### Distance Calculation
Using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula):
```
Distance = 1,590.5 miles
```

### Delivery Limit Check
```typescript
isDeliveryAvailable(1590.5 miles) {
  maxRadius = 50 miles
  return 1590.5 <= 50  // FALSE! ❌
}
```

**Result:** Delivery NOT available because 1,590.5 miles > 50 miles

## Why This Happens

### Scenario 1: Testing From Far Away
You might be testing the system from a different location than where your actual business operates.

**Solution:** Use a ZIP code within 50 miles of San Francisco for testing:
- 94102 (San Francisco downtown) - 0 miles
- 94612 (Oakland) - ~10 miles  
- 94401 (San Mateo) - ~15 miles
- 94806 (San Pablo) - ~20 miles
- 95050 (Santa Clara) - ~40 miles

### Scenario 2: Wrong Business Location
Your business coordinates might be set incorrectly in `.env.local`.

**Solution:** Update to your actual business location.

### Scenario 3: Delivery Radius Too Small
Your 50-mile radius might be too restrictive for your business model.

**Solution:** Increase the radius if you deliver further.

## How to Fix

### Option 1: Use Local ZIP Code for Testing

If you're in **Springfield, MO (65807)** but want to test:

1. **Update `.env.local` temporarily:**
```env
# Springfield, MO coordinates
NEXT_PUBLIC_BUSINESS_LAT=37.2090
NEXT_PUBLIC_BUSINESS_LNG=-93.2923
```

2. **Restart your dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

3. **Test with nearby ZIP codes:**
- 65807 (Springfield) - 0 miles ✓
- 65802 (Springfield) - ~5 miles ✓
- 65619 (Nixa) - ~12 miles ✓

### Option 2: Increase Delivery Radius

If you actually deliver across multiple states:

1. **Update `.env.local`:**
```env
# Increase to 100 miles
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=100

# Or even larger
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=500

# Or nationwide (not recommended for firewood!)
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=3000
```

2. **Restart dev server**

### Option 3: Set Your Real Business Location

If your firewood business is in **Missouri**, not California:

1. **Find your coordinates** at [LatLong.net](https://www.latlong.net/)

2. **Update `.env.local`:**
```env
# Example: Springfield, MO
NEXT_PUBLIC_BUSINESS_LAT=37.2090
NEXT_PUBLIC_BUSINESS_LNG=-93.2923
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50
```

3. **Restart server**

## How the System Works

### Step 1: User Enters ZIP Code
```
User types: "65807"
```

### Step 2: Get Coordinates
```typescript
// API call to Zippopotam.us
fetch('https://api.zippopotam.us/us/65807')

// Returns:
{
  "places": [{
    "latitude": "37.2090",
    "longitude": "-93.2923"
  }]
}
```

### Step 3: Calculate Distance
```typescript
calculateDistance(
  37.7749,   // Your business (SF)
  -122.4194,
  37.2090,   // Customer (Springfield)
  -93.2923
)
// Result: 1590.5 miles
```

### Step 4: Check if Deliverable
```typescript
isDeliveryAvailable(1590.5) {
  maxRadius = 50  // From .env.local
  return 1590.5 <= 50  // FALSE
}
```

### Step 5: Show Error
```
"Delivery not available to 65807 (1590.5 miles away)"
```

## Delivery Fee Calculation

If the ZIP code **were** within range, here's how fees work:

### Within 10 Miles
```
Fee = $15 (base fee only)
```

### Beyond 10 Miles
```
Fee = $15 + ($2 × extra miles)

Example at 25 miles:
Fee = $15 + ($2 × 15) = $45
```

### Example Fees from San Francisco

| Destination | Distance | Fee |
|------------|----------|-----|
| Oakland (94612) | 10 mi | $15 |
| San Jose (95113) | 48 mi | $91 |
| Sacramento (95814) | 90 mi | Out of range! |

## Recommended Settings by Business Type

### Local Delivery (Urban Area)
```env
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=25
NEXT_PUBLIC_BASE_DELIVERY_FEE=10
NEXT_PUBLIC_PER_MILE_FEE=1.5
```

### Regional Delivery (Metro Area)
```env
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=75
NEXT_PUBLIC_BASE_DELIVERY_FEE=20
NEXT_PUBLIC_PER_MILE_FEE=2.5
```

### Wide Area Delivery (Multi-County)
```env
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=150
NEXT_PUBLIC_BASE_DELIVERY_FEE=30
NEXT_PUBLIC_PER_MILE_FEE=3
```

### Statewide Delivery
```env
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=300
NEXT_PUBLIC_BASE_DELIVERY_FEE=50
NEXT_PUBLIC_PER_MILE_FEE=4
```

## Testing Tips

### Test Within Range
Use these SF Bay Area ZIP codes (all within 50 miles):
```
94102 - San Francisco (0 mi)
94612 - Oakland (10 mi)
94401 - San Mateo (15 mi)
94952 - Petaluma (35 mi)
95050 - Santa Clara (40 mi)
```

### Test Out of Range
Use these to trigger the error:
```
95814 - Sacramento (90 mi) ❌
93721 - Fresno (185 mi) ❌
90001 - Los Angeles (380 mi) ❌
65807 - Springfield, MO (1,590 mi) ❌
```

## Common Questions

### Q: Why is it so far?
**A:** Your business location in `.env.local` is set to San Francisco, CA, but the ZIP code tested (65807) is in Springfield, Missouri - that's across the entire country!

### Q: Can I deliver nationwide?
**A:** Technically yes (set radius to 3000), but for firewood, that's impractical due to shipping costs and weight.

### Q: How do I change my location?
**A:** Update `NEXT_PUBLIC_BUSINESS_LAT` and `NEXT_PUBLIC_BUSINESS_LNG` in `.env.local` to your actual business coordinates.

### Q: What's a reasonable radius for firewood?
**A:** Most firewood businesses deliver within 25-75 miles. Beyond that, shipping costs exceed product value.

### Q: Can customers pick up instead?
**A:** Yes! The system supports "pickup" vs "delivery" options (though this feature needs to be implemented in the UI).

## Next Steps

1. **Determine your actual business location**
2. **Update `.env.local` with correct coordinates**
3. **Set a realistic delivery radius** (25-75 miles recommended)
4. **Restart your dev server**
5. **Test with nearby ZIP codes**

---

## Quick Fix for Testing Right Now

**If you're in Missouri and want to test immediately:**

```bash
# Edit .env.local
NEXT_PUBLIC_BUSINESS_LAT=37.2090
NEXT_PUBLIC_BUSINESS_LNG=-93.2923
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50

# Restart server
npm run dev
```

Now ZIP code 65807 will work! ✅

**If you're actually in San Francisco:**

Just use a local ZIP code like **94102** instead of 65807.
