import { create } from 'zustand';
import { orderService, OrderResponse, CreateOrderRequest } from '../service/order.service';

interface OrderState {
  orders: OrderResponse[];
  myOrders: OrderResponse[]
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  fetchMyOrders: (page?: number, limit?: number) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<OrderResponse>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  myOrders: [],                             
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,

  fetchOrders: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderService.getAll(page, limit);
      set({ orders: res.data, total: res.total, page: res.page, limit: res.limit, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal memuat order', isLoading: false });
    }
  },

  fetchMyOrders: async (page = 1, limit = 10) => {         
    set({ isLoading: true, error: null });
    try {
      const res = await orderService.getMyOrders(page, limit);
      set({ myOrders: res.data, total: res.total, page: res.page, limit: res.limit, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal memuat riwayat pesanan', isLoading: false });
    }
  },

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.create(data);
      set({ orders: [newOrder, ...get().orders], isLoading: false });
      return newOrder;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal membuat order', isLoading: false });
      throw err;
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  clearError: () => set({ error: null }),
}));