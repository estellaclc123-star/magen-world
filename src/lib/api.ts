import { supabase } from './supabase'
import { SAMPLE_PRODUCTS } from './mockData'
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  type CartItem,
  type CustomerInfo,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PaymentMethod,
  type Product,
} from './types'

const DEMO_PRODUCTS_KEY = 'magen.demo.products'
const DEMO_ORDERS_KEY = 'magen.demo.orders'

function readDemoProducts(): Product[] {
  try {
    const raw = localStorage.getItem(DEMO_PRODUCTS_KEY)
    if (raw) return JSON.parse(raw) as Product[]
  } catch {
    /* ignore */
  }
  return SAMPLE_PRODUCTS
}

function writeDemoProducts(list: Product[]): void {
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(list))
}

function readDemoOrders(): Order[] {
  try {
    const raw = localStorage.getItem(DEMO_ORDERS_KEY)
    if (raw) return JSON.parse(raw) as Order[]
  } catch {
    /* ignore */
  }
  return []
}

function writeDemoOrders(list: Order[]): void {
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(list))
}

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    category: String(row.category),
    price: Number(row.price),
    original_price: row.original_price !== null && row.original_price !== undefined
      ? Number(row.original_price)
      : null,
    description: String(row.description ?? ''),
    image_url: String(row.image_url ?? ''),
    stock: Number(row.stock),
    featured: Boolean(row.featured),
    created_at: String(row.created_at),
  }
}

export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => toProduct(row))
  }
  return readDemoProducts()
}

export async function getProduct(id: string): Promise<Product | null> {
  const filtered = (await getProducts()).filter((p) => p.id === id)
  return filtered[0] ?? null
}

export async function getCategories(): Promise<string[]> {
  if (supabase) {
    const { data, error } = await supabase.from('products').select('category')
    if (error) throw new Error(error.message)
    const unique = Array.from(new Set((data ?? []).map((r) => String(r.category))))
    return unique.sort((a, b) => a.localeCompare(b))
  }
  return Array.from(new Set(readDemoProducts().map((p) => p.category))).sort((a, b) =>
    a.localeCompare(b),
  )
}

export interface ProductInput {
  id?: string
  name: string
  category: string
  price: number
  original_price: number | null
  description: string
  image_url: string
  stock: number
  featured: boolean
}

async function uploadImage(file: File, existingUrl?: string): Promise<string> {
  if (supabase) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `products/${crypto.randomUUID()}-${safeName}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600' })
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
    return data.publicUrl
  }
  if (existingUrl && existingUrl.startsWith('data:')) return existingUrl
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Demo mode: images must be smaller than 2MB.')
  }
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read image file.'))
    reader.readAsDataURL(file)
  })
}

export async function upsertProduct(input: ProductInput, imageFile?: File): Promise<Product> {
  if (supabase) {
    const image_url = imageFile
      ? await uploadImage(imageFile, input.image_url)
      : input.image_url
    if (input.id) {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: input.name,
          category: input.category,
          price: input.price,
          original_price: input.original_price,
          description: input.description,
          image_url,
          stock: input.stock,
          featured: input.featured,
        })
        .eq('id', input.id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return toProduct(data)
    }
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: input.name,
        category: input.category,
        price: input.price,
        original_price: input.original_price,
        description: input.description,
        image_url,
        stock: input.stock,
        featured: input.featured,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return toProduct(data)
  }

  const list = readDemoProducts()
  const image_url = imageFile ? await uploadImage(imageFile, input.image_url) : input.image_url
  const normalized: Product = {
    id: input.id ?? crypto.randomUUID(),
    name: input.name.trim(),
    category: input.category.trim(),
    price: Number(input.price),
    original_price: input.original_price === null ? null : Number(input.original_price),
    description: input.description.trim(),
    image_url,
    stock: Number(input.stock),
    featured: input.featured,
    created_at: list.find((p) => p.id === input.id)?.created_at ?? new Date().toISOString(),
  }
  const next = input.id
    ? list.map((p) => (p.id === input.id ? normalized : p))
    : [normalized, ...list]
  writeDemoProducts(next)
  return normalized
}

export async function deleteProduct(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  const list = readDemoProducts().filter((p) => p.id !== id)
  writeDemoProducts(list)
}

export interface PlacementResult {
  orderId: string
  subtotal: number
  deliveryFee: number
  total: number
}

export function computeDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export async function placeCustomerOrder(
  items: CartItem[],
  customer: CustomerInfo,
  payment: PaymentMethod,
): Promise<PlacementResult> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = computeDeliveryFee(subtotal)
  const total = subtotal + deliveryFee

  if (supabase) {
    const { data, error } = await supabase.rpc('place_order', {
      p_items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      p_customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      p_payment_method: payment,
    })
    if (error) throw new Error(error.message)
    return { orderId: String(data), subtotal, deliveryFee, total }
  }

  const products = readDemoProducts()
  const orderItems: OrderItem[] = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id)
    return {
      product_id: product?.id ?? item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    }
  })

  const order: Order = {
    id: crypto.randomUUID(),
    customer_name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    payment_method: payment,
    status: 'pending',
    subtotal,
    delivery_fee: deliveryFee,
    total,
    created_at: new Date().toISOString(),
    items: orderItems,
  }

  const nextStock = products.map((p) => {
    const qty = items.find((i) => i.product_id === p.id)?.quantity ?? 0
    return qty > 0 ? { ...p, stock: Math.max(0, p.stock - qty) } : p
  })
  writeDemoProducts(nextStock)
  writeDemoOrders([order, ...readDemoOrders()])

  return { orderId: order.id, subtotal, deliveryFee, total }
}

function toOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    customer_name: String(row.customer_name),
    email: String(row.email),
    phone: String(row.phone),
    address: String(row.address),
    payment_method: row.payment_method as PaymentMethod,
    status: row.status as OrderStatus,
    subtotal: Number(row.subtotal),
    delivery_fee: Number(row.delivery_fee),
    total: Number(row.total),
    created_at: String(row.created_at),
    items: ((row as Record<string, unknown>).order_items as Record<string, unknown>[] | undefined ?? [])
      .map((item) => ({
        product_id: item.product_id ? String(item.product_id) : null,
        name: String(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
        image_url: String(item.image_url ?? ''),
      })),
  }
}

export async function getOrders(): Promise<Order[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => toOrder(row))
  }
  return readDemoOrders()
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (supabase) {
    const { error } = await supabase.rpc('update_order_status', {
      p_order_id: orderId,
      p_status: status,
    })
    if (error) throw new Error(error.message)
    return
  }

  const orders = readDemoOrders()
  const order = orders.find((o) => o.id === orderId)
  if (!order) throw new Error('Order not found.')

  if (status === 'cancelled' && order.status !== 'cancelled') {
    const products = readDemoProducts()
    const nextStock = products.map((p) => {
      const qty = order.items.find((i) => i.product_id === p.id)?.quantity ?? 0
      return qty > 0 ? { ...p, stock: p.stock + qty } : p
    })
    writeDemoProducts(nextStock)
  }

  writeDemoOrders(
    orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
  )
}