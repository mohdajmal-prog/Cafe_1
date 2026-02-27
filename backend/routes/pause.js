const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get pause state
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('key', 'pause_state')
      .maybeSingle();

    if (error) {
      console.error('Pause state error:', error);
      return res.json({
        is_app_paused: false,
        pause_reason: '',
        paused_at: null,
        resumed_at: null
      });
    }

    if (!data) {
      return res.json({
        is_app_paused: false,
        pause_reason: '',
        paused_at: null,
        resumed_at: null
      });
    }

    res.json(data.value);
  } catch (error) {
    console.error('Pause state error:', error);
    res.json({
      is_app_paused: false,
      pause_reason: '',
      paused_at: null,
      resumed_at: null
    });
  }
});

// Set pause state
router.put('/', async (req, res) => {
  try {
    const { is_app_paused, pause_reason } = req.body;

    const value = {
      is_app_paused,
      pause_reason: pause_reason || '',
      paused_at: is_app_paused ? new Date().toISOString() : null,
      resumed_at: !is_app_paused ? new Date().toISOString() : null,
      admin_id: req.user.id
    };

    const { data, error } = await supabase
      .from('app_settings')
      .upsert({
        key: 'pause_state',
        value
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
