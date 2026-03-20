import { db } from '../../config/database';
import { Order, OrderRow, OrderStatus } from './order.model';
import { CartService } from '../cart/cart.service';

export interface CreateOrderDto {
  userId: string;
  shippingAddress: Record<string, string>;
  notes?: string;
}

/** Orchestrates order creation from an existing cart and manages order lifecycle */
export class OrderService {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  /** Creates an order from the user's active cart and clears it afterwards */
  public async createFromCart(dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getCartByUserId(dto.userId);
    if (cart.lineCount === 0) throw new Error('Cart is empty');

    const subtotal = cart.calculateSubtotal();
    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    const order = new Order({
      userId: dto.userId,
      items: [...cart.getItems()],
      subtotal,
      tax,
      total,
      shippingAddress: dto.shippingAddress,
      notes: dto.notes,
    });

    await db.query(
      `INSERT INTO orders
         (id, user_id, items, subtotal, tax, total, status, payment_status, shipping_address, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        order.id,
        order.userId,
        JSON.stringify(order.items),
        order.subtotal,
        order.tax,
        order.total,
        order.status,
        order.paymentStatus,
        JSON.stringify(order.shippingAddress),
        order.notes ?? null,
      ]
    );

    await this.cartService.clearCart(dto.userId);
    return order;
  }

  public async findByUserId(userId: string): Promise<Order[]> {
    const rows = await db.query<OrderRow>('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows.map(Order.fromRow);
  }

  public async findById(id: string): Promise<Order | null> {
    const rows = await db.query<OrderRow>('SELECT * FROM orders WHERE id = $1', [id]);
    return rows.length ? Order.fromRow(rows[0]) : null;
  }

  public async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const rows = await db.query<OrderRow>(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    if (!rows.length) throw new Error(`Order "${orderId}" not found`);
    return Order.fromRow(rows[0]);
  }
}
