-- Complete Database Fix for Cafe App
-- Run this in Supabase SQL Editor

-- Step 1: Create menu_items table if missing
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create OTP table if missing
CREATE TABLE IF NOT EXISTS otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Step 3: Create app_settings table if missing
CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Clean up orphaned order_items (items referencing non-existent menu items)
-- Set menu_item_id to NULL for orphaned records
UPDATE order_items 
SET menu_item_id = NULL 
WHERE menu_item_id IS NOT NULL 
AND menu_item_id NOT IN (SELECT id FROM menu_items);

-- Step 5: Fix foreign key relationship between order_items and menu_items
-- Drop existing constraint if it exists
ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_menu_item_id_fkey;

-- Add the foreign key constraint
ALTER TABLE order_items 
ADD CONSTRAINT order_items_menu_item_id_fkey 
FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL;

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);

-- Step 7: Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for service role
DROP POLICY IF EXISTS "Service role full access menu" ON menu_items;
DROP POLICY IF EXISTS "Service role full access otps" ON otps;
DROP POLICY IF EXISTS "Service role full access settings" ON app_settings;

CREATE POLICY "Service role full access menu" ON menu_items FOR ALL USING (true);
CREATE POLICY "Service role full access otps" ON otps FOR ALL USING (true);
CREATE POLICY "Service role full access settings" ON app_settings FOR ALL USING (true);

-- Step 9: Insert default app settings
INSERT INTO app_settings (key, value)
VALUES ('pause_state', '{"is_app_paused": false, "pause_reason": ""}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Step 10: Insert sample menu items
INSERT INTO menu_items (name, description, price, category, available) VALUES
('Espresso', 'Strong black coffee', 2.50, 'Coffee', true),
('Cappuccino', 'Espresso with steamed milk foam', 3.50, 'Coffee', true),
('Latte', 'Espresso with steamed milk', 4.00, 'Coffee', true),
('Americano', 'Espresso with hot water', 3.00, 'Coffee', true),
('Mocha', 'Espresso with chocolate and steamed milk', 4.50, 'Coffee', true),
('Croissant', 'Buttery French pastry', 3.00, 'Pastry', true),
('Muffin', 'Blueberry muffin', 2.50, 'Pastry', true),
('Bagel', 'Fresh baked bagel', 2.00, 'Pastry', true),
('Danish', 'Sweet pastry', 3.50, 'Pastry', true),
('Cookie', 'Chocolate chip cookie', 1.50, 'Pastry', true)
ON CONFLICT DO NOTHING;

-- Step 11: Refresh schema cache (Supabase specific)
NOTIFY pgrst, 'reload schema';
