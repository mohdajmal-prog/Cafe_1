/**
 * Bill Service - Backend Integration for Bill Generation and Management
 * Handles QR-based bill generation, payment verification, and stock updates
 */

import { API_BASE_URL } from '../constants/api';
import { Order } from './types';

export interface Bill {
  id: string;
  orderId: string;
  orderNumber: string; // Display format: ORD-XXXXXX
  studentName: string;
  studentEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'online' | 'cash' | 'card' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'verified';
  generatedAt: string;
  generatedBy?: string; // Admin ID
  qrVerified: boolean;
}

export const billService = {
  /**
   * Generate bill for pre-order (QR-based)
   * This is called when admin scans QR code
   * @param orderId - Order ID from QR code
   * @param adminId - Admin who scanned the QR
   */
  async generateBillFromQR(orderId: string, adminId?: string): Promise<Bill> {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/generate-from-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          adminId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate bill: ${response.statusText}`);
      }

      const bill = await response.json();
      return bill;
    } catch (error) {
      console.error('Error generating bill from QR:', error);
      throw error;
    }
  },

  /**
   * Generate manual bill (walk-in customer)
   * @param items - Items to bill
   * @param customerName - Walk-in customer name
   * @param paymentMethod - Payment method
   * @param adminId - Admin creating bill
   */
  async generateManualBill(
    items: Array<{ id: string; name: string; quantity: number; price: number }>,
    customerName: string,
    paymentMethod: 'cash' | 'card' | 'upi' = 'cash',
    adminId?: string
  ): Promise<Bill> {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/generate-manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerName,
          paymentMethod,
          adminId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate bill: ${response.statusText}`);
      }

      const bill = await response.json();
      return bill;
    } catch (error) {
      console.error('Error generating manual bill:', error);
      throw error;
    }
  },

  /**
   * Get bill details
   * @param billId - Bill ID
   */
  async getBill(billId: string): Promise<Bill> {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/${billId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bill = await response.json();
      return bill;
    } catch (error) {
      console.error('Error fetching bill:', error);
      throw error;
    }
  },

  /**
   * Get all bills for a date range (analytics)
   * @param startDate - Start date (ISO string)
   * @param endDate - End date (ISO string)
   */
  async getBillsByDateRange(startDate: string, endDate: string): Promise<Bill[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/billing?startDate=${startDate}&endDate=${endDate}`,
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

      const bills = await response.json();
      return bills;
    } catch (error) {
      console.error('Error fetching bills by date range:', error);
      throw error;
    }
  },

  /**
   * Verify payment for an order
   * @param orderId - Order ID
   * @param paymentTransactionId - Payment gateway transaction ID
   */
  async verifyPayment(orderId: string, paymentTransactionId: string): Promise<{ verified: boolean; order: Order }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentTransactionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  /**
   * Get today's sales summary
   * Used in admin analytics
   */
  async getTodaysSalesSummary(): Promise<{
    totalBills: number;
    totalRevenue: number;
    preOrderCount: number;
    walkInCount: number;
    averageOrderValue: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/billing/today-summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summary = await response.json();
      return summary;
    } catch (error) {
      console.error('Error fetching today\'s sales summary:', error);
      throw error;
    }
  },

  /**
   * Get top selling items today
   */
  async getTopSellingItems(limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/billing/top-items?limit=${limit}`,
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

      const items = await response.json();
      return items;
    } catch (error) {
      console.error('Error fetching top selling items:', error);
      throw error;
    }
  },
};
