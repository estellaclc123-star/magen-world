import type { Product } from './types'

const daysAgo = (n: number): string =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '50000000-0000-4000-8000-000000000001',
    name: 'Nova Wireless Headphones',
    category: 'Electronics',
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
    category: 'Electronics',
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
    category: 'Electronics',
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
    category: 'Fashion',
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
    category: 'Accessories',
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
    category: 'Fashion',
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
    category: 'Fashion',
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
    category: 'Accessories',
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
    category: 'Home & Living',
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
    category: 'Beauty',
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
    category: 'Beauty',
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
]

export const CATEGORIES: string[] = [
  'Electronics',
  'Fashion',
  'Accessories',
  'Home & Living',
  'Beauty',
]