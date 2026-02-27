const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function initDatabase() {
  console.log('🔧 Initializing database tables...');

  try {
    // Create tables using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          phone VARCHAR(20) UNIQUE,
          is_admin BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          CONSTRAINT check_email_or_phone_users CHECK (email IS NOT NULL OR phone IS NOT NULL)
        );

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

        -- Orders table
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_status VARCHAR(50) DEFAULT 'pending',
          delivery_address TEXT,
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Order items table
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          menu_item_id UUID REFERENCES menu_items(id),
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- OTP table
        CREATE TABLE IF NOT EXISTS otps (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255),
          phone VARCHAR(20),
          otp VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
        );

        -- App settings table
        CREATE TABLE IF NOT EXISTS app_settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
        CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
      `
    });

    if (error) {
      console.error('❌ Error creating tables:', error);
      console.log('\n⚠️  RPC function not available. Please run the SQL manually in Supabase SQL Editor.');
      console.log('📋 Copy the SQL from: backend/config/schema.sql');
      return;
    }

    console.log('✅ Database tables created successfully!');
    
    // Insert default app settings
    const { error: settingsError } = await supabase
      .from('app_settings')
      .upsert({ key: 'pause_state', value: { is_app_paused: false, pause_reason: '' } });

    if (settingsError) {
      console.log('⚠️  Could not insert default settings:', settingsError.message);
    }

    console.log('✅ Database initialization complete!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and run the SQL from: backend/config/schema.sql');
  }
}

initDatabase();
