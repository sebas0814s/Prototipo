import { Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { AuthenticatedRequest } from '../../shared/types';
import { successResponse, errorResponse } from '../../shared/utils';

/** HTTP adapter for Cart module. All routes require an authenticated user. */
export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.getCartByUserId(req.user!.userId);
      res.json(successResponse(cart));
    } catch (err) {
      next(err);
    }
  };

  public addItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.addItem(req.user!.userId, req.body);
      res.json(successResponse(cart, 'Item added to cart'));
    } catch (err) {
      next(err);
    }
  };

  public removeItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.removeItem(req.user!.userId, req.params.productId);
      res.json(successResponse(cart, 'Item removed from cart'));
    } catch (err) {
      next(err);
    }
  };

  public updateQuantity = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number') {
        res.status(400).json(errorResponse('quantity must be a number'));
        return;
      }
      const cart = await this.cartService.updateQuantity(req.user!.userId, req.params.productId, quantity);
      res.json(successResponse(cart, 'Cart updated'));
    } catch (err) {
      next(err);
    }
  };

  public clearCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.cartService.clearCart(req.user!.userId);
      res.json(successResponse(null, 'Cart cleared'));
    } catch (err) {
      next(err);
    }
  };
}
