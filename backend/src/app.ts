import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { ENV } from './config/env';
import { db } from './config/database';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';

import productRoutes  from './modules/product/product.routes';
import cartRoutes     from './modules/cart/cart.routes';
import userRoutes     from './modules/user/user.routes';
import orderRoutes    from './modules/order/order.routes';
import paymentRoutes  from './modules/payment/payment.routes';

const app = express();

// ─── Security Headers ──────────────────────────────────────────
app.use(helmet());

// ─── Rate Limiting ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, intenta después' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos, intenta después de 15 minutos' },
});

app.use(globalLimiter);

// ─── CORS & Body Parsers ───────────────────────────────────────
const corsOptions: cors.CorsOptions = {
  origin: ENV.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── API Routes ───────────────────────────────────────────────
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/cart`,     cartRoutes);
app.use(`${API_PREFIX}/users`,    userRoutes);
app.use(`${API_PREFIX}/orders`,   orderRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', env: ENV.NODE_ENV }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ArteMueble API Docs',
}));

// ─── Global Error Handler (must be last) ──────────────────────
app.use(errorMiddleware);

// ─── Bootstrap ────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  await db.connect();
  app.listen(ENV.PORT, () => {
    console.log(`[Server] Running on http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});

export default app;
