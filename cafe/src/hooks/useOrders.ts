import { useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import { Order } from "../services/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        if (mounted) setLoading(true);
        const data = await orderService.getOrders();
        if (mounted) setOrders(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Poll for updates so newly created orders appear in UI
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { orders, loading, error };
}

export function usePollOrderStatus(orderId: string, interval = 3000) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const timer = setInterval(fetchOrder, interval);
    return () => clearInterval(timer);
  }, [orderId, interval]);

  return { order, loading };
}
