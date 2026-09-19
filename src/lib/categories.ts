export interface CategoryDef {
  name: string
  emoji: string
  subcategories: string[]
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: 'Fashion & Clothing',
    emoji: '👗',
    subcategories: [
      "Women's clothing", "Men's clothing", "Children's clothing", 'Dresses', 'T-shirts', 'Shirts',
      'Trousers', 'Jeans', 'Shorts', 'Skirts', 'Suits', 'Jackets', 'Hoodies', 'Underwear',
      'Sleepwear', 'Sportswear', 'Traditional/African wear', 'Maternity wear', 'School uniforms',
      'Workwear',
    ],
  },
  {
    name: 'Shoes',
    emoji: '👟',
    subcategories: [
      'Sneakers', 'Trainers', 'Sandals', 'Slippers', 'Heels', 'Flats', 'Boots', 'School shoes',
      'Work shoes', "Children's shoes", 'Sports shoes',
    ],
  },
  {
    name: 'Bags & Accessories',
    emoji: '👜',
    subcategories: [
      'Handbags', 'Backpacks', 'School bags', 'Laptop bags', 'Travel bags', 'Wallets', 'Purses',
      'Belts', 'Caps', 'Hats', 'Sunglasses', 'Scarves', 'Watches', 'Jewelry', 'Hair accessories',
    ],
  },
  {
    name: 'Phones & Tablets',
    emoji: '📱',
    subcategories: [
      'Smartphones', 'Feature phones', 'Tablets', 'iPads', 'Phone cases', 'Screen protectors',
      'Chargers', 'Power banks', 'USB cables', 'Phone holders', 'Earphones', 'Headphones',
      'Smartwatches',
    ],
  },
  {
    name: 'Computers & Electronics',
    emoji: '💻',
    subcategories: [
      'Laptops', 'Desktop computers', 'Monitors', 'Keyboards', 'Mice', 'Printers', 'Flash drives',
      'Hard drives', 'SSDs', 'Routers', 'Wi-Fi devices', 'Webcams', 'Speakers',
      'Computer accessories',
    ],
  },
  {
    name: 'Gaming',
    emoji: '🎮',
    subcategories: [
      'PlayStation', 'Xbox', 'Nintendo', 'Game controllers', 'Gaming headsets', 'Gaming keyboards',
      'Gaming mice', 'Gaming chairs', 'Games', 'Console accessories',
    ],
  },
  {
    name: 'TV & Home Entertainment',
    emoji: '📺',
    subcategories: [
      'Televisions', 'Soundbars', 'Home theatres', 'Speakers', 'Projectors', 'Streaming devices',
      'TV stands', 'HDMI cables', 'Remote controls',
    ],
  },
  {
    name: 'Beauty & Cosmetics',
    emoji: '💄',
    subcategories: [
      'Makeup', 'Foundation', 'Lipsticks', 'Lip gloss', 'Mascara', 'Perfumes', 'Body sprays',
      'Skincare', 'Face wash', 'Moisturizers', 'Sunscreen', 'Hair products', 'Wigs',
      'Hair extensions', 'Braids', 'Hair dryers', 'Straighteners', 'Nail products',
    ],
  },
  {
    name: 'Personal Care',
    emoji: '🧴',
    subcategories: [
      'Bath products', 'Body lotions', 'Soaps', 'Deodorants', 'Shaving products',
      'Oral-care products', 'Toothbrushes', 'Toothpaste', 'Personal grooming tools',
    ],
  },
  {
    name: 'Home & Living',
    emoji: '🏠',
    subcategories: [
      'Furniture', 'Chairs', 'Tables', 'Beds', 'Mattresses', 'Wardrobes', 'Curtains', 'Rugs',
      'Carpets', 'Pillows', 'Bedsheets', 'Blankets', 'Towels', 'Decorations', 'Wall art',
      'Mirrors', 'Clocks', 'Storage containers',
    ],
  },
  {
    name: 'Kitchen & Dining',
    emoji: '🍳',
    subcategories: [
      'Pots', 'Pans', 'Plates', 'Bowls', 'Cups', 'Cutlery', 'Blenders', 'Microwaves',
      'Rice cookers', 'Air fryers', 'Electric kettles', 'Toasters', 'Food processors',
      'Water bottles', 'Lunch boxes', 'Kitchen utensils',
    ],
  },
  {
    name: 'Cleaning & Household',
    emoji: '🧹',
    subcategories: [
      'Detergents', 'Washing powder', 'Dishwashing liquid', 'Disinfectants', 'Bleach', 'Mops',
      'Brooms', 'Brushes', 'Buckets', 'Bins', 'Cleaning cloths', 'Air fresheners',
      'Laundry products',
    ],
  },
  {
    name: 'Groceries & Food',
    emoji: '🛒',
    subcategories: [
      'Rice', 'Cooking oil', 'Sugar', 'Flour', 'Cereals', 'Pasta', 'Noodles', 'Canned foods',
      'Biscuits', 'Snacks', 'Drinks', 'Water', 'Spices', 'Sauces', 'Condiments',
    ],
  },
  {
    name: 'Baby & Kids',
    emoji: '👶',
    subcategories: [
      'Baby clothes', 'Diapers', 'Baby wipes', 'Baby food', 'Baby bottles', 'Baby toiletries',
      'Toys', 'Strollers', 'Baby carriers', 'Cribs', "Children's books", 'School supplies',
    ],
  },
  {
    name: 'Books, School & Office',
    emoji: '📚',
    subcategories: [
      'Textbooks', 'Novels', 'Notebooks', 'Exercise books', 'Pens', 'Pencils', 'Calculators',
      'Backpacks', 'Files', 'Folders', 'Staplers', 'Printer paper', 'Office equipment',
      'Desk accessories',
    ],
  },
  {
    name: 'Sports & Fitness',
    emoji: '⚽',
    subcategories: [
      'Footballs', 'Jerseys', 'Sports shoes', 'Gym clothes', 'Dumbbells', 'Resistance bands',
      'Yoga mats', 'Skipping ropes', 'Fitness equipment', 'Sports bags', 'Water bottles',
    ],
  },
  {
    name: 'Automotive',
    emoji: '🚗',
    subcategories: [
      'Car accessories', 'Phone holders', 'Car chargers', 'Seat covers', 'Floor mats',
      'Car cleaning products', 'Air fresheners', 'Jump starters', 'Tools',
      'Motorbike accessories', 'Bicycle accessories',
    ],
  },
  {
    name: 'Tools & Hardware',
    emoji: '🔧',
    subcategories: [
      'Screwdrivers', 'Hammers', 'Pliers', 'Spanners', 'Drills', 'Measuring tools',
      'Electrical tools', 'Building hardware', 'Locks', 'Extension boards', 'Light bulbs',
      'Cables', 'Switches', 'Sockets',
    ],
  },
  {
    name: 'Electrical & Smart Home',
    emoji: '💡',
    subcategories: [
      'LED bulbs', 'Solar lights', 'Extension cables', 'Power strips', 'Inverters', 'Solar panels',
      'Rechargeable lamps', 'Smart bulbs', 'Smart plugs', 'Security cameras', 'Doorbells',
      'Sensors',
    ],
  },
  {
    name: 'Garden & Outdoor',
    emoji: '🌱',
    subcategories: [
      'Gardening tools', 'Plant pots', 'Seeds', 'Watering cans', 'Outdoor furniture',
      'Camping equipment', 'Tents', 'Outdoor lights', 'Picnic accessories',
    ],
  },
  {
    name: 'Pet Supplies',
    emoji: '🐕',
    subcategories: [
      'Pet food', 'Pet beds', 'Collars', 'Leashes', 'Pet toys', 'Feeding bowls',
      'Grooming products', 'Pet accessories',
    ],
  },
  {
    name: 'Travel',
    emoji: '✈️',
    subcategories: [
      'Suitcases', 'Travel bags', 'Neck pillows', 'Travel organizers', 'Passport holders',
      'Travel bottles', 'Travel accessories',
    ],
  },
  {
    name: 'Gifts & Special Occasions',
    emoji: '🎁',
    subcategories: [
      'Gift boxes', 'Flowers', 'Personalized gifts', 'Birthday gifts', 'Wedding gifts',
      'Anniversary gifts', 'Graduation gifts', "Valentine's gifts", 'Christmas items',
      'Party decorations',
    ],
  },
]

export const CATEGORY_NAMES: string[] = CATEGORIES.map((c) => c.name)

export function categoryLabel(name: string): string {
  const match = CATEGORIES.find((c) => c.name === name)
  return match ? `${match.emoji} ${match.name}` : name
}

export function subcategoriesFor(name: string): string[] {
  return CATEGORIES.find((c) => c.name === name)?.subcategories ?? []
}

export function orderCategories(names: string[]): string[] {
  const present = new Set(names)
  const ordered = CATEGORY_NAMES.filter((n) => present.has(n))
  const extra = names.filter((n) => !CATEGORY_NAMES.includes(n)).sort((a, b) => a.localeCompare(b))
  return [...ordered, ...extra]
}