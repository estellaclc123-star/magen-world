-- Sample products for Magen World
-- Run after schema.sql (in the Supabase SQL editor) to load sample data.
-- Safe to re-run: existing sample rows keep their data; categories are normalised.

insert into public.products
  (id, name, category, price, original_price, description, image_url, stock, featured, created_at)
values
  (
    '50000000-0000-4000-8000-000000000001',
    'Nova Wireless Headphones',
    'Computers & Electronics',
    850.00, 1200.00,
    'Immersive over-ear wireless headphones with active noise cancellation, plush ear cushions and up to 40 hours of battery life. Perfect for work, travel and daily listening.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    24, true, now() - interval '18 days'
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    'Aura Pro Smartphone',
    'Phones & Tablets',
    3200.00, 3800.00,
    'Flagship-grade smartphone with a vivid 6.5 inch AMOLED display, 128GB storage, powerful dual cameras and a long-lasting battery with fast charging.',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    18, true, now() - interval '22 days'
  ),
  (
    '50000000-0000-4000-8000-000000000003',
    'Vertex Slim Laptop 14',
    'Computers & Electronics',
    7500.00, 8900.00,
    'Lightweight 14 inch laptop with a crisp full-HD display, fast SSD storage and all-day battery life. Great for students, creators and working professionals.',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    8, false, now() - interval '2 days'
  ),
  (
    '50000000-0000-4000-8000-000000000004',
    'Summit Running Sneakers',
    'Shoes',
    650.00, 850.00,
    'Responsive, breathable running sneakers with lightweight cushioning and a grippy outsole. Built for your daily miles and weekend errands alike.',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    32, true, now() - interval '25 days'
  ),
  (
    '50000000-0000-4000-8000-000000000005',
    'Classic Leather Watch',
    'Bags & Accessories',
    1100.00, 1400.00,
    'A timeless analog watch with a genuine leather strap, scratch-resistant glass and water resistance. The perfect everyday or formal accessory.',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    15, true, now() - interval '20 days'
  ),
  (
    '50000000-0000-4000-8000-000000000006',
    'Elegance Leather Handbag',
    'Bags & Accessories',
    1450.00, 1800.00,
    'Sophisticated handbag in premium faux leather with a roomy interior, secure zip pocket and adjustable strap. Style meets everyday practicality.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    12, false, now() - interval '4 days'
  ),
  (
    '50000000-0000-4000-8000-000000000007',
    'Essential Cotton Tee',
    'Fashion & Clothing',
    180.00, null,
    'Soft, breathable 100% combed cotton t-shirt in a relaxed fit. A wardrobe staple that looks great on its own or layered.',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    60, false, now() - interval '30 days'
  ),
  (
    '50000000-0000-4000-8000-000000000008',
    'Horizon UV Sunglasses',
    'Bags & Accessories',
    520.00, 700.00,
    'Polarised sunglasses with full UV protection, lightweight frame and a flattering silhouette. Includes a protective hard case and cleaning cloth.',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    40, false, now() - interval '27 days'
  ),
  (
    '50000000-0000-4000-8000-000000000009',
    'Glow Ceramic Table Lamp',
    'Home & Living',
    390.00, 480.00,
    'A warm, mood-lighting table lamp with a handmade ceramic base and soft linen shade. Brings a cosy glow to any living room or bedroom corner.',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    26, true, now() - interval '15 days'
  ),
  (
    '50000000-0000-4000-8000-000000000010',
    'Chef''s Kitchenware Set',
    'Kitchen & Dining',
    1250.00, null,
    'A complete 12-piece kitchen set including pots, pans and utensils with non-stick coating and heat-resistant handles. Everything you need to cook with confidence.',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
    9, false, now() - interval '6 days'
  ),
  (
    '50000000-0000-4000-8000-000000000011',
    'Velvet Noir Parfum',
    'Beauty & Cosmetics',
    980.00, 1300.00,
    'A rich, long-lasting unisex fragrance with notes of amber, vanilla and oud. Elegant and bold, bottled to last all day and into the night.',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    21, false, now() - interval '3 days'
  ),
  (
    '50000000-0000-4000-8000-000000000012',
    'Radiant Skincare Kit',
    'Beauty & Cosmetics',
    430.00, 550.00,
    'A complete daily skincare routine: gentle cleanser, brightening serum and hydrating moisturiser. Suitable for all skin types, made with natural actives.',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    35, true, now() - interval '1 day'
  ),
  (
    '50000000-0000-4000-8000-000000000013',
    'Nexus Pro Game Controller',
    'Gaming',
    780.00, 950.00,
    'Ergonomic wireless controller with responsive triggers, rumble feedback and a long battery life. Works with consoles, PC and mobile.',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80',
    20, false, now() - interval '12 days'
  ),
  (
    '50000000-0000-4000-8000-000000000014',
    'Ambient 3.1 Soundbar',
    'TV & Home Entertainment',
    2900.00, 3600.00,
    'A powerful soundbar with deep bass, crisp dialogue and multiple connectivity options. Transforms movie nights and music sessions at home.',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    7, false, now() - interval '9 days'
  ),
  (
    '50000000-0000-4000-8000-000000000015',
    'PureRefresh Wellness Set',
    'Personal Care',
    520.00, null,
    'A soothing personal care bundle: hydrating body lotion, gentle soap and a lightweight deodorant. Keep your daily routine feeling fresh.',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    28, false, now() - interval '11 days'
  ),
  (
    '50000000-0000-4000-8000-000000000016',
    'HomeFresh Multi-Surface Cleaner',
    'Cleaning & Household',
    260.00, 340.00,
    'One powerful cleaner for floors, counters and surfaces. Removes grease and grime with a fresh scent and a family-safe formula.',
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80',
    45, false, now() - interval '14 days'
  ),
  (
    '50000000-0000-4000-8000-000000000017',
    'Golden Harvest Rice 5kg',
    'Groceries & Food',
    190.00, null,
    'Premium long-grain rice in a convenient 5kg pack. Fluffy, aromatic and perfect for jollof, fried rice and everyday meals.',
    'https://images.unsplash.com/photo-1586201375761-838650e08a49?auto=format&fit=crop&w=900&q=80',
    80, false, now() - interval '7 days'
  ),
  (
    '50000000-0000-4000-8000-000000000018',
    'TinyCloud Baby Starter Kit',
    'Baby & Kids',
    640.00, null,
    'Everything little ones need to start the day: soft baby clothes, gentle toiletries and a cuddly toy in one thoughtful gift set.',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=900&q=80',
    24, false, now() - interval '10 days'
  ),
  (
    '50000000-0000-4000-8000-000000000019',
    'Scholar Stationery Pack',
    'Books, School & Office',
    150.00, 210.00,
    'A ready-to-go study pack with notebooks, pens, pencils and a calculator. Ideal for students heading back to school or the office.',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
    70, false, now() - interval '8 days'
  ),
  (
    '50000000-0000-4000-8000-000000000020',
    'Velocity Match Football',
    'Sports & Fitness',
    350.00, 460.00,
    'A durable, match-ready football with a grippy surface and excellent flight. Great for training, school games and weekend kickabouts.',
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    50, true, now() - interval '5 days'
  ),
  (
    '50000000-0000-4000-8000-000000000021',
    'DriveMount Phone Holder',
    'Automotive',
    180.00, null,
    'A secure dashboard and windscreen mount for your phone with a 360° rotating head. Keeps navigation and calls safely in view on every journey.',
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80',
    60, false, now() - interval '13 days'
  ),
  (
    '50000000-0000-4000-8000-000000000022',
    'ProFix 36-Piece Tool Set',
    'Tools & Hardware',
    2200.00, 2700.00,
    'A complete 36-piece toolkit with screwdrivers, spanners, pliers and measurement tools in a sturdy case. Perfect for home and workshop repairs.',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=900&q=80',
    10, false, now() - interval '16 days'
  ),
  (
    '50000000-0000-4000-8000-000000000023',
    'SunGlow Solar Charging Lamp',
    'Electrical & Smart Home',
    480.00, 600.00,
    'A rechargeable solar lamp with USB charging, three brightness levels and a portable design. Reliable light for home and outdoor use.',
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
    22, false, now() - interval '19 days'
  ),
  (
    '50000000-0000-4000-8000-000000000024',
    'GreenThumb Planter Set',
    'Garden & Outdoor',
    310.00, 400.00,
    'A set of terracotta-style planters with seeds and a watering can. Everything you need to start a small herb or flower garden at home.',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    33, false, now() - interval '12 days'
  ),
  (
    '50000000-0000-4000-8000-000000000025',
    'CozyPet Bed & Bowl Combo',
    'Pet Supplies',
    420.00, 530.00,
    'A soft, machine-washable pet bed with matching feeding bowls. Your furry friend gets a comfortable corner and dinner service.',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80',
    25, false, now() - interval '9 days'
  ),
  (
    '50000000-0000-4000-8000-000000000026',
    'Nomad 20" Cabin Suitcase',
    'Travel',
    1350.00, 1600.00,
    'A lightweight hard-shell cabin suitcase with smooth spinner wheels, a TSA lock and a roomy interior. Made for weekend trips and carry-on travel.',
    'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=900&q=80',
    14, false, now() - interval '10 days'
  ),
  (
    '50000000-0000-4000-8000-000000000027',
    'Celebration Gift Box',
    'Gifts & Special Occasions',
    850.00, 1100.00,
    'An elegant curated gift box with treats and keepsakes, ready for birthdays, weddings or thank-yous. Add a personal note at checkout.',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    30, true, now() - interval '4 days'
  )
on conflict (id) do nothing;

-- Normalise the first batch of sample products to the curated category names.
update public.products p
set category = t.category
from (values
  ('50000000-0000-4000-8000-000000000001', 'Computers & Electronics'),
  ('50000000-0000-4000-8000-000000000002', 'Phones & Tablets'),
  ('50000000-0000-4000-8000-000000000003', 'Computers & Electronics'),
  ('50000000-0000-4000-8000-000000000004', 'Shoes'),
  ('50000000-0000-4000-8000-000000000005', 'Bags & Accessories'),
  ('50000000-0000-4000-8000-000000000006', 'Bags & Accessories'),
  ('50000000-0000-4000-8000-000000000007', 'Fashion & Clothing'),
  ('50000000-0000-4000-8000-000000000008', 'Bags & Accessories'),
  ('50000000-0000-4000-8000-000000000009', 'Home & Living'),
  ('50000000-0000-4000-8000-000000000010', 'Kitchen & Dining'),
  ('50000000-0000-4000-8000-000000000011', 'Beauty & Cosmetics'),
  ('50000000-0000-4000-8000-000000000012', 'Beauty & Cosmetics')
) as t(id, category)
where p.id = t.id;