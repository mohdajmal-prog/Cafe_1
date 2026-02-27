// QR Code generation utility
export const generateQRCode = (orderId: string): string => {
  // Generate QR code string in format: ORDER_ID|TIMESTAMP
  // In a real app, you'd use a library like 'qrcode' to generate actual QR images
  const timestamp = Date.now();
  const qrString = `${orderId}|${timestamp}`;
  return qrString;
};

export const parseQRCode = (qrData: string | undefined): { orderId: string; timestamp: number } | null => {
  if (!qrData) return null;
  try {
    const parts = qrData.split('|');
    if (parts.length === 2) {
      return {
        orderId: parts[0],
        timestamp: parseInt(parts[1], 10),
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const formatOrderId = (orderId: string | undefined): string => {
  // Format order ID for display (e.g., "ORD-123456")
  if (!orderId) return 'ORD-UNKNOWN';
  return `ORD-${orderId.slice(-6).toUpperCase()}`;
};
