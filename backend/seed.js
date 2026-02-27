require('dotenv').config();
const supabase = require('./config/supabase');

async function seedData() {
  console.log('🌱 Seeding database...\n');

  // Sample menu items
  const menuItems = [
    { name: 'Tea', description: 'Refreshing hot tea with aromatic flavors', price: 15, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', available: true },
    { name: 'Coffee', description: 'Rich and bold brewed coffee', price: 20, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', available: true },
    { name: 'Milk', description: 'Fresh cold milk, pure and wholesome', price: 20, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop', available: true },
    { name: 'Paneer Puffs', description: 'Crispy puffs filled with spiced paneer', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', available: true },
    { name: 'Samosa', description: 'Golden fried pastry with potato filling', price: 13, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', available: true },
    { name: 'Cutlet', description: 'Spicy vegetable cutlet, crispy and delicious', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop', available: true },
    { name: 'Donut', description: 'Sweet glazed donut, soft and fluffy', price: 35, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', available: true },
    { name: 'Brownie', description: 'Rich chocolate brownie, fudgy and decadent', price: 40, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=400&fit=crop', available: true },
    { name: 'Chocolate Cake', description: 'Moist chocolate cake with rich frosting', price: 150, category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', available: true }
  ];

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select();

    if (error) throw error;

    console.log(`✅ Added ${data.length} menu items`);
    console.log('\n📋 Menu Items:');
    data.forEach(item => {
      console.log(`  - ${item.name}: $${item.price}`);
    });

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
}

seedData();
