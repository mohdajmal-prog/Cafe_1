import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import { Order, User, CartItem, MenuItem, Category, PauseState } from './types';
import * as SecureStore from 'expo-secure-store';

// --- Auth Token Management ---
const AUTH_TOKEN_KEY = 'authToken';

const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
};

const setAuthToken = async (token: string | null) => {
  if (token) {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  }
};
// --------------------------

// --- WebSocket Real-time Service ---
type WSEvent = 'ORDER_UPDATED' | 'PAUSE_STATE_UPDATED';
type WSEventListener = (payload: any) => void;

const wsListeners = new Map<WSEvent, Set<WSEventListener>>();
let socket: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

function getWebSocketURL(): string {
  const url = new URL(API_BASE_URL);
  // Use ws:// for http:// and wss:// for https://
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${url.host}`;
}

function connectWebSocket() {
  // Avoid creating multiple connections
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const wsUrl = getWebSocketURL();
  console.log(`🔌 Connecting to WebSocket at ${wsUrl}`);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('✅ WebSocket connection established.');
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('📬 Received WebSocket message:', message);
      if (message.type && wsListeners.has(message.type)) {
        wsListeners.get(message.type)?.forEach(listener => listener(message.payload));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error.message);
  };

  socket.onclose = () => {
    console.log('🔌 WebSocket connection closed. Attempting to reconnect in 5 seconds...');
    socket = null;
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(connectWebSocket, 5000);
    }
  };
}

function subscribeToWSEvent(event: WSEvent, callback: WSEventListener): () => void {
  if (!wsListeners.has(event)) {
    wsListeners.set(event, new Set());
  }
  const listeners = wsListeners.get(event);
  listeners?.add(callback);

  // Ensure connection is active when the first listener for any event is added
  connectWebSocket();

  return () => {
    listeners?.delete(callback);
  };
}
// ------------------------------------

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      console.error(`❌ API Error (${response.status}):`, errorJson);
      throw new Error(errorJson.error || `Request failed with status ${response.status}`);
    } catch (e) {
      console.error(`❌ API Error (${response.status}): Not a JSON response.`, errorText.substring(0, 500));
      throw new Error(`Server returned an error: ${response.status}. Check console for details.`);
    }
  }
  // Handle cases where the response body might be empty (e.g., 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

/**
 * A wrapper for fetch that automatically includes the Authorization header
 * for authenticated requests.
 */
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
};

export const api = {
  // --- Authentication ---
  sendOTP: async (identifier: string) => {
    try {
      console.log('📤 Sending OTP to:', identifier);
      console.log('🌐 API URL:', `${API_BASE_URL}${ENDPOINTS.SEND_OTP}`);
      
      const isEmail = identifier.includes('@');
      const payload = { [isEmail ? 'email' : 'phone']: identifier };
      console.log('📦 Payload:', JSON.stringify(payload));

      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_OTP}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Response status:', res.status);
      const data = await handleResponse(res);
      console.log('✅ OTP sent successfully');
      return {
        success: true,
        message: data.message || 'OTP sent successfully',
        otp: data.otp,
      };
    } catch (error: any) {
      console.error('❌ sendOTP error:', error.message);
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  },

  verifyOTP: async (identifier: string, otp: string, name?: string, email?: string) => {
    const isEmail = identifier.includes('@');
    const payload: any = { [isEmail ? 'email' : 'phone']: identifier, otp };
    if (name) payload.name = name;
    if (email && !isEmail) payload.email = email;

    const res = await fetch(`${API_BASE_URL}${ENDPOINTS.VERIFY_OTP}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(res);
    if (data.token) {
      await setAuthToken(data.token); // Automatically store the token on successful login
    }
    return {
      success: true,
      user: data.user as User,
      token: data.token as string,
    };
  },

  logout: async () => {
    await setAuthToken(null);
  },

  // --- Menu (Public) ---
  getMenuItems: async (): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE_URL}${ENDPOINTS.MENU}`);
    return handleResponse(res);
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE_URL}${ENDPOINTS.CATEGORIES}`);
    return handleResponse(res);
  },

  // --- Orders (Authenticated) ---
  getOrders: async (): Promise<Order[]> => {
    const res = await authFetch(`${API_BASE_URL}${ENDPOINTS.ORDERS}`);
    return handleResponse(res);
  },

  createOrder: async (items: { id: string; name?: string; quantity: number; price: number }[]): Promise<Order> => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('📦 API createOrder - Items:', items, 'Total:', total);
    
    const res = await authFetch(`${API_BASE_URL}${ENDPOINTS.ORDERS}`, {
      method: 'POST',
      body: JSON.stringify({ items, totalAmount: total }),
    });
    return handleResponse(res);
  },

  // --- User Profile (Authenticated) ---
  getUserProfile: async (): Promise<User> => {
    const res = await authFetch(`${API_BASE_URL}${ENDPOINTS.PROFILE}`);
    return handleResponse(res);
  },

  // --- Admin (Authenticated) ---
  getPauseState: async (): Promise<PauseState> => {
    const res = await authFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_PAUSE}`);
    return handleResponse(res);
  },

  setPauseState: async (paused: boolean, reason: string = ''): Promise<PauseState> => {
    const res = await authFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_PAUSE}`, {
      method: 'PUT',
      body: JSON.stringify({
        is_app_paused: paused,
        pause_reason: reason,
      }),
    });
    return handleResponse(res);
  },

  // --- Real-time Subscriptions ---
  subscribeToOrderUpdates: (callback: (order: Order) => void): () => void => {
    return subscribeToWSEvent('ORDER_UPDATED', callback);
  },

  subscribeToPauseStateUpdates: (callback: (state: PauseState) => void): () => void => {
    return subscribeToWSEvent('PAUSE_STATE_UPDATED', callback);
  },
};
