import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Clock, Store } from 'lucide-react'
import { useSEO } from '../lib/seo'
import {
  BUSINESS_NAME,
  BUSINESS_HOURS,
  ADDRESS,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '../lib/business'

export default function ContactPage() {
  useSEO({
    title: 'Contact Us',
    description:
      'Reach the Magen World team by phone or email. Real contact details for orders, deliveries and support across Ghana.',
    path: '/contact',
  })

  const rows = [
    {
      icon: Phone,
      label: 'Phone',
      value: PHONE_DISPLAY,
      href: `tel:${PHONE_TEL}`,
    },
    { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, label: 'Address', value: ADDRESS, href: undefined },
    { icon: Clock, label: 'Hours', value: BUSINESS_HOURS, href: undefined },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-amber-300">
          <Store className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-stone-900">Contact {BUSINESS_NAME}</h1>
        <p className="mx-auto mt-2 max-w-xl text-stone-600">
          Questions about an order, delivery times or a product? Talk to us directly by phone or
          email and our team will get back to you.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-stone-200 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <row.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-sm font-semibold tracking-wide text-stone-500 uppercase">
              {row.label}
            </h2>
            {row.href ? (
              <a
                href={row.href}
                className="mt-1 block font-display text-lg font-bold text-emerald-800 hover:underline"
              >
                {row.value}
              </a>
            ) : (
              <p className="mt-1 font-display text-lg font-bold text-stone-900">{row.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-display text-lg font-bold text-emerald-900">Shopping help</h2>
        <ul className="mt-3 space-y-2 text-sm text-emerald-800">
          <li>
            <strong>Pay on delivery</strong> — cash on delivery is available for orders across Ghana.
          </li>
          <li>
            <strong>Mobile money</strong> — pay via MTN MoMo, Telecel Cash or AT Money.
          </li>
          <li>
            <strong>Returns</strong> — items can be returned within 7 days of delivery if damaged,
            incorrect or faulty.
          </li>
        </ul>
      </div>

      <p className="mt-8 text-center text-sm text-stone-500">
        Prefer to read the fine print?{' '}
        <Link to="/privacy" className="font-semibold text-emerald-700 hover:underline">
          Privacy Policy
        </Link>{' '}
        ·{' '}
        <Link to="/terms" className="font-semibold text-emerald-700 hover:underline">
          Terms of Service
        </Link>
      </p>
    </div>
  )
}