export interface Product {
  id: string
  name: string
  category: string
  price: number
  original_price: number | null
  description: string
  image_url: string
  stock: number
  featured: boolean
  created_at: string
}

export interface CartItem {
  product_id: string
  name: string
  price: number
  image_url: string
  stock: number
  quantity: number
}

export interface OrderItem {
  product_id: string | null
  name: string
  price: number
  quantity: number
  image_url: string
}

export interface Order {
  id: string
  customer_name: string
  email: string
  phone: string
  address: string
  payment_method: PaymentMethod
  status: OrderStatus
  subtotal: number
  delivery_fee: number
  total: number
  created_at: string
  items: OrderItem[]
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
}

export type PaymentMethod = 'cash_on_delivery' | 'mobile_money'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Profile {
  id: string
  full_name: string
  role: 'customer' | 'admin'
}

export interface CategoryMeta {
  name: string
  image_url: string
  count: number
}

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
  { value: 'mobile_money', label: 'Mobile Money (MoMo)' },
]

export const DELIVERY_FEE = 35
export const FREE_DELIVERY_THRESHOLD = 1500