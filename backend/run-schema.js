const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('📄 Reading schema file...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'config', 'schema.sql'),
      'utf8'
    );

    console.log('🔧 Executing schema...');
    await client.query(schemaSQL);
    
    console.log('✅ Schema executed successfully!');
    console.log('✅ All tables created!');

    // Insert default pause state
    await client.query(`
      INSERT INTO app_settings (key, value)
      VALUES ('pause_state', '{"is_app_paused": false, "pause_reason": ""}')
      ON CONFLICT (key) DO NOTHING;
    `);

    console.log('✅ Default settings inserted!');
    console.log('\n🎉 Database initialization complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 If this fails, manually run the SQL:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy contents from: backend/config/schema.sql');
    console.log('3. Execute the SQL');
  } finally {
    await client.end();
  }
}

runSchema();
