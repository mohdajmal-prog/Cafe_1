const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform to match frontend format
    const items = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: parseFloat(item.price),
      category: item.category || 'Other',
      image: item.image_url || 'https://via.placeholder.com/150',
      rating: 4.5,
      reviews: 0,
      time: '5 min',
      discount: 0,
      available: item.available
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Menu error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
