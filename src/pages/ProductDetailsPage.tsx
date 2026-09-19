import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ChevronRight,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { getProduct, getProducts } from '../lib/api'
import { SAMPLE_PRODUCTS } from '../lib/mockData'
import { formatPrice } from '../lib/format'
import type { Product } from '../lib/types'
import { ProductCard } from '../components/ProductCard'
import { QuantityStepper } from '../components/QuantityStepper'
import { Spinner } from '../components/Spinner'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useSettings } from '../context/SettingsContext'
import { useSEO } from '../lib/seo'

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()
  const { settings } = useSettings()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useSEO({
    title: product ? product.name : 'Product',
    description: product
      ? `${product.name} – ${product.description.slice(0, 150)}`
      : 'View product details at Magen World.',
    path: product ? `/product/${product.id}` : '/product',
    image: product?.image_url,
  })

  useEffect(() => {
    let active = true
    setLoading(true)
    setQuantity(1)
    Promise.all([getProduct(id ?? ''), getProducts()])
      .then(([detail, all]) => {
        if (!active) return
        const resolved = detail ?? all.find((p) => p.id === id) ?? null
        if (!resolved) {
          setProduct(SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null)
        } else {
          setProduct(resolved)
        }
        setRelated(
          all
            .filter((p) => p.category === resolved?.category && p.id !== resolved?.id)
            .slice(0, 4),
        )
      })
      .catch(() => {
        if (!active) return
        const resolved = SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null
        setProduct(resolved)
        setRelated(SAMPLE_PRODUCTS.filter((p) => p.category === resolved?.category && p.id !== resolved?.id).slice(0, 4))
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Spinner label="Loading product…" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-display text-xl font-semibold text-stone-900">Product not found</p>
        <Link to="/shop" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          Back to shop →
        </Link>
      </div>
    )
  }

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0
  const outOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (outOfStock) {
      toast('This product is currently out of stock.', 'info')
      return
    }
    addItem(product, quantity)
    toast(`${quantity} × ${product.name} added to cart.`)
  }

  const handleBuyNow = () => {
    if (outOfStock) {
      toast('This product is currently out of stock.', 'info')
      return
    }
    addItem(product, quantity)
    navigate('/checkout')
  }

  const quickAdd = (p: Product) => {
    addItem(p)
    toast(`${p.name} added to cart.`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-stone-500">
        <Link to="/" className="transition hover:text-emerald-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="transition hover:text-emerald-700">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="transition hover:text-emerald-700"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate font-medium text-stone-800">{product.name}</span>
      </nav>

      <div className="animate-fade-up grid gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <img
            src={product.image_url}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                Save {discount}%
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow-lg">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-stone-900">{formatPrice(product.price)}</p>
            {product.original_price && product.original_price > product.price && (
              <p className="pb-1 text-lg text-stone-500 line-through">
                {formatPrice(product.original_price)}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 font-medium text-rose-700">
                <AlertTriangle className="h-4 w-4" /> Out of stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-700">
                <AlertTriangle className="h-4 w-4" /> Only {product.stock} left in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> In stock — {product.stock} available
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-stone-200 pt-6">
            <h2 className="font-display text-sm font-semibold tracking-wide text-stone-900 uppercase">
              Description
            </h2>
            <p className="mt-2 leading-relaxed text-stone-600">{product.description}</p>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-stone-700">Quantity</p>
            <QuantityStepper value={quantity} onChange={setQuantity} max={Math.min(product.stock, 100)} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-6 py-3.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
            >
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
            >
              <Zap className="h-5 w-5" /> Buy Now
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-3">
            {[
              { icon: Truck, title: 'Delivery', text: `2–4 days, free over ${formatPrice(settings.free_delivery_threshold)}` },
              { icon: ShieldCheck, title: 'Secure', text: 'COD & Mobile Money' },
              { icon: RotateCcw, title: 'Returns', text: '7-day easy returns' },
            ].map((b) => (
              <div key={b.title} className="flex flex-col gap-1.5">
                <b.icon className="h-5 w-5 text-emerald-700" />
                <p className="text-sm font-semibold text-stone-800">{b.title}</p>
                <p className="text-xs text-stone-500">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-stone-900">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onQuickAdd={quickAdd} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}