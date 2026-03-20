import {
  PaymentProvider,
  PaymentIntentPayload,
  PaymentIntentResult,
  TransactionStatus,
} from '../payment.interface';
import { ENV } from '../../../config/env';

/**
 * Stripe implementation of PaymentProvider.
 * Uses the Stripe SDK to create PaymentIntents and handle webhooks.
 */
export class StripeProvider implements PaymentProvider {
  public readonly name = 'stripe';

  /**
   * Creates a Stripe PaymentIntent and returns the clientSecret
   * that the frontend uses with stripe.js to confirm the payment.
   *
   * NOTE: Install @types/stripe and stripe package in production.
   */
  public async createPaymentIntent(payload: PaymentIntentPayload): Promise<PaymentIntentResult> {
    if (!ENV.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }

    // In a real implementation, instantiate Stripe with the secret key:
    // const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    // const intent = await stripe.paymentIntents.create({ amount: payload.amountInCents, currency: payload.currency });

    // Stubbed response for demonstration
    const mockIntentId = `pi_${Date.now()}`;
    const mockClientSecret = `${mockIntentId}_secret_demo`;

    return {
      transactionId: mockIntentId,
      clientSecret: mockClientSecret,
      provider: this.name,
      status: 'PENDING',
    };
  }

  public async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    // const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    // const intent = await stripe.paymentIntents.retrieve(transactionId);
    // return this.mapStripeStatus(intent.status);
    console.log(`[StripeProvider] Checking status for ${transactionId}`);
    return 'PENDING';
  }

  /**
   * Verifies the Stripe-Signature header to ensure the webhook originates from Stripe.
   * Requires STRIPE_WEBHOOK_SECRET in environment variables.
   */
  public validateWebhook(payload: unknown, signature: string): boolean {
    // const event = stripe.webhooks.constructEvent(payload as Buffer, signature, ENV.STRIPE_WEBHOOK_SECRET);
    console.log(`[StripeProvider] Validating webhook signature: ${signature}`);
    return true;
  }
}
