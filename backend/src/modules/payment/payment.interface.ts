/**
 * Strategy interface that every payment gateway provider must implement.
 * Adding a new gateway only requires creating a class that satisfies this contract.
 */
export interface PaymentProvider {
  /** Human-readable name of the gateway (e.g. 'stripe', 'wompi') */
  readonly name: string;

  /**
   * Initiates a payment intent or transaction.
   * Returns the gateway-specific transaction reference and a redirect/client URL.
   */
  createPaymentIntent(payload: PaymentIntentPayload): Promise<PaymentIntentResult>;

  /** Queries the gateway to retrieve the current status of a transaction */
  getTransactionStatus(transactionId: string): Promise<TransactionStatus>;

  /**
   * Validates the authenticity of an incoming webhook event.
   * Should verify the gateway's signature to prevent spoofing.
   */
  validateWebhook(payload: unknown, signature: string): boolean;
}

export interface PaymentIntentPayload {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  orderId: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  transactionId: string;
  /** URL to redirect the user to complete payment (if applicable) */
  checkoutUrl?: string;
  /** Client secret for client-side confirmation (Stripe model) */
  clientSecret?: string;
  provider: string;
  status: TransactionStatus;
}

export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'ERROR'
  | 'VOIDED'
  | 'REFUNDED';
