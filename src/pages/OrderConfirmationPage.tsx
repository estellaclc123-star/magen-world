import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, PackageSearch, Truck } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../lib/seo'

interface ConfirmationState {
  subtotal?: number
  deliveryFee?: number
  total?: number
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const state = (location.state ?? {}) as ConfirmationState
  const { user } = useAuth()

  useSEO({
    title: 'Order Confirmed',
    description: 'Your Magen World order has been placed. Track it from your account.',
    path: `/confirmation/${orderId ?? ''}`,
    noindex: true,
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="animate-scale-in mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-11 w-11 text-emerald-700" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-stone-900">Order placed!</h1>
      <p className="mt-2 text-stone-600">
        Thank you for shopping at Magen World. We&apos;ll review your order and reach out shortly.
      </p>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs tracking-wide text-stone-500 uppercase">Order reference</p>
            <p className="font-mono text-sm font-bold text-stone-900">{orderId}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Pending
          </span>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <dt>Subtotal</dt>
            <dd>{formatPrice(state.subtotal ?? 0)}</dd>
          </div>
          <div className="flex justify-between text-stone-600">
            <dt>Delivery fee</dt>
            <dd>{(state.deliveryFee ?? 0) === 0 ? 'FREE' : formatPrice(state.deliveryFee ?? 0)}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2">
            <dt className="font-display font-bold text-stone-900">Total</dt>
            <dd className="font-display text-lg font-bold text-emerald-800">
              {formatPrice(state.total ?? 0)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold text-stone-900">Estimated delivery</p>
            <p className="text-xs text-stone-500">2–4 working days across Ghana</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left">
          <PackageSearch className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold text-stone-900">Order tracking</p>
            <p className="text-xs text-stone-500">
              {user ? 'View status anytime from your account.' : 'Keep your order reference for tracking.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to={user ? '/account' : '/shop'}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          {user ? 'View my orders' : 'Continue shopping'}
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50"
        >
          Back to shop
        </Link>
      </div>
    </div>
  )
}