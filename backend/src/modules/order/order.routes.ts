import { Router } from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new OrderController();

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Crear pedido desde el carrito
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress]
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   department:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 */
router.post('/', controller.createOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Obtener pedidos del usuario
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/', controller.getMyOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Obtener pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalle del pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', controller.getOrderById);

export default router;
