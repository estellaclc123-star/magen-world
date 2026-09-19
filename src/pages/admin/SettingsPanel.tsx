import { useState, type FormEvent } from 'react'
import { Megaphone, Truck, Loader2, AlertCircle } from 'lucide-react'
import { formatPrice } from '../../lib/format'
import { useSettings } from '../../context/SettingsContext'
import { useToast } from '../../context/ToastContext'

export function SettingsPanel() {
  const { settings, updateSettings } = useSettings()
  const { toast } = useToast()

  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcement_enabled)
  const [announcementText, setAnnouncementText] = useState(settings.announcement_text)
  const [deliveryFee, setDeliveryFee] = useState(String(settings.delivery_fee))
  const [freeThreshold, setFreeThreshold] = useState(String(settings.free_delivery_threshold))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const fee = Number(deliveryFee)
    const threshold = Number(freeThreshold)
    if (!Number.isFinite(fee) || fee < 0) {
      setError('Delivery fee must be a valid amount (0 or more).')
      return
    }
    if (!Number.isFinite(threshold) || threshold < 0) {
      setError('Free delivery threshold must be a valid amount (0 or more).')
      return
    }
    const text = announcementText.trim()
    if (announcementEnabled && text.length === 0) {
      setError('Add a message for the announcement bar, or turn it off.')
      return
    }

    setSaving(true)
    try {
      await updateSettings({
        announcement_enabled: announcementEnabled,
        announcement_text: announcementEnabled ? text : settings.announcement_text,
        delivery_fee: fee,
        free_delivery_threshold: threshold,
      })
      toast('Store settings saved. They update across the site instantly.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-stone-900">
            <Megaphone className="h-5 w-5 text-emerald-700" /> Announcement bar
          </h2>
          <p className="mb-4 text-sm text-stone-500">
            The message shown at the very top of every page.
          </p>

          <label className="mb-3 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-stone-200 px-4 py-3">
            <span className="text-sm font-medium text-stone-800">Show announcement bar</span>
            <button
              type="button"
              role="switch"
              aria-checked={announcementEnabled}
              onClick={() => setAnnouncementEnabled((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                announcementEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  announcementEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">Message</span>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              disabled={!announcementEnabled}
              rows={2}
              maxLength={180}
              placeholder="e.g. Free delivery on orders over GH₵1,500 · Pay on delivery across Ghana"
              className={`${inputClass} resize-none disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400`}
            />
            <span className="mt-1 block text-right text-xs text-stone-400">
              {announcementText.length}/180
            </span>
          </label>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-stone-900">
            <Truck className="h-5 w-5 text-emerald-700" /> Delivery
          </h2>
          <p className="mb-4 text-sm text-stone-500">
            Applies to every order across the store.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Delivery fee</span>
              <input
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className={inputClass}
              />
              <span className="mt-1 block text-xs text-stone-500">
                Current: {formatPrice(settings.delivery_fee)}
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">
                Free delivery over
              </span>
              <input
                type="number"
                min="0"
                step="50"
                inputMode="decimal"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className={inputClass}
              />
              <span className="mt-1 block text-xs text-stone-500">
                Current: {formatPrice(settings.free_delivery_threshold)}
              </span>
            </label>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              'Save settings'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}