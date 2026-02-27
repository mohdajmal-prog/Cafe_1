const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupDatabase() {
  console.log('🔧 Setting up database tables...\n');

  const tables = [
    {
      name: 'users',
      check: async () => {
        const { data, error } = await supabase.from('users').select('id').limit(1);
        return !error;
      }
    },
    {
      name: 'menu_items',
      check: async () => {
        const { data, error } = await supabase.from('menu_items').select('id').limit(1);
        return !error;
      }
    },
    {
      name: 'orders',
      check: async () => {
        const { data, error } = await supabase.from('orders').select('id').limit(1);
        return !error;
      }
    },
    {
      name: 'order_items',
      check: async () => {
        const { data, error } = await supabase.from('order_items').select('id').limit(1);
        return !error;
      }
    },
    {
      name: 'otps',
      check: async () => {
        const { data, error } = await supabase.from('otps').select('id').limit(1);
        return !error;
      }
    },
    {
      name: 'app_settings',
      check: async () => {
        const { data, error } = await supabase.from('app_settings').select('key').limit(1);
        return !error;
      }
    }
  ];

  console.log('📊 Checking existing tables...\n');
  
  let missingTables = [];
  for (const table of tables) {
    const exists = await table.check();
    if (exists) {
      console.log(`✅ ${table.name} - exists`);
    } else {
      console.log(`❌ ${table.name} - missing`);
      missingTables.push(table.name);
    }
  }

  if (missingTables.length > 0) {
    console.log('\n⚠️  Missing tables detected!');
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/' + process.env.SUPABASE_URL.split('//')[1].split('.')[0]);
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Click "New Query"');
    console.log('4. Copy and paste the entire contents of: backend/config/schema.sql');
    console.log('5. Click "Run" to execute');
    console.log('\n📋 Missing tables:', missingTables.join(', '));
  } else {
    console.log('\n✅ All tables exist!');
    
    // Check and insert default pause state
    const { data: pauseState } = await supabase
      .from('app_settings')
      .select('*')
      .eq('key', 'pause_state')
      .single();

    if (!pauseState) {
      await supabase.from('app_settings').insert({
        key: 'pause_state',
        value: { is_app_paused: false, pause_reason: '' }
      });
      console.log('✅ Default pause state inserted!');
    }

    console.log('\n🎉 Database is ready!');
  }
}

setupDatabase().catch(console.error);
