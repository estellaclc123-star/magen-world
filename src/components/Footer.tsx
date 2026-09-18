import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { CATEGORIES } from '../lib/mockData'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?sort=discount', label: 'Special Offers' },
  { to: '/cart', label: 'Your Cart' },
  { to: '/account', label: 'My Account' },
]

export default function Footer() {
  return (
    <footer className="mt-16 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-amber-300">
              <span className="font-display text-lg font-bold">M</span>
            </span>
            <span className="font-display text-xl font-bold text-white">
              Magen <span className="text-amber-300">World</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-emerald-200/80">
            Quality products in Electronics, Fashion, Accessories, Home & Living and Beauty.
            Delivered across Ghana with pay-on-delivery options.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-emerald-200 transition hover:bg-amber-400 hover:text-emerald-950"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-emerald-200/80 transition hover:text-amber-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase">
            Categories
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="text-emerald-200/80 transition hover:text-amber-300"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-emerald-200/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              Accra, Ghana
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-amber-300" />
              +233 24 000 0000
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-amber-300" />
              hello@magenworld.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-900 px-4 py-5 text-center text-xs text-emerald-300/70">
        © {new Date().getFullYear()} Magen World. All rights reserved.
      </div>
    </footer>
  )
}