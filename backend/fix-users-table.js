require('dotenv').config();
const supabase = require('./config/supabase');

async function fixUsersTable() {
  try {
    console.log('🔧 Fixing users table schema...');
    
    // Execute SQL to make email nullable in users table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE users ALTER COLUMN email DROP NOT NULL;'
    });
    
    if (error) {
      console.error('❌ Error:', error);
      console.log('\n📝 Please run this SQL command manually in Supabase SQL Editor:');
      console.log('ALTER TABLE users ALTER COLUMN email DROP NOT NULL;');
    } else {
      console.log('✅ Users table updated successfully!');
    }
    
  } catch (error) {
    console.error('❌ Failed:', error);
    console.log('\n📝 Please run this SQL command manually in Supabase SQL Editor:');
    console.log('ALTER TABLE users ALTER COLUMN email DROP NOT NULL;');
  }
}

fixUsersTable();