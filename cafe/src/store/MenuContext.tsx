import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { MenuItem } from '../services/types';
import { menuService } from '../services/menuService';

interface MenuContextType {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviews'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  updatePrice: (id: string, price: number) => void;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch menu items from backend on mount
  useEffect(() => {
    let isMounted = true;

    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await menuService.getMenuItems();
        if (isMounted) {
          setMenuItems(items);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.debug('Failed to fetch menu items:', err);
          setError('Failed to load menu');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenuItems();

    // Set up polling interval (5 seconds) for menu updates
    const intervalId = setInterval(() => {
      fetchMenuItems();
    }, 30000);
    pollIntervalRef.current = intervalId as unknown as NodeJS.Timeout;

    // Set up WebSocket subscription for real-time stock updates
    try {
      unsubscribeRef.current = menuService.subscribeToMenuUpdates(
        (updatedItem) => {
          if (isMounted) {
            setMenuItems((prev) =>
              prev.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
              )
            );
          }
        },
        (error) => {
          console.debug('Menu WebSocket error:', error);
        }
      );
    } catch (error) {
      console.debug('Failed to set up menu WebSocket:', error);
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const refreshMenu = useCallback(async () => {
    try {
      const items = await menuService.getMenuItems();
      setMenuItems(items);
      setError(null);
    } catch (err) {
      console.debug('Failed to refresh menu:', err);
      setError('Failed to refresh menu');
    }
  }, []);

  const addMenuItem = useCallback(
    (item: Omit<MenuItem, 'id' | 'rating' | 'reviews'>) => {
      const newItem: MenuItem = {
        ...item,
        id: Date.now().toString(),
        rating: 4.5,
        reviews: 0,
      };
      setMenuItems((prev) => [...prev, newItem]);
    },
    []
  );

  const updateMenuItem = useCallback((id: string, item: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((prevItem) => (prevItem.id === id ? { ...prevItem, ...item } : prevItem))
    );
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateStock = useCallback((id: string, stock: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock } : item))
    );
  }, []);

  const updatePrice = useCallback((id: string, price: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item))
    );
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateStock,
        updatePrice,
        refreshMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
