import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cart, CartItem } from '../types';
import { cartApi, userApi } from '../services/api';

// ─── Auth Store ───────────────────────────────────────────────
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await userApi.login({ email, password });
        const { user } = data.data!;
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);

// ─── Cart Store ───────────────────────────────────────────────
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    const { data } = await cartApi.get();
    set({ cart: data.data ?? null, isLoading: false });
  },

  addItem: async (item) => {
    const { data } = await cartApi.addItem(item);
    set({ cart: data.data ?? null });
  },

  removeItem: async (productId) => {
    const { data } = await cartApi.removeItem(productId);
    set({ cart: data.data ?? null });
  },

  updateQuantity: async (productId, quantity) => {
    const { data } = await cartApi.updateQuantity(productId, quantity);
    set({ cart: data.data ?? null });
  },

  clearCart: async () => {
    await cartApi.clear();
    set({ cart: null });
  },
}));
