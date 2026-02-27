import { MenuItem, MOCK_MENU_ITEMS, MOCK_CATEGORIES, Category } from "./types";
import { API_BASE_URL, ENDPOINTS } from "../constants/api";

export const menuService = {
  // Fetch all menu items from backend API
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.MENU}`);
      if (!res.ok) {
        console.debug('Menu API returned non-OK status, using mock data', await res.text());
        return MOCK_MENU_ITEMS;
      }

      const data = await res.json();
      if (!data || data.length === 0) {
        console.debug('No menu items returned from API, using mock data');
        return MOCK_MENU_ITEMS;
      }

      const items = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        rating: item.rating || 4.5,
        reviews: item.reviews || 0,
        time: item.time || '2 min',
        discount: item.discount || 0,
        stock: item.stock,
      }));

      return items;
    } catch (error: any) {
      console.debug('Failed to fetch menu from API, using mock data:', error?.message || error);
      return MOCK_MENU_ITEMS;
    }
  },

  // Subscribe to menu updates - no real-time client in this build.
  // Backend should expose a websocket or SSE endpoint if real-time is required.
  subscribeToMenuItems(callback: (items: MenuItem[]) => void): () => void {
    // Simple no-op subscription: poll once immediately
    this.getMenuItems().then(callback).catch(() => {});
    return () => {};
  },

  // Fetch single item via backend API
  async getMenuItem(id: string): Promise<MenuItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.MENU}/${encodeURIComponent(id)}`);
      if (!res.ok) {
        console.error('Error fetching menu item from API:', res.status);
        const item = MOCK_MENU_ITEMS.find((item) => item.id === id);
        return item || null;
      }
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        rating: data.rating || 4.5,
        reviews: data.reviews || 0,
        time: data.time || '2 min',
        discount: data.discount || 0,
        stock: data.stock,
      };
    } catch (error) {
      console.error('Failed to fetch menu item from API:', error);
      const item = MOCK_MENU_ITEMS.find((item) => item.id === id);
      return item || null;
    }
  },

  // Search items via backend API
  async searchItems(query: string): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        console.error('Menu search API error, falling back to mock');
        const filtered = MOCK_MENU_ITEMS.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
        return filtered;
      }
      const data = await res.json();
      const items = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        rating: item.rating || 4.5,
        reviews: item.reviews || 0,
        time: item.time || '2 min',
        discount: item.discount || 0,
        stock: item.stock,
      }));
      return items;
    } catch (error) {
      console.error('Failed to search menu items via API:', error);
      const filtered = MOCK_MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    }
  },

  // Get categories via backend API
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.CATEGORIES}`);
      if (!res.ok) {
        console.debug('Categories API returned non-OK, using mock');
        return MOCK_CATEGORIES;
      }
      const data = await res.json();
      if (!data || data.length === 0) {
        console.debug('No categories returned from API, using mock');
        return MOCK_CATEGORIES;
      }
      const categories = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
      }));
      return categories;
    } catch (error: any) {
      console.debug('Failed to fetch categories from API, using mock:', error?.message || error);
      return MOCK_CATEGORIES;
    }
  },

  // Get items by category via backend API
  async getItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.MENU}?category=${encodeURIComponent(category)}`);
      if (!res.ok) {
        console.error('Items by category API error, falling back to mock');
        const filtered = MOCK_MENU_ITEMS.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
        return filtered;
      }
      const data = await res.json();
      const items = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        rating: item.rating || 4.5,
        reviews: item.reviews || 0,
        time: item.time || '2 min',
        discount: item.discount || 0,
        stock: item.stock,
      }));
      return items;
    } catch (error) {
      console.error('Failed to fetch items by category from API:', error);
      const filtered = MOCK_MENU_ITEMS.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      return filtered;
    }
  },

  // Subscribe to menu updates - placeholder. Backend should provide a WS/SSE endpoint.
  subscribeToMenuUpdates(
    onUpdate: (updatedItem: MenuItem) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Polling fallback - check every 30 seconds
    const interval = setInterval(async () => {
      try {
        const items = await this.getMenuItems();
        // Note: This polls all items, not individual updates
        // For true real-time, implement WebSocket on backend
      } catch (error) {
        onError?.(error as Error);
      }
    }, 30000);

    return () => clearInterval(interval);
  },
};

