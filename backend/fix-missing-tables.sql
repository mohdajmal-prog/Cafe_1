-- Create missing tables for Cafe app

-- Menu items table
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

-- OTP table for authentication
CREATE TABLE IF NOT EXISTS otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- App settings table for pause state
CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Service role bypass policies (backend uses service key)
CREATE POLICY "Service role full access menu" ON menu_items FOR ALL USING (true);
CREATE POLICY "Service role full access otps" ON otps FOR ALL USING (true);
CREATE POLICY "Service role full access settings" ON app_settings FOR ALL USING (true);

-- Insert default pause state
INSERT INTO app_settings (key, value)
VALUES ('pause_state', '{"is_app_paused": false, "pause_reason": ""}')
ON CONFLICT (key) DO NOTHING;

-- Add foreign key constraint if missing
ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_menu_item_id_fkey;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_menu_item_id_fkey 
FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL;

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, available) VALUES
('Espresso', 'Strong black coffee', 2.50, 'Coffee', true),
('Cappuccino', 'Espresso with steamed milk foam', 3.50, 'Coffee', true),
('Latte', 'Espresso with steamed milk', 4.00, 'Coffee', true),
('Croissant', 'Buttery French pastry', 3.00, 'Pastry', true),
('Muffin', 'Blueberry muffin', 2.50, 'Pastry', true)
ON CONFLICT DO NOTHING;
