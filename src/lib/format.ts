export const formatPrice = (value: number): string =>
  `GH₵${value.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const truncate = (text: string, length = 90): string =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text