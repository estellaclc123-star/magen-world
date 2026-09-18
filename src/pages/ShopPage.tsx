import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Check } from 'lucide-react'
import { getProducts } from '../lib/api'
import { SAMPLE_PRODUCTS } from '../lib/mockData'
import type { Product } from '../lib/types'
import { ProductCard } from '../components/ProductCard'
import { Spinner } from '../components/Spinner'
import { EmptyState } from '../components/EmptyState'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'discount' | 'name'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'name', label: 'Name A–Z' },
]

const PRICE_RANGES = [
  { label: 'All prices', min: 0, max: Infinity },
  { label: 'Under GH₵500', min: 0, max: 500 },
  { label: 'GH₵500 – GH₵1,000', min: 500, max: 1000 },
  { label: 'GH₵1,000 – GH₵3,000', min: 1000, max: 3000 },
  { label: 'Above GH₵3,000', min: 3000, max: Infinity },
]

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const searchQ = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const sort = (params.get('sort') ?? 'newest') as SortKey
  const inStockOnly = params.get('inStock') === '1'

  const filterCount =
    (searchQ ? 1 : 0) +
    (category ? 1 : 0) +
    (params.get('minPrice') ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  useEffect(() => {
    let active = true
    setLoading(true)
    getProducts()
      .then((data) => active && setProducts(data))
      .catch(() => active && setProducts(SAMPLE_PRODUCTS))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (searchQ) {
      const q = searchQ.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }
    if (category) list = list.filter((p) => p.category === category)
    if (inStockOnly) list = list.filter((p) => p.stock > 0)

    const minRaw = Number(params.get('minPrice') ?? '')
    const maxRaw = Number(params.get('maxPrice') ?? '')
    if (!Number.isNaN(minRaw) && minRaw > 0) list = list.filter((p) => p.price >= minRaw)
    if (!Number.isNaN(maxRaw) && maxRaw > 0) list = list.filter((p) => p.price <= maxRaw)

    const discountOf = (p: Product) =>
      p.original_price ? (p.original_price - p.price) / p.original_price : 0

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'discount':
        list.sort((a, b) => discountOf(b) - discountOf(a))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
    return list
  }, [products, searchQ, category, inStockOnly, sort, params])

  const quickAdd = (product: Product) => {
    if (product.stock <= 0) {
      toast('This product is currently out of stock.', 'info')
      return
    }
    addItem(product)
    toast(`${product.name} added to cart.`)
  }

  const clearFilters = () => {
    setParams(new URLSearchParams(), { replace: true })
  }

  const activeMin = Number(params.get('minPrice') ?? '')
  const activeMax = Number(params.get('maxPrice') ?? '')

  const filtersPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold text-stone-900">Category</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam('category', null)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                !category ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Categories
              {!category && <Check className="h-4 w-4" />}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => updateParam('category', cat)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  category === cat ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat}
                {category === cat && <Check className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-semibold text-stone-900">Price range</h3>
        <ul className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              activeMin === range.min && (activeMax === range.max || Number.isNaN(activeMax))
            return (
              <li key={range.label}>
                <button
                  onClick={() => {
                    if (range.max === Infinity) {
                      updateParam('minPrice', null)
                      updateParam('maxPrice', null)
                    } else {
                      updateParam('minPrice', String(range.min))
                      updateParam('maxPrice', String(range.max))
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {range.label}
                  {isActive && <Check className="h-4 w-4" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-lg bg-stone-100 px-3 py-2.5">
        <span className="text-sm font-medium text-stone-700">In stock only</span>
        <span
          className={`relative h-6 w-11 rounded-full transition ${inStockOnly ? 'bg-emerald-600' : 'bg-stone-300'}`}
          onClick={() => updateParam('inStock', inStockOnly ? null : '1')}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              inStockOnly ? 'left-5.5' : 'left-0.5'
            }`}
          />
        </span>
      </label>

      {filterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
        >
          <X className="h-4 w-4" /> Clear filters ({filterCount})
        </button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-stone-900">Shop</h1>
        <p className="mt-1 text-sm text-stone-500">
          {loading ? 'Loading products…' : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
          {category ? ` in ${category}` : ''}
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:hidden">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = (e.currentTarget.elements.namedItem('mobileSearch') as HTMLInputElement).value
            updateParam('q', input.trim())
          }}
          className="relative"
        >
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            name="mobileSearch"
            defaultValue={searchQ}
            placeholder="Search products…"
            className="w-full rounded-full border border-stone-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </form>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {filterCount > 0 && (
            <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white">
              {filterCount}
            </span>
          )}
        </button>
        {filtersOpen && (
          <div className="animate-fade-in rounded-2xl border border-stone-200 bg-white p-4">
            {filtersPanel}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-stone-900">
              <SlidersHorizontal className="h-4 w-4 text-emerald-700" /> Filters
            </h2>
            {filtersPanel}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const input = (e.currentTarget.elements.namedItem('desktopSearch') as HTMLInputElement).value
                updateParam('q', input.trim())
              }}
              className="relative hidden flex-1 lg:block"
            >
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                name="desktopSearch"
                defaultValue={searchQ}
                placeholder="Search products…"
                className="w-full max-w-sm rounded-full border border-stone-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </form>

            {searchQ && (
              <button
                onClick={() => updateParam('q', null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100"
              >
                “{searchQ}” <X className="h-3.5 w-3.5" />
              </button>
            )}

            <label className="ml-auto flex items-center gap-2 text-sm text-stone-600">
              Sort
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm font-medium text-stone-800 outline-none transition focus:border-emerald-600"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear all filters"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onQuickAdd={quickAdd} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}