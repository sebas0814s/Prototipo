-- ============================================================
--  Custom Furniture E-commerce — Relational Schema (PostgreSQL)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100)  NOT NULL UNIQUE,
  slug        VARCHAR(120)  NOT NULL UNIQUE,
  description TEXT,
  image_url   VARCHAR(500),
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Furniture (Products) ─────────────────────────────────────
CREATE TABLE furniture (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID          NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name        VARCHAR(200)  NOT NULL,
  description TEXT          NOT NULL,
  material    VARCHAR(50)   NOT NULL CHECK (material IN ('wood','metal','glass','fabric','leather','mixed')),
  price       NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  stock       INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
  width_cm    NUMERIC(8,2)  NOT NULL,
  height_cm   NUMERIC(8,2)  NOT NULL,
  depth_cm    NUMERIC(8,2)  NOT NULL,
  images      TEXT[]        NOT NULL DEFAULT '{}',
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_furniture_category  ON furniture(category_id);
CREATE INDEX idx_furniture_material  ON furniture(material);
CREATE INDEX idx_furniture_price     ON furniture(price);
CREATE INDEX idx_furniture_is_active ON furniture(is_active);

-- ─── Users ────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name    VARCHAR(100)  NOT NULL,
  last_name     VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  phone         VARCHAR(30),
  address       JSONB,
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─── Carts ────────────────────────────────────────────────────
CREATE TABLE carts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  items      JSONB       NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Orders ───────────────────────────────────────────────────
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID          NOT NULL REFERENCES users(id),
  items            JSONB         NOT NULL,
  subtotal         NUMERIC(12,2) NOT NULL,
  tax              NUMERIC(12,2) NOT NULL,
  total            NUMERIC(12,2) NOT NULL,
  status           VARCHAR(30)   NOT NULL DEFAULT 'pending_payment'
                   CHECK (status IN ('pending_payment','paid','processing','shipped','delivered','cancelled')),
  payment_status   VARCHAR(20)   NOT NULL DEFAULT 'PENDING'
                   CHECK (payment_status IN ('PENDING','APPROVED','DECLINED','ERROR','VOIDED','REFUNDED')),
  payment_provider VARCHAR(30),
  transaction_id   VARCHAR(255),
  shipping_address JSONB         NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status  ON orders(status);

-- ─── Payment Transactions ─────────────────────────────────────
CREATE TABLE payment_transactions (
  id              SERIAL PRIMARY KEY,
  transaction_id  VARCHAR(255)  NOT NULL UNIQUE,
  order_id        UUID          NOT NULL REFERENCES orders(id),
  provider        VARCHAR(30)   NOT NULL,
  status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
  amount_in_cents BIGINT        NOT NULL,
  currency        VARCHAR(10)   NOT NULL DEFAULT 'COP',
  raw_response    JSONB,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Webhook Events (Idempotency) ──────────────────────────────
CREATE TABLE webhook_events (
  id              SERIAL PRIMARY KEY,
  event_id        VARCHAR(255)  NOT NULL,
  provider        VARCHAR(30)   NOT NULL,
  event_type      VARCHAR(50)   NOT NULL,
  processed_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, provider)
);

CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_id_type ON webhook_events(event_id, event_type);

-- ─── Seed: default categories ─────────────────────────────────
INSERT INTO categories (name, slug, description) VALUES
  ('Living Room',  'living-room',  'Sofas, armchairs and coffee tables'),
  ('Bedroom',      'bedroom',      'Beds, wardrobes and nightstands'),
  ('Dining Room',  'dining-room',  'Tables and dining chairs'),
  ('Office',       'office',       'Desks, shelves and ergonomic chairs'),
  ('Outdoor',      'outdoor',      'Weather-resistant patio furniture');
