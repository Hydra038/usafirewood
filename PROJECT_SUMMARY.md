# 🔥 Firewood USA - Complete E-Commerce Platform

## 📋 Project Overview

A **production-ready e-commerce platform** built for a firewood business with Next.js 15, TypeScript, Tailwind CSS, and Supabase. Features admin dashboard, manual payment processing, delivery calculation, and comprehensive order management.

---

## ✅ Project Status: READY FOR DEPLOYMENT

All core features have been implemented. The application is ready for:
1. Dependency installation (`npm install`)
2. Environment configuration
3. Database setup
4. Testing
5. Production deployment to Vercel

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom wood-themed colors
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth (email/password + magic link)
- **Storage:** Supabase Storage (product images, payment QR codes)
- **Validation:** Zod schemas
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel

### Key Features
✅ **No Stripe** - Manual payment methods only (PayPal, Venmo, Cash App, etc.)
✅ **Admin Dashboard** - Full CRUD for products, orders, users, payment methods
✅ **User Dashboard** - Order history, profile management
✅ **Firewood-Specific Fields** - Wood type, moisture content, heat treatment, pest compliance
✅ **Delivery Calculation** - ZIP code-based with Haversine formula
✅ **Role-Based Access** - Customer vs Admin roles with RLS policies
✅ **Responsive Design** - Mobile-first approach
✅ **Production-Ready** - Error handling, validation, security best practices

---

## 📁 File Structure

```
firewoodUSA/
├── src/
│   ├── app/
│   │   ├── globals.css                    # Global styles + Tailwind
│   │   ├── layout.tsx                     # Root layout with metadata
│   │   ├── page.tsx                       # Homepage with featured products
│   │   ├── middleware.ts                  # Route protection middleware
│   │   ├── sitemap.ts                     # Dynamic sitemap generation
│   │   ├── robots.ts                      # SEO robots.txt
│   │   ├── actions/
│   │   │   ├── products.ts                # Product server actions
│   │   │   ├── cart.ts                    # Shopping cart actions
│   │   │   ├── orders.ts                  # Order creation & management
│   │   │   └── admin.ts                   # Admin-only actions
│   │   ├── auth/
│   │   │   ├── login/page.tsx             # Login with password or magic link
│   │   │   ├── register/page.tsx          # User registration
│   │   │   ├── forgot-password/page.tsx   # Password reset request
│   │   │   ├── reset-password/page.tsx    # Set new password
│   │   │   └── callback/route.ts          # Auth callback handler
│   │   ├── products/
│   │   │   ├── page.tsx                   # Product listing with filters
│   │   │   └── [slug]/
│   │   │       ├── page.tsx               # Product detail page
│   │   │       └── AddToCartButton.tsx    # Add to cart component
│   │   ├── cart/
│   │   │   ├── page.tsx                   # Shopping cart page
│   │   │   └── CartItem.tsx               # Cart item component
│   │   ├── checkout/
│   │   │   ├── page.tsx                   # Checkout form with delivery calc
│   │   │   └── success/[orderId]/page.tsx # Order confirmation page
│   │   ├── dashboard/                     # User dashboard
│   │   │   ├── page.tsx                   # Dashboard overview with stats
│   │   │   └── orders/
│   │   │       └── page.tsx               # Order history table
│   │   ├── admin/                         # Admin dashboard
│   │   │   ├── page.tsx                   # Admin overview & stats
│   │   │   ├── products/page.tsx          # Product management
│   │   │   ├── orders/page.tsx            # Order management
│   │   │   ├── users/page.tsx             # User management
│   │   │   └── payment-methods/page.tsx   # Payment method config
│   │   └── api/
│   │       └── health/route.ts            # Health check endpoint
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx                 # Reusable button component
│   │   │   ├── Input.tsx                  # Form input component
│   │   │   ├── Select.tsx                 # Select dropdown component
│   │   │   └── Textarea.tsx               # Textarea component
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                 # Main navigation
│   │   │   ├── Footer.tsx                 # Footer with links
│   │   │   ├── MainLayout.tsx             # Public page layout
│   │   │   ├── DashboardLayout.tsx        # User dashboard layout
│   │   │   ├── AdminLayout.tsx            # Admin layout wrapper
│   │   │   └── AdminSidebar.tsx           # Admin navigation sidebar
│   │   ├── products/
│   │   │   ├── ProductCard.tsx            # Product card with image
│   │   │   └── ProductGrid.tsx            # Responsive product grid
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                  # Client-side Supabase client
│   │   │   ├── server.ts                  # Server-side Supabase client
│   │   │   └── middleware.ts              # Supabase middleware helpers
│   │   ├── utils/
│   │   │   ├── index.ts                   # Utility functions (formatCurrency, etc.)
│   │   │   ├── delivery.ts                # Delivery fee calculation
│   │   │   └── __tests__/                 # Unit tests for utilities
│   │   └── validations/
│   │       └── schemas.ts                 # Zod validation schemas
│   └── types/
│       └── database.ts                    # Database type definitions
├── supabase/
│   └── migrations/
│       ├── 20240101000000_initial_schema.sql  # Database schema with RLS
│       └── 20240101000001_seed_data.sql       # Sample products & categories
├── public/
│   └── robots.txt                         # SEO robots.txt file
├── .env.example                           # Environment variable template
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript configuration
├── tailwind.config.ts                     # Tailwind with custom theme
├── jest.config.js                         # Jest test configuration
├── jest.setup.js                          # Jest setup file
├── next.config.js                         # Next.js configuration
├── README.md                              # Setup & usage instructions
└── DEPLOYMENT.md                          # Deployment guide
```

---

## 🗄️ Database Schema

### Tables (12 Total)

1. **profiles** - User profiles linked to auth.users
   - Fields: id, email, full_name, phone, role (customer/admin), avatar_url
   - RLS: Users can read own profile, admins can read all

2. **products** - Firewood products
   - Fields: name, description, price, compare_at_price, slug, wood_type, moisture_content, cord_fraction, unit_type, is_heat_treated, is_kiln_dried, is_epa_certified, is_pest_compliant, stock_quantity, is_active
   - RLS: Public read for active products, admin-only write

3. **product_images** - Product photos
   - Fields: product_id, image_url, alt_text, display_order, is_primary
   - Storage: Supabase Storage bucket `product-images`

4. **categories** - Product categories
   - Fields: name, slug, description
   - Examples: Hardwood, Softwood, Bundles, Seasoned, Kiln-Dried

5. **product_categories** - Many-to-many relationship

6. **payment_methods** - Admin-configurable payment options
   - Fields: name, type, payment_details (JSON), instructions, is_active
   - Examples: PayPal, Venmo, Cash App, Zelle, Bank Transfer, Cash on Delivery, Check

7. **carts** - Shopping carts
   - Fields: user_id, expires_at
   - Cleanup: Auto-delete after 30 days

8. **cart_items** - Items in cart
   - Fields: cart_id, product_id, quantity

9. **orders** - Customer orders
   - Fields: order_number (auto-generated), user_id, order_status, payment_status, payment_method_id, subtotal_amount, tax_amount, delivery_fee, total_amount, notes
   - Statuses: pending → processing → shipped → delivered → cancelled

10. **order_items** - Products in orders
    - Fields: order_id, product_id, quantity, price (locked at order time)

11. **deliveries** - Delivery information
    - Fields: order_id, delivery_address, delivery_zip, delivery_latitude, delivery_longitude, delivery_fee, delivery_status, delivery_notes, estimated_delivery_date

12. **audit_logs** - Change tracking
    - Fields: table_name, record_id, action, old_data, new_data, changed_by

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Policies:** 
  - Customers: Read own data only
  - Admins: Full access to all data
- **Triggers:** Auto-update `updated_at` timestamps
- **Functions:** Generate unique order numbers

---

## 🎨 UI Components

### Reusable Components
- **Button** - Primary, secondary, outline, ghost variants + loading state
- **Input** - Label, error, helper text, all HTML input types
- **Select** - Dropdown with label and error handling
- **Textarea** - Multi-line text input

### Layout Components
- **Navbar** - Responsive nav with auth state, cart badge
- **Footer** - Links, copyright, business info
- **MainLayout** - Public pages wrapper
- **DashboardLayout** - User dashboard with sidebar
- **AdminLayout** - Admin pages with sidebar navigation

### Product Components
- **ProductCard** - Image, price, discount badge, stock status, heat treated badge
- **ProductGrid** - Responsive grid (1/2/3/4 columns)
- **AddToCartButton** - Quantity selector + add to cart

---

## 🔐 Authentication Flow

1. **Registration** (`/auth/register`)
   - Email + password
   - Optional: Full name, phone
   - Email verification link sent
   - Auto-creates profile in `profiles` table

2. **Login** (`/auth/login`)
   - Email + password OR
   - Magic link (passwordless)
   - Redirects to `/dashboard` (customer) or `/admin` (admin)

3. **Password Reset**
   - Request reset: `/auth/forgot-password`
   - Click email link
   - Set new password: `/auth/reset-password`

4. **Session Management**
   - Middleware protects routes
   - Auto-refresh tokens
   - Server-side session validation

---

## 🛒 Shopping Flow

1. **Browse Products** (`/products`)
   - Filter by category, wood type
   - Search by name
   - Sort by price, name

2. **Product Detail** (`/products/[slug]`)
   - Full description
   - Multiple images
   - Specifications (wood type, moisture, heat treatment, etc.)
   - Stock availability
   - Add to cart with quantity

3. **Cart** (`/cart`)
   - Update quantities
   - Remove items
   - See subtotal
   - Proceed to checkout

4. **Checkout** (`/checkout`)
   - Delivery address form
   - ZIP code → auto-calculate delivery fee
   - Select payment method
   - Order review

5. **Order Confirmation** (`/checkout/success/[orderId]`)
   - Order number
   - Payment instructions
   - Order summary
   - Delivery details

6. **Dashboard** (`/dashboard/orders`)
   - Order history
   - Track status
   - View payment status

---

## 💳 Payment Methods (Manual - NO Stripe)

All payment methods are **admin-configurable** via database:

- **PayPal** - Email/account number
- **Venmo** - Username
- **Cash App** - $Cashtag
- **Zelle** - Email/phone
- **Bank Transfer** - Account & routing numbers
- **Cash on Delivery** - Pay driver
- **Check** - Mailing address

### Payment Instructions
- Shown on order confirmation page
- Include order number in payment notes
- Admin marks as "paid" manually

---

## 📦 Delivery System

### ZIP Code-Based Calculation
1. User enters delivery ZIP during checkout
2. System geocodes ZIP to coordinates (using zippopotam.us API)
3. Calculates distance using **Haversine formula**
4. Checks if within delivery radius (env: `MAX_DELIVERY_RADIUS_MILES`)
5. Calculates fee:
   - Base fee for ≤10 miles: `BASE_DELIVERY_FEE`
   - Additional fee per mile >10: `PER_MILE_FEE`

### Heat-Treated Wood Restrictions
- Interstate shipping requires heat treatment for pest compliance
- Non-heat-treated wood limited to in-state delivery

### Environment Variables
```
NEXT_PUBLIC_BUSINESS_LAT=37.7749
NEXT_PUBLIC_BUSINESS_LNG=-122.4194
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50
NEXT_PUBLIC_BASE_DELIVERY_FEE=15
NEXT_PUBLIC_PER_MILE_FEE=2
```

---

## 👨‍💼 Admin Dashboard

### Features
- **Products Management** (`/admin/products`)
  - Create, edit, delete products
  - Upload images
  - Set pricing, stock, specifications
  - Manage categories

- **Orders Management** (`/admin/orders`)
  - View all orders
  - Update order status (pending → processing → shipped → delivered)
  - Update payment status (pending → paid → failed)
  - View delivery details

- **Payment Methods** (`/admin/payment-methods`)
  - Add new payment options
  - Edit payment instructions
  - Enable/disable methods

- **Users Management** (`/admin/users`)
  - View all users
  - Change user roles (customer ↔ admin)
  - View user order history

### Access Control
- Only users with `role = 'admin'` in profiles table
- Protected by middleware + RLS policies
- Server actions verify admin role

---

## 🧪 Testing

### Unit Tests
- **Delivery utilities** - Distance calculation, fee calculation, radius validation
- **Utility functions** - formatCurrency, formatDate, slugify
- **Component tests** - ProductCard rendering, badges, stock status

### Test Coverage
```bash
npm test                    # Run all tests
npm test -- --coverage      # Coverage report
```

### Files
- `src/lib/utils/__tests__/delivery.test.ts`
- `src/lib/utils/__tests__/index.test.ts`
- `src/components/products/__tests__/ProductCard.test.tsx`

---

## 🚀 Deployment

### Prerequisites
1. Supabase project created
2. GitHub repository
3. Vercel account

### Steps
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Import to Vercel**
   - Connect GitHub repo
   - Framework: Next.js
   - Set environment variables

3. **Run Supabase Migrations**
   ```bash
   npx supabase db push
   ```

4. **Upload Sample Images**
   - Upload to Supabase Storage bucket `product-images`

5. **Create First Admin User**
   - Register via `/auth/register`
   - Update role in database:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
     ```

6. **Test Everything**
   - Browse products
   - Add to cart
   - Complete checkout
   - Admin dashboard

### Environment Variables (Production)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_BUSINESS_LAT=
NEXT_PUBLIC_BUSINESS_LNG=
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50
NEXT_PUBLIC_BASE_DELIVERY_FEE=15
NEXT_PUBLIC_PER_MILE_FEE=2
```

---

## 📝 Seed Data

### Categories (5)
1. Hardwood
2. Softwood
3. Bundles
4. Seasoned
5. Kiln-Dried

### Payment Methods (7)
1. PayPal
2. Venmo
3. Cash App
4. Zelle
5. Bank Transfer
6. Cash on Delivery
7. Check

### Sample Products (8)
1. **Premium Oak Firewood** - $350/cord, heat-treated
2. **Cherry Firewood** - $275/cord
3. **Maple Firewood** - $300/cord, heat-treated
4. **Hickory Firewood** - $325/cord
5. **Ash Firewood** - $250/cord
6. **Pine Kindling Bundle** - $25/bundle
7. **Cedar Firewood Bundle** - $35/bundle
8. **Mixed Hardwood** - $225/cord

---

## 🎯 Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in Supabase credentials

3. **Run Database Migrations**
   ```bash
   npx supabase db push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

6. **Deploy to Vercel**
   - See `DEPLOYMENT.md`

---

## 🔗 Important Links

- **Supabase Dashboard:** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🆘 Support

For issues or questions, refer to:
- `README.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide
- Database schema in `supabase/migrations/`
- Inline code comments

---

**Built with ❤️ for sustainable firewood delivery**
