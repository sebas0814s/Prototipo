import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../cart/cart.model';
import { TransactionStatus } from '../payment/payment.interface';

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderRow {
  id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: TransactionStatus;
  payment_provider?: string;
  transaction_id?: string;
  shipping_address: Record<string, string>;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/** Domain entity representing a placed order */
export class Order {
  public readonly id: string;
  public readonly userId: string;
  public items: CartItem[];
  public subtotal: number;
  public tax: number;
  public total: number;
  public status: OrderStatus;
  public paymentStatus: TransactionStatus;
  public paymentProvider?: string;
  public transactionId?: string;
  public shippingAddress: Record<string, string>;
  public notes?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    status?: OrderStatus;
    paymentStatus?: TransactionStatus;
    paymentProvider?: string;
    transactionId?: string;
    shippingAddress: Record<string, string>;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? uuidv4();
    this.userId = params.userId;
    this.items = params.items;
    this.subtotal = params.subtotal;
    this.tax = params.tax;
    this.total = params.total;
    this.status = params.status ?? 'pending_payment';
    this.paymentStatus = params.paymentStatus ?? 'PENDING';
    this.paymentProvider = params.paymentProvider;
    this.transactionId = params.transactionId;
    this.shippingAddress = params.shippingAddress;
    this.notes = params.notes;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  public markAsPaid(transactionId: string, provider: string): void {
    this.paymentStatus = 'APPROVED';
    this.status = 'paid';
    this.transactionId = transactionId;
    this.paymentProvider = provider;
    this.updatedAt = new Date();
  }

  public static fromRow(row: OrderRow): Order {
    return new Order({
      id: row.id,
      userId: row.user_id,
      items: row.items,
      subtotal: Number(row.subtotal),
      tax: Number(row.tax),
      total: Number(row.total),
      status: row.status,
      paymentStatus: row.payment_status,
      paymentProvider: row.payment_provider,
      transactionId: row.transaction_id,
      shippingAddress: row.shipping_address,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      status: this.status,
      paymentStatus: this.paymentStatus,
      shippingAddress: this.shippingAddress,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
