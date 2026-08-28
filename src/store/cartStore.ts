import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string | number;
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
  //Omit<T, K> itu utility type bawaan TypeScript buat bikin tipe baru dari tipe yang udah ada, tapi buang salah satu (atau beberapa) propertinya.
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,

      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (product, quantity = 1) => {
        if (!product || product.status === 'SOLD OUT') return;

        set((state) => {
          const existingIndex = state.cartItems.findIndex(item => item.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.cartItems];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity
            };
            return { cartItems: updated };
          } else {
            return { cartItems: [...state.cartItems, { ...product, quantity }] };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== productId)
        }));
      },

      updateQuantity: (productId, delta) => {
        set((state) => ({
          cartItems: state.cartItems
            .map(item => {
              if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null)
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'neko_cart', // key localStorage, sama kayak sebelumnya biar cart lama user gak ilang
      partialize: (state) => ({ cartItems: state.cartItems }), // cuma cartItems yang disimpen, isCartOpen gak perlu ikut ke-persist
    }
  )
);