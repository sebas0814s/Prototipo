import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware, requireRole } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';
import { createProductValidation, updateProductValidation, productIdValidation } from './product.validation';

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Listar productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *         description: Filtrar por material
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: inStockOnly
 *         schema:
 *           type: boolean
 *         description: Solo productos en stock
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', ...productIdValidation, validateRequest, controller.getById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Crear producto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               material:
 *                 type: string
 *               dimensions:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', authMiddleware, requireRole('admin'), ...createProductValidation, validateRequest, controller.create);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Actualizar producto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/:id', authMiddleware, requireRole('admin'), ...updateProductValidation, validateRequest, controller.update);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Eliminar producto (Admin)
 *     tags: [Products]
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
 *         description: Producto eliminado
 */
router.delete('/:id', authMiddleware, requireRole('admin'), ...productIdValidation, validateRequest, controller.delete);

export default router;
