import type { Product } from './types'

const daysAgo = (n: number): string =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '50000000-0000-4000-8000-000000000001',
    name: 'Nova Wireless Headphones',
    category: 'Computers & Electronics',
    price: 850,
    original_price: 1200,
    description:
      'Immersive over-ear wireless headphones with active noise cancellation, plush ear cushions and up to 40 hours of battery life. Perfect for work, travel and daily listening.',
    image_url:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    stock: 24,
    featured: true,
    created_at: daysAgo(18),
  },
  {
    id: '50000000-0000-4000-8000-000000000002',
    name: 'Aura Pro Smartphone',
    category: 'Phones & Tablets',
    price: 3200,
    original_price: 3800,
    description:
      'Flagship-grade smartphone with a vivid 6.5 inch AMOLED display, 128GB storage, powerful dual cameras and a long-lasting battery with fast charging.',
    image_url:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    stock: 18,
    featured: true,
    created_at: daysAgo(22),
  },
  {
    id: '50000000-0000-4000-8000-000000000003',
    name: 'Vertex Slim Laptop 14',
    category: 'Computers & Electronics',
    price: 7500,
    original_price: 8900,
    description:
      'Lightweight 14 inch laptop with a crisp full-HD display, fast SSD storage and all-day battery life. Great for students, creators and working professionals.',
    image_url:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    stock: 8,
    featured: false,
    created_at: daysAgo(2),
  },
  {
    id: '50000000-0000-4000-8000-000000000004',
    name: 'Summit Running Sneakers',
    category: 'Shoes',
    price: 650,
    original_price: 850,
    description:
      'Responsive, breathable running sneakers with lightweight cushioning and a grippy outsole. Built for your daily miles and weekend errands alike.',
    image_url:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    stock: 32,
    featured: true,
    created_at: daysAgo(25),
  },
  {
    id: '50000000-0000-4000-8000-000000000005',
    name: 'Classic Leather Watch',
    category: 'Bags & Accessories',
    price: 1100,
    original_price: 1400,
    description:
      'A timeless analog watch with a genuine leather strap, scratch-resistant glass and water resistance. The perfect everyday or formal accessory.',
    image_url:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 15,
    featured: true,
    created_at: daysAgo(20),
  },
  {
    id: '50000000-0000-4000-8000-000000000006',
    name: 'Elegance Leather Handbag',
    category: 'Bags & Accessories',
    price: 1450,
    original_price: 1800,
    description:
      'Sophisticated handbag in premium faux leather with a roomy interior, secure zip pocket and adjustable strap. Style meets everyday practicality.',
    image_url:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    stock: 12,
    featured: false,
    created_at: daysAgo(4),
  },
  {
    id: '50000000-0000-4000-8000-000000000007',
    name: 'Essential Cotton Tee',
    category: 'Fashion & Clothing',
    price: 180,
    original_price: null,
    description:
      'Soft, breathable 100% combed cotton t-shirt in a relaxed fit. A wardrobe staple that looks great on its own or layered.',
    image_url:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    stock: 60,
    featured: false,
    created_at: daysAgo(30),
  },
  {
    id: '50000000-0000-4000-8000-000000000008',
    name: 'Horizon UV Sunglasses',
    category: 'Bags & Accessories',
    price: 520,
    original_price: 700,
    description:
      'Polarised sunglasses with full UV protection, lightweight frame and a flattering silhouette. Includes a protective hard case and cleaning cloth.',
    image_url:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    stock: 40,
    featured: false,
    created_at: daysAgo(27),
  },
  {
    id: '50000000-0000-4000-8000-000000000009',
    name: 'Glow Ceramic Table Lamp',
    category: 'Home & Living',
    price: 390,
    original_price: 480,
    description:
      'A warm, mood-lighting table lamp with a handmade ceramic base and soft linen shade. Brings a cosy glow to any living room or bedroom corner.',
    image_url:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    stock: 26,
    featured: true,
    created_at: daysAgo(15),
  },
  {
    id: '50000000-0000-4000-8000-000000000010',
    name: "Chef's Kitchenware Set",
    category: 'Kitchen & Dining',
    price: 1250,
    original_price: null,
    description:
      'A complete 12-piece kitchen set including pots, pans and utensils with non-stick coating and heat-resistant handles. Everything you need to cook with confidence.',
    image_url:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
    stock: 9,
    featured: false,
    created_at: daysAgo(6),
  },
  {
    id: '50000000-0000-4000-8000-000000000011',
    name: 'Velvet Noir Parfum',
    category: 'Beauty & Cosmetics',
    price: 980,
    original_price: 1300,
    description:
      'A rich, long-lasting unisex fragrance with notes of amber, vanilla and oud. Elegant and bold, bottled to last all day and into the night.',
    image_url:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    stock: 21,
    featured: false,
    created_at: daysAgo(3),
  },
  {
    id: '50000000-0000-4000-8000-000000000012',
    name: 'Radiant Skincare Kit',
    category: 'Beauty & Cosmetics',
    price: 430,
    original_price: 550,
    description:
      'A complete daily skincare routine: gentle cleanser, brightening serum and hydrating moisturiser. Suitable for all skin types, made with natural actives.',
    image_url:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    stock: 35,
    featured: true,
    created_at: daysAgo(1),
  },
  {
    id: '50000000-0000-4000-8000-000000000013',
    name: 'Nexus Pro Game Controller',
    category: 'Gaming',
    price: 780,
    original_price: 950,
    description:
      'Ergonomic wireless controller with responsive triggers, rumble feedback and a long battery life. Works with consoles, PC and mobile.',
    image_url:
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80',
    stock: 20,
    featured: false,
    created_at: daysAgo(12),
  },
  {
    id: '50000000-0000-4000-8000-000000000014',
    name: 'Ambient 3.1 Soundbar',
    category: 'TV & Home Entertainment',
    price: 2900,
    original_price: 3600,
    description:
      'A powerful soundbar with deep bass, crisp dialogue and multiple connectivity options. Transforms movie nights and music sessions at home.',
    image_url:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    stock: 7,
    featured: false,
    created_at: daysAgo(9),
  },
  {
    id: '50000000-0000-4000-8000-000000000015',
    name: 'PureRefresh Wellness Set',
    category: 'Personal Care',
    price: 520,
    original_price: null,
    description:
      'A soothing personal care bundle: hydrating body lotion, gentle soap and a lightweight deodorant. Keep your daily routine feeling fresh.',
    image_url:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    stock: 28,
    featured: false,
    created_at: daysAgo(11),
  },
  {
    id: '50000000-0000-4000-8000-000000000016',
    name: 'HomeFresh Multi-Surface Cleaner',
    category: 'Cleaning & Household',
    price: 260,
    original_price: 340,
    description:
      'One powerful cleaner for floors, counters and surfaces. Removes grease and grime with a fresh scent and a family-safe formula.',
    image_url:
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80',
    stock: 45,
    featured: false,
    created_at: daysAgo(14),
  },
  {
    id: '50000000-0000-4000-8000-000000000017',
    name: 'Golden Harvest Rice 5kg',
    category: 'Groceries & Food',
    price: 190,
    original_price: null,
    description:
      'Premium long-grain rice in a convenient 5kg pack. Fluffy, aromatic and perfect for jollof, fried rice and everyday meals.',
    image_url:
      'https://images.unsplash.com/photo-1586201375761-838650e08a49?auto=format&fit=crop&w=900&q=80',
    stock: 80,
    featured: false,
    created_at: daysAgo(7),
  },
  {
    id: '50000000-0000-4000-8000-000000000018',
    name: 'TinyCloud Baby Starter Kit',
    category: 'Baby & Kids',
    price: 640,
    original_price: null,
    description:
      'Everything little ones need to start the day: soft baby clothes, gentle toiletries and a cuddly toy in one thoughtful gift set.',
    image_url:
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=900&q=80',
    stock: 24,
    featured: false,
    created_at: daysAgo(10),
  },
  {
    id: '50000000-0000-4000-8000-000000000019',
    name: 'Scholar Stationery Pack',
    category: 'Books, School & Office',
    price: 150,
    original_price: 210,
    description:
      'A ready-to-go study pack with notebooks, pens, pencils and a calculator. Ideal for students heading back to school or the office.',
    image_url:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
    stock: 70,
    featured: false,
    created_at: daysAgo(8),
  },
  {
    id: '50000000-0000-4000-8000-000000000020',
    name: 'Velocity Match Football',
    category: 'Sports & Fitness',
    price: 350,
    original_price: 460,
    description:
      'A durable, match-ready football with a grippy surface and excellent flight. Great for training, school games and weekend kickabouts.',
    image_url:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    stock: 50,
    featured: true,
    created_at: daysAgo(5),
  },
  {
    id: '50000000-0000-4000-8000-000000000021',
    name: 'DriveMount Phone Holder',
    category: 'Automotive',
    price: 180,
    original_price: null,
    description:
      'A secure dashboard and windscreen mount for your phone with a 360° rotating head. Keeps navigation and calls safely in view on every journey.',
    image_url:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80',
    stock: 60,
    featured: false,
    created_at: daysAgo(13),
  },
  {
    id: '50000000-0000-4000-8000-000000000022',
    name: 'ProFix 36-Piece Tool Set',
    category: 'Tools & Hardware',
    price: 2200,
    original_price: 2700,
    description:
      'A complete 36-piece toolkit with screwdrivers, spanners, pliers and measurement tools in a sturdy case. Perfect for home and workshop repairs.',
    image_url:
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=900&q=80',
    stock: 10,
    featured: false,
    created_at: daysAgo(16),
  },
  {
    id: '50000000-0000-4000-8000-000000000023',
    name: 'SunGlow Solar Charging Lamp',
    category: 'Electrical & Smart Home',
    price: 480,
    original_price: 600,
    description:
      'A rechargeable solar lamp with USB charging, three brightness levels and a portable design. Reliable light for home and outdoor use.',
    image_url:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
    stock: 22,
    featured: false,
    created_at: daysAgo(19),
  },
  {
    id: '50000000-0000-4000-8000-000000000024',
    name: 'GreenThumb Planter Set',
    category: 'Garden & Outdoor',
    price: 310,
    original_price: 400,
    description:
      'A set of terracotta-style planters with seeds and a watering can. Everything you need to start a small herb or flower garden at home.',
    image_url:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    stock: 33,
    featured: false,
    created_at: daysAgo(12),
  },
  {
    id: '50000000-0000-4000-8000-000000000025',
    name: 'CozyPet Bed & Bowl Combo',
    category: 'Pet Supplies',
    price: 420,
    original_price: 530,
    description:
      'A soft, machine-washable pet bed with matching feeding bowls. Your furry friend gets a comfortable corner and dinner service.',
    image_url:
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80',
    stock: 25,
    featured: false,
    created_at: daysAgo(9),
  },
  {
    id: '50000000-0000-4000-8000-000000000026',
    name: 'Nomad 20" Cabin Suitcase',
    category: 'Travel',
    price: 1350,
    original_price: 1600,
    description:
      'A lightweight hard-shell cabin suitcase with smooth spinner wheels, a TSA lock and a roomy interior. Made for weekend trips and carry-on travel.',
    image_url:
      'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=900&q=80',
    stock: 14,
    featured: false,
    created_at: daysAgo(10),
  },
  {
    id: '50000000-0000-4000-8000-000000000027',
    name: 'Celebration Gift Box',
    category: 'Gifts & Special Occasions',
    price: 850,
    original_price: 1100,
    description:
      'An elegant curated gift box with treats and keepsakes, ready for birthdays, weddings or thank-yous. Add a personal note at checkout.',
    image_url:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    stock: 30,
    featured: true,
    created_at: daysAgo(4),
  },
]