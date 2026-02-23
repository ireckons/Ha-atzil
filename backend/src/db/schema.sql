-- ═══════════════════════════════════════════════════
-- HaAtzil Butcher Shop – PostgreSQL Schema
-- ═══════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────
-- Users (admin only)
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────
-- Categories
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,           -- e.g. "beef"
  name_he     TEXT NOT NULL,                  -- Hebrew display name
  name_en     TEXT NOT NULL,                  -- English display name
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────
-- Products
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name_he             TEXT NOT NULL,
  name_en             TEXT NOT NULL,
  description_he      TEXT,
  description_en      TEXT,
  price_nis           NUMERIC(10,2) NOT NULL,
  image_url           TEXT,
  weight_options      JSONB NOT NULL DEFAULT '[]',   -- [{"label":"500g","grams":500}, ...]
  is_available        BOOLEAN NOT NULL DEFAULT true,
  is_kosher           BOOLEAN NOT NULL DEFAULT true,
  kosher_cert_text    TEXT,
  unit                TEXT NOT NULL DEFAULT 'kg',   -- 'kg' | 'unit' | 'portion'
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);

-- ─────────────────────────────────────
-- Pickup Slots
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS pickup_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date       DATE NOT NULL,
  slot_time       TIME NOT NULL,
  capacity        INT NOT NULL DEFAULT 10,
  booked_count    INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slot_date, slot_time)
);

CREATE INDEX idx_slots_date ON pickup_slots(slot_date);

-- ─────────────────────────────────────
-- Orders
-- ─────────────────────────────────────
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'ready', 'collected', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,  -- human-readable e.g. "HA-20240224-0001"
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  pickup_slot_id  UUID NOT NULL REFERENCES pickup_slots(id) ON DELETE RESTRICT,
  status          order_status NOT NULL DEFAULT 'pending',
  notes           TEXT,
  total_nis       NUMERIC(10,2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_slot ON orders(pickup_slot_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ─────────────────────────────────────
-- Order Items
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  name_he     TEXT NOT NULL,  -- snapshot at order time
  name_en     TEXT NOT NULL,
  price_nis   NUMERIC(10,2) NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  weight_g    INT,            -- grams chosen (nullable for unit products)
  subtotal_nis NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ─────────────────────────────────────
-- Audit Log
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,   -- 'order' | 'product'
  entity_id   UUID NOT NULL,
  action      TEXT NOT NULL,   -- 'status_change' | 'create' | 'update' | 'delete'
  old_value   JSONB,
  new_value   JSONB,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_time ON audit_log(performed_at DESC);

-- ─────────────────────────────────────
-- Auto-update updated_at trigger
-- ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
