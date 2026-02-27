const API_BASE_URL = 'https://api.example.com';

export const api = {
  getMenuItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  createOrder: async (items: any[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
};
