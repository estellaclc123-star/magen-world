import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({ eyebrow, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold tracking-widest text-emerald-700 uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}