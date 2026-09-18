import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { CATEGORIES } from '../lib/mockData'
import { BUSINESS_NAME, ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL } from '../lib/business'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?sort=discount', label: 'Special Offers' },
  { to: '/cart', label: 'Your Cart' },
  { to: '/account', label: 'My Account' },
]

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="mt-16 bg-emerald-950 text-emerald-100">
      <h2 className="sr-only">Footer</h2>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Magen World logo" className="h-9 w-9 shrink-0 rounded-xl" />
            <span className="font-display text-xl font-bold text-white">
              Magen <span className="text-amber-300">World</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-emerald-200/80">
            Quality products in Electronics, Fashion, Accessories, Home & Living and Beauty.
            Delivered across Ghana with pay-on-delivery options.
          </p>
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
          <h3 className="mt-6 font-display text-sm font-semibold tracking-wide text-white uppercase">
            Legal
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LEGAL_LINKS.map((link) => (
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
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-emerald-200/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              {ADDRESS}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-amber-300" />
              <a href={`tel:${PHONE_TEL}`} className="transition hover:text-amber-300">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-amber-300" />
              <a href={`mailto:${EMAIL}`} className="transition hover:text-amber-300">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-900 px-4 py-5 text-center text-xs text-emerald-300/70">
        © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved. ·{' '}
        <Link to="/privacy" className="transition hover:text-amber-300">
          Privacy
        </Link>{' '}
        ·{' '}
        <Link to="/terms" className="transition hover:text-amber-300">
          Terms
        </Link>
      </div>
    </footer>
  )
}