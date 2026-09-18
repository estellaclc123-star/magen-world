import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingCart, Trash2, Plus } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { FREE_DELIVERY_THRESHOLD } from '../lib/types'
import { QuantityStepper } from '../components/QuantityStepper'
import { EmptyState } from '../components/EmptyState'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, subtotal, deliveryFee, total, setQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display text-3xl font-bold text-stone-900">Your Cart</h1>
        <EmptyState
          title="Your cart is empty"
          message="Browse our products and add something you love. Free delivery on orders over GH₵1,500."
          actionLabel="Start shopping"
          actionTo="/shop"
        />
      </div>
    )
  }

  const remainingForFree = FREE_DELIVERY_THRESHOLD - subtotal
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 flex items-center gap-2 font-display text-3xl font-bold text-stone-900">
        <ShoppingCart className="h-7 w-7 text-emerald-700" />
        Your Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="animate-fade-up flex gap-4 rounded-2xl border border-stone-200 bg-white p-4"
            >
              <Link
                to={`/product/${item.product_id}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100"
              >
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                      Price: {formatPrice(item.price)}
                    </p>
                    <Link
                      to={`/product/${item.product_id}`}
                      className="font-display text-base font-semibold text-stone-900 transition hover:text-emerald-800"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    max={item.stock}
                    onChange={(q) => setQuantity(item.product_id, q)}
                  />
                  <p className="text-lg font-bold text-stone-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            <Plus className="h-4 w-4" /> Continue shopping
          </Link>
        </div>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold text-stone-900">Order Summary</h2>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-stone-600">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? 'font-semibold text-emerald-700' : ''}>
                {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-stone-500">
              {remainingForFree > 0 ? (
                <>
                  Add <span className="font-semibold text-emerald-700">{formatPrice(remainingForFree)}</span>{' '}
                  more for free delivery
                </>
              ) : (
                'Free delivery unlocked'
              )}
            </p>
          </div>

          <dl className="mt-5 space-y-2.5 border-t border-stone-200 pt-5 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Subtotal ({items.length} item{items.length === 1 ? '' : 's'})</dt>
              <dd className="font-medium text-stone-900">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-stone-600">
              <dt>Delivery fee</dt>
              <dd className="font-medium text-stone-900">
                {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <dt className="font-display text-base font-bold text-stone-900">Total</dt>
              <dd className="font-display text-xl font-bold text-emerald-800">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-center text-xs text-stone-500">
            Cash on delivery & Mobile Money accepted
          </p>
        </aside>
      </div>
    </div>
  )
}