import api from '../lib/api';

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  userId: number | null;
  customerName: string | null;
  totalAmount: number;
  snapToken: string | null;
  paymentStatus: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderListResponse {
  data: OrderResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateOrderRequest {
  customerName?: string;
  userId?: number;
  items: { productId: number; qty: number }[];
}

export const orderService = {
  create: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getAll: async (page = 1, limit = 10): Promise<OrderListResponse> => {
    const response = await api.get('/orders', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: number): Promise<OrderResponse> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getMyOrders: async (page = 1, limit = 10): Promise<OrderListResponse> => {
    const response = await api.get('/orders/my', { params: { page, limit } });
    return response.data;
  },
};