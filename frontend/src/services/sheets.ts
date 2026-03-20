/**
 * Integración con Google Sheets via Google Apps Script Web App.
 *
 * ──────────────────────────────────────────────────────────────
 *  PASOS PARA CONFIGURAR (hazlo una sola vez):
 * ──────────────────────────────────────────────────────────────
 *  1. Abre https://sheets.google.com y crea una hoja llamada "Pedidos".
 *     En la fila 1 (cabeceras) escribe exactamente:
 *     Fecha | Orden ID | Nombre | Teléfono | Ciudad | Dirección | Productos | Subtotal | IVA | Total | Notas | Estado
 *
 *  2. Abre el menú Extensiones → Apps Script y pega el código de abajo.
 *
 *  3. Despliega: Implementar → Nueva implementación → Tipo: Aplicación web
 *     - Ejecutar como: Yo (tu cuenta)
 *     - Quién tiene acceso: Cualquier persona
 *     - Copia la URL que te da (termina en /exec)
 *
 *  4. Crea el archivo frontend/.env (copia de .env.example) y agrega:
 *     VITE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/TU_ID/exec
 *
 * ──────────────────────────────────────────────────────────────
 *  CÓDIGO PARA PEGAR EN APPS SCRIPT:
 * ──────────────────────────────────────────────────────────────
 *
 *  function doPost(e) {
 *    try {
 *      var data   = JSON.parse(e.postData.contents);
 *      var sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pedidos');
 *      sheet.appendRow([
 *        data.fecha,
 *        data.ordenId,
 *        data.clienteNombre,
 *        data.clienteTelefono,
 *        data.clienteCiudad,
 *        data.clienteDireccion || '',
 *        data.productos,
 *        data.subtotal,
 *        data.iva,
 *        data.total,
 *        data.notas || '',
 *        data.estado || 'Pendiente',
 *      ]);
 *      return ContentService
 *        .createTextOutput(JSON.stringify({ ok: true }))
 *        .setMimeType(ContentService.MimeType.JSON);
 *    } catch(err) {
 *      return ContentService
 *        .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
 *        .setMimeType(ContentService.MimeType.JSON);
 *    }
 *  }
 *
 *  function doGet() {
 *    return ContentService.createTextOutput('Jalac Sheets Webhook OK');
 *  }
 * ──────────────────────────────────────────────────────────────
 */

import { CartItem } from '../types';
import { CustomerInfo } from './whatsapp';

export interface OrderRow {
  fecha: string;
  ordenId: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteCiudad: string;
  clienteDireccion: string;
  productos: string;
  subtotal: number;
  iva: number;
  total: number;
  notas: string;
  estado: string;
}

function buildOrderRow(
  items: CartItem[],
  subtotal: number,
  total: number,
  customer: CustomerInfo,
): OrderRow {
  const productsSummary = items
    .map((i) => `${i.name} x${i.quantity}`)
    .join(' | ');

  return {
    fecha: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    ordenId: `WA-${Date.now()}`,
    clienteNombre: customer.name,
    clienteTelefono: customer.phone,
    clienteCiudad: customer.city,
    clienteDireccion: customer.address ?? '',
    productos: productsSummary,
    subtotal,
    iva: +(total - subtotal).toFixed(0),
    total: +total.toFixed(0),
    notas: customer.notes ?? '',
    estado: 'Pendiente confirmación',
  };
}

const WEBHOOK_URL: string = import.meta.env.VITE_SHEETS_WEBHOOK_URL ?? '';

/** Expone testSheets() en la consola del navegador para diagnóstico rápido */
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).testSheets = async () => {
    console.log('🔗 URL configurada:', WEBHOOK_URL || '❌ VACÍA');
    if (!WEBHOOK_URL) {
      console.error('El .env no se cargó. Reinicia el servidor dentro de la carpeta frontend/');
      return;
    }
    const testRow = {
      fecha: new Date().toLocaleString('es-CO'),
      ordenId: 'TEST-001',
      clienteNombre: 'Prueba Técnica',
      clienteTelefono: '3001234567',
      clienteCiudad: 'Medellín',
      clienteDireccion: '',
      productos: 'Silla de prueba x1',
      subtotal: 100000,
      iva: 19000,
      total: 119000,
      notas: '',
      estado: 'TEST',
    };
    const url = `${WEBHOOK_URL}?data=${encodeURIComponent(JSON.stringify(testRow))}`;
    console.log('📡 Abre esta URL en el navegador para verificar Apps Script:', url);
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log('✅ Respuesta del servidor:', res.status, text);
    } catch (e) {
      console.warn('⚠️ CORS bloqueó la respuesta (normal). Enviando con no-cors...');
      await fetch(url, { mode: 'no-cors' });
      console.log('📨 Petición enviada. Verifica si aparece en la hoja de cálculo.');
    }
  };
  console.info('💡 [Sheets] Escribe testSheets() en esta consola para probar la conexión.');
}

export async function logOrderToSheets(
  items: CartItem[],
  subtotal: number,
  total: number,
  customer: CustomerInfo,
): Promise<void> {
  console.group('[Sheets] 🚀 Intentando registrar pedido...');
  console.log('[Sheets] WEBHOOK_URL:', WEBHOOK_URL || '⚠️ VACÍO — revisa el .env');

  if (!WEBHOOK_URL) {
    console.error('[Sheets] ❌ VITE_SHEETS_WEBHOOK_URL no está cargado. Reinicia el servidor.');
    console.groupEnd();
    return;
  }

  const row = buildOrderRow(items, subtotal, total, customer);
  console.log('[Sheets] Datos a enviar:', row);

  const url = `${WEBHOOK_URL}?data=${encodeURIComponent(JSON.stringify(row))}`;
  console.log('[Sheets] URL completa:', url);

  try {
    // Primer intento: fetch normal para ver el error real en consola
    const res = await fetch(url, { method: 'GET' });
    console.log('[Sheets] ✅ Respuesta HTTP:', res.status, res.statusText);
    const text = await res.text();
    console.log('[Sheets] Cuerpo respuesta:', text);
  } catch (err) {
    console.warn('[Sheets] ⚠️ Fetch normal bloqueado por CORS — reintentando con no-cors...', err);
    try {
      await fetch(url, { method: 'GET', mode: 'no-cors' });
      console.log('[Sheets] Petición no-cors enviada (respuesta opaca — no podemos leerla).');
    } catch (err2) {
      console.error('[Sheets] ❌ Falló también no-cors:', err2);
    }
  }

  console.groupEnd();
}
