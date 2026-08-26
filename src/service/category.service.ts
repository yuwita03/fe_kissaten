import api from '../lib/api';

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export const categoryService = {
  getAll: async (): Promise<CategoryResponse[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};