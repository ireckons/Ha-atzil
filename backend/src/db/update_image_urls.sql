-- Update all product image_url fields to local paths

-- BEEF
UPDATE products SET image_url = '/images/products/beef/ribeye.jpg' WHERE name_en = 'Ribeye Steak';
UPDATE products SET image_url = '/images/products/beef/tenderloin.jpg' WHERE name_en = 'Beef Tenderloin';
UPDATE products SET image_url = '/images/products/beef/chuck_roast.jpg' WHERE name_en = 'Chuck Roast';
UPDATE products SET image_url = '/images/products/beef/chuck_eye.jpg' WHERE name_en = 'Chuck Eye Roll';
UPDATE products SET image_url = '/images/products/beef/liver.jpg' WHERE name_en = 'Fresh Beef Liver';

-- LAMB
UPDATE products SET image_url = '/images/products/lamb/lamb_chops.jpg' WHERE name_en = 'Lamb Chops';
UPDATE products SET image_url = '/images/products/lamb/lamb_kebab.jpg' WHERE name_en = 'Lamb Kebab';
UPDATE products SET image_url = '/images/products/lamb/lamb_shoulder.jpg' WHERE name_en = 'Whole Lamb Shoulder';
UPDATE products SET image_url = '/images/products/lamb/lamb_leg.jpg' WHERE name_en = 'Lamb Leg';

-- POULTRY
UPDATE products SET image_url = '/images/products/poultry/chicken_schnitzel.jpg' WHERE name_en = 'Chicken Schnitzel';
UPDATE products SET image_url = '/images/products/poultry/turkey_shawarma.jpg' WHERE name_en = 'Turkey Shawarma';
UPDATE products SET image_url = '/images/products/poultry/whole_chicken.jpg' WHERE name_en = 'Whole Fresh Chicken';
UPDATE products SET image_url = '/images/products/poultry/chicken_legs.jpg' WHERE name_en = 'Chicken Legs';
UPDATE products SET image_url = '/images/products/poultry/turkey_breast.jpg' WHERE name_en = 'Sliced Turkey Breast';

-- PREPARED
UPDATE products SET image_url = '/images/products/prepared/beef_patties.jpg' WHERE name_en = 'Ready Beef Patties';
UPDATE products SET image_url = '/images/products/prepared/marinated_ribeye.jpg' WHERE name_en = 'Marinated Ribeye';
UPDATE products SET image_url = '/images/products/prepared/beef_sausages.jpg' WHERE name_en = 'Beef Sausages';
UPDATE products SET image_url = '/images/products/prepared/bone_broth.jpg' WHERE name_en = 'Beef Bone Broth Kit';

-- KOSHER SPECIALS
UPDATE products SET image_url = '/images/products/kosher-special/mehadrin_beef.jpg' WHERE name_en = 'Mehadrin Beef Selection';
UPDATE products SET image_url = '/images/products/kosher-special/mehadrin_lamb.jpg' WHERE name_en LIKE 'Mehadrin Lamb%';
UPDATE products SET image_url = '/images/products/kosher-special/whole_turkey.jpg' WHERE name_en LIKE 'Whole Turkey%';
