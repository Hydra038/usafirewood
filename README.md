# Firewood USA - E-Commerce Platform

A complete, production-ready e-commerce website for a firewood business built with Next.js, TypeScript, Tailwind CSS, and Supabase. Features manual payment processing, admin dashboard, and comprehensive order management.

## 🚀 Features

### Customer-Facing Features
- **Product Catalog** with filtering by wood type, unit type, and categories
- **Product Details** with images, specifications (moisture content, heat-treated status, etc.)
- **Shopping Cart** (guest carts via localStorage, authenticated carts synced to database)
- **Checkout Flow** with delivery zone validation
- **Delivery Calculation** based on ZIP code and distance (Haversine formula)
- **Multiple Payment Options** (PayPal, Venmo, Cash App, etc. - configured by admin)
- **Order Tracking** - Users can view order status and payment instructions
- **User Dashboard** - Order history, profile management

### Admin Features
- **Product Management** - Create, edit, delete products, manage images
- **Order Management** - View all orders, update status, mark as paid
- **Payment Methods Configuration** - Add/edit/delete payment methods with custom instructions
- **User Management** - View users, change roles, manage accounts
- **Inventory Management** - Track stock levels
- **Delivery Management** - Assign drivers, update tracking

### Business Rules
- **Firewood-Specific Fields**: Wood type, moisture content, seasoned/kiln-dried status
- **Heat Treatment Tracking**: Required for interstate shipping
- **Pest Compliance**: Products must be heat-treated for cross-state delivery
- **Delivery Radius**: Configurable maximum delivery distance
- **Dynamic Delivery Fees**: Base fee + per-mile charges

### Technical Features
- Next.js 15 with App Router
- TypeScript for type safety
- Supabase for authentication, database, and storage
- Row Level Security (RLS) policies
- Server-side validation with Zod
- Responsive Tailwind CSS design
- SEO optimized (metadata, sitemap, robots.txt)
- Unit tests for critical business logic

---

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account ([https://supabase.com](https://supabase.com))
- Git (optional, for version control)

---

## 🛠️ Installation & Setup

### 1. Clone or Download the Project

```bash
cd firewoodUSA
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to finish setting up (this takes a few minutes)

#### Run Database Migrations

1. Go to your Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/20240101000000_initial_schema.sql`
3. Copy and paste the entire contents into the SQL Editor
4. Click "Run" to execute the migration
5. Repeat for `supabase/migrations/20240101000001_seed_data.sql`

#### Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:
   - **`product-images`** (Public bucket)
     - Policies: Allow public read access
   - **`payment-qr-codes`** (Public bucket)
     - Policies: Allow public read access
   - **`documents`** (Private bucket)

To set bucket policies:
- Select the bucket
- Go to "Policies"
- Add policy for SELECT (public read):
  ```sql
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );
  ```
- Add policy for INSERT/UPDATE/DELETE (admin only):
  ```sql
  CREATE POLICY "Admin Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
  ```

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials (found in Project Settings → API):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Firewood USA

# Business Configuration
NEXT_PUBLIC_BUSINESS_LAT=40.7128
NEXT_PUBLIC_BUSINESS_LNG=-74.0060
NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES=50
NEXT_PUBLIC_BASE_DELIVERY_FEE=15
NEXT_PUBLIC_PER_MILE_FEE=2

# Admin Configuration
ADMIN_EMAIL=admin@firewoodusa.com
```

**Important**: Replace `NEXT_PUBLIC_BUSINESS_LAT` and `NEXT_PUBLIC_BUSINESS_LNG` with your actual business coordinates.

### 5. Create Your First Admin User

1. Sign up on your website or use Supabase Authentication
2. After creating the account, get the user's ID from Supabase Dashboard → Authentication → Users
3. Run this SQL in Supabase SQL Editor:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Customization

### Update Product Images

1. Upload images to Supabase Storage → `product-images` bucket
2. Update the `product_images` table with the correct URLs
3. Or use the admin dashboard (once built) to upload images

### Configure Payment Methods

1. Log in as admin
2. Go to `/admin/payment-methods`
3. Add your payment methods (PayPal, Venmo, etc.)
4. Upload QR codes if needed
5. Set instructions for each method

### Adjust Delivery Settings

Edit `.env.local`:
- `NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES` - Maximum delivery distance
- `NEXT_PUBLIC_BASE_DELIVERY_FEE` - Flat delivery fee
- `NEXT_PUBLIC_PER_MILE_FEE` - Additional fee per mile beyond 10 miles

---

## 📚 Project Structure

```
firewoodUSA/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (storefront)/      # Customer-facing pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── dashboard/         # User dashboard
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── layout/           # Navbar, Footer
│   │   ├── products/         # Product cards, grids
│   │   ├── admin/            # Admin-specific components
│   │   └── ui/               # General UI components
│   ├── lib/                   # Utility functions
│   │   ├── supabase/         # Supabase clients
│   │   ├── utils/            # Helper functions
│   │   └── validations/      # Zod schemas
│   └── types/                 # TypeScript type definitions
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── tests/                     # Unit and integration tests
```

---

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (same as `.env.local`)
5. Deploy

### Environment Variables for Production

Make sure to set all environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)
- All business configuration variables

---

## 🔒 Security Notes

### Row Level Security (RLS)

All database tables have RLS policies enabled. Users can only:
- View their own orders
- Update their own profile
- Admins can manage all resources

### Service Role Key

**⚠️ NEVER expose your service role key in client-side code!**
- Only use it in server-side code
- Never commit it to version control
- Use environment variables

### Authentication

- Powered by Supabase Auth
- Email/password and magic link supported
- Add social providers in Supabase Dashboard → Authentication → Providers

---

## 🛡️ Pest Compliance

This application enforces firewood pest regulations:
- Products must be marked as `heat_treated` for interstate shipping
- Interstate shipping is disabled for non-heat-treated wood
- Compliance notice shown during checkout

---

## 📖 API Documentation

### Server Actions

All data mutations use Next.js Server Actions located in:
- `src/app/actions/` - Product, cart, order, and admin actions

### Key Actions

**Products**
- `getProducts()` - Fetch all active products
- `getProductBySlug(slug)` - Get single product
- `getProductsByCategory(categorySlug)` - Filter by category

**Cart**
- `addToCart(productId, quantity)` - Add item to cart
- `updateCartItem(itemId, quantity)` - Update quantity
- `removeFromCart(itemId)` - Remove item

**Orders**
- `createOrder(orderData)` - Place new order
- `getUserOrders()` - Get user's orders
- `updateOrderStatus(orderId, status)` - Admin: update order

**Admin**
- `createProduct(data)` - Create product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product
- `updatePaymentMethod(id, data)` - Manage payment methods

---

## 🎯 Roadmap

### Current Features
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Checkout flow
- ✅ Manual payment processing
- ✅ Admin dashboard
- ✅ Order management
- ✅ User dashboard

### Future Enhancements
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Customer reviews and ratings
- [ ] Loyalty program
- [ ] Referral system
- [ ] Real-time inventory sync
- [ ] Driver mobile app

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check that your `.env.local` file has correct credentials
- Verify Supabase project is running
- Check network/firewall settings

### "Permission denied" errors
- Verify RLS policies are set up correctly
- Check user role in `profiles` table
- Ensure you're authenticated

### Images not loading
- Verify Storage buckets are created
- Check bucket policies allow public read
- Ensure image URLs are correct

### Delivery calculation not working
- Implement a geocoding API (Google Maps, Mapbox)
- Update `getCoordinatesFromZip()` in `src/lib/utils/delivery.ts`

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🤝 Support

For support, email support@firewoodusa.com or open an issue in the repository.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the styling system
- Vercel for hosting platform

---

**Built with ❤️ for Firewood USA**
