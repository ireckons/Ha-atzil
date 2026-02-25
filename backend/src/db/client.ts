/**
 * SQLite-backed DB client (drop-in replacement for the pg pool).
 * Uses better-sqlite3 so no PostgreSQL server is required locally.
 * The query() function mirrors the pg Pool.query() signature so the
 * rest of the codebase needs zero changes.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(__dirname, '..', '..', 'haatzil.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─────────────────────────────────────
// Bootstrap schema + seed (idempotent)
// ─────────────────────────────────────
function bootstrap() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name          TEXT,
      is_admin      INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT UNIQUE NOT NULL,
      name_he     TEXT NOT NULL,
      name_en     TEXT NOT NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id                TEXT PRIMARY KEY,
      category_id       INTEGER NOT NULL REFERENCES categories(id),
      name_he           TEXT NOT NULL,
      name_en           TEXT NOT NULL,
      description_he    TEXT,
      description_en    TEXT,
      price_nis         REAL NOT NULL,
      image_url         TEXT,
      weight_options    TEXT NOT NULL DEFAULT '[]',
      is_available      INTEGER NOT NULL DEFAULT 1,
      is_kosher         INTEGER NOT NULL DEFAULT 1,
      kosher_cert_text  TEXT,
      unit              TEXT NOT NULL DEFAULT 'kg',
      created_at        TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pickup_slots (
      id            TEXT PRIMARY KEY,
      slot_date     TEXT NOT NULL,
      slot_time     TEXT NOT NULL,
      capacity      INTEGER NOT NULL DEFAULT 10,
      booked_count  INTEGER NOT NULL DEFAULT 0,
      is_active     INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (slot_date, slot_time)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id              TEXT PRIMARY KEY,
      order_number    TEXT UNIQUE NOT NULL,
      customer_name   TEXT NOT NULL,
      customer_phone  TEXT NOT NULL,
      customer_email  TEXT,
      pickup_slot_id  TEXT NOT NULL REFERENCES pickup_slots(id),
      status          TEXT NOT NULL DEFAULT 'pending',
      notes           TEXT,
      total_nis       REAL NOT NULL,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id          TEXT PRIMARY KEY,
      order_id    TEXT NOT NULL REFERENCES orders(id),
      product_id  TEXT NOT NULL REFERENCES products(id),
      name_he     TEXT NOT NULL,
      name_en     TEXT NOT NULL,
      price_nis   REAL NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      weight_g    INTEGER,
      subtotal_nis REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id           TEXT PRIMARY KEY,
      entity_type  TEXT NOT NULL,
      entity_id    TEXT NOT NULL,
      action       TEXT NOT NULL,
      old_value    TEXT,
      new_value    TEXT,
      performed_by TEXT,
      performed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedIfEmpty();
}

function seedIfEmpty() {
  const count = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c;
  if (count > 0) return;

  // Categories
  const insertCat = db.prepare(
    `INSERT OR IGNORE INTO categories (slug, name_he, name_en, sort_order) VALUES (?, ?, ?, ?)`
  );
  const categories = [
    ['beef', 'בקר', 'Beef', 1],
    ['lamb', 'כבש וטלה', 'Lamb', 2],
    ['poultry', 'עוף והודו', 'Poultry', 3],
    ['prepared', 'מוכן לבישול', 'Prepared Foods', 4],
    ['kosher-special', 'מיוחדי כשרות', 'Kosher Specials', 5],
  ] as const;
  categories.forEach((c) => insertCat.run(...c));

  const catId = (slug: string): number =>
    (db.prepare('SELECT id FROM categories WHERE slug=?').get(slug) as { id: number }).id;

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products
      (id, category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  const products = [
    // BEEF
    [uuidv4(), catId('beef'), 'אנטריקוט טרי', 'Ribeye Steak', 'נתח פרמיום מהצלעות', 'Premium ribeye cut, beautifully marbled.', 189, '[{"label":"300g","grams":300},{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/beef/ribeye.jpg'],
    [uuidv4(), catId('beef'), 'פילה בקר מובחר', 'Beef Tenderloin', 'הנתח הרך ביותר', 'The most tender cut.', 229, '[{"label":"250g","grams":250},{"label":"500g","grams":500}]', 'kg', 'Badatz Mehadrin', '/images/products/beef/tenderloin.jpg'],
    [uuidv4(), catId('beef'), 'צלי כתף בקר', 'Chuck Roast', 'נתח כתף שמנמן', 'Fatty shoulder roast, ideal for slow cooking.', 89, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]', 'kg', 'Badatz Mehadrin', '/images/products/beef/chuck_roast.jpg'],
    [uuidv4(), catId('beef'), 'שפיץ צ״אק', 'Chuck Eye Roll', 'נתח טוסס עם טעם עשיר', 'Flavourful chuck eye roll.', 119, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/beef/chuck_eye.jpg'],
    [uuidv4(), catId('beef'), 'כבד בקר טרי', 'Fresh Beef Liver', 'כבד בקר טרי ואיכותי', 'Fresh quality beef liver.', 59, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/beef/liver.jpg'],
    // LAMB
    [uuidv4(), catId('lamb'), 'צלעות כבש', 'Lamb Chops', 'צלעות כבש עסיסיות', 'Juicy lamb chops.', 149, '[{"label":"400g","grams":400},{"label":"800g","grams":800}]', 'kg', 'Badatz Mehadrin', '/images/products/lamb/lamb_chops.jpg'],
    [uuidv4(), catId('lamb'), 'קבב טלה', 'Lamb Kebab', 'קבב טלה הכן לצלייה', 'Ready-to-grill lamb kebab.', 79, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/lamb/lamb_kebab.jpg'],
    [uuidv4(), catId('lamb'), 'כתף טלה שלמה', 'Whole Lamb Shoulder', 'כתף טלה שלמה', 'Whole lamb shoulder.', 199, '[{"label":"1.5kg","grams":1500},{"label":"2.5kg","grams":2500}]', 'kg', 'Badatz Mehadrin', '/images/products/lamb/lamb_shoulder.jpg'],
    [uuidv4(), catId('lamb'), 'שוק כבש', 'Lamb Leg', 'שוק כבש מהרבה ראשונה', 'First-grade lamb leg.', 169, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]', 'kg', 'Badatz Mehadrin', '/images/products/lamb/lamb_leg.jpg'],
    // POULTRY
    [uuidv4(), catId('poultry'), 'שניצל עוף', 'Chicken Schnitzel', 'פרגיות עוף פרוסות', 'Sliced chicken breasts ready for schnitzel.', 56, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/poultry/chicken_schnitzel.jpg'],
    [uuidv4(), catId('poultry'), 'שווארמה הודו', 'Turkey Shawarma', 'תערובת שווארמה הודו', 'Ground turkey shawarma blend.', 69, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/poultry/turkey_shawarma.jpg'],
    [uuidv4(), catId('poultry'), 'עוף שלם טרי', 'Whole Fresh Chicken', 'עוף שלם גדול', 'Large whole chicken, antibiotic-free.', 48, '[{"label":"1.2kg","grams":1200},{"label":"1.8kg","grams":1800}]', 'unit', 'Badatz Mehadrin', '/images/products/poultry/whole_chicken.jpg'],
    [uuidv4(), catId('poultry'), 'כרעיים עוף', 'Chicken Legs', 'כרעיים עוף שמינות', 'Plump chicken legs.', 39, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]', 'kg', 'Badatz Mehadrin', '/images/products/poultry/chicken_legs.jpg'],
    [uuidv4(), catId('poultry'), 'חזה הודו פרוס', 'Sliced Turkey Breast', 'חזה הודו פרוס דק', 'Thinly sliced turkey breast.', 59, '[{"label":"300g","grams":300},{"label":"600g","grams":600}]', 'kg', 'Badatz Mehadrin', '/images/products/poultry/turkey_breast.jpg'],
    // PREPARED
    [uuidv4(), catId('prepared'), 'קציצות בקר הכן', 'Ready Beef Patties', 'קציצות בקר מתובלות', 'Seasoned beef patties ready to pan-fry.', 72, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/prepared/beef_patties.jpg'],
    [uuidv4(), catId('prepared'), 'מרינדה אנטריקוט', 'Marinated Ribeye', 'אנטריקוט במרינדת שום', 'Ribeye in garlic and herb marinade.', 199, '[{"label":"400g","grams":400},{"label":"800g","grams":800}]', 'kg', 'Badatz Mehadrin', '/images/products/prepared/marinated_ribeye.jpg'],
    [uuidv4(), catId('prepared'), 'נקניקיות בקר', 'Beef Sausages', 'נקניקיות בקר ביתיות', 'Homestyle beef sausages.', 64, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin', '/images/products/prepared/beef_sausages.jpg'],
    [uuidv4(), catId('prepared'), 'מרק עצמות', 'Beef Bone Broth Kit', 'עצמות מרק עם ירקות', 'Soup bones with root vegetables.', 45, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]', 'kg', 'Badatz Mehadrin', '/images/products/prepared/bone_broth.jpg'],
    // KOSHER SPECIALS
    [uuidv4(), catId('kosher-special'), 'בשר בקר מהדרין', 'Mehadrin Beef Selection', 'מבחר נתחי בקר מהדרין', 'Mehadrin beef selection.', 249, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]', 'kg', 'Badatz Mehadrin min HaMehadrin', '/images/products/kosher-special/mehadrin_beef.jpg'],
    [uuidv4(), catId('kosher-special'), 'כבש מהדרין לר״ה', 'Mehadrin Lamb for Rosh Hashana', 'כבש שלם או חצי', 'Whole or half lamb for the holidays.', 899, '[{"label":"half","grams":4000},{"label":"whole","grams":8000}]', 'unit', 'Badatz Mehadrin min HaMehadrin', '/images/products/kosher-special/mehadrin_lamb.jpg'],
    [uuidv4(), catId('kosher-special'), 'הודו שלם לחג', 'Whole Turkey for Holiday', 'הודו שלם מהדרין', 'Whole mehadrin turkey.', 289, '[{"label":"4kg","grams":4000},{"label":"6kg","grams":6000}]', 'unit', 'Badatz Mehadrin', '/images/products/kosher-special/whole_turkey.jpg'],
  ];

  products.forEach((p) => insertProduct.run(...p));

  // Admin user (password: Admin1234!)
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password_hash, is_admin)
    VALUES (?, 'admin@haatzil.co.il', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGMQbgY4p9.uqNF8T3y7d2X1lhe', 1)
  `).run(uuidv4());
}

bootstrap();

// ─────────────────────────────────────
// pg-compatible query() shim
// Converts SQLite results to the same { rows, rowCount } shape
// ─────────────────────────────────────
type QueryResult<T> = { rows: T[]; rowCount: number };

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  // Convert Postgres $1,$2 placeholders → ? for SQLite
  const sql = text.replace(/\$\d+/g, '?');

  // Detect statement type
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT')) {
    const rows = db.prepare(sql).all(...params) as T[];
    return { rows, rowCount: rows.length };
  } else {
    const info = db.prepare(sql).run(...params);
    // For INSERT … RETURNING * (Postgres syntax), re-fetch the row
    if (/RETURNING \*/i.test(text)) {
      // Extract table name
      const match = text.match(/(?:INSERT INTO|UPDATE)\s+(\w+)/i);
      if (match) {
        const table = match[1];
        const lastId = info.lastInsertRowid;
        const row = db.prepare(`SELECT * FROM ${table} WHERE rowid=?`).get(lastId) as T | undefined;
        const rows = row ? [row] : [];
        return { rows, rowCount: rows.length };
      }
    }
    return { rows: [], rowCount: info.changes };
  }
}

// Dummy pool export for any code that might reference pool.end()
export const pool = {
  end: () => Promise.resolve(),
  connect: () => Promise.resolve({ release: () => { }, query }),
};
