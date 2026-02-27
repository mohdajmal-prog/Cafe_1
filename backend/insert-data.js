const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function runFix() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    console.log('📝 Inserting sample menu items...');
    const menuItems = [
      { name: 'Espresso', description: 'Strong black coffee', price: 2.50, category: 'Coffee', available: true },
      { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 3.50, category: 'Coffee', available: true },
      { name: 'Latte', description: 'Espresso with steamed milk', price: 4.00, category: 'Coffee', available: true },
      { name: 'Americano', description: 'Espresso with hot water', price: 3.00, category: 'Coffee', available: true },
      { name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 4.50, category: 'Coffee', available: true },
      { name: 'Croissant', description: 'Buttery French pastry', price: 3.00, category: 'Pastry', available: true },
      { name: 'Muffin', description: 'Blueberry muffin', price: 2.50, category: 'Pastry', available: true },
      { name: 'Bagel', description: 'Fresh baked bagel', price: 2.00, category: 'Pastry', available: true },
      { name: 'Danish', description: 'Sweet pastry', price: 3.50, category: 'Pastry', available: true },
      { name: 'Cookie', description: 'Chocolate chip cookie', price: 1.50, category: 'Pastry', available: true }
    ];

    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItems);
    
    if (error) {
      console.log('Menu items insert result:', error.message);
    } else {
      console.log('✅ Menu items inserted successfully!');
    }

    // Insert app settings
    console.log('⚙️ Setting up app settings...');
    const { error: settingsError } = await supabase
      .from('app_settings')
      .insert({ 
        key: 'pause_state', 
        value: { is_app_paused: false, pause_reason: '' } 
      });

    if (settingsError) {
      console.log('Settings result:', settingsError.message);
    } else {
      console.log('✅ App settings inserted!');
    }

    console.log('✅ Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runFix();