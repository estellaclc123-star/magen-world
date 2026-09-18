-- Sample products for Magen World
-- Run after schema.sql (in the Supabase SQL editor) to load sample data.

insert into public.products
  (id, name, category, price, original_price, description, image_url, stock, featured, created_at)
values
  (
    '50000000-0000-4000-8000-000000000001',
    'Nova Wireless Headphones',
    'Electronics',
    850.00, 1200.00,
    'Immersive over-ear wireless headphones with active noise cancellation, plush ear cushions and up to 40 hours of battery life. Perfect for work, travel and daily listening.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    24, true, now() - interval '18 days'
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    'Aura Pro Smartphone',
    'Electronics',
    3200.00, 3800.00,
    'Flagship-grade smartphone with a vivid 6.5 inch AMOLED display, 128GB storage, powerful dual cameras and a long-lasting battery with fast charging.',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    18, true, now() - interval '22 days'
  ),
  (
    '50000000-0000-4000-8000-000000000003',
    'Vertex Slim Laptop 14',
    'Electronics',
    7500.00, 8900.00,
    'Lightweight 14 inch laptop with a crisp full-HD display, fast SSD storage and all-day battery life. Great for students, creators and working professionals.',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    8, false, now() - interval '2 days'
  ),
  (
    '50000000-0000-4000-8000-000000000004',
    'Summit Running Sneakers',
    'Fashion',
    650.00, 850.00,
    'Responsive, breathable running sneakers with lightweight cushioning and a grippy outsole. Built for your daily miles and weekend errands alike.',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    32, true, now() - interval '25 days'
  ),
  (
    '50000000-0000-4000-8000-000000000005',
    'Classic Leather Watch',
    'Accessories',
    1100.00, 1400.00,
    'A timeless analog watch with a genuine leather strap, scratch-resistant glass and water resistance. The perfect everyday or formal accessory.',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    15, true, now() - interval '20 days'
  ),
  (
    '50000000-0000-4000-8000-000000000006',
    'Elegance Leather Handbag',
    'Fashion',
    1450.00, 1800.00,
    'Sophisticated handbag in premium faux leather with a roomy interior, secure zip pocket and adjustable strap. Style meets everyday practicality.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    12, false, now() - interval '4 days'
  ),
  (
    '50000000-0000-4000-8000-000000000007',
    'Essential Cotton Tee',
    'Fashion',
    180.00, null,
    'Soft, breathable 100% combed cotton t-shirt in a relaxed fit. A wardrobe staple that looks great on its own or layered.',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    60, false, now() - interval '30 days'
  ),
  (
    '50000000-0000-4000-8000-000000000008',
    'Horizon UV Sunglasses',
    'Accessories',
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
    'Home & Living',
    1250.00, null,
    'A complete 12-piece kitchen set including pots, pans and utensils with non-stick coating and heat-resistant handles. Everything you need to cook with confidence.',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
    9, false, now() - interval '6 days'
  ),
  (
    '50000000-0000-4000-8000-000000000011',
    'Velvet Noir Parfum',
    'Beauty',
    980.00, 1300.00,
    'A rich, long-lasting unisex fragrance with notes of amber, vanilla and oud. Elegant and bold, bottled to last all day and into the night.',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    21, false, now() - interval '3 days'
  ),
  (
    '50000000-0000-4000-8000-000000000012',
    'Radiant Skincare Kit',
    'Beauty',
    430.00, 550.00,
    'A complete daily skincare routine: gentle cleanser, brightening serum and hydrating moisturiser. Suitable for all skin types, made with natural actives.',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    35, true, now() - interval '1 day'
  )
on conflict (id) do nothing;