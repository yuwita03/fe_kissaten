import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService, ProductResponse, ProductListResponse, CreateProductRequest, UpdateProductRequest } from '../service/product.service';
import { categoryService, CategoryResponse } from '../service/category.service';
import { orderService, OrderResponse, OrderListResponse } from '../service/order.service';

interface ProductContextType {
  products: ProductResponse[];
  categories: CategoryResponse[];
  orders: OrderResponse[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params?: { categoryId?: number; page?: number; limit?: number }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  addProduct: (data: CreateProductRequest) => Promise<ProductResponse>;
  updateProduct: (id: number, data: UpdateProductRequest) => Promise<ProductResponse>;
  deleteProduct: (id: number) => Promise<void>;
  createOrder: (orderData: { customerName?: string; userId?: number; items: { productId: number; qty: number }[] }) => Promise<OrderResponse>;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchProducts = useCallback(async (params?: { categoryId?: number; page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ProductListResponse = await productService.getAll(params);
      setProducts(response.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAll();
      setCategories(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: OrderListResponse = await orderService.getAll(page, limit);
      setOrders(response.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = async (data: CreateProductRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProduct = await productService.create(data);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: number, data: UpdateProductRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.update(id, data);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: { customerName?: string; userId?: number; items: { productId: number; qty: number }[] }) => {
    setIsLoading(true);
    setError(null);
    try {
      const newOrder = await orderService.create(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        orders,
        isLoading,
        error,
        fetchProducts,
        fetchCategories,
        fetchOrders,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        clearError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;