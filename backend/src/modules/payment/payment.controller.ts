import { Request, Response, NextFunction } from 'express';
import { PaymentService, GatewayName } from './payment.service';
import { successResponse, errorResponse } from '../../shared/utils';
import { db } from '../../config/database';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  public initiatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gateway, ...payload } = req.body as { gateway: GatewayName } & Parameters<PaymentService['initiatePayment']>[1];
      const result = await this.paymentService.initiatePayment(gateway, payload);
      res.status(201).json(successResponse(result, 'Payment initiated'));
    } catch (err) {
      next(err);
    }
  };

  public checkStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gateway, transactionId } = req.params as { gateway: GatewayName; transactionId: string };
      const status = await this.paymentService.checkStatus(gateway, transactionId);
      res.json(successResponse({ status }));
    } catch (err) {
      next(err);
    }
  };

  public handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gateway = req.params.gateway as GatewayName;
      const signature = (req.headers['x-event-checksum'] ?? req.headers['stripe-signature'] ?? '') as string;
      const isValid = this.paymentService.validateWebhook(gateway, req.body, signature);

      if (!isValid) {
        res.status(400).json(errorResponse('Invalid webhook signature'));
        return;
      }

      const { eventId, eventType, transactionId, orderId, newStatus } = this.extractWebhookData(gateway, req.body);

      if (!eventId) {
        res.status(400).json(errorResponse('Missing event ID'));
        return;
      }

      const alreadyProcessed = await this.checkEventProcessed(eventId, gateway);
      if (alreadyProcessed) {
        res.json(successResponse(null, 'Event already processed'));
        return;
      }

      await this.processWebhookEvent(eventId, gateway, eventType, transactionId, orderId, newStatus);
      res.json(successResponse(null, 'Webhook processed'));
    } catch (err) {
      next(err);
    }
  };

  private extractWebhookData(gateway: GatewayName, body: unknown): {
    eventId: string | null;
    eventType: string | null;
    transactionId: string | null;
    orderId: string | null;
    newStatus: string | null;
  } {
    const payload = body as Record<string, unknown>;

    if (gateway === 'stripe') {
      return {
        eventId: (payload.id as string) ?? null,
        eventType: (payload.type as string) ?? null,
        transactionId: ((payload.data as Record<string, unknown>)?.object as Record<string, unknown>)?.id as string ?? null,
        orderId: null,
        newStatus: this.mapStripeStatus(payload.type as string),
      };
    }

    if (gateway === 'wompi') {
      return {
        eventId: (payload.id as string) ?? null,
        eventType: (payload.type as string) ?? null,
        transactionId: ((payload.data as Record<string, unknown>)?.transaction as Record<string, unknown>)?.id as string ?? null,
        orderId: ((payload.data as Record<string, unknown>)?.transaction as Record<string, unknown>)?.reference as string ?? null,
        newStatus: this.mapWompiStatus(((payload.data as Record<string, unknown>)?.transaction as Record<string, unknown>)?.status as string),
      };
    }

    return { eventId: null, eventType: null, transactionId: null, orderId: null, newStatus: null };
  }

  private mapStripeStatus(eventType: string): string | null {
    const statusMap: Record<string, string> = {
      'payment_intent.succeeded': 'APPROVED',
      'payment_intent.payment_failed': 'DECLINED',
      'charge.refunded': 'REFUNDED',
    };
    return statusMap[eventType] ?? null;
  }

  private mapWompiStatus(status: string): string | null {
    const statusMap: Record<string, string> = {
      'APPROVED': 'APPROVED',
      'DECLINED': 'DECLINED',
      'ERROR': 'ERROR',
      'VOIDED': 'VOIDED',
      'PENDING': 'PENDING',
    };
    return statusMap[status] ?? null;
  }

  private async checkEventProcessed(eventId: string, provider: string): Promise<boolean> {
    const result = await db.queryWithResult(
      'SELECT id FROM webhook_events WHERE event_id = $1 AND provider = $2',
      [eventId, provider]
    );
    return (result.rowCount ?? 0) > 0;
  }

  private async markEventProcessed(eventId: string, provider: string, eventType: string): Promise<void> {
    await db.query(
      'INSERT INTO webhook_events (event_id, provider, event_type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [eventId, provider, eventType]
    );
  }

  private async processWebhookEvent(
    eventId: string,
    provider: string,
    eventType: string | null,
    transactionId: string | null,
    orderId: string | null,
    newStatus: string | null
  ): Promise<void> {
    if (!transactionId || !newStatus) return;

    const updateResult = await db.queryWithResult(
      `UPDATE orders 
       SET payment_status = $1, status = $2, updated_at = NOW()
       WHERE transaction_id = $3`,
      [newStatus, newStatus === 'APPROVED' ? 'paid' : 'pending_payment', transactionId]
    );

    if ((updateResult.rowCount ?? 0) > 0) {
      await db.query(
        'UPDATE payment_transactions SET status = $1, updated_at = NOW() WHERE transaction_id = $2',
        [newStatus, transactionId]
      );
    }

    await this.markEventProcessed(eventId, provider, eventType ?? 'unknown');
  }
}
