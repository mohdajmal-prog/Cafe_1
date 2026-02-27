import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { api } from '../services/api';
import { Order } from '../services/types';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showQR, setShowQR] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const fetchedOrders = await api.getOrders();
      setOrders(fetchedOrders);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity onPress={() => { setSelectedOrder(item); setShowQR(true); }}>
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
          <Text style={[styles.status, styles[`status_${item.status}`]]}>{item.status}</Text>
        </View>
        <Text style={styles.orderDate}>
          {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'Date not available'}
        </Text>
        <View style={styles.itemsContainer}>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemText}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
          ))}
        </View>
        <Text style={styles.total}>Total: ₹{item.total.toFixed(2)}</Text>
        <Text style={styles.tapHint}>Tap to view QR code</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
  }

  if (orders.length === 0) {
    return <Text style={styles.centered}>You have no past orders.</Text>;
  }

  return (
    <>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      <Modal visible={showQR} transparent animationType="fade" onRequestClose={() => setShowQR(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Order QR Code</Text>
            <Text style={styles.qrOrderId}>Order #{selectedOrder?.id.slice(0, 8)}</Text>
            {selectedOrder && (
              <QRCode
                value={JSON.stringify({
                  orderId: selectedOrder.id,
                  total: selectedOrder.total,
                  status: selectedOrder.status
                })}
                size={250}
              />
            )}
            <Text style={styles.qrHint}>Show this QR at pickup counter</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowQR(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red' },
  listContainer: { padding: 16 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, color: '#fff', textTransform: 'capitalize' },
  status_pending: { backgroundColor: '#f59e0b' },
  status_completed: { backgroundColor: '#10b981' },
  status_cancelled: { backgroundColor: '#ef4444' },
  orderDate: { fontSize: 12, color: '#666', marginBottom: 12 },
  itemsContainer: { marginBottom: 8 },
  itemText: { fontSize: 14, color: '#333' },
  total: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginTop: 8 },
  tapHint: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  qrContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: '85%' },
  qrTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  qrOrderId: { fontSize: 14, color: '#666', marginBottom: 20 },
  qrHint: { fontSize: 12, color: '#666', marginTop: 20, textAlign: 'center' },
  closeButton: { backgroundColor: '#10b981', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8, marginTop: 20 },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default MyOrdersScreen;