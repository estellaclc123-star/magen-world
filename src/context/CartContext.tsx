import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { computeDeliveryFee } from '../lib/api'
import type { CartItem, Product } from '../lib/types'

const CART_KEY = 'magen.cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  deliveryFee: number
  total: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (raw) return JSON.parse(raw) as CartItem[]
  } catch {
    /* ignore */
  }
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.product_id === product.id)
      if (existing) {
        return current.map((i) =>
          i.product_id === product.id
            ? {
                ...i,
                quantity: Math.min(i.quantity + quantity, product.stock, 100),
              }
            : i,
        )
      }
      return [
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock, 100),
        },
        ...current,
      ]
    })
  }

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((i) => i.product_id !== productId))
  }

  const setQuantity = (productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((i) =>
          i.product_id === productId
            ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock, 100)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    )
  }

  const clearCart = () => setItems([])

  const { count, subtotal, deliveryFee, total } = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const deliveryFee = computeDeliveryFee(subtotal)
    return { count, subtotal, deliveryFee, total: subtotal + deliveryFee }
  }, [items])

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, deliveryFee, total, addItem, removeItem, setQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}