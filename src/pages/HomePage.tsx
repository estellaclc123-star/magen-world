import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Tag, Truck, ShieldCheck, RefreshCw } from 'lucide-react'
import { getProducts } from '../lib/api'
import { formatPrice } from '../lib/format'
import { SAMPLE_PRODUCTS } from '../lib/mockData'
import type { Product } from '../lib/types'
import { ProductCard } from '../components/ProductCard'
import { SectionHeader } from '../components/SectionHeader'
import { Spinner } from '../components/Spinner'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useSettings } from '../context/SettingsContext'
import { useSEO } from '../lib/seo'

function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    getProducts()
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch(() => {
        if (active) setProducts(SAMPLE_PRODUCTS)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { products, loading }
}

export default function HomePage() {
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { toast } = useToast()
  const { settings } = useSettings()

  const featured = products.filter((p) => p.featured).slice(0, 4)
  const discounted = products
    .filter((p) => p.original_price && p.original_price > p.price)
    .sort(
      (a, b) =>
        ((b.original_price! - b.price) / b.original_price!) -
        ((a.original_price! - a.price) / a.original_price!),
    )
    .slice(0, 8)
  const newArrivals = [...products]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 4)

  const categories = Array.from(new Set(products.map((p) => p.category))).slice(0, 5)
  const categoryImage = (name: string) =>
    products.find((p) => p.category === name)?.image_url ?? ''

  useSEO({
    title: 'Home',
    description:
      'Magen World – quality products in Electronics, Fashion, Accessories, Home & Living and Beauty, delivered across Ghana with pay-on-delivery options.',
    path: '/',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  })

  const quickAdd = (product: Product) => {
    if (product.stock <= 0) {
      toast('This product is currently out of stock.', 'info')
      return
    }
    addItem(product)
    toast(`${product.name} added to cart.`)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-emerald-950">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-800/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="animate-fade-up relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              New season · Shop the latest
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
              Everything you need,
              <span className="block text-amber-300">delivered in Ghana.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-emerald-100/80 sm:text-lg">
              Discover honest prices on Electronics, Fashion, Beauty and more. Fast delivery,
              easy payments and pay on delivery available.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop?sort=discount"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-900/60 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Browse Deals <Tag className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-emerald-100">
              {[
                { icon: Truck, title: 'Fast Delivery', sub: '2–4 days' },
                { icon: ShieldCheck, title: 'Safe Payments', sub: 'COD + MoMo' },
                { icon: RefreshCw, title: 'Easy Returns', sub: '7 days' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-1.5">
                  <item.icon className="h-5 w-5 text-amber-300" />
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-emerald-200/70">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up stagger-2 relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p, idx) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className={`group overflow-hidden rounded-2xl bg-emerald-900/60 shadow-xl ${
                    idx % 2 === 0 ? 'translate-y-0' : 'translate-y-8'
                  }`}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="aspect-[4/5] w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Browse by category"
          title="Shop Categories"
          subtitle="Find exactly what you're looking for"
          action={
            <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              View all →
            </Link>
          }
        />
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, idx) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className={`group animate-fade-up stagger-${(idx % 5) + 1} relative overflow-hidden rounded-2xl`}
              >
                <img
                  src={categoryImage(cat)}
                  alt={cat}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />
                <div className="absolute right-4 bottom-4 left-4">
                  <h3 className="font-display text-lg font-bold text-white">{cat}</h3>
                  <p className="text-xs text-emerald-200/80">
                    {products.filter((p) => p.category === cat).length} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Handpicked for you"
          title="Featured Products"
          action={
            <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              View all →
            </Link>
          }
        />
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.length > 0 ? (
              featured.map((p) => <ProductCard key={p.id} product={p} onQuickAdd={quickAdd} />)
            ) : (
              <p className="col-span-full py-10 text-center text-stone-500">No featured products yet.</p>
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Just landed"
          title="New Arrivals"
          action={
            <Link to="/shop?sort=newest" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              View all →
            </Link>
          }
        />
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} onQuickAdd={quickAdd} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-emerald-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Limited time"
            title="Special Offers"
            subtitle="Save on popular favourites"
            action={
              <Link
                to="/shop?sort=discount"
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View all offers →
              </Link>
            }
          />
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {discounted.map((p) => (
                <ProductCard key={p.id} product={p} onQuickAdd={quickAdd} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-emerald-900">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                Magen World membership
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Join and enjoy exclusive perks
              </h2>
              <p className="mt-4 max-w-md text-emerald-100/80">
                Track your orders, get personalised deals and enjoy priority delivery when you
                create your account.
              </p>
              <Link
                to="/auth"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-emerald-950 transition hover:bg-amber-300"
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { value: `${categories.length || '5'}`, label: 'Categories' },
                { value: `${products.length || '0'}`, label: 'Products' },
                { value: `${formatPrice(settings.free_delivery_threshold)}+`, label: 'Free delivery' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-emerald-800/70 p-6">
                  <p className="font-display text-3xl font-bold text-amber-300">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-100/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}