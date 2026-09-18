import { PackageOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  title: string
  message: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ title, message, actionLabel, actionTo = '/shop' }: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <PackageOpen className="h-7 w-7" />
      </span>
      <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>
      <p className="max-w-md text-sm text-stone-500">{message}</p>
      {actionLabel && (
        <Link
          to={actionTo}
          className="mt-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}