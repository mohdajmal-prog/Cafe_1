const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const websocketService = require('../services/websocketService');

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch users and order_items separately
    const ordersWithDetails = await Promise.all(
      (data || []).map(async (order) => {
        const { data: user } = await supabase
          .from('users')
          .select('id, name, email, phone')
          .eq('id', order.user_id)
          .single();

        const { data: items } = await supabase
          .from('order_items')
          .select('id, quantity, price, menu_item_id')
          .eq('order_id', order.id);

        const itemsWithMenu = await Promise.all(
          (items || []).map(async (item) => {
            const { data: menu } = await supabase
              .from('menu_items')
              .select('id, name, category')
              .eq('id', item.menu_item_id)
              .single();
            return { ...item, menu_items: menu };
          })
        );

        return {
          ...order,
          users: user,
          order_items: itemsWithMenu
        };
      })
    );

    console.log('Orders fetched:', ordersWithDetails?.length);
    res.json(ordersWithDetails || []);
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add menu item
router.post('/menu', async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    const { data, error } = await supabase
      .from('menu_items')
      .insert({ name, description, price, category, image_url })
      .select()
      .single();

    if (error) throw error;
    
    websocketService.broadcastMenuUpdate(data);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
router.patch('/menu/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    
    websocketService.broadcastMenuUpdate(data);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const { period } = req.query;
    
    let dateFilter;
    if (period === 'week') dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    else if (period === 'month') dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    else dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('order_items')
      .select('menu_item_id, quantity, price')
      .gte('created_at', dateFilter.toISOString());

    if (error) throw error;

    // Get orders to filter by payment_status
    const { data: orders } = await supabase
      .from('orders')
      .select('id, payment_status')
      .eq('payment_status', 'paid');

    const paidOrderIds = new Set((orders || []).map(o => o.id));

    const analytics = {};
    for (const item of data || []) {
      const { data: menu } = await supabase
        .from('menu_items')
        .select('name, category')
        .eq('id', item.menu_item_id)
        .single();

      const id = item.menu_item_id;
      if (!analytics[id]) {
        analytics[id] = {
          name: menu?.name,
          category: menu?.category,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      analytics[id].totalQuantity += item.quantity;
      analytics[id].totalRevenue += item.quantity * item.price;
    }

    res.json(Object.values(analytics).sort((a, b) => b.totalRevenue - a.totalRevenue));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QR scan order lookup
router.get('/orders/:orderId/bill', async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.orderId)
      .eq('payment_status', 'paid')
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'No data found' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('name, email, phone')
      .eq('id', order.user_id)
      .single();

    const { data: items } = await supabase
      .from('order_items')
      .select('quantity, price, menu_item_id')
      .eq('order_id', order.id);

    const itemsWithMenu = await Promise.all(
      (items || []).map(async (item) => {
        const { data: menu } = await supabase
          .from('menu_items')
          .select('name, category')
          .eq('id', item.menu_item_id)
          .single();
        return { ...item, menu_items: menu };
      })
    );

    res.json({
      ...order,
      users: user,
      order_items: itemsWithMenu
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
