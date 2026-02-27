-- Add Order Number Column to Orders Table
-- Run this in Supabase SQL Editor

-- Step 1: Add order_number column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number INTEGER;

-- Step 2: Create sequence for auto-incrementing order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10000;

-- Step 3: Set default value for new orders
ALTER TABLE orders ALTER COLUMN order_number SET DEFAULT nextval('order_number_seq');

-- Step 4: Update existing orders with sequential numbers
UPDATE orders 
SET order_number = nextval('order_number_seq') 
WHERE order_number IS NULL;

-- Step 5: Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Verification query
SELECT id, order_number, user_id, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
