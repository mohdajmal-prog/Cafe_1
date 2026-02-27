const supabase = require('./config/supabase');

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema...');

    // Add phone column to otps table if it doesn't exist
    const { error: alterOtpsError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          -- Add phone column to otps table
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'otps' AND column_name = 'phone') THEN
            ALTER TABLE otps ADD COLUMN phone VARCHAR(20);
          END IF;
          
          -- Make email nullable in otps table
          ALTER TABLE otps ALTER COLUMN email DROP NOT NULL;
          
          -- Add constraint to ensure either email or phone is provided
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_email_or_phone') THEN
            ALTER TABLE otps ADD CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL);
          END IF;
          
          -- Create index on phone column
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_otps_phone') THEN
            CREATE INDEX idx_otps_phone ON otps(phone);
          END IF;
        END $$;
      `
    });

    if (alterOtpsError) {
      console.error('❌ Error updating otps table:', alterOtpsError);
    } else {
      console.log('✅ OTPs table updated successfully');
    }

    // Update users table
    const { error: alterUsersError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          -- Make email nullable in users table
          ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
          
          -- Add unique constraint to phone if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_phone_key') THEN
            ALTER TABLE users ADD CONSTRAINT users_phone_key UNIQUE (phone);
          END IF;
          
          -- Add constraint to ensure either email or phone is provided
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_email_or_phone_users') THEN
            ALTER TABLE users ADD CONSTRAINT check_email_or_phone_users CHECK (email IS NOT NULL OR phone IS NOT NULL);
          END IF;
          
          -- Create index on phone column
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone') THEN
            CREATE INDEX idx_users_phone ON users(phone);
          END IF;
        END $$;
      `
    });

    if (alterUsersError) {
      console.error('❌ Error updating users table:', alterUsersError);
    } else {
      console.log('✅ Users table updated successfully');
    }

    console.log('🎉 Schema update completed!');
  } catch (error) {
    console.error('❌ Schema update failed:', error);
  }
}

updateSchema();