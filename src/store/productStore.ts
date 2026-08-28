import { create } from 'zustand';
import { productService, ProductResponse, ProductQueryParams, CreateProductRequest, UpdateProductRequest } from '../service/product.service';

interface ProductState {
  products: ProductResponse[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  fetchProducts: (params?: ProductQueryParams) => Promise<void>;
  addProduct: (data: CreateProductRequest) => Promise<ProductResponse>;
  updateProduct: (id: number, data: UpdateProductRequest) => Promise<ProductResponse>;
  deleteProduct: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await productService.getAll(params);
      set({ products: res.data, total: res.total, page: res.page, limit: res.limit, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || 'Gagal memuat produk',
        isLoading: false,
      });
    }
  },

  addProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productService.create(data);
      set({ products: [newProduct, ...get().products], isLoading: false });
      return newProduct;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal menambah produk', isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await productService.update(id, data);
      set({ products: get().products.map(p => p.id === id ? updated : p), isLoading: false });
      return updated;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal update produk', isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productService.delete(id);
      set({ products: get().products.filter(p => p.id !== id), isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal menghapus produk', isLoading: false });
      throw err;
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  clearError: () => set({ error: null }),
}));