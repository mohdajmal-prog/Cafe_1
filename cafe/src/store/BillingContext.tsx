import React, { createContext, useContext, useState, useCallback } from 'react';
import { MenuItem } from '../services/types';

export interface BillItem extends MenuItem {
  billQuantity: number;
  billLineTotal: number;
}

export interface Bill {
  id: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  paymentMethod: 'cash' | 'card' | 'upi';
  customerName?: string;
}

interface BillingContextType {
  billItems: BillItem[];
  currentBill: Bill | null;
  addToBill: (item: MenuItem, quantity: number) => void;
  removeFromBill: (itemId: string) => void;
  updateBillItemQuantity: (itemId: string, quantity: number) => void;
  clearBill: () => void;
  generateBill: (paymentMethod: 'cash' | 'card' | 'upi', customerName?: string) => Bill;
  calculateTotals: () => { subtotal: number; tax: number; total: number };
  getBillHistory: () => Bill[];
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [billHistory, setBillHistory] = useState<Bill[]>([]);

  const addToBill = useCallback((item: MenuItem, quantity: number) => {
    setBillItems((prev) => {
      const existingItem = prev.find((b) => b.id === item.id);
      if (existingItem) {
        return prev.map((b) =>
          b.id === item.id
            ? {
                ...b,
                billQuantity: b.billQuantity + quantity,
                billLineTotal: (b.billQuantity + quantity) * b.price,
              }
            : b
        );
      }
      return [
        ...prev,
        {
          ...item,
          billQuantity: quantity,
          billLineTotal: quantity * item.price,
        },
      ];
    });
  }, []);

  const removeFromBill = useCallback((itemId: string) => {
    setBillItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateBillItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBill(itemId);
      return;
    }
    setBillItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              billQuantity: quantity,
              billLineTotal: quantity * item.price,
            }
          : item
      )
    );
  }, [removeFromBill]);

  const clearBill = useCallback(() => {
    setBillItems([]);
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotal = billItems.reduce((sum, item) => sum + item.billLineTotal, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [billItems]);

  const generateBill = useCallback(
    (paymentMethod: 'cash' | 'card' | 'upi', customerName?: string) => {
      const totals = calculateTotals();
      const bill: Bill = {
        id: Date.now().toString(),
        items: billItems,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        createdAt: new Date(),
        paymentMethod,
        customerName,
      };
      setBillHistory((prev) => [...prev, bill]);
      clearBill();
      return bill;
    },
    [billItems, calculateTotals, clearBill]
  );

  const getBillHistory = useCallback(() => billHistory, [billHistory]);

  return (
    <BillingContext.Provider
      value={{
        billItems,
        currentBill: null,
        addToBill,
        removeFromBill,
        updateBillItemQuantity,
        clearBill,
        generateBill,
        calculateTotals,
        getBillHistory,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within BillingProvider');
  }
  return context;
}
