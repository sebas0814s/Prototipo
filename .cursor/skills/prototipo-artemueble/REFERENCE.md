# Referencia rápida — Prototipo / ArteMueble

## Stack

- Backend: Node.js, TypeScript, Express, PostgreSQL (pool en `backend/src/config/database.ts`).
- Frontend: React, TypeScript, Vite.
- Pagos: Stripe y Wompi (`backend/src/modules/payment/`).
- Auth: JWT (`backend/src/middlewares/auth.middleware.ts`).

## Raíz del repo

- `README.md` — visión general y árbol de módulos.
- `DEPLOYMENT.md` — DB, `.env` backend/frontend, producción.
- `vercel.json` — build del frontend para Vercel.

## Backend — puntos de entrada

- `backend/src/app.ts` — bootstrap y rutas.
- `backend/src/config/env.ts` — variables de entorno.
- `backend/src/database/schema.sql` — esquema PostgreSQL.

## Frontend

- `frontend/src/services/api.ts` — cliente API base.
- `frontend/vite.config.ts` — proxy/dev según configuración actual.

## Convención de carpetas (backend)

```
backend/src/modules/<dominio>/
  *.routes.ts
  *.controller.ts
  *.service.ts
  *.model.ts
  *.validation.ts   (si aplica)
```

Mantener nuevas features dentro de este patrón salvo razón fuerte documentada en el cambio.
