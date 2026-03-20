import { Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { AuthenticatedRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.createFromCart({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json(successResponse(order, 'Order created'));
    } catch (err) {
      next(err);
    }
  };

  public getMyOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.findByUserId(req.user!.userId);
      res.json(successResponse(orders));
    } catch (err) {
      next(err);
    }
  };

  public getOrderById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.findById(req.params.id);
      if (!order || order.userId !== req.user!.userId) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }
      res.json(successResponse(order));
    } catch (err) {
      next(err);
    }
  };
}
