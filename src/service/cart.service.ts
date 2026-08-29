import api from '../lib/api';

export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  price: number;
  image: string | null;
  qty: number;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
}

export interface AddCartItemRequest {
  productId: number;
  qty: number;
}

export interface UpdateCartItemRequest {
  qty: number;
}

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (data: AddCartItemRequest): Promise<CartResponse> => {
    const response = await api.post('/cart/items', data);
    return response.data;
  },

  updateItem: async (itemId: number, data: UpdateCartItemRequest): Promise<CartResponse> => {
    const response = await api.patch(`/cart/items/${itemId}`, data);
    return response.data;
  },

  removeItem: async (itemId: number): Promise<CartResponse> => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<CartResponse> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
