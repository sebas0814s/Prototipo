import { PaymentProvider, PaymentIntentPayload, PaymentIntentResult, TransactionStatus } from './payment.interface';
import { StripeProvider } from './providers/stripe.provider';
import { WompiProvider } from './providers/wompi.provider';
import { db } from '../../config/database';

export type GatewayName = 'stripe' | 'wompi';

/**
 * PaymentService applies the Strategy Pattern:
 * the concrete PaymentProvider (gateway) is swapped at runtime
 * based on the user's selected payment method.
 *
 * Adding a new gateway = implementing PaymentProvider + registering it here.
 */
export class PaymentService {
  private readonly providers: Map<GatewayName, PaymentProvider>;

  constructor() {
    this.providers = new Map<GatewayName, PaymentProvider>([
      ['stripe', new StripeProvider()],
      ['wompi', new WompiProvider()],
    ]);
  }

  /** Selects the appropriate strategy and creates a payment intent */
  public async initiatePayment(
    gateway: GatewayName,
    payload: PaymentIntentPayload
  ): Promise<PaymentIntentResult> {
    const provider = this.resolveProvider(gateway);
    const result = await provider.createPaymentIntent(payload);

    await this.saveTransaction({
      transactionId: result.transactionId,
      orderId: payload.orderId,
      provider: gateway,
      status: result.status,
      amountInCents: payload.amountInCents,
      currency: payload.currency,
    });

    return result;
  }

  /** Delegates status check to the correct gateway */
  public async checkStatus(gateway: GatewayName, transactionId: string): Promise<TransactionStatus> {
    const provider = this.resolveProvider(gateway);
    const status = await provider.getTransactionStatus(transactionId);

    await db.query(
      'UPDATE payment_transactions SET status = $1, updated_at = NOW() WHERE transaction_id = $2',
      [status, transactionId]
    );

    return status;
  }

  /** Validates an incoming webhook from the specified gateway */
  public validateWebhook(gateway: GatewayName, payload: unknown, signature: string): boolean {
    const provider = this.resolveProvider(gateway);
    return provider.validateWebhook(payload, signature);
  }

  private resolveProvider(gateway: GatewayName): PaymentProvider {
    const provider = this.providers.get(gateway);
    if (!provider) throw new Error(`Unsupported payment gateway: "${gateway}"`);
    return provider;
  }

  private async saveTransaction(data: {
    transactionId: string;
    orderId: string;
    provider: string;
    status: TransactionStatus;
    amountInCents: number;
    currency: string;
  }): Promise<void> {
    await db.query(
      `INSERT INTO payment_transactions
         (transaction_id, order_id, provider, status, amount_in_cents, currency)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (transaction_id) DO NOTHING`,
      [data.transactionId, data.orderId, data.provider, data.status, data.amountInCents, data.currency]
    );
  }
}
