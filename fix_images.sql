-- =============================================
-- UPDATE PRODUCT IMAGES TO USE WORKING PLACEHOLDERS
-- =============================================
-- Run this in Supabase SQL Editor to fix the images
-- =============================================

-- Delete old placeholder images
DELETE FROM product_images;

-- Insert new working placeholder images
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
