# ArteMueble — E-commerce de Muebles Personalizados

Stack: **Node.js + TypeScript** (backend) · **React + TypeScript + Vite** (frontend) · **PostgreSQL**

---

## Árbol de Directorios

```
furniture-ecommerce/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts                          ← Bootstrap de Express + rutas globales
│       ├── config/
│       │   ├── database.ts                 ← Singleton Pool de PostgreSQL
│       │   └── env.ts                      ← Variables de entorno centralizadas
│       ├── shared/
│       │   ├── types/index.ts              ← Tipos globales (ApiResponse, JwtPayload…)
│       │   └── utils/index.ts              ← Helpers (successResponse, errorResponse)
│       ├── middlewares/
│       │   ├── auth.middleware.ts          ← Verificación JWT + control de roles
│       │   ├── error.middleware.ts         ← Manejador global de errores
│       │   └── validation.middleware.ts    ← Validación express-validator
│       ├── database/
│       │   └── schema.sql                  ← DDL relacional completo (PostgreSQL)
│       └── modules/
│           ├── product/
│           │   ├── product.model.ts        ← Clase Furniture (entidad de dominio)
│           │   ├── product.service.ts      ← CRUD + filtros paginados
│           │   ├── product.controller.ts   ← Adaptador HTTP
│           │   └── product.routes.ts       ← Rutas públicas/admin
│           ├── cart/
│           │   ├── cart.model.ts           ← Clase Cart (addItem, removeItem, calculateTotal)
│           │   ├── cart.service.ts         ← Persistencia carrito en DB
│           │   ├── cart.controller.ts
│           │   └── cart.routes.ts
│           ├── payment/
│           │   ├── payment.interface.ts    ← Contrato PaymentProvider (Strategy)
│           │   ├── payment.service.ts      ← Orquestador — selecciona proveedor en runtime
│           │   ├── payment.controller.ts
│           │   ├── payment.routes.ts
│           │   └── providers/
│           │       ├── stripe.provider.ts  ← Implementación Stripe
│           │       └── wompi.provider.ts   ← Implementación Wompi (Colombia)
│           ├── user/
│           │   ├── user.model.ts           ← Clase User (hashPassword, verifyPassword)
│           │   ├── user.service.ts         ← Auth (register/login/JWT)
│           │   ├── user.controller.ts
│           │   └── user.routes.ts
│           └── order/
│               ├── order.model.ts          ← Clase Order (ciclo de vida del pedido)
│               ├── order.service.ts        ← Crea pedido desde carrito
│               ├── order.controller.ts
│               └── order.routes.ts
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.tsx                        ← Entry point
        ├── App.tsx                         ← Router + QueryClient + Toaster
        ├── index.css                       ← Tailwind base
        ├── types/index.ts                  ← Tipos del dominio (Product, Cart, User…)
        ├── services/
        │   └── api.ts                      ← Axios client + todos los endpoints
        ├── store/
        │   └── index.ts                    ← Zustand (authStore + cartStore)
        ├── hooks/                          ← (espacio para custom hooks)
        ├── pages/
        │   ├── Home.tsx                    ← Hero + features + productos destacados
        │   ├── Products.tsx                ← Catálogo con filtros
        │   ├── ProductDetail.tsx           ← Detalle + selector de cantidad
        │   ├── Cart.tsx                    ← Carrito + resumen
        │   ├── Checkout.tsx                ← Dirección + selección de pasarela
        │   ├── Login.tsx
        │   └── Profile.tsx                 ← Perfil + historial de pedidos
        └── components/
            ├── layout/
            │   ├── Navbar.tsx              ← Sticky nav + contador carrito + auth
            │   └── Footer.tsx
            ├── common/
            │   └── Button.tsx              ← Componente reutilizable con variantes
            ├── product/
            │   ├── ProductCard.tsx         ← Card con agregar al carrito
            │   └── ProductGrid.tsx         ← Grid con skeleton loader
            └── cart/
                └── CartItem.tsx            ← Línea de carrito con stepper
```

---

## Principios de Arquitectura Aplicados

| Principio | Dónde se ve |
|-----------|-------------|
| **Layered Architecture** | Model → Service → Controller → Routes |
| **POO / Clases de dominio** | `Furniture`, `Cart`, `Order`, `User` |
| **Strategy Pattern** | `PaymentProvider` + `StripeProvider` / `WompiProvider` |
| **Singleton** | `Database` (pool de conexiones) |
| **Clean Code** | Nombres en inglés, tipado estricto, responsabilidad única por archivo |
| **Separation of Concerns** | Módulos independientes por dominio |

---

## Puesta en Marcha

### Backend
```bash
cd backend
cp .env.example .env        # Configurar variables de entorno
npm install
# Crear la BD: psql -U postgres -c "CREATE DATABASE furniture_ecommerce;"
# Ejecutar schema: psql -U postgres -d furniture_ecommerce -f src/database/schema.sql
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

La API corre en `http://localhost:3000` y el frontend en `http://localhost:5173`.

---

## Endpoints Principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/products` | No | Listar productos con filtros |
| GET | `/api/v1/products/:id` | No | Detalle de producto |
| POST | `/api/v1/products` | Admin | Crear producto |
| GET | `/api/v1/cart` | Sí | Ver carrito |
| POST | `/api/v1/cart/items` | Sí | Agregar ítem |
| POST | `/api/v1/users/register` | No | Registro |
| POST | `/api/v1/users/login` | No | Login → JWT |
| POST | `/api/v1/orders` | Sí | Crear pedido desde carrito |
| POST | `/api/v1/payments/initiate` | Sí | Iniciar pago (Stripe/Wompi) |
| POST | `/api/v1/payments/webhook/:gateway` | No | Webhook de pasarela |
