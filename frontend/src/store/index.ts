import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cart, CartItem, Product } from '../types';
import { cartApi, userApi } from '../services/api';

// ─── Theme Store ────────────────────────────────────────────
interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => {
        const newDark = !state.isDark;
        if (newDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark: newDark };
      }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);

// ─── Wishlist Store ─────────────────────────────────────────
interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((state) => ({
        items: state.items.some((p) => p.id === product.id)
          ? state.items
          : [...state.items, product],
      })),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((p) => p.id !== productId),
      })),
      isInWishlist: (productId) => get().items.some((p) => p.id === productId),
      toggleItem: (product) => {
        const isIn = get().isInWishlist(product.id);
        if (isIn) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: 'wishlist-storage' }
  )
);

// ─── Cart Animation Store ───────────────────────────────────
interface CartAnimationState {
  bouncing: boolean;
  triggerBounce: () => void;
}

export const useCartAnimationStore = create<CartAnimationState>()((set) => ({
  bouncing: false,
  triggerBounce: () => {
    set({ bouncing: true });
    setTimeout(() => set({ bouncing: false }), 500);
  },
}));

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
