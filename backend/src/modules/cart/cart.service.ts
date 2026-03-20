import { db } from '../../config/database';
import { Cart, CartItem } from './cart.model';

/**
 * Service layer for cart operations.
 * Persists cart state to the database and delegates business rules to Cart domain entity.
 */
export class CartService {
  /** Load (or lazily create) the cart for a given user */
  public async getCartByUserId(userId: string): Promise<Cart> {
    const rows = await db.query<{ id: string; items: CartItem[] }>(
      'SELECT id, items FROM carts WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      const newCart = new Cart({ userId });
      await db.query('INSERT INTO carts (id, user_id, items) VALUES ($1, $2, $3)', [
        newCart.id,
        userId,
        JSON.stringify([]),
      ]);
      return newCart;
    }

    return new Cart({ id: rows[0].id, userId, items: rows[0].items });
  }

  public async addItem(userId: string, item: CartItem): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    cart.addItem(item);
    await this.persist(cart);
    return cart;
  }

  public async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    cart.removeItem(productId);
    await this.persist(cart);
    return cart;
  }

  public async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    cart.updateQuantity(productId, quantity);
    await this.persist(cart);
    return cart;
  }

  public async clearCart(userId: string): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    cart.clear();
    await this.persist(cart);
  }

  private async persist(cart: Cart): Promise<void> {
    await db.query(
      'UPDATE carts SET items = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(cart.getItems()), cart.id]
    );
  }
}
