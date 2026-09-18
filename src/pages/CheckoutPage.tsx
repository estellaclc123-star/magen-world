import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Banknote,
  Smartphone,
  Lock,
  AlertCircle,
  Loader2,
  MapPin,
} from 'lucide-react'
import { placeCustomerOrder } from '../lib/api'
import { formatPrice } from '../lib/format'
import { PAYMENT_METHODS, type PaymentMethod } from '../lib/types'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart()
  const { user, isDemo } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(() => (isDemo ? 'Demo Customer' : ''))
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('cash_on_delivery')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const needsAuth = !isDemo && !user
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern = /^\+?[0-9][0-9 ()-]{7,19}$/

  const validate = (): string => {
    if (needsAuth) return 'Please sign in to place an order.'
    if (name.trim().length === 0) return 'Please enter your full name.'
    if (email.trim().length === 0) return 'Please enter your email address.'
    if (name.trim().length > 120) return 'Name is too long.'
    if (!emailPattern.test(email.trim())) return 'Please enter a valid email address.'
    if (!phonePattern.test(phone.trim())) return 'Please enter a valid phone number (8–20 digits).'
    if (address.trim().length === 0) return 'Please enter your delivery address.'
    if (address.trim().length > 500) return 'Address is too long.'
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const result = await placeCustomerOrder(
        items,
        { name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim() },
        payment,
      )
      clearCart()
      navigate(`/confirmation/${result.orderId}`, {
        state: { subtotal: result.subtotal, deliveryFee: result.deliveryFee, total: result.total },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-stone-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {needsAuth && (
            <div className="animate-fade-in flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Sign in to place your order
                  </p>
                  <p className="text-sm text-amber-700">
                    You already have items in your cart — your order will be saved to your account.
                  </p>
                </div>
              </div>
              <Link
                to="/auth"
                state={{ from: '/checkout' }}
                className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-center text-sm font-bold text-amber-950 transition hover:bg-amber-400"
              >
                Sign in
              </Link>
            </div>
          )}

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-stone-900">
              <MapPin className="h-5 w-5 text-emerald-700" /> Delivery Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-name" className="mb-1.5 block text-sm font-medium text-stone-700">
                  Full name
                </label>
                <input
                  id="checkout-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ama Mensah"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-medium text-stone-700">
                  Email address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-medium text-stone-700">
                  Phone number
                </label>
                <input
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 024 000 0000"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-address" className="mb-1.5 block text-sm font-medium text-stone-700">
                  Delivery address
                </label>
                <textarea
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="House number, street, town/city, region"
                  className="w-full resize-none rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-stone-900">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.value === 'cash_on_delivery' ? Banknote : Smartphone
                const selected = payment === method.value
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPayment(method.value)}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                      selected
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        selected ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-stone-900">
                        {method.label}
                      </span>
                      <span className="block text-xs text-stone-500">
                        {method.value === 'cash_on_delivery'
                          ? 'Pay in cash when your order arrives'
                          : 'Pay via MTN MoMo, Telecel Cash or AT Money'}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selected ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300'
                      }`}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {error && (
            <div className="animate-fade-in flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Placing order…
              </>
            ) : (
              <>
                Place Order · {formatPrice(total)} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 font-display text-lg font-bold text-stone-900">Order Summary</h2>
          <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.product_id} className="flex items-start gap-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-14 w-14 shrink-0 rounded-lg bg-stone-100 object-cover"
                />
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-stone-800">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-stone-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2.5 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Subtotal</dt>
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
          <p className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
            <Lock className="h-3.5 w-3.5" /> Orders are fulfilled securely by Magen World.
          </p>
        </aside>
      </div>
    </div>
  )
}