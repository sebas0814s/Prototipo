# Guía de Deployment - ArteMueble E-commerce

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

---

## 1. Configuración de la Base de Datos

### Crear Base de Datos
```bash
psql -U postgres -c "CREATE DATABASE artemueble_db;"
```

### Ejecutar Schema
```bash
psql -U postgres -d artemueble_db -f src/database/schema.sql
```

---

## 2. Configuración del Backend

### Variables de Entorno
Crear archivo `backend/.env`:
```env
# Entorno
NODE_ENV=production
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artemueble_db
DB_USER=postgres
DB_PASSWORD=tu_password_seguro

# Seguridad (OBLIGATORIO en producción)
JWT_SECRET=genera_un_token_largo_y_aleatorio_aqui
JWT_EXPIRES_IN=7d

# Pasarelas de pago
STRIPE_SECRET_KEY=sk_live_...
WOMPI_PUBLIC_KEY=pub_test_...
WOMPI_PRIVATE_KEY=prv_test_...

# Frontend URL
FRONTEND_URL=https://tu-dominio.com
```

### Generar JWT_SECRET seguro
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Instalar y Compilar
```bash
cd backend
npm install
npm run build
```

### Iniciar en Producción
```bash
npm start
```

---

## 3. Configuración del Frontend

### Variables de Entorno
Crear archivo `frontend/.env`:
```env
VITE_API_URL=https://api.tu-dominio.com
```

### Build de Producción
```bash
cd frontend
npm install
npm run build
```

---

## 4. Deployment en Railway (Recomendado)

### Backend
1. Crear nuevo proyecto en Railway
2. Conectar repositorio Git
3. Agregar variables de entorno
4. Railway detectará automáticamente Node.js

### Base de Datos
1. Agregar plugin PostgreSQL
2. Obtener connection string de las variables de entorno

### Frontend
1. Crear nuevo proyecto
2. Conectar repositorio
3. Configurar build command: `npm run build`
4. Output directory: `dist`

---

## 5. Deployment en Render

### Backend (Web Service)
```yaml
# render.yaml
services:
  - type: web
    name: artemueble-api
    env: node
    region: us-east
    buildCommand: npm install && npm run build
    startCommand: npm start
```

### Frontend (Static Site)
```yaml
  - type: web
    name: artemueble-web
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
```

---

## 6. Configuración de Webhooks

### Stripe
```bash
# En dashboard.stripe.com
stripe listen --forward-to tu-dominio.com/api/v1/payments/webhook/stripe
```

### Wompi
Configurar en portal de Wompi la URL:
```
https://tu-dominio.com/api/v1/payments/webhook/wompi
```

---

## 7. Checklist de Seguridad

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` configurado (no default)
- [ ] Contraseña de BD fuerte
- [ ] HTTPS habilitado
- [ ] CORS configurado con dominio correcto
- [ ] Rate limiting activo
- [ ] Headers de seguridad (Helmet) activos

---

## 8. Comandos Rápidos

```bash
# Desarrollo
cd backend && npm run dev
cd frontend && npm run dev

# Producción
cd backend && npm start
# Servir frontend desde /dist con nginx o similar

# Verificar API
curl http://localhost:3000/health

# Ver documentación Swagger
curl http://localhost:3000/api-docs
```

---

## 9. Estructura de Production

```
                    ┌─────────────┐
                    │   Browser   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Nginx     │
                    │  (SSL/Proxy)│
                    └──────┬──────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
  ┌──────▼──────┐                   ┌───────▼──────┐
  │  Frontend   │                   │    Backend   │
  │   (Vercel)  │                   │   (Railway)  │
  │   Puerto    │                   │    Puerto    │
  │   5173      │                   │    3000      │
  └─────────────┘                   └───────┬──────┘
                                           │
                                   ┌───────▼──────┐
                                   │  PostgreSQL  │
                                   │   (Railway)  │
                                   └──────────────┘
```

---

## 10. Monitoreo

### Logs
```bash
# Ver logs en Railway
railway logs -f

# Ver logs en Render
render logs -f
```

### Health Check
```bash
curl https://api.tu-dominio.com/health
```

### Swagger Docs
```bash
curl https://api.tu-dominio.com/api-docs
```
