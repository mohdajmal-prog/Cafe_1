require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema for phone authentication...');

    // First, let's check current schema
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'otps');

    console.log('Current OTP table columns:', columns);

    // Add phone column to otps table
    console.log('Adding phone column to otps table...');
    
    // Since we can't run DDL directly, let's use a different approach
    // We'll recreate the table with the correct schema
    
    console.log('✅ Please run the following SQL commands in your Supabase SQL editor:');
    console.log(`
-- 1. Add phone column to otps table
ALTER TABLE otps ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 2. Make email nullable
ALTER TABLE otps ALTER COLUMN email DROP NOT NULL;

-- 3. Add constraint for email or phone
ALTER TABLE otps ADD CONSTRAINT IF NOT EXISTS check_email_or_phone 
CHECK (email IS NOT NULL OR phone IS NOT NULL);

-- 4. Create index on phone
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);

-- 5. Update users table - make email nullable
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- 6. Add unique constraint to phone
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS users_phone_key UNIQUE (phone);

-- 7. Add constraint for users table
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS check_email_or_phone_users 
CHECK (email IS NOT NULL OR phone IS NOT NULL);

-- 8. Create index on users phone
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    `);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateSchema();