import {
  PaymentProvider,
  PaymentIntentPayload,
  PaymentIntentResult,
  TransactionStatus,
} from '../payment.interface';
import { ENV } from '../../../config/env';
import crypto from 'crypto';

/**
 * Wompi (Colombia) implementation of PaymentProvider.
 * Generates a signed checkout URL for the Wompi Widget.
 * Docs: https://docs.wompi.co
 */
export class WompiProvider implements PaymentProvider {
  public readonly name = 'wompi';

  private readonly baseUrl = 'https://checkout.wompi.co/p/';
  private readonly apiUrl = 'https://production.wompi.co/v1';

  public async createPaymentIntent(payload: PaymentIntentPayload): Promise<PaymentIntentResult> {
    if (!ENV.WOMPI_PUBLIC_KEY || !ENV.WOMPI_PRIVATE_KEY) {
      throw new Error('Wompi keys are not configured');
    }

    const reference = `ORDER-${payload.orderId}-${Date.now()}`;
    const integritySignature = this.buildIntegritySignature(
      reference,
      payload.amountInCents,
      payload.currency
    );

    const checkoutUrl =
      `${this.baseUrl}?public-key=${ENV.WOMPI_PUBLIC_KEY}` +
      `&currency=${payload.currency}` +
      `&amount-in-cents=${payload.amountInCents}` +
      `&reference=${reference}` +
      `&signature:integrity=${integritySignature}` +
      `&customer-data:email=${encodeURIComponent(payload.customerEmail)}`;

    return {
      transactionId: reference,
      checkoutUrl,
      provider: this.name,
      status: 'PENDING',
    };
  }

  public async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const response = await fetch(`${this.apiUrl}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${ENV.WOMPI_PRIVATE_KEY}` },
    });

    if (!response.ok) throw new Error(`Wompi API error: ${response.status}`);

    const body = (await response.json()) as { data: { status: string } };
    return this.mapWompiStatus(body.data.status);
  }

  /**
   * Validates a Wompi webhook event using HMAC-SHA256.
   * The signature is provided in the X-Event-Checksum header.
   */
  public validateWebhook(payload: unknown, signature: string): boolean {
    const serialized = JSON.stringify(payload) + ENV.WOMPI_PRIVATE_KEY;
    const computed = crypto.createHash('sha256').update(serialized).digest('hex');
    return computed === signature;
  }

  /** Generates the integrity signature required by the Wompi widget */
  private buildIntegritySignature(reference: string, amountInCents: number, currency: string): string {
    const raw = `${reference}${amountInCents}${currency}${ENV.WOMPI_PRIVATE_KEY}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  private mapWompiStatus(status: string): TransactionStatus {
    const map: Record<string, TransactionStatus> = {
      PENDING: 'PENDING',
      APPROVED: 'APPROVED',
      DECLINED: 'DECLINED',
      ERROR: 'ERROR',
      VOIDED: 'VOIDED',
    };
    return map[status] ?? 'ERROR';
  }
}
