-- =============================================
-- FIREWOOD USA - COMPLETE DATABASE SETUP
-- =============================================
-- This file combines:
-- 1. Initial Schema (tables, indexes, RLS)
-- 2. Seed Data (categories, products, payment methods)
-- 3. Image Fix (working placeholder URLs)
-- 
-- INSTRUCTIONS:
-- 1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez/sql/new
-- 2. Copy THIS ENTIRE FILE
-- 3. Paste into Supabase SQL Editor
-- 4. Click RUN (or press Ctrl+Enter)
-- 5. Wait for "Success. No rows returned"
-- 6. Refresh your website - products will now appear!
-- =============================================

-- =============================================
-- PART 1: SCHEMA CREATION
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  
  -- Address fields
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  
  -- Coordinates for delivery calculation
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  
  -- Firewood-specific fields
  wood_type TEXT NOT NULL,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('cord', 'face_cord', 'bundle', 'rack')),
  is_heat_treated BOOLEAN DEFAULT false,
  moisture_content DECIMAL(5, 2),
  is_seasoned BOOLEAN DEFAULT false,
  is_kiln_dried BOOLEAN DEFAULT false,
  
  -- Weight/dimensions
  weight_lbs DECIMAL(10, 2),
  dimensions TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_wood_type ON products(wood_type);

-- =============================================
-- PRODUCT IMAGES TABLE
-- =============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(is_primary);

-- =============================================
-- PRODUCT CATEGORIES (Junction Table)
-- =============================================
CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

-- =============================================
-- PAYMENT METHODS TABLE
-- =============================================
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'manual',
  instructions TEXT,
  
  account_username TEXT,
  qr_code_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_active ON payment_methods(is_active);

-- =============================================
-- CARTS TABLE
-- =============================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- =============================================
-- CART ITEMS TABLE
-- =============================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_at_add DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'USA',
  
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  delivery_distance_miles DECIMAL(10, 2),
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  
  customer_notes TEXT,
  admin_notes TEXT,
  
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  product_name TEXT NOT NULL,
  product_sku TEXT,
  wood_type TEXT,
  unit_type TEXT,
  is_heat_treated BOOLEAN,
  
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- =============================================
-- DELIVERIES TABLE
-- =============================================
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_name TEXT,
  driver_phone TEXT,
  tracking_number TEXT,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deliveries_order ON deliveries(order_id);

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'FW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- CATEGORIES POLICIES
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can create categories"
  ON categories FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PRODUCTS POLICIES
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Admins can create products"
  ON products FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PRODUCT IMAGES POLICIES
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PRODUCT CATEGORIES POLICIES
CREATE POLICY "Product categories are viewable by everyone"
  ON product_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage product categories"
  ON product_categories FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PAYMENT METHODS POLICIES
CREATE POLICY "Active payment methods are viewable by everyone"
  ON payment_methods FOR SELECT USING (is_active = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can manage payment methods"
  ON payment_methods FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- CARTS POLICIES
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cart"
  ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON carts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON carts FOR DELETE USING (auth.uid() = user_id);

-- CART ITEMS POLICIES
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

-- ORDERS POLICIES
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ORDER ITEMS POLICIES
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Order items can be created with order"
  ON order_items FOR INSERT WITH CHECK (true);

-- DELIVERIES POLICIES
CREATE POLICY "Users can view own deliveries"
  ON deliveries FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage deliveries"
  ON deliveries FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- =============================================
-- PART 2: SEED DATA
-- =============================================

-- CATEGORIES
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Hardwood', 'hardwood', 'Premium hardwood firewood - burns longer and hotter', 1, true),
('Softwood', 'softwood', 'Great for kindling and quick fires', 2, true),
('Bundles', 'bundles', 'Pre-packaged firewood bundles perfect for camping', 3, true),
('Seasoned Wood', 'seasoned', 'Aged firewood ready to burn', 4, true),
('Kiln-Dried', 'kiln-dried', 'Professionally dried for optimal burning', 5, true);

-- PAYMENT METHODS
INSERT INTO payment_methods (name, type, instructions, account_username, display_order, is_active) VALUES
('PayPal', 'manual', 'Send payment to our PayPal account. Include your order number in the payment notes.', 'payments@firewoodusa.com', 1, true),
('Venmo', 'manual', 'Send payment to our Venmo account. Include your order number in the payment notes.', '@firewood-usa', 2, true),
('Cash App', 'manual', 'Send payment to our Cash App account. Include your order number in the payment notes.', '$FirewoodUSA', 3, true),
('Zelle', 'manual', 'Send payment via Zelle to our email. Include your order number in the payment notes.', 'payments@firewoodusa.com', 4, true),
('Bank Transfer', 'manual', 'Wire transfer details will be provided after order placement. Please allow 1-2 business days for processing.', NULL, 5, true),
('Cash on Delivery', 'manual', 'Pay with cash when your firewood is delivered. Driver will provide receipt.', NULL, 6, true),
('Check', 'manual', 'Mail check to: Firewood USA, 123 Main St, Your City, ST 12345. Include order number on memo line.', NULL, 7, true);

-- PRODUCTS
INSERT INTO products (
  name, slug, description, price, compare_at_price, stock_quantity, sku,
  wood_type, unit_type, is_heat_treated, moisture_content, is_seasoned, is_kiln_dried,
  weight_lbs, dimensions, is_active, is_featured,
  meta_title, meta_description
) VALUES
(
  'Premium Oak Full Cord',
  'premium-oak-full-cord',
  'Our premium oak firewood is seasoned for over 12 months, delivering long-lasting heat and minimal smoke. Perfect for heating your home through the winter. Each full cord measures 4ft x 4ft x 8ft and is ready to burn.',
  350.00, 400.00, 50, 'OAK-CORD-001',
  'Oak', 'cord', true, 18.5, true, false,
  3500, '4ft x 4ft x 8ft', true, true,
  'Premium Oak Full Cord - Seasoned Firewood | Firewood USA',
  'Buy premium seasoned oak firewood by the full cord. Heat-treated, low moisture content, ready to burn. Free delivery within 50 miles.'
),
(
  'Cherry Kiln-Dried Half Cord',
  'cherry-kiln-dried-half-cord',
  'Beautiful cherry firewood that fills your home with a pleasant aroma. Kiln-dried to less than 15% moisture for optimal burning. Half cord provides about 2-3 months of regular use.',
  225.00, NULL, 30, 'CHERRY-HALF-001',
  'Cherry', 'face_cord', true, 12.0, true, true,
  1800, '4ft x 4ft x 16in', true, true,
  'Cherry Kiln-Dried Half Cord | Premium Firewood USA',
  'Aromatic cherry firewood, kiln-dried to perfection. Heat-treated and ready to burn immediately.'
),
(
  'Maple Seasoned Full Cord',
  'maple-seasoned-full-cord',
  'Hard maple firewood seasoned for 10+ months. Excellent heat output and minimal ash production. Great for wood stoves and fireplaces.',
  340.00, NULL, 40, 'MAPLE-CORD-001',
  'Maple', 'cord', true, 19.0, true, false,
  3400, '4ft x 4ft x 8ft', true, false,
  'Maple Seasoned Full Cord Firewood | Firewood USA',
  'Premium seasoned maple firewood. High heat output, low ash, perfect for home heating.'
),
(
  'Hickory Premium Face Cord',
  'hickory-premium-face-cord',
  'Hickory is known for its exceptional heat output and is perfect for smoking meats. This face cord is heat-treated and seasoned to perfection.',
  195.00, 220.00, 25, 'HICKORY-FACE-001',
  'Hickory', 'face_cord', true, 17.5, true, false,
  1900, '4ft x 4ft x 16in', true, true,
  'Hickory Premium Face Cord | Firewood USA',
  'Premium hickory firewood - perfect for heating and smoking. Heat-treated and ready to burn.'
),
(
  'Ash Kiln-Dried Full Cord',
  'ash-kiln-dried-full-cord',
  'White ash is easy to split and lights quickly. Our kiln-dried ash has extremely low moisture content and burns cleanly with little smoke.',
  360.00, NULL, 20, 'ASH-CORD-001',
  'Ash', 'cord', true, 11.0, true, true,
  3300, '4ft x 4ft x 8ft', true, false,
  'Ash Kiln-Dried Full Cord | Premium Firewood',
  'Kiln-dried ash firewood with ultra-low moisture. Clean burning and easy to light.'
),
(
  'Pine Kindling Bundle',
  'pine-kindling-bundle',
  'Perfect for starting fires quickly. Each bundle contains split pine kindling that lights easily and burns hot. Great for camping or fireplace starting.',
  12.00, NULL, 200, 'PINE-BUNDLE-001',
  'Pine', 'bundle', false, 20.0, true, false,
  25, NULL, true, false,
  'Pine Kindling Bundle | Fire Starter Wood',
  'Premium pine kindling bundle - perfect for starting fires quickly and easily.'
),
(
  'Cedar Firewood Bundle',
  'cedar-firewood-bundle',
  'Aromatic cedar firewood bundle. Burns beautifully with a pleasant scent. Each bundle contains approximately 0.75 cubic feet of split cedar.',
  18.00, NULL, 150, 'CEDAR-BUNDLE-001',
  'Cedar', 'bundle', true, 15.0, true, true,
  30, NULL, true, false,
  'Cedar Firewood Bundle | Aromatic Wood',
  'Aromatic cedar firewood bundle - heat-treated and ready for your fireplace or fire pit.'
),
(
  'Mixed Hardwood Camping Bundle',
  'mixed-hardwood-camping-bundle',
  'Perfect for camping trips! Mix of oak, maple, and cherry. Each bundle is heat-treated to prevent pest spread and approved for interstate transport.',
  22.00, NULL, 100, 'MIXED-BUNDLE-001',
  'Mixed Hardwood', 'bundle', true, 16.0, true, true,
  35, NULL, true, true,
  'Mixed Hardwood Camping Bundle | Heat-Treated Firewood',
  'Heat-treated mixed hardwood bundle - perfect for camping anywhere in the USA.'
);

-- PRODUCT IMAGES (with working placeholder URLs)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/8B4513/FFFFFF?text=Premium+Oak+Firewood', 'Premium Oak Firewood Stacked', 0, true
FROM products p WHERE p.slug = 'premium-oak-full-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/A0522D/FFFFFF?text=Cherry+Firewood', 'Cherry Kiln-Dried Firewood', 0, true
FROM products p WHERE p.slug = 'cherry-kiln-dried-half-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/D2691E/FFFFFF?text=Maple+Firewood', 'Seasoned Maple Firewood', 0, true
FROM products p WHERE p.slug = 'maple-seasoned-full-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/8B4513/FFFFFF?text=Hickory+Firewood', 'Premium Hickory Firewood', 0, true
FROM products p WHERE p.slug = 'hickory-premium-face-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/CD853F/FFFFFF?text=Ash+Firewood', 'Kiln-Dried Ash Firewood', 0, true
FROM products p WHERE p.slug = 'ash-kiln-dried-full-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/DEB887/333333?text=Pine+Kindling', 'Pine Kindling Bundle', 0, true
FROM products p WHERE p.slug = 'pine-kindling-bundle';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/8B7355/FFFFFF?text=Cedar+Bundle', 'Cedar Firewood Bundle', 0, true
FROM products p WHERE p.slug = 'cedar-firewood-bundle';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, 'https://placehold.co/600x400/A0522D/FFFFFF?text=Mixed+Hardwood', 'Mixed Hardwood Camping Bundle', 0, true
FROM products p WHERE p.slug = 'mixed-hardwood-camping-bundle';

-- PRODUCT CATEGORIES MAPPING
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'premium-oak-full-cord' AND c.slug IN ('hardwood', 'seasoned');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'cherry-kiln-dried-half-cord' AND c.slug IN ('hardwood', 'kiln-dried');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'maple-seasoned-full-cord' AND c.slug IN ('hardwood', 'seasoned');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'hickory-premium-face-cord' AND c.slug IN ('hardwood', 'seasoned');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'ash-kiln-dried-full-cord' AND c.slug IN ('hardwood', 'kiln-dried');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'pine-kindling-bundle' AND c.slug IN ('softwood', 'bundles');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'cedar-firewood-bundle' AND c.slug IN ('softwood', 'bundles', 'kiln-dried');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c 
WHERE p.slug = 'mixed-hardwood-camping-bundle' AND c.slug IN ('hardwood', 'bundles', 'kiln-dried');

-- =============================================
-- SETUP COMPLETE!
-- =============================================
-- Next steps:
-- 1. Create your first account at /auth/register
-- 2. Promote yourself to admin by running:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- 3. Start shopping! Products are now available
-- =============================================
