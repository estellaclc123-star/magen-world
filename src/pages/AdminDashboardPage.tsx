import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import { useSEO } from '../lib/seo'
import { ProductsPanel } from './admin/ProductsPanel'
import { OrdersPanel } from './admin/OrdersPanel'

type Tab = 'dashboard' | 'products' | 'orders'

function isAdminAvailable(
  user: { id: string; email: string } | null,
  role: 'customer' | 'admin' | undefined,
): boolean {
  if (!isSupabaseConfigured) return true
  return Boolean(user && role === 'admin')
}

export default function AdminDashboardPage() {
  const { user, profile, isDemo } = useAuth()
  const [tab, setTab] = useState<Tab>('dashboard')

  useSEO({
    title: 'Admin Dashboard',
    description: 'Magen World admin dashboard – manage your product catalogue and customer orders.',
    path: '/admin',
    noindex: true,
  })

  if (!isAdminAvailable(user, profile?.role)) {
    return <Navigate to="/auth" state={{ from: '/admin' }} replace />
  }

  const isAdmin = isAdminAvailable(user, profile?.role)

  const tabs: { value: Tab; label: string; icon: typeof Package }[] = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'products', label: 'Products', icon: Package },
    { value: 'orders', label: 'Orders', icon: ShoppingBag },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage your product catalogue and customer orders.
          </p>
        </div>
        <Link
          to="/shop"
          className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
        >
          View storefront
        </Link>
      </div>

      {isDemo && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-sm text-emerald-800">
            Demo mode: products and orders are stored in this browser. Connect Supabase in .env to
            manage a live store.
          </p>
          <Link
            to="/account"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Go to account →
          </Link>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.value
                ? 'border-b-2 border-emerald-700 bg-emerald-50 text-emerald-800'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {tab === 'dashboard' && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Quick actions',
                items: [
                  { label: 'Add a new product', action: () => setTab('products') },
                  { label: 'Review new orders', action: () => setTab('orders') },
                ],
              },
              {
                title: 'Storefront',
                items: [
                  { label: 'Shop categories', href: '/shop' },
                  { label: 'Special offers', href: '/shop?sort=discount' },
                ],
              },
              {
                title: 'Account',
                items: [
                  { label: 'My orders', href: '/account' },
                  { label: 'Store profile', href: '/account' },
                ],
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-stone-200 bg-white p-5">
                <h2 className="mb-3 font-display text-sm font-semibold text-stone-900 uppercase">
                  {card.title}
                </h2>
                <ul className="space-y-2">
                  {card.items.map((item) =>
                    'action' in item ? (
                      <li key={item.label}>
                        <button
                          onClick={item.action}
                          className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                        >
                          {item.label} →
                        </button>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                        >
                          {item.label} →
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
        {tab === 'products' && <ProductsPanel isAdmin={isAdmin} />}
        {tab === 'orders' && <OrdersPanel isAdmin={isAdmin} />}
      </div>
    </div>
  )
}