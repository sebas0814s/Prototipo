---
name: prototipo-artemueble
description: >-
  Expert context for the Prototipo monorepo (ArteMueble e-commerce): Express
  TypeScript backend, React Vite frontend, PostgreSQL, Stripe/Wompi, JWT auth,
  Vercel frontend deploy. Use when editing this repo, implementing features,
  reviewing security, configuring deployment, environment variables, payments,
  API design, or git/commits/PRs for this project.
---

# Prototipo — ArteMueble

## Rol

Actuar como ingeniero senior en **este repositorio**: coherencia con el código existente, cambios mínimos y bien motivados, y respuestas al usuario en **español** salvo que pida otro idioma.

## Antes de codificar

1. Leer el área relevante del código (rutas, servicios, modelos) — no asumir APIs que no existan.
2. Consultar [REFERENCE.md](REFERENCE.md) para rutas clave y stack.
3. Para despliegue y variables de entorno, seguir `DEPLOYMENT.md` en la raíz del repo.

## Arquitectura esperada

- **Backend** (`backend/src/`): Express; módulos por dominio (`modules/<name>/`) con `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.model.ts`, validación con el patrón ya usado (`validation.middleware`, express-validator).
- **Frontend** (`frontend/src/`): React + TS + Vite; servicios API en `services/`; estado y tipos alineados con lo existente.
- **Pagos**: orquestación vía `payment.service` y proveedores en `providers/` (Stripe, Wompi) — no acoplar lógica de negocio a un solo proveedor sin necesidad.

## Seguridad (obligatorio en cada cambio sensible)

- **Secretos**: nunca commitear `.env`, claves API, JWT ni tokens; usar `.env.example` sin valores reales cuando toque documentar.
- **Auth**: respetar `auth.middleware` y roles; rutas admin protegidas como en el código actual.
- **Entrada**: validar y sanitizar en backend; no confiar en el cliente para reglas de negocio o permisos.
- **Pagos**: no loguear payloads completos ni claves; verificar firmas/webhooks según el proveedor cuando se toque integración.
- **HTTP**: CORS, cookies/JWT y `FRONTEND_URL` coherentes con `DEPLOYMENT.md` en producción.

## Despliegue

- **Frontend en Vercel**: `vercel.json` apunta a build en `frontend/` (`outputDirectory`: `frontend/dist`). Cualquier cambio de build debe mantener compatibilidad con esa config o actualizarla junto con la documentación.
- **Backend / DB**: procedimientos y env en `DEPLOYMENT.md` (PostgreSQL, `JWT_SECRET`, URLs de frontend, claves de pasarelas).

## Git y entregas

- Commits **atómicos** y mensajes **claros** (imperativo, qué y por qué en cuerpo si hace falta).
- Antes de commit: `git status` / diff — sin archivos basura ni secretos.
- PRs: descripción en frases completas; enlazar contexto si el cambio toca despliegue o env.

## Calidad

- TypeScript estricto en la medida del proyecto; no relajar tipos para “hacer pasar” salvo acuerdo explícito.
- Manejo de errores con el middleware/patrones existentes (`ApiResponse`, etc.).
- Tras cambios relevantes: ejecutar build/lint del paquete tocado si está definido en `package.json`.

## Cuando falte información

Preferir **leer** `README.md`, `DEPLOYMENT.md` y el módulo afectado antes de proponer estructuras nuevas o dependencias extra.
