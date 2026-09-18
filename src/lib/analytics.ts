import type { ConsentStatus } from '../components/CookieConsent'

export const CONSENT_KEY = 'magen.consent'

export function getConsent(): ConsentStatus | null {
  const raw = localStorage.getItem(CONSENT_KEY)
  return raw === 'accepted' || raw === 'declined' ? (raw as ConsentStatus) : null
}

const GA_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let loaded = false

export function initAnalytics() {
  if (!GA_ID || loaded || getConsent() !== 'accepted') return
  loaded = true
  const g = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
  g.dataLayer = g.dataLayer || []
  g.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    g.dataLayer?.push(arguments)
  }
  g.gtag('js', new Date())
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  g.gtag('config', GA_ID)
}

export function trackPageView(path: string) {
  if (!GA_ID || getConsent() !== 'accepted') return
  window.gtag?.('config', GA_ID, { page_path: path })
}