const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifySetup() {
  console.log('🔍 Verifying database setup...\n');

  // Check tables
  const tables = ['users', 'menu_items', 'orders', 'order_items', 'otps', 'app_settings'];
  console.log('📊 Checking tables:');
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    console.log(error ? `❌ ${table}` : `✅ ${table}`);
  }

  // Check menu items count
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('*');
  
  if (!menuError && menuItems) {
    console.log(`\n📋 Menu items: ${menuItems.length} items found`);
  }

  // Check relationship by trying to fetch orders with items
  console.log('\n🔗 Testing order_items → menu_items relationship:');
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        menu_items (*)
      )
    `)
    .limit(1);

  if (ordersError) {
    console.log('❌ Relationship error:', ordersError.message);
    console.log('\n⚠️  You need to run: backend/complete-fix.sql');
  } else {
    console.log('✅ Relationship working!');
  }

  // Check app settings
  const { data: settings } = await supabase
    .from('app_settings')
    .select('*')
    .eq('key', 'pause_state')
    .single();

  if (settings) {
    console.log('\n⚙️  App settings:', settings.value);
  }

  console.log('\n' + '='.repeat(50));
  if (!menuError && !ordersError) {
    console.log('🎉 Everything is working correctly!');
  } else {
    console.log('⚠️  Please run: backend/complete-fix.sql in Supabase');
  }
}

verifySetup().catch(console.error);
