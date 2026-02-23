-- ═══════════════════════════════════════════════════
-- HaAtzil Butcher Shop – Seed Data
-- Run AFTER schema.sql
-- ═══════════════════════════════════════════════════

-- ─────────────────────────────────────
-- Categories
-- ─────────────────────────────────────
INSERT INTO categories (slug, name_he, name_en, sort_order) VALUES
  ('beef',           'בקר',           'Beef',            1),
  ('lamb',           'כבש וטלה',       'Lamb',            2),
  ('poultry',        'עוף והודו',       'Poultry',         3),
  ('prepared',       'מוכן לבישול',    'Prepared Foods',  4),
  ('kosher-special', 'מיוחדי כשרות',   'Kosher Specials', 5)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────
-- Products – Beef (5)
-- ─────────────────────────────────────
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='beef'),
  'אנטריקוט טרי', 'Ribeye Steak',
  'נתח פרמיום מהצלעות, עם שיוש מעולה ותוצאה אידאלית על הגריל.',
  'Premium ribeye cut, beautifully marbled, ideal for grilling.',
  189.00, '[{"label":"300g","grams":300},{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/ribeye.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  'פילה בקר מובחר', 'Beef Tenderloin',
  'הנתח הרך ביותר – מושלם לצלייה מהירה ולסטייק בשיטת sous vide.',
  'The most tender cut – perfect for quick searing or sous vide.',
  229.00, '[{"label":"250g","grams":250},{"label":"500g","grams":500}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/tenderloin.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  'צלי כתף בקר', 'Chuck Roast',
  'נתח כתף שמנמן, מומלץ לבישול ממושך בתנור או בסיר לחץ.',
  'Fatty shoulder roast, ideal for slow cooking or pressure pot.',
  89.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/chuck_roast.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  'שפיץ צ׳אק', 'Chuck Eye Roll',
  'נתח תוסס עם טעם עשיר – מעולה לסטייק ולבישול ארוך.',
  'Flavourful chuck eye roll – great as steak or slow cooked.',
  119.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/chuck_eye.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  'כבד בקר טרי', 'Fresh Beef Liver',
  'כבד בקר טרי ואיכותי – עשיר בברזל וניוטריאנטים חיוניים.',
  'Fresh quality beef liver – rich in iron and essential nutrients.',
  59.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/liver.jpg'
);

-- ─────────────────────────────────────
-- Products – Lamb (4)
-- ─────────────────────────────────────
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='lamb'),
  'צלעות כבש', 'Lamb Chops',
  'צלעות כבש עסיסיות, מתובלות בתבלינים טריים מהבית.',
  'Juicy lamb chops, seasoned with fresh Mediterranean spices.',
  149.00, '[{"label":"400g","grams":400},{"label":"800g","grams":800}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/lamb_chops.jpg'
),
(
  (SELECT id FROM categories WHERE slug='lamb'),
  'קבב טלה', 'Lamb Kebab',
  'קבב טלה הכן לצלייה – על שיפוד, פאטה ותבלינים מיוחדים.',
  'Ready-to-grill lamb kebab with special spice blend on skewers.',
  79.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/lamb_kebab.jpg'
),
(
  (SELECT id FROM categories WHERE slug='lamb'),
  'כתף טלה שלמה', 'Whole Lamb Shoulder',
  'כתף טלה שלמה – מומלצת לצלייה איטית בתנור, עסיסית ומפנקת.',
  'Whole lamb shoulder – slow roast for a rich and tender result.',
  199.00, '[{"label":"1.5kg","grams":1500},{"label":"2.5kg","grams":2500}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/lamb_shoulder.jpg'
),
(
  (SELECT id FROM categories WHERE slug='lamb'),
  'שוק כבש', 'Lamb Leg',
  'שוק כבש מדרגה ראשונה – מושלם לאוכל חגיגי בשבת.',
  'First-grade lamb leg – perfect for a festive Shabbat meal.',
  169.00, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/lamb_leg.jpg'
);

-- ─────────────────────────────────────
-- Products – Poultry (5)
-- ─────────────────────────────────────
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='poultry'),
  'שניצל עוף', 'Chicken Schnitzel',
  'פרגיות עוף פרוסות ומוכנות לשניצל – רכות ועסיסיות לבישול ביתי.',
  'Sliced chicken breasts ready for schnitzel – tender and juicy.',
  56.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/chicken_schnitzel.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  'שווארמה הודו', 'Turkey Shawarma',
  'תערובת שווארמה הודו טחונה עם תבלינים ייחודיים של האציל.',
  'Ground turkey shawarma blend with HaAtzil signature spices.',
  69.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/turkey_shawarma.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  'עוף שלם טרי', 'Whole Fresh Chicken',
  'עוף שלם גדול, מגודל ללא אנטיביוטיקה – מומלץ לתבשיל או צלייה.',
  'Large whole chicken, antibiotic-free – great for stew or roast.',
  48.00, '[{"label":"1.2kg","grams":1200},{"label":"1.8kg","grams":1800}]',
  'unit', true, 'בד"ץ מהדרין עיר שמש', '/images/whole_chicken.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  'כרעיים עוף', 'Chicken Legs',
  'כרעיים עוף שמינות – מצוינות לתנור עם עשבי תיבול.',
  'Plump chicken legs – excellent oven-roasted with fresh herbs.',
  39.00, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/chicken_legs.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  'חזה הודו פרוס', 'Sliced Turkey Breast',
  'חזה הודו פרוס דק, מעולה לסנדוויצ׳ים ולבישול קל.',
  'Thinly sliced turkey breast – great for sandwiches and light cooking.',
  59.00, '[{"label":"300g","grams":300},{"label":"600g","grams":600}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/turkey_breast.jpg'
);

-- ─────────────────────────────────────
-- Products – Prepared Foods (4)
-- ─────────────────────────────────────
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='prepared'),
  'קציצות בקר הכן', 'Ready Beef Patties',
  'קציצות בקר תבולות, מוכנות לצלייה – מתכון הבית של האציל.',
  'Seasoned beef patties ready to pan-fry – HaAtzil house recipe.',
  72.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/beef_patties.jpg'
),
(
  (SELECT id FROM categories WHERE slug='prepared'),
  'מרינדה אנטריקוט', 'Marinated Ribeye',
  'אנטריקוט במרינדת שום ועשבי תיבול – ישר לגריל ללא הכנה.',
  'Ribeye in garlic and herb marinade – grill-ready, no prep needed.',
  199.00, '[{"label":"400g","grams":400},{"label":"800g","grams":800}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/marinated_ribeye.jpg'
),
(
  (SELECT id FROM categories WHERE slug='prepared'),
  'נקניקיות בקר', 'Beef Sausages',
  'נקניקיות בקר ביתיות עם תבלינים – מושלמות לברביקיו.',
  'Homestyle beef sausages with spices – perfect for the barbecue.',
  64.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/beef_sausages.jpg'
),
(
  (SELECT id FROM categories WHERE slug='prepared'),
  'מרק עצמות', 'Beef Bone Broth Kit',
  'עצמות מרק עם ירקות שורש לבחירתכם – בסיס מושלם למרק.',
  'Soup bones with root vegetables – the perfect soup base.',
  45.00, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש', '/images/bone_broth.jpg'
);

-- ─────────────────────────────────────
-- Products – Kosher Specials (3)
-- ─────────────────────────────────────
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='kosher-special'),
  'בשר בקר מהדרין', 'Mehadrin Beef Selection',
  'מבחר נתחי בקר מהדרין – כשרות מחמירה עם תעודה מוכרת.',
  'Mehadrin beef selection – strict kosher with certified documentation.',
  249.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'בד"ץ מהדרין עיר שמש – מהדרין מן המהדרין', '/images/mehadrin_beef.jpg'
),
(
  (SELECT id FROM categories WHERE slug='kosher-special'),
  'כבש מהדרין לר"ה', 'Mehadrin Lamb for Rosh Hashana',
  'כבש שלם או חצי לפי המסורת – כשרות מהדרין לחגים.',
  'Whole or half lamb per tradition – mehadrin kosher for the holidays.',
  899.00, '[{"label":"half","grams":4000},{"label":"whole","grams":8000}]',
  'unit', true, 'בד"ץ מהדרין עיר שמש – מהדרין מן המהדרין', '/images/mehadrin_lamb.jpg'
),
(
  (SELECT id FROM categories WHERE slug='kosher-special'),
  'הודו שלם לחג', 'Whole Turkey for Holiday',
  'הודו שלם מהדרין – אידאלי לצלייה חגיגית בחגים ובארוחות גדולות.',
  'Whole mehadrin turkey – ideal for festive holiday roasting.',
  289.00, '[{"label":"4kg","grams":4000},{"label":"6kg","grams":6000}]',
  'unit', true, 'בד"ץ מהדרין עיר שמש', '/images/whole_turkey.jpg'
);

-- ─────────────────────────────────────
-- Pickup Slots (next 7 days, 09:00–19:00 every hour, 10 capacity)
-- ─────────────────────────────────────
INSERT INTO pickup_slots (slot_date, slot_time, capacity)
SELECT
  CURRENT_DATE + i AS slot_date,
  make_time(h, 0, 0) AS slot_time,
  10 AS capacity
FROM generate_series(1, 7) AS i,
     generate_series(9, 18) AS h
ON CONFLICT (slot_date, slot_time) DO NOTHING;

-- ─────────────────────────────────────
-- Admin User (password: Admin1234!)
-- bcrypt hash generated with rounds=12
-- ─────────────────────────────────────
INSERT INTO users (email, password_hash, is_admin) VALUES
  (
    'admin@haatzil.co.il',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGMQbgY4p9.uqNF8T3y7d2X1lhe',
    true
  )
ON CONFLICT (email) DO NOTHING;
