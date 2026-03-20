import { v4 as uuidv4 } from 'uuid';

/** Single line item inside the cart */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

/**
 * Domain entity representing a shopping cart.
 * Holds items and enforces quantity and total calculation rules.
 */
export class Cart {
  public readonly id: string;
  public readonly userId: string;
  private items: CartItem[];
  public updatedAt: Date;

  constructor(params: { id?: string; userId: string; items?: CartItem[] }) {
    this.id = params.id ?? uuidv4();
    this.userId = params.userId;
    this.items = params.items ?? [];
    this.updatedAt = new Date();
  }

  /** Returns a read-only snapshot of the current items */
  public getItems(): ReadonlyArray<CartItem> {
    return this.items;
  }

  /** Returns the number of distinct product lines in the cart */
  public get lineCount(): number {
    return this.items.length;
  }

  /** Returns the total number of units across all lines */
  public get totalUnits(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  /**
   * Adds a product to the cart.
   * If the product already exists, increments the quantity instead of duplicating the line.
   */
  public addItem(item: CartItem): void {
    const existing = this.items.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
    this.updatedAt = new Date();
  }

  /**
   * Removes a product line from the cart entirely.
   * Throws if the productId is not found.
   */
  public removeItem(productId: string): void {
    const index = this.items.findIndex((i) => i.productId === productId);
    if (index === -1) throw new Error(`Item "${productId}" not found in cart`);
    this.items.splice(index, 1);
    this.updatedAt = new Date();
  }

  /**
   * Sets an exact quantity for an existing item.
   * Use quantity = 0 to remove the item.
   */
  public updateQuantity(productId: string, quantity: number): void {
    if (quantity < 0) throw new Error('Quantity cannot be negative');
    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find((i) => i.productId === productId);
    if (!item) throw new Error(`Item "${productId}" not found in cart`);
    item.quantity = quantity;
    this.updatedAt = new Date();
  }

  /** Removes all items from the cart */
  public clear(): void {
    this.items = [];
    this.updatedAt = new Date();
  }

  /** Calculates the subtotal without taxes or shipping */
  public calculateSubtotal(): number {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  /** Calculates the total including a given tax rate (e.g. 0.19 for 19% IVA) */
  public calculateTotal(taxRate = 0.19): number {
    const subtotal = this.calculateSubtotal();
    return subtotal + subtotal * taxRate;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      lineCount: this.lineCount,
      totalUnits: this.totalUnits,
      subtotal: this.calculateSubtotal(),
      total: this.calculateTotal(),
      updatedAt: this.updatedAt,
    };
  }
}
