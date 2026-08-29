import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService, type CartResponse } from '../service/cart.service';

interface CartItem {
  id: string | number;
  productId?: string | number;
  cartItemId?: number;
  name: string;
  price: number;
  image?: string | null;
  notes?: string;
  description?: string;
  status?: string;
  category?: string;
  categoryId?: number;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  fetchCartFromServer: () => Promise<void>;
}

const mapServerCartToLocal = (response: CartResponse): CartItem[] =>
  response.items.map((item) => ({
    id: item.productId,
    productId: item.productId,
    cartItemId: item.id,
    name: item.productName,
    price: item.price,
    image: item.image,
    quantity: item.qty,
    notes: '',
    description: '',
    status: 'AVAILABLE',
    category: '',
  }));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,

      setIsCartOpen: (open) => set({ isCartOpen: open }),

      fetchCartFromServer: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ cartItems: [] });
          return;
        }

        try {
          const response = await cartService.getCart();
          set({ cartItems: mapServerCartToLocal(response) });
        } catch (error) {
          console.warn('Failed to fetch cart from server:', error);
          set({ cartItems: [] });
        }
      },

      addToCart: async (product, quantity = 1) => {
        if (!product || product.status === 'SOLD OUT') return;

        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const response = await cartService.addItem({
              productId: Number(product.id),
              qty: quantity,
            });
            set({ cartItems: mapServerCartToLocal(response) });
            return;
          } catch (error) {
            console.warn('Add to cart API failed, fallback to local cart:', error);
          }
        }

        set((state) => {
          const productId = String(product.id);
          let foundProduct = false;
          const updated = state.cartItems.reduce<CartItem[]>((items, item) => {
            if (String(item.id) !== productId) {
              items.push(item);
              return items;
            }

            if (!foundProduct) {
              items.push({
                ...item,
                ...product,
                quantity: item.quantity + quantity,
              });
              foundProduct = true;
            }

            return items;
          }, []);

          if (!foundProduct) {
            updated.push({ ...product, quantity });
          }

          return { cartItems: updated };
        });
      },

      removeFromCart: async (productId) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const currentItem = get().cartItems.find((item) => String(item.id) === String(productId));
          if (currentItem?.cartItemId) {
            try {
              const response = await cartService.removeItem(currentItem.cartItemId);
              set({ cartItems: mapServerCartToLocal(response) });
              return;
            } catch (error) {
              console.warn('Remove cart item API failed, fallback to local cart:', error);
            }
          }
        }

        set((state) => ({
          cartItems: state.cartItems.filter((item) => String(item.id) !== String(productId)),
        }));
      },

      updateQuantity: async (productId, delta) => {
        const token = localStorage.getItem('accessToken');
        const item = get().cartItems.find((cartItem) => String(cartItem.id) === String(productId));

        if (token && item?.cartItemId) {
          const nextQty = (item.quantity ?? 0) + delta;

          try {
            if (nextQty <= 0) {
              const response = await cartService.removeItem(item.cartItemId);
              set({ cartItems: mapServerCartToLocal(response) });
              return;
            }

            const response = await cartService.updateItem(item.cartItemId, { qty: nextQty });
            set({ cartItems: mapServerCartToLocal(response) });
            return;
          } catch (error) {
            console.warn('Update cart item API failed, fallback to local cart:', error);
          }
        }

        set((state) => ({
          cartItems: state.cartItems
            .map((cartItem) => {
              if (String(cartItem.id) === String(productId)) {
                const newQty = cartItem.quantity + delta;
                return newQty > 0 ? { ...cartItem, quantity: newQty } : null;
              }
              return cartItem;
            })
            .filter((cartItem): cartItem is CartItem => cartItem !== null),
        }));
      },

      clearCart: async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const response = await cartService.clearCart();
            set({ cartItems: mapServerCartToLocal(response) });
            return;
          } catch (error) {
            console.warn('Clear cart API failed, fallback to local cart:', error);
          }
        }

        set({ cartItems: [] });
      },

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'neko_cart',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);