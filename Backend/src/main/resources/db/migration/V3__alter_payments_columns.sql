-- Drop existing columns if they exist
ALTER TABLE payments DROP COLUMN IF EXISTS transaction_id;
ALTER TABLE payments DROP COLUMN IF EXISTS payment_url;

-- Add columns with TEXT type
ALTER TABLE payments ADD COLUMN transaction_id TEXT;
ALTER TABLE payments ADD COLUMN payment_url TEXT; 