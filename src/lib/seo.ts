import { useEffect } from 'react'
import { SITE_URL } from './business'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  noindex?: boolean
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSEO({ title, description, path = '/', image, noindex }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${'Magen World'}` : 'Magen World'
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', `${SITE_URL}${path}`)
    setMeta('property', 'og:site_name', 'Magen World')
    if (image) setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    const rel = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (rel) rel.setAttribute('href', `${SITE_URL}${path}`)
    else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = `${SITE_URL}${path}`
      document.head.appendChild(link)
    }
    if (noindex) setMeta('name', 'robots', 'noindex')
    return () => {
      if (noindex) document.head.querySelector('meta[name="robots"]')?.remove()
    }
  }, [title, description, path, image, noindex])
}