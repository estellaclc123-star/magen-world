import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck, ShoppingBag, User, Store } from 'lucide-react'
import { getOrders } from '../lib/api'
import { formatDate, formatPrice } from '../lib/format'
import type { Order } from '../lib/types'
import { StatusBadge } from '../components/StatusBadge'
import { Spinner } from '../components/Spinner'
import { EmptyState } from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AccountPage() {
  const { user, profile, isDemo, signOut } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user && !isDemo) {
      setLoading(false)
      return
    }
    getOrders()
      .then((data) => active && setOrders(data))
      .catch(() => active && setOrders([]))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user, isDemo])

  if (!user && !isDemo) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <EmptyState
          title="Sign in to view your account"
          message="Track your orders, save your details and manage your account."
          actionLabel="Sign in"
          actionTo="/auth"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            {isDemo ? <Store className="h-7 w-7" /> : <User className="h-7 w-7" />}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-stone-900">
              {isDemo ? 'Demo Owner' : profile?.full_name || user?.email}
            </h1>
            <p className="text-sm text-stone-500">
              {isDemo ? 'owner@magen.world' : user?.email}
              {profile?.role === 'admin' && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  Admin
                </span>
              )}
              {isDemo && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Demo mode
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Admin dashboard
            </Link>
          )}
          <button
            onClick={async () => {
              await signOut()
              toast('Signed out.')
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-stone-900">
          <PackageCheck className="h-5 w-5 text-emerald-700" /> My Orders
        </h2>

        {loading ? (
          <Spinner label="Loading orders…" />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="When you place an order it will appear here with live status updates."
            actionLabel="Start shopping"
            actionTo="/shop"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="animate-fade-up rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-stone-500">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-sm text-stone-500">{formatDate(order.created_at)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="font-display text-lg font-bold text-emerald-800">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <ul className="mt-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-11 w-11 rounded-lg bg-stone-100 object-cover"
                      />
                      <span className="flex-1 text-sm text-stone-700">{item.name}</span>
                      <span className="text-xs text-stone-500">× {item.quantity}</span>
                      <span className="w-24 text-right text-sm font-medium text-stone-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {order.payment_method === 'cash_on_delivery'
                      ? 'Cash on Delivery'
                      : 'Mobile Money'}
                  </span>
                  <span>Deliver to: {order.address}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}