import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import type { Product } from '../lib/types'

interface ProductCardProps {
  product: Product
  onQuickAdd?: (product: Product) => void
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0
  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 5

  return (
    <Link
      to={`/product/${product.id}`}
      className="group animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            outOfStock ? 'opacity-40 grayscale' : ''
          }`}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow">
              Featured
            </span>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-stone-900/80 px-4 py-1.5 text-xs font-bold text-white">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
          {product.category}
        </span>
        <h3 className="line-clamp-1 font-display text-base font-semibold text-stone-900">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-stone-900">{formatPrice(product.price)}</p>
            {product.original_price && product.original_price > product.price && (
              <p className="text-xs text-stone-400 line-through">
                {formatPrice(product.original_price)}
              </p>
            )}
          </div>
          {lowStock && !outOfStock && (
            <span className="text-xs font-medium text-amber-600">Only {product.stock} left</span>
          )}
        </div>

        <button
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onQuickAdd?.(product)
          }}
          disabled={outOfStock}
          className="mt-2 w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {outOfStock ? 'Out of stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}