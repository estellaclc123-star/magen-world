import { Link, NavLink } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?sort=discount', label: 'Deals' },
]

export default function Navbar() {
  const { count } = useCart()
  const { user, profile, isDemo, signOut } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setMobileOpen(false)
  }

  const displayName =
    profile?.full_name || (isDemo && user ? 'Demo Owner' : user?.email?.split('@')[0]) || 'Sign in'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'font-semibold text-emerald-800'
      : 'text-stone-600 transition hover:text-emerald-800'

  return (
    <header className="sticky top-0 z-40">
      {settings.announcement_enabled && (
        <div className="bg-emerald-900 px-4 py-2 text-center text-xs font-medium text-emerald-50">
          {settings.announcement_text}
        </div>
      )}
      <nav className="border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Magen World logo" className="h-9 w-9 shrink-0 rounded-xl" />
            <span className="font-display text-xl font-bold tracking-tight text-stone-900">
              Magen <span className="text-emerald-700">World</span>
            </span>
          </Link>

          <div className="hidden flex-1 justify-center px-4 lg:flex">
            <form onSubmit={submitSearch} className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-stone-300 bg-stone-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </form>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              to={user ? '/account' : '/auth'}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 sm:flex"
              title="Account"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden max-w-28 truncate md:block">{displayName}</span>
            </Link>

            <Link
              to="/auth"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 sm:hidden"
              title="Account"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                <User className="h-4 w-4" />
              </span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-stone-900">
                  {count}
                </span>
              )}
              <span className="hidden lg:inline">Cart</span>
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-6 border-t border-stone-100 px-4 py-2 sm:flex lg:hidden">
          <form onSubmit={submitSearch} className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-stone-300 bg-stone-50 py-2 pr-4 pl-10 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </form>
        </div>

        <div className="hidden items-center gap-6 border-t border-stone-100 px-6 py-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
          {user && (
            <button
              onClick={handleSignOut}
              className="ml-auto text-sm font-medium text-stone-500 transition hover:text-rose-600"
            >
              Sign out
            </button>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-in border-b border-stone-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="mb-4 space-y-1">
            {NAV_LINKS.map((link, idx) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={user ? '/account' : '/auth'}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              {user ? 'My Account' : 'Sign in / Register'}
            </NavLink>
          </div>
          {user && (
            <button
              onClick={() => {
                void handleSignOut()
              }}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  )
}