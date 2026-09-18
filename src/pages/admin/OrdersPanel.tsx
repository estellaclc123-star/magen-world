import { useEffect, useMemo, useState } from 'react'
import { Package, Phone, MapPin, Mail } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../lib/api'
import { formatDate, formatPrice } from '../../lib/format'
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
} from '../../lib/types'
import { StatusBadge } from '../../components/StatusBadge'
import { Spinner } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

export function OrdersPanel({ isAdmin }: { isAdmin: boolean }) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async () => {
    try {
      setOrders(await getOrders())
    } catch {
      setOrders([])
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(
    () =>
      (orders ?? []).filter((o) =>
        statusFilter === 'all' ? true : o.status === statusFilter,
      ),
    [orders, statusFilter],
  )

  const totalRevenue = useMemo(
    () =>
      (orders ?? [])
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    [orders],
  )

  const handleStatus = async (order: Order, status: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, status)
      toast(`Order marked as ${status.replace('_', ' ')}.`)
      await load()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not update order.', 'error')
    }
  }

  const countFor = (status: 'all' | OrderStatus) =>
    status === 'all' ? orders?.length ?? 0 : (orders ?? []).filter((o) => o.status === status).length

  const tabs: { value: 'all' | OrderStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    ...ORDER_STATUSES.map((s) => ({ value: s as 'all' | OrderStatus, label: s })),
  ]

  if (!orders) return <Spinner label="Loading orders…" />

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="text-xs text-stone-500 uppercase">Total orders</p>
          <p className="mt-1 font-display text-2xl font-bold text-stone-900">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="text-xs text-stone-500 uppercase">Revenue (excl. cancelled)</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-800">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="text-xs text-stone-500 uppercase">Pending</p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-600">
            {countFor('pending')}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="text-xs text-stone-500 uppercase">Delivered</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600">
            {countFor('delivered')}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              statusFilter === tab.value
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)} ({countFor(tab.value)})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No orders here"
          message="Orders placed through the storefront will appear here."
          actionLabel="Go to storefront"
          actionTo="/shop"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="animate-fade-up rounded-2xl border border-stone-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Package className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-stone-900">{order.customer_name}</p>
                    <p className="font-mono text-xs text-stone-500">#{order.id.slice(0, 8)}</p>
                  </div>
                  <span className="text-sm text-stone-500">· {formatDate(order.created_at)}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="font-display text-lg font-bold text-emerald-800">
                  {formatPrice(order.total)}
                </p>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-[1fr_260px]">
                <div>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg bg-stone-100 object-cover"
                        />
                        <span className="flex-1 text-sm text-stone-700">{item.name}</span>
                        <span className="text-xs text-stone-500">× {item.quantity}</span>
                        <span className="text-sm font-medium text-stone-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-stone-100 pt-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {order.phone}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {order.email}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {order.address}
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 md:border-l md:border-stone-100 md:pl-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="font-medium text-stone-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Delivery</span>
                    <span className="font-medium text-stone-900">
                      {order.delivery_fee === 0 ? 'FREE' : formatPrice(order.delivery_fee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Payment</span>
                    <span className="font-medium text-stone-900">
                      {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Mobile Money'}
                    </span>
                  </div>

                  <div className="mt-auto border-t border-stone-100 pt-3">
                    <label className="mb-1.5 block text-xs font-medium text-stone-500">
                      Order status
                    </label>
                    <select
                      value={order.status}
                      disabled={!isAdmin || ALLOWED_TRANSITIONS[order.status].length === 0}
                      onChange={(e) => void handleStatus(order, e.target.value as OrderStatus)}
                      className={`w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-medium outline-none transition focus:border-emerald-600 ${
                        !isAdmin ? 'cursor-not-allowed bg-stone-100' : 'bg-white'
                      }`}
                    >
                      <option value={order.status}>{order.status}</option>
                      {ALLOWED_TRANSITIONS[order.status].map((next) => (
                        <option key={next} value={next}>
                          {next}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    {expanded === order.id ? 'Hide details' : 'View details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAdmin && (
        <p className="mt-4 text-xs text-stone-500">
          You are viewing orders in demo mode — changes are stored locally in your browser.
        </p>
      )}
    </div>
  )
}