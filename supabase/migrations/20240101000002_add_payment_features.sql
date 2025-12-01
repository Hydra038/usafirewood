-- Add venmo_link field to payment_methods table
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS venmo_link TEXT;

-- Add payment_proof_url field to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN payment_methods.venmo_link IS 'Direct Venmo payment link (e.g., https://venmo.com/username)';
COMMENT ON COLUMN orders.payment_proof_url IS 'URL to uploaded payment proof image stored in Supabase Storage';
