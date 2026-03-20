import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArteMueble E-commerce API',
      version: '1.0.0',
      description: 'API REST para e-commerce de muebles personalizados. Incluye autenticación JWT, gestión de productos, carrito, pedidos y pagos con Stripe/Wompi.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['customer', 'admin'] },
            phone: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            material: { type: 'string' },
            stock: { type: 'integer' },
            imageUrl: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            subtotal: { type: 'number' },
            total: { type: 'number' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            quantity: { type: 'integer' },
            imageUrl: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            items: { type: 'array' },
            subtotal: { type: 'number' },
            tax: { type: 'number' },
            total: { type: 'number' },
            status: { type: 'string', enum: ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] },
            paymentStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'DECLINED', 'ERROR', 'VOIDED', 'REFUNDED'] },
            shippingAddress: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Autenticación de usuarios' },
      { name: 'Users', description: 'Gestión de usuarios' },
      { name: 'Products', description: 'Catálogo de productos' },
      { name: 'Cart', description: 'Carrito de compras' },
      { name: 'Orders', description: 'Gestión de pedidos' },
      { name: 'Payments', description: 'Pasarelas de pago' },
    ],
  },
  apis: ['./src/modules/*/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
