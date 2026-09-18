import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'
import { CONSENT_KEY, initAnalytics, trackPageView } from '../lib/analytics'

export type ConsentStatus = 'accepted' | 'declined'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
  }, [])

  const choose = (status: ConsentStatus) => {
    localStorage.setItem(CONSENT_KEY, status)
    setVisible(false)
    if (status === 'accepted') {
      initAnalytics()
      trackPageView(`${window.location.pathname}${window.location.search}`)
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:flex-row sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="flex-1 text-sm text-stone-600">
          <p>
            We use essential cookies to keep the store working. With your consent, we also use
            analytics cookies to understand how the site is used. See our{' '}
            <Link to="/privacy" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose('declined')}
            className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
          >
            Decline
          </button>
          <button
            onClick={() => choose('accepted')}
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}