import { Link } from 'react-router-dom'
import { Compass, ShoppingBag } from 'lucide-react'
import { useSEO } from '../lib/seo'

export default function NotFoundPage() {
  useSEO({
    title: 'Page Not Found',
    description: 'The page you were looking for could not be found. Head back to the Magen World shop.',
    path: '/404',
    noindex: true,
  })

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Compass className="h-10 w-10" />
      </span>
      <h1 className="mt-6 font-display text-5xl font-extrabold text-stone-900">404</h1>
      <p className="mt-3 font-display text-xl font-bold text-stone-800">That page can&apos;t be found</p>
      <p className="mt-2 max-w-md text-stone-600">
        The link may be broken, or the page may have moved. Let&apos;s get you back to something
        useful.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          Go to Homepage
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50"
        >
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}