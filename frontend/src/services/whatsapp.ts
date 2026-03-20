import { CartItem } from '../types';

export const WA_PHONE = '573046251510';

export interface CustomerInfo {
  name: string;
  phone: string;
  city: string;
  address?: string;
  notes?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);

export function buildWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  total: number,
  customer: CustomerInfo,
): string {
  const iva = total - subtotal;

  const productLines = items.map(
    (item, i) =>
      `  ${i + 1}. *${item.name}*\n` +
      `      ${item.quantity} ud × ${fmt(item.price)} = ${fmt(item.price * item.quantity)}`,
  );

  const lines = [
    '🛍️ *NUEVO PEDIDO — Jalac Mobiliario*',
    '',
    `👤 *Nombre:* ${customer.name}`,
    `📱 *Teléfono:* ${customer.phone}`,
    `📍 *Ciudad:* ${customer.city}`,
    ...(customer.address ? [`🏠 *Dirección:* ${customer.address}`] : []),
    '',
    '📦 *Productos:*',
    ...productLines,
    '',
    `💰 Subtotal: ${fmt(subtotal)}`,
    `🧾 IVA (19%): ${fmt(iva)}`,
    `✅ *TOTAL: ${fmt(total)}*`,
    '',
    ...(customer.notes ? [`📝 *Notas:* ${customer.notes}`, ''] : []),
    '¡Hola! Me gustaría confirmar este pedido. ¿Pueden ayudarme? 🙏',
  ];

  return lines.join('\n');
}

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** URL de imagen QR que apunta al chat de WhatsApp Business */
export const WA_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=075E54&data=${encodeURIComponent(`https://wa.me/${WA_PHONE}`)}`;
