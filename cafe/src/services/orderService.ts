import { Order, CartItem } from "./types";
import { api } from "./api";

export const orderService = {
  // Get all orders
  async getOrders(): Promise<Order[]> {
    try {
      return await api.getOrders();
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  },

  // Get single order
  async getOrder(id: string): Promise<Order | null> {
    try {
      const orders = await api.getOrders();
      return orders.find((o) => o.id === id) || null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  },

  // Create order
  async createOrder(items: CartItem[]): Promise<Order> {
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      
      console.log('📦 Creating order with items:', orderItems);
      return await api.createOrder(orderItems);
    } catch (error) {
      console.error('Failed to create order:', error);
      // Fallback to mock order if API fails
      return {
        id: `order_${Date.now()}`,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "pending",
        createdAt: new Date(),
        estimatedTime: Math.floor(Math.random() * 10) + 5,
        orderType: "pre-order"
      };
    }
  },

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<Order | null> {
    try {
      // This would need a backend endpoint to update status
      const orders = await api.getOrders();
      return orders.find((o) => o.id === orderId) || null;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return null;
    }
  },
};
