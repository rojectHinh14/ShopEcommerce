-- Drop existing columns if they exist
ALTER TABLE payments DROP COLUMN IF EXISTS transaction_id;
ALTER TABLE payments DROP COLUMN IF EXISTS payment_url;

-- Add columns with correct lengths
ALTER TABLE payments ADD COLUMN transaction_id VARCHAR(1000);
ALTER TABLE payments ADD COLUMN payment_url VARCHAR(1000); 