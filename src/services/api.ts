/**
 * Buy9ja Marketplace API Service
 * Handles all backend API communications for orders and payments
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Type Definitions
 */
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  total: number;
  userId?: string;
}

export interface Order {
  ID: string;
  USER_ID: string | null;
  VENDOR_ID: string;
  VENDOR_NAME: string;
  STATUS: 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
  TOTAL: number;
  ESTIMATED_TIME: string;
  CREATED_AT: string;
  UPDATED_AT: string;
  items: OrderItem[];
  estimatedTime?: string;
}

export interface PaymentInitRequest {
  email: string;
  amount: number;
  orderId?: string;
  items?: OrderItem[];
}

export interface PaymentInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  paid_at: string;
  customer: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  metadata?: any;
}

export interface Transaction {
  reference: string;
  amount: number;
  status: string;
  paid_at: string;
  customer: {
    email: string;
  };
}

export interface Bank {
  id: number;
  name: string;
  code: string;
  slug: string;
}

/**
 * API Helper Function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Order Management API
 */
export const OrderAPI = {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Get all orders (optionally filtered by userId)
   */
  async getOrders(userId?: string): Promise<Order[]> {
    const query = userId ? `?userId=${userId}` : '';
    return apiRequest<Order[]>(`/orders${query}`);
  },

  /**
   * Get a single order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    return apiRequest<Order>(`/orders/${orderId}`);
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: 'preparing' | 'on-the-way' | 'delivered' | 'cancelled'
  ): Promise<Order> {
    return apiRequest<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * Payment API (Paystack Integration)
 */
export const PaymentAPI = {
  /**
   * Initialize a payment transaction
   */
  async initializePayment(
    paymentData: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    return apiRequest<PaymentInitResponse>('/initialize-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    return apiRequest<PaymentVerificationResponse>(`/verify-payment/${reference}`);
  },

  /**
   * Get all transactions
   */
  async getTransactions(perPage = 50, page = 1): Promise<{
    success: boolean;
    transactions: Transaction[];
    meta: any;
  }> {
    return apiRequest(`/transactions?perPage=${perPage}&page=${page}`);
  },

  /**
   * Process a refund
   */
  async processRefund(
    reference: string,
    amount?: number
  ): Promise<{
    success: boolean;
    message: string;
    reference: string;
    amount: number;
  }> {
    return apiRequest('/refund', {
      method: 'POST',
      body: JSON.stringify({ reference, amount }),
    });
  },

  /**
   * Get list of supported banks
   */
  async getBanks(): Promise<{
    success: boolean;
    banks: Bank[];
  }> {
    return apiRequest('/banks');
  },
};

/**
 * Health Check API
 */
export const HealthAPI = {
  /**
   * Check if API server is running
   */
  async checkHealth(): Promise<{
    status: string;
    message: string;
    version: string;
  }> {
    return apiRequest('/health');
  },
};

/**
 * Export all APIs
 */
export default {
  Order: OrderAPI,
  Payment: PaymentAPI,
  Health: HealthAPI,
};

