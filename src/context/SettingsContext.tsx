import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_SETTINGS, getSiteSettings, updateSiteSettings } from '../lib/settings'
import type { SiteSettings } from '../lib/types'

interface SettingsContextValue {
  settings: SiteSettings
  updateSettings: (patch: Partial<SiteSettings>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    let active = true
    getSiteSettings()
      .then((loaded) => {
        if (active) setSettings(loaded)
      })
      .catch(() => {
        /* keep defaults */
      })
    return () => {
      active = false
    }
  }, [])

  const updateSettings = useCallback(async (patch: Partial<SiteSettings>) => {
    const next = await updateSiteSettings(patch)
    setSettings(next)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider')
  return ctx
}