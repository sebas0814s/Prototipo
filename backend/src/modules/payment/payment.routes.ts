import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new PaymentController();

/**
 * @swagger
 * /api/v1/payments/initiate:
 *   post:
 *     summary: Iniciar proceso de pago
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gateway, orderId, amountInCents, currency, customerEmail]
 *             properties:
 *               gateway:
 *                 type: string
 *                 enum: [stripe, wompi]
 *               orderId:
 *                 type: string
 *                 format: uuid
 *               amountInCents:
 *                 type: integer
 *               currency:
 *                 type: string
 *                 default: COP
 *               customerEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Pago iniciado
 *       400:
 *         description: Gateway no soportado
 */
router.post('/initiate', authMiddleware, controller.initiatePayment);

/**
 * @swagger
 * /api/v1/payments/status/{gateway}/{transactionId}:
 *   get:
 *     summary: Consultar estado de transacción
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gateway
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stripe, wompi]
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de la transacción
 */
router.get('/status/:gateway/:transactionId', authMiddleware, controller.checkStatus);

/**
 * @swagger
 * /api/v1/payments/webhook/{gateway}:
 *   post:
 *     summary: Webhook para notificaciones de pago
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: gateway
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stripe, wompi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook procesado
 *       400:
 *         description: Firma inválida
 */
router.post('/webhook/:gateway', controller.handleWebhook);

export default router;
