/**
 * QR Order Service - Backend Integration for Pre-Orders
 * Handles all QR code related operations and order lookup
 */

import { API_BASE_URL } from '../constants/api';
import { Order } from './types';

export const qrOrderService = {
  /**
   * Lookup order by QR code (or order ID directly)
   * @param qrCode - Full QR string "ORDER_ID|TIMESTAMP" or just order ID
   * @returns Complete order details with student info
   */
  async lookupOrderByQR(qrCode: string): Promise<Order> {
    try {
      // Parse QR code to extract order ID
      const orderId = qrCode.includes('|') 
        ? qrCode.split('|')[0] 
        : qrCode;

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Order not found: ${orderId}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error looking up order by QR:', error);
      throw error;
    }
  },

  /**
   * Get all pre-orders awaiting pickup
   * Used by admin to see pending QR scans
   */
  async getPendingPreOrders(): Promise<Order[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders?status=paid&orderType=pre-order`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Error fetching pending pre-orders:', error);
      throw error;
    }
  },

  /**
   * Verify QR code validity and get order details
   * @param qrCode - QR code string
   * @returns Order details if valid, null if expired or invalid
   */
  async verifyQRCode(qrCode: string): Promise<Order | null> {
    try {
      const orderId = qrCode.includes('|') 
        ? qrCode.split('|')[0] 
        : qrCode;

      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/verify-qr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrCode }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error verifying QR code:', error);
      return null;
    }
  },

  /**
   * Mark order as handed over (QR scanned successfully)
   * Updates order status to 'ready_for_pickup' or 'completed'
   */
  async markOrderHandedOver(orderId: string): Promise<Order> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/handover`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            handoverTime: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error marking order as handed over:', error);
      throw error;
    }
  },

  /**
   * Get order history for a student
   * @param studentId - Student identifier
   * @returns Array of orders for this student
   */
  async getStudentOrders(studentId: string): Promise<Order[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${studentId}/orders`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Error fetching student orders:', error);
      throw error;
    }
  },
};
