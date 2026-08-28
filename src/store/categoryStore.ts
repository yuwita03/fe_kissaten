import { create } from 'zustand';
import { categoryService, CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../service/category.service';

interface CategoryState {
  categories: CategoryResponse[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (data: CreateCategoryRequest) => Promise<CategoryResponse>;
  updateCategory: (id: number, data: UpdateCategoryRequest) => Promise<CategoryResponse>;
  deleteCategory: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getAll();
      set({ categories: res, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal memuat kategori', isLoading: false });
    }
  },

  addCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryService.create(data);
      set({ categories: [newCategory, ...get().categories], isLoading: false });
      return newCategory;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal menambah kategori', isLoading: false });
      throw err;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await categoryService.update(id, data);
      set({ categories: get().categories.map(c => c.id === id ? updated : c), isLoading: false });
      return updated;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal update kategori', isLoading: false });
      throw err;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.delete(id);
      set({ categories: get().categories.filter(c => c.id !== id), isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Gagal menghapus kategori', isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));