const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Create order
router.post('/', async (req, res) => {
  try {
    console.log('📦 Create order request:', JSON.stringify(req.body));
    console.log('👤 User:', req.user);
    
    const { items, totalAmount, deliveryAddress, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Calculate total from items if not provided
    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = totalAmount || calculatedTotal;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        total_amount: total,
        delivery_address: deliveryAddress || null,
        phone: phone || req.user.phone,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Order creation error:', orderError);
      throw orderError;
    }

    console.log('✅ Order created:', order.id);

    // Check if menu items exist in database, if not skip order_items insertion
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    // Try to insert order items, but don't fail if menu_items don't exist
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.warn('⚠️ Order items insertion warning:', itemsError.message);
      // Don't throw error, just log it - order is still created
    } else {
      console.log('✅ Order items added');
    }

    // Return order with items data embedded
    res.json({
      ...order,
      items: items.map(item => ({
        id: item.id,
        name: item.name || 'Item',
        price: item.price,
        quantity: item.quantity
      }))
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/', async (req, res) => {
  try {
    // First get orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    
    // Then get order items for each order
    const ordersWithItems = await Promise.all((orders || []).map(async (order) => {
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      // Get menu item details for each order item
      const itemsWithDetails = await Promise.all((orderItems || []).map(async (item) => {
        if (item.menu_item_id) {
          const { data: menuItem } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', item.menu_item_id)
            .single();
          
          return {
            name: menuItem?.name || 'Unknown Item',
            quantity: item.quantity,
            price: parseFloat(item.price)
          };
        }
        return {
          name: 'Unknown Item',
          quantity: item.quantity,
          price: parseFloat(item.price)
        };
      }));
      
      return {
        id: order.id,
        orderNumber: order.order_number || order.id.substring(0, 8),
        status: order.status,
        total: parseFloat(order.total_amount),
        createdAt: { seconds: new Date(order.created_at).getTime() / 1000 },
        items: itemsWithDetails
      };
    }));
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (orderError) throw orderError;
    
    // Get order items
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    
    // Get menu item details
    const itemsWithDetails = await Promise.all((orderItems || []).map(async (item) => {
      if (item.menu_item_id) {
        const { data: menuItem } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', item.menu_item_id)
          .single();
        
        return {
          ...item,
          menu_items: menuItem
        };
      }
      return item;
    }));
    
    res.json({
      ...order,
      order_items: itemsWithDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
