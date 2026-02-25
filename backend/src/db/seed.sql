-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- HaAtzil Butcher Shop â€“ Seed Data
-- Run AFTER schema.sql
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Categories
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO categories (slug, name_he, name_en, sort_order) VALUES
  ('beef',           '×‘×§×¨',           'Beef',            1),
  ('lamb',           '×›×‘×© ×•×˜×œ×”',       'Lamb',            2),
  ('poultry',        '×¢×•×£ ×•×”×•×“×•',       'Poultry',         3),
  ('prepared',       '×ž×•×›×Ÿ ×œ×‘×™×©×•×œ',    'Prepared Foods',  4),
  ('kosher-special', '×ž×™×•×—×“×™ ×›×©×¨×•×ª',   'Kosher Specials', 5)
ON CONFLICT (slug) DO NOTHING;

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Products â€“ Beef (5)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='beef'),
  '×× ×˜×¨×™×§×•×˜ ×˜×¨×™', 'Ribeye Steak',
  '× ×ª×— ×¤×¨×ž×™×•× ×ž×”×¦×œ×¢×•×ª, ×¢× ×©×™×•×© ×ž×¢×•×œ×” ×•×ª×•×¦××” ××™×“××œ×™×ª ×¢×œ ×”×’×¨×™×œ.',
  'Premium ribeye cut, beautifully marbled, ideal for grilling.',
  189.00, '[{"label":"300g","grams":300},{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/beef/ribeye.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  '×¤×™×œ×” ×‘×§×¨ ×ž×•×‘×—×¨', 'Beef Tenderloin',
  '×”× ×ª×— ×”×¨×š ×‘×™×•×ª×¨ â€“ ×ž×•×©×œ× ×œ×¦×œ×™×™×” ×ž×”×™×¨×” ×•×œ×¡×˜×™×™×§ ×‘×©×™×˜×ª sous vide.',
  'The most tender cut â€“ perfect for quick searing or sous vide.',
  229.00, '[{"label":"250g","grams":250},{"label":"500g","grams":500}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/beef/tenderloin.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  '×¦×œ×™ ×›×ª×£ ×‘×§×¨', 'Chuck Roast',
  '× ×ª×— ×›×ª×£ ×©×ž× ×ž×Ÿ, ×ž×•×ž×œ×¥ ×œ×‘×™×©×•×œ ×ž×ž×•×©×š ×‘×ª× ×•×¨ ××• ×‘×¡×™×¨ ×œ×—×¥.',
  'Fatty shoulder roast, ideal for slow cooking or pressure pot.',
  89.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/beef/chuck_roast.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  '×©×¤×™×¥ ×¦×³××§', 'Chuck Eye Roll',
  '× ×ª×— ×ª×•×¡×¡ ×¢× ×˜×¢× ×¢×©×™×¨ â€“ ×ž×¢×•×œ×” ×œ×¡×˜×™×™×§ ×•×œ×‘×™×©×•×œ ××¨×•×š.',
  'Flavourful chuck eye roll â€“ great as steak or slow cooked.',
  119.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/beef/chuck_eye.jpg'
),
(
  (SELECT id FROM categories WHERE slug='beef'),
  '×›×‘×“ ×‘×§×¨ ×˜×¨×™', 'Fresh Beef Liver',
  '×›×‘×“ ×‘×§×¨ ×˜×¨×™ ×•××™×›×•×ª×™ â€“ ×¢×©×™×¨ ×‘×‘×¨×–×œ ×•× ×™×•×˜×¨×™×× ×˜×™× ×—×™×•× ×™×™×.',
  'Fresh quality beef liver â€“ rich in iron and essential nutrients.',
  59.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/beef/liver.jpg'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Products â€“ Lamb (4)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='lamb'),
  '×¦×œ×¢×•×ª ×›×‘×©', 'Lamb Chops',
  '×¦×œ×¢×•×ª ×›×‘×© ×¢×¡×™×¡×™×•×ª, ×ž×ª×•×‘×œ×•×ª ×‘×ª×‘×œ×™× ×™× ×˜×¨×™×™× ×ž×”×‘×™×ª.',
  'Juicy lamb chops, seasoned with fresh Mediterranean spices.',
  149.00, '[{"label":"400g","grams":400},{"label":"800g","grams":800}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/lamb/lamb_chops.jpg'
),
(
  (SELECT id FROM categories WHERE slug='lamb'),
  '×§×‘×‘ ×˜×œ×”', 'Lamb Kebab',
  '×§×‘×‘ ×˜×œ×” ×”×›×Ÿ ×œ×¦×œ×™×™×” â€“ ×¢×œ ×©×™×¤×•×“, ×¤××˜×” ×•×ª×‘×œ×™× ×™× ×ž×™×•×—×“×™×.',
  'Ready-to-grill lamb kebab with special spice blend on skewers.',
  79.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/lamb/lamb_kebab.jpg'
),
(
  (SELECT id FROM categories WHERE slug='lamb'),
  '×›×ª×£ ×˜×œ×” ×©×œ×ž×”', 'Whole Lamb Shoulder',
  '×›×ª×£ ×˜×œ×” ×©×œ×ž×” â€“ ×ž×•×ž×œ×¦×ª ×œ×¦×œ×™×™×” ××™×˜×™×ª ×‘×ª× ×•×¨, ×¢×¡×™×¡×™×ª ×•×ž×¤× ×§×ª.',
  'Whole lamb shoulder â€“ slow roast for a rich and tender result.',
  199.00, '[{"label":"1.5kg","grams":1500},{"label":"2.5kg","grams":2500}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/lamb/lamb_shoulder.jpg'
),
(
  (SELECT id FROM categories WHERE slug='lamb'),
  '×©×•×§ ×›×‘×©', 'Lamb Leg',
  '×©×•×§ ×›×‘×© ×ž×“×¨×’×” ×¨××©×•× ×” â€“ ×ž×•×©×œ× ×œ××•×›×œ ×—×’×™×’×™ ×‘×©×‘×ª.',
  'First-grade lamb leg â€“ perfect for a festive Shabbat meal.',
  169.00, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/lamb/lamb_leg.jpg'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Products â€“ Poultry (5)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='poultry'),
  '×©× ×™×¦×œ ×¢×•×£', 'Chicken Schnitzel',
  '×¤×¨×’×™×•×ª ×¢×•×£ ×¤×¨×•×¡×•×ª ×•×ž×•×›× ×•×ª ×œ×©× ×™×¦×œ â€“ ×¨×›×•×ª ×•×¢×¡×™×¡×™×•×ª ×œ×‘×™×©×•×œ ×‘×™×ª×™.',
  'Sliced chicken breasts ready for schnitzel â€“ tender and juicy.',
  56.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/poultry/chicken_schnitzel.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  '×©×•×•××¨×ž×” ×”×•×“×•', 'Turkey Shawarma',
  '×ª×¢×¨×•×‘×ª ×©×•×•××¨×ž×” ×”×•×“×• ×˜×—×•× ×” ×¢× ×ª×‘×œ×™× ×™× ×™×™×—×•×“×™×™× ×©×œ ×”××¦×™×œ.',
  'Ground turkey shawarma blend with HaAtzil signature spices.',
  69.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/poultry/turkey_shawarma.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  '×¢×•×£ ×©×œ× ×˜×¨×™', 'Whole Fresh Chicken',
  '×¢×•×£ ×©×œ× ×’×“×•×œ, ×ž×’×•×“×œ ×œ×œ× ×× ×˜×™×‘×™×•×˜×™×§×” â€“ ×ž×•×ž×œ×¥ ×œ×ª×‘×©×™×œ ××• ×¦×œ×™×™×”.',
  'Large whole chicken, antibiotic-free â€“ great for stew or roast.',
  48.00, '[{"label":"1.2kg","grams":1200},{"label":"1.8kg","grams":1800}]',
  'unit', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/poultry/whole_chicken.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  '×›×¨×¢×™×™× ×¢×•×£', 'Chicken Legs',
  '×›×¨×¢×™×™× ×¢×•×£ ×©×ž×™× ×•×ª â€“ ×ž×¦×•×™× ×•×ª ×œ×ª× ×•×¨ ×¢× ×¢×©×‘×™ ×ª×™×‘×•×œ.',
  'Plump chicken legs â€“ excellent oven-roasted with fresh herbs.',
  39.00, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/poultry/chicken_legs.jpg'
),
(
  (SELECT id FROM categories WHERE slug='poultry'),
  '×—×–×” ×”×•×“×• ×¤×¨×•×¡', 'Sliced Turkey Breast',
  '×—×–×” ×”×•×“×• ×¤×¨×•×¡ ×“×§, ×ž×¢×•×œ×” ×œ×¡× ×“×•×•×™×¦×³×™× ×•×œ×‘×™×©×•×œ ×§×œ.',
  'Thinly sliced turkey breast â€“ great for sandwiches and light cooking.',
  59.00, '[{"label":"300g","grams":300},{"label":"600g","grams":600}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/poultry/turkey_breast.jpg'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Products â€“ Prepared Foods (4)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='prepared'),
  '×§×¦×™×¦×•×ª ×‘×§×¨ ×”×›×Ÿ', 'Ready Beef Patties',
  '×§×¦×™×¦×•×ª ×‘×§×¨ ×ª×‘×•×œ×•×ª, ×ž×•×›× ×•×ª ×œ×¦×œ×™×™×” â€“ ×ž×ª×›×•×Ÿ ×”×‘×™×ª ×©×œ ×”××¦×™×œ.',
  'Seasoned beef patties ready to pan-fry â€“ HaAtzil house recipe.',
  72.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/prepared/beef_patties.jpg'
),
(
  (SELECT id FROM categories WHERE slug='prepared'),
  '×ž×¨×™× ×“×” ×× ×˜×¨×™×§×•×˜', 'Marinated Ribeye',
  '×× ×˜×¨×™×§×•×˜ ×‘×ž×¨×™× ×“×ª ×©×•× ×•×¢×©×‘×™ ×ª×™×‘×•×œ â€“ ×™×©×¨ ×œ×’×¨×™×œ ×œ×œ× ×”×›× ×”.',
  'Ribeye in garlic and herb marinade â€“ grill-ready, no prep needed.',
  199.00, '[{"label":"400g","grams":400},{"label":"800g","grams":800}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/prepared/marinated_ribeye.jpg'
),
(
  (SELECT id FROM categories WHERE slug='prepared'),
  '× ×§× ×™×§×™×•×ª ×‘×§×¨', 'Beef Sausages',
  '× ×§× ×™×§×™×•×ª ×‘×§×¨ ×‘×™×ª×™×•×ª ×¢× ×ª×‘×œ×™× ×™× â€“ ×ž×•×©×œ×ž×•×ª ×œ×‘×¨×‘×™×§×™×•.',
  'Homestyle beef sausages with spices â€“ perfect for the barbecue.',
  64.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/prepared/beef_sausages.jpg'
),
(
  (SELECT id FROM categories WHERE slug='prepared'),
  '×ž×¨×§ ×¢×¦×ž×•×ª', 'Beef Bone Broth Kit',
  '×¢×¦×ž×•×ª ×ž×¨×§ ×¢× ×™×¨×§×•×ª ×©×•×¨×© ×œ×‘×—×™×¨×ª×›× â€“ ×‘×¡×™×¡ ×ž×•×©×œ× ×œ×ž×¨×§.',
  'Soup bones with root vegetables â€“ the perfect soup base.',
  45.00, '[{"label":"1kg","grams":1000},{"label":"2kg","grams":2000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/prepared/bone_broth.jpg'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Products â€“ Kosher Specials (3)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO products (category_id, name_he, name_en, description_he, description_en, price_nis, weight_options, unit, is_kosher, kosher_cert_text, image_url) VALUES
(
  (SELECT id FROM categories WHERE slug='kosher-special'),
  '×‘×©×¨ ×‘×§×¨ ×ž×”×“×¨×™×Ÿ', 'Mehadrin Beef Selection',
  '×ž×‘×—×¨ × ×ª×—×™ ×‘×§×¨ ×ž×”×“×¨×™×Ÿ â€“ ×›×©×¨×•×ª ×ž×—×ž×™×¨×” ×¢× ×ª×¢×•×“×” ×ž×•×›×¨×ª.',
  'Mehadrin beef selection â€“ strict kosher with certified documentation.',
  249.00, '[{"label":"500g","grams":500},{"label":"1kg","grams":1000}]',
  'kg', true, 'Badatz Mehadrin Beit Shemesh - Mehadrin min HaMehadrin', '/images/products/kosher-special/mehadrin_beef.jpg'
),
(
  (SELECT id FROM categories WHERE slug='kosher-special'),
  '×›×‘×© ×ž×”×“×¨×™×Ÿ ×œ×¨"×”', 'Mehadrin Lamb for Rosh Hashana',
  '×›×‘×© ×©×œ× ××• ×—×¦×™ ×œ×¤×™ ×”×ž×¡×•×¨×ª â€“ ×›×©×¨×•×ª ×ž×”×“×¨×™×Ÿ ×œ×—×’×™×.',
  'Whole or half lamb per tradition â€“ mehadrin kosher for the holidays.',
  899.00, '[{"label":"half","grams":4000},{"label":"whole","grams":8000}]',
  'unit', true, 'Badatz Mehadrin Beit Shemesh - Mehadrin min HaMehadrin', '/images/products/kosher-special/mehadrin_lamb.jpg'
),
(
  (SELECT id FROM categories WHERE slug='kosher-special'),
  '×”×•×“×• ×©×œ× ×œ×—×’', 'Whole Turkey for Holiday',
  '×”×•×“×• ×©×œ× ×ž×”×“×¨×™×Ÿ â€“ ××™×“××œ×™ ×œ×¦×œ×™×™×” ×—×’×™×’×™×ª ×‘×—×’×™× ×•×‘××¨×•×—×•×ª ×’×“×•×œ×•×ª.',
  'Whole mehadrin turkey â€“ ideal for festive holiday roasting.',
  289.00, '[{"label":"4kg","grams":4000},{"label":"6kg","grams":6000}]',
  'unit', true, 'Badatz Mehadrin Beit Shemesh', '/images/products/kosher-special/whole_turkey.jpg'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Pickup Slots (next 7 days, 09:00â€“19:00 every hour, 10 capacity)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO pickup_slots (slot_date, slot_time, capacity)
SELECT
  CURRENT_DATE + i AS slot_date,
  make_time(h, 0, 0) AS slot_time,
  10 AS capacity
FROM generate_series(1, 7) AS i,
     generate_series(9, 18) AS h
ON CONFLICT (slot_date, slot_time) DO NOTHING;

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Admin User (password: Admin1234!)
-- bcrypt hash generated with rounds=12
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO users (email, password_hash, is_admin) VALUES
  (
    'admin@haatzil.co.il',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGMQbgY4p9.uqNF8T3y7d2X1lhe',
    true
  )
ON CONFLICT (email) DO NOTHING;
