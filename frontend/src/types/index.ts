export type FurnitureMaterial = 'wood' | 'metal' | 'glass' | 'fabric' | 'leather' | 'mixed';

export interface Dimensions {
  widthCm: number;
  heightCm: number;
  depthCm: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  material: FurnitureMaterial;
  price: number;
  stock: number;
  categoryId: string;
  dimensions: Dimensions;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  lineCount: number;
  totalUnits: number;
  subtotal: number;
  total: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: Record<string, string>;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: Record<string, string>;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
