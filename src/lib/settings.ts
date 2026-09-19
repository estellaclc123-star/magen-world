import { supabase } from './supabase'
import type { SiteSettings } from './types'

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement_enabled: true,
  announcement_text:
    'Free delivery on all orders over GH₵1,500 · Pay on delivery across Ghana',
  delivery_fee: 35,
  free_delivery_threshold: 1500,
}

const DEMO_SETTINGS_KEY = 'magen.demo.settings'

function readDemoSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(DEMO_SETTINGS_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SiteSettings>) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS }
}

function writeDemoSettings(settings: SiteSettings): void {
  localStorage.setItem(DEMO_SETTINGS_KEY, JSON.stringify(settings))
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    if (data) {
      return {
        announcement_enabled: Boolean(data.announcement_enabled),
        announcement_text: String(data.announcement_text),
        delivery_fee: Number(data.delivery_fee),
        free_delivery_threshold: Number(data.free_delivery_threshold),
      }
    }
  }
  return readDemoSettings()
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  if (supabase) {
    const updates: Record<string, unknown> = {
      ...(patch.announcement_enabled !== undefined
        ? { announcement_enabled: patch.announcement_enabled }
        : {}),
      ...(patch.announcement_text !== undefined
        ? { announcement_text: patch.announcement_text }
        : {}),
      ...(patch.delivery_fee !== undefined ? { delivery_fee: patch.delivery_fee } : {}),
      ...(patch.free_delivery_threshold !== undefined
        ? { free_delivery_threshold: patch.free_delivery_threshold }
        : {}),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', 1)
      .select()
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (data) {
      return {
        announcement_enabled: Boolean(data.announcement_enabled),
        announcement_text: String(data.announcement_text),
        delivery_fee: Number(data.delivery_fee),
        free_delivery_threshold: Number(data.free_delivery_threshold),
      }
    }
    return { ...readDemoSettings(), ...patch }
  }

  const next: SiteSettings = { ...readDemoSettings(), ...patch }
  writeDemoSettings(next)
  return next
}

export function formatGhc(amount: number): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `GH₵${formatted}`
}