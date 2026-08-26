import api from '../lib/api';

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  image: string | null;
  categoryId: number;
  categoryName: string;
}

export interface ProductListResponse {
  data: ProductResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  image?: string;
  categoryId: number;
  status?: 'AVAILABLE' | 'SOLD OUT';
  isFeatured?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  image?: string;
  categoryId?: number;
  status?: 'AVAILABLE' | 'SOLD OUT';
  isFeatured?: boolean;
}

export interface ProductQueryParams {
  categoryId?: number;
  page?: number;
  limit?: number;
}

export const productService = {
  getAll: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ProductResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<ProductResponse> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductRequest): Promise<ProductResponse> => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};