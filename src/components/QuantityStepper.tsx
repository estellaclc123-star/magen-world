import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: 'sm' | 'md'
}

export function QuantityStepper({ value, onChange, max = 100, size = 'md' }: QuantityStepperProps) {
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const input = size === 'sm' ? 'h-8 w-10 text-sm' : 'h-10 w-12'
  return (
    <div className="inline-flex items-center rounded-xl border border-stone-300 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={`${btn} flex items-center justify-center rounded-l-xl text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value)
          if (!Number.isNaN(next)) onChange(Math.max(1, Math.min(next, max)))
        }}
        className={`${input} border-x border-stone-200 bg-white text-center font-semibold text-stone-900 outline-none`}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${btn} flex items-center justify-center rounded-r-xl text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}