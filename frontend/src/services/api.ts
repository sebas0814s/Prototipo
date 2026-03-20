/**
 * Mock API — sin backend real.
 * Productos guardados en IndexedDB (sin límite de tamaño).
 * Carrito y pedidos siguen en localStorage (son datos pequeños).
 */
import { Product, Cart, CartItem, User, Order, ApiResponse } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockData';
import { idbGet, idbSet } from '../utils/storage';

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const ok = <T>(data: T, message?: string): { data: ApiResponse<T> } => ({
  data: { success: true, data, message },
});

// ─── Claves ───────────────────────────────────────────────────
const PRODUCTS_KEY = 'jalac_products_v2';
const CART_KEY     = 'jalac_cart';
const ORDERS_KEY   = 'jalac_orders';

// ─── Productos — IndexedDB (sin límite de tamaño) ─────────────
async function loadProducts(): Promise<Product[]> {
  const stored = await idbGet<Product[]>(PRODUCTS_KEY);
  if (stored && stored.length > 0) return stored;
  // Primera vez: guardar los productos de ejemplo
  await idbSet(PRODUCTS_KEY, MOCK_PRODUCTS);
  return MOCK_PRODUCTS;
}

async function saveProducts(products: Product[]): Promise<void> {
  await idbSet(PRODUCTS_KEY, products);
}

// ─── Cart — localStorage (datos pequeños) ─────────────────────
function loadCart(userId: string): Cart {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) return JSON.parse(raw) as Cart;
  } catch { /* ignorar */ }
  return { id: 'cart-local', userId, items: [], lineCount: 0, totalUnits: 0, subtotal: 0, total: 0 };
}

function recalculate(cart: Cart): Cart {
  const subtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  return {
    ...cart,
    lineCount:  cart.items.length,
    totalUnits: cart.items.reduce((a, i) => a + i.quantity, 0),
    subtotal,
    total: subtotal * 1.19,
  };
}

function saveCart(cart: Cart): Cart {
  const updated = recalculate(cart);
  localStorage.setItem(CART_KEY, JSON.stringify(updated));
  return updated;
}

// ─── Product API (público) ────────────────────────────────────
export const productApi = {
  getAll: async (params?: Record<string, unknown>) => {
    await delay();
    let products = (await loadProducts()).filter((p) => p.isActive);
    if (params?.material)    products = products.filter((p) => p.material === params.material);
    if (params?.inStockOnly) products = products.filter((p) => p.stock > 0);
    if (params?.maxPrice)    products = products.filter((p) => p.price <= Number(params.maxPrice));
    return ok(products.slice(0, Number(params?.limit ?? 50)));
  },

  getById: async (id: string) => {
    await delay(150);
    const all     = await loadProducts();
    const product = all.find((p) => p.id === id) ?? null;
    return ok(product as Product);
  },
};

// ─── Admin Product API ────────────────────────────────────────
export const adminProductApi = {
  getAll: async () => {
    await delay(150);
    return ok(await loadProducts());
  },

  create: async (data: Omit<Product, 'id' | 'createdAt'>) => {
    await delay(300);
    const products   = await loadProducts();
    const newProduct: Product = { ...data, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
    products.unshift(newProduct);
    await saveProducts(products);
    return ok(newProduct, 'Producto creado');
  },

  update: async (id: string, data: Partial<Product>) => {
    await delay(250);
    const products = await loadProducts();
    const idx      = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    products[idx] = { ...products[idx], ...data };
    await saveProducts(products);
    return ok(products[idx], 'Producto actualizado');
  },

  delete: async (id: string) => {
    await delay(200);
    const products = (await loadProducts()).filter((p) => p.id !== id);
    await saveProducts(products);
    return ok(null, 'Producto eliminado');
  },

  /** Reemplaza TODOS los productos (usado al importar catálogo) */
  replaceAll: async (products: Product[]) => {
    await saveProducts(products);
    return ok(products, 'Catálogo importado');
  },

  resetToDefaults: async () => {
    await saveProducts(MOCK_PRODUCTS);
    return ok(MOCK_PRODUCTS, 'Catálogo restaurado');
  },
};

// ─── Cart API ─────────────────────────────────────────────────
export const cartApi = {
  get: async () => { await delay(100); return ok(loadCart('user')); },

  addItem: async (item: CartItem) => {
    await delay(150);
    const cart     = loadCart('user');
    const existing = cart.items.find((i) => i.productId === item.productId);
    if (existing) existing.quantity += item.quantity;
    else cart.items.push({ ...item });
    return ok(saveCart(cart));
  },

  updateQuantity: async (productId: string, quantity: number) => {
    await delay(100);
    const cart = loadCart('user');
    const item = cart.items.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
    return ok(saveCart(cart));
  },

  removeItem: async (productId: string) => {
    await delay(100);
    const cart = loadCart('user');
    cart.items = cart.items.filter((i) => i.productId !== productId);
    return ok(saveCart(cart));
  },

  clear: async () => { localStorage.removeItem(CART_KEY); return ok(null); },
};

// ─── User API ─────────────────────────────────────────────────
const MOCK_USER: User  = { id: 'user-1',  firstName: 'Demo',  lastName: 'Usuario', fullName: 'Demo Usuario', email: 'demo@example.com',  role: 'customer' };

let _sessionUser: User = MOCK_USER;

export const userApi = {
  register: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    await delay(350);
    const user: User = { ...MOCK_USER, firstName: data.firstName, lastName: data.lastName, fullName: `${data.firstName} ${data.lastName}`, email: data.email };
    _sessionUser = user;
    return ok({ user, token: 'mock-token' }, 'Cuenta creada');
  },

  login: async (data: { email: string; password: string }) => {
    await delay(350);
    if (!data.email || !data.password) throw new Error('Credenciales requeridas');
    const user: User = { ...MOCK_USER, email: data.email };
    _sessionUser = user;
    return ok({ user, token: 'mock-token' });
  },

  getProfile:    async () => { await delay(100); return ok(_sessionUser); },
  updateProfile: async (data: Partial<User>) => { _sessionUser = { ..._sessionUser, ...data }; return ok(_sessionUser); },
};

// ─── Order API ────────────────────────────────────────────────
export const orderApi = {
  create: async (data: { shippingAddress: Record<string, string>; notes?: string }) => {
    await delay(400);
    const cart  = loadCart('user');
    const order: Order = {
      id: `order-${Date.now()}`,
      items: cart.items,
      subtotal: cart.subtotal,
      tax:  cart.total - cart.subtotal,
      total: cart.total,
      status: 'pending_payment',
      paymentStatus: 'PENDING',
      shippingAddress: data.shippingAddress,
      createdAt: new Date().toISOString(),
    };
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as Order[];
    stored.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(stored));
    localStorage.removeItem(CART_KEY);
    return ok(order, 'Pedido creado');
  },

  getMyOrders: async () => {
    await delay(150);
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as Order[];
    return ok([...stored, ...MOCK_ORDERS]);
  },

  getById: async (id: string) => {
    await delay(100);
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as Order[];
    return ok([...stored, ...MOCK_ORDERS].find((o) => o.id === id) ?? null as unknown as Order);
  },
};

// ─── Payment API ──────────────────────────────────────────────
export const paymentApi = {
  initiate: async (data: { gateway: string; orderId: string; amountInCents: number; currency: string; customerEmail: string }) => {
    await delay(450);
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as Order[];
    const order  = stored.find((o) => o.id === data.orderId);
    if (order) {
      order.status        = 'paid';
      order.paymentStatus = 'APPROVED';
      localStorage.setItem(ORDERS_KEY, JSON.stringify(stored));
    }
    return ok({ transactionId: `TXN-${Date.now()}`, status: 'APPROVED', provider: data.gateway });
  },
};
