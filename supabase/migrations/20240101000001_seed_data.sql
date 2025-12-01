-- =============================================
-- SEED DATA FOR FIREWOOD USA
-- =============================================
-- Run this after the initial schema migration
-- =============================================

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Hardwood', 'hardwood', 'Premium hardwood firewood - burns longer and hotter', 1, true),
('Softwood', 'softwood', 'Great for kindling and quick fires', 2, true),
('Bundles', 'bundles', 'Pre-packaged firewood bundles perfect for camping', 3, true),
('Seasoned Wood', 'seasoned', 'Aged firewood ready to burn', 4, true),
('Kiln-Dried', 'kiln-dried', 'Professionally dried for optimal burning', 5, true);

-- =============================================
-- PAYMENT METHODS
-- =============================================
INSERT INTO payment_methods (name, type, instructions, account_username, display_order, is_active) VALUES
('PayPal', 'manual', 'Send payment to our PayPal account. Include your order number in the payment notes.', 'payments@firewoodusa.com', 1, true),
('Venmo', 'manual', 'Send payment to our Venmo account. Include your order number in the payment notes.', '@firewood-usa', 2, true),
('Cash App', 'manual', 'Send payment to our Cash App account. Include your order number in the payment notes.', '$FirewoodUSA', 3, true),
('Zelle', 'manual', 'Send payment via Zelle to our email. Include your order number in the payment notes.', 'payments@firewoodusa.com', 4, true),
('Bank Transfer', 'manual', 'Wire transfer details will be provided after order placement. Please allow 1-2 business days for processing.', NULL, 5, true),
('Cash on Delivery', 'manual', 'Pay with cash when your firewood is delivered. Driver will provide receipt.', NULL, 6, true),
('Check', 'manual', 'Mail check to: Firewood USA, 123 Main St, Your City, ST 12345. Include order number on memo line.', NULL, 7, true);

-- =============================================
-- PRODUCTS - HARDWOOD
-- =============================================
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
  350.00,
  400.00,
  50,
  'OAK-CORD-001',
  'Oak',
  'cord',
  true,
  18.5,
  true,
  false,
  3500,
  '4ft x 4ft x 8ft',
  true,
  true,
  'Premium Oak Full Cord - Seasoned Firewood | Firewood USA',
  'Buy premium seasoned oak firewood by the full cord. Heat-treated, low moisture content, ready to burn. Free delivery within 50 miles.'
),
(
  'Cherry Kiln-Dried Half Cord',
  'cherry-kiln-dried-half-cord',
  'Beautiful cherry firewood that fills your home with a pleasant aroma. Kiln-dried to less than 15% moisture for optimal burning. Half cord provides about 2-3 months of regular use.',
  225.00,
  NULL,
  30,
  'CHERRY-HALF-001',
  'Cherry',
  'face_cord',
  true,
  12.0,
  true,
  true,
  1800,
  '4ft x 4ft x 16in',
  true,
  true,
  'Cherry Kiln-Dried Half Cord | Premium Firewood USA',
  'Aromatic cherry firewood, kiln-dried to perfection. Heat-treated and ready to burn immediately.'
),
(
  'Maple Seasoned Full Cord',
  'maple-seasoned-full-cord',
  'Hard maple firewood seasoned for 10+ months. Excellent heat output and minimal ash production. Great for wood stoves and fireplaces.',
  340.00,
  NULL,
  40,
  'MAPLE-CORD-001',
  'Maple',
  'cord',
  true,
  19.0,
  true,
  false,
  3400,
  '4ft x 4ft x 8ft',
  true,
  false,
  'Maple Seasoned Full Cord Firewood | Firewood USA',
  'Premium seasoned maple firewood. High heat output, low ash, perfect for home heating.'
),
(
  'Hickory Premium Face Cord',
  'hickory-premium-face-cord',
  'Hickory is known for its exceptional heat output and is perfect for smoking meats. This face cord is heat-treated and seasoned to perfection.',
  195.00,
  220.00,
  25,
  'HICKORY-FACE-001',
  'Hickory',
  'face_cord',
  true,
  17.5,
  true,
  false,
  1900,
  '4ft x 4ft x 16in',
  true,
  true,
  'Hickory Premium Face Cord | Firewood USA',
  'Premium hickory firewood - perfect for heating and smoking. Heat-treated and ready to burn.'
),
(
  'Ash Kiln-Dried Full Cord',
  'ash-kiln-dried-full-cord',
  'White ash is easy to split and lights quickly. Our kiln-dried ash has extremely low moisture content and burns cleanly with little smoke.',
  360.00,
  NULL,
  20,
  'ASH-CORD-001',
  'Ash',
  'cord',
  true,
  11.0,
  true,
  true,
  3300,
  '4ft x 4ft x 8ft',
  true,
  false,
  'Ash Kiln-Dried Full Cord | Premium Firewood',
  'Kiln-dried ash firewood with ultra-low moisture. Clean burning and easy to light.'
);

-- =============================================
-- PRODUCTS - SOFTWOOD & BUNDLES
-- =============================================
INSERT INTO products (
  name, slug, description, price, stock_quantity, sku,
  wood_type, unit_type, is_heat_treated, moisture_content, is_seasoned, is_kiln_dried,
  weight_lbs, is_active, is_featured,
  meta_title, meta_description
) VALUES
(
  'Pine Kindling Bundle',
  'pine-kindling-bundle',
  'Perfect for starting fires quickly. Each bundle contains split pine kindling that lights easily and burns hot. Great for camping or fireplace starting.',
  12.00,
  200,
  'PINE-BUNDLE-001',
  'Pine',
  'bundle',
  false,
  20.0,
  true,
  false,
  25,
  true,
  false,
  'Pine Kindling Bundle | Fire Starter Wood',
  'Premium pine kindling bundle - perfect for starting fires quickly and easily.'
),
(
  'Cedar Firewood Bundle',
  'cedar-firewood-bundle',
  'Aromatic cedar firewood bundle. Burns beautifully with a pleasant scent. Each bundle contains approximately 0.75 cubic feet of split cedar.',
  18.00,
  150,
  'CEDAR-BUNDLE-001',
  'Cedar',
  'bundle',
  true,
  15.0,
  true,
  true,
  30,
  true,
  false,
  'Cedar Firewood Bundle | Aromatic Wood',
  'Aromatic cedar firewood bundle - heat-treated and ready for your fireplace or fire pit.'
),
(
  'Mixed Hardwood Camping Bundle',
  'mixed-hardwood-camping-bundle',
  'Perfect for camping trips! Mix of oak, maple, and cherry. Each bundle is heat-treated to prevent pest spread and approved for interstate transport.',
  22.00,
  100,
  'MIXED-BUNDLE-001',
  'Mixed Hardwood',
  'bundle',
  true,
  16.0,
  true,
  true,
  35,
  true,
  true,
  'Mixed Hardwood Camping Bundle | Heat-Treated Firewood',
  'Heat-treated mixed hardwood bundle - perfect for camping anywhere in the USA.'
);

-- =============================================
-- PRODUCT IMAGES
-- =============================================
-- Using placeholder images from placehold.co (will show product names)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/8B4513/FFFFFF?text=Premium+Oak+Firewood',
  'Premium Oak Firewood Stacked',
  0,
  true
FROM products p WHERE p.slug = 'premium-oak-full-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/A0522D/FFFFFF?text=Cherry+Firewood',
  'Cherry Kiln-Dried Firewood',
  0,
  true
FROM products p WHERE p.slug = 'cherry-kiln-dried-half-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/D2691E/FFFFFF?text=Maple+Firewood',
  'Seasoned Maple Firewood',
  0,
  true
FROM products p WHERE p.slug = 'maple-seasoned-full-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/8B4513/FFFFFF?text=Hickory+Firewood',
  'Premium Hickory Firewood',
  0,
  true
FROM products p WHERE p.slug = 'hickory-premium-face-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/CD853F/FFFFFF?text=Ash+Firewood',
  'Kiln-Dried Ash Firewood',
  0,
  true
FROM products p WHERE p.slug = 'ash-kiln-dried-full-cord';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/DEB887/333333?text=Pine+Kindling',
  'Pine Kindling Bundle',
  0,
  true
FROM products p WHERE p.slug = 'pine-kindling-bundle';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/8B7355/FFFFFF?text=Cedar+Bundle',
  'Cedar Firewood Bundle',
  0,
  true
FROM products p WHERE p.slug = 'cedar-firewood-bundle';

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  'https://placehold.co/600x400/A0522D/FFFFFF?text=Mixed+Hardwood',
  'Mixed Hardwood Camping Bundle',
  0,
  true
FROM products p WHERE p.slug = 'mixed-hardwood-camping-bundle';

-- =============================================
-- PRODUCT CATEGORIES MAPPING
-- =============================================
-- Map products to categories
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
-- CREATE DEFAULT ADMIN USER
-- Note: After creating your first user via Supabase Auth,
-- run this query with the actual user ID
-- =============================================
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@firewoodusa.com';
