import dotenv from 'dotenv';

dotenv.config();

/** Centralized environment variable access with validation */
export const ENV = {
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  // Database
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
  DB_NAME: process.env.DB_NAME ?? 'furniture_ecommerce',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',

  // Auth
  JWT_SECRET: (() => {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    return process.env.JWT_SECRET ?? 'dev_only_secret_do_not_use_in_production';
  })(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',

  // Payment Gateways
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  WOMPI_PUBLIC_KEY: process.env.WOMPI_PUBLIC_KEY ?? '',
  WOMPI_PRIVATE_KEY: process.env.WOMPI_PRIVATE_KEY ?? '',

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
} as const;
