import { Router } from 'express';
import { CartController } from './cart.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new CartController();

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Obtener carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 */
router.get('/', controller.getCart);

/**
 * @swagger
 * /api/v1/cart/items:
 *   post:
 *     summary: Agregar item al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, name, price, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item agregado
 */
router.post('/items', controller.addItem);

/**
 * @swagger
 * /api/v1/cart/items/{productId}:
 *   put:
 *     summary: Actualizar cantidad de item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 */
router.put('/items/:productId', controller.updateQuantity);

/**
 * @swagger
 * /api/v1/cart/items/{productId}:
 *   delete:
 *     summary: Eliminar item del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item eliminado
 */
router.delete('/items/:productId', controller.removeItem);

/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Vaciar carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete('/', controller.clearCart);

export default router;
