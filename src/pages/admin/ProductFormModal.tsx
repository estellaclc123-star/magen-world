import { useRef, useState } from 'react'
import { X, ImagePlus, UploadCloud } from 'lucide-react'
import type { Product } from '../../lib/types'

export interface ProductFormState {
  name: string
  category: string
  price: string
  original_price: string
  stock: string
  description: string
  image_url: string
  featured: boolean
}

interface ProductFormModalProps {
  product?: Product | null
  categories: string[]
  onCancel: () => void
  onSave: (state: ProductFormState, imageFile?: File) => Promise<void>
}

export const EMPTY_FORM: ProductFormState = {
  name: '',
  category: '',
  price: '',
  original_price: '',
  stock: '',
  description: '',
  image_url: '',
  featured: false,
}

function buildInitial(product?: Product | null): ProductFormState {
  if (!product) return EMPTY_FORM
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    original_price: product.original_price === null ? '' : String(product.original_price),
    stock: String(product.stock),
    description: product.description,
    image_url: product.image_url,
    featured: product.featured,
  }
}

export function ProductFormModal({
  product,
  categories,
  onCancel,
  onSave,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormState>(() => buildInitial(product))
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof ProductFormState, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handlePreview = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setError('')
    setImageFile(file)
    if (form.image_url === '' || form.image_url.startsWith('data:')) {
      set('image_url', URL.createObjectURL(file))
    }
  }

  const validate = (): string => {
    if (form.name.trim().length === 0) return 'Product name is required.'
    if (form.category.trim().length === 0) return 'Category is required.'
    const price = Number(form.price)
    if (Number.isNaN(price) || price < 0) return 'Enter a valid price.'
    const stock = Number(form.stock)
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) return 'Enter a valid stock count.'
    const originalPrice =
      form.original_price.trim() === '' ? null : Number(form.original_price)
    if (originalPrice !== null && (Number.isNaN(originalPrice) || originalPrice < 0))
      return 'Enter a valid original price.'
    if (form.image_url.trim() === '' && !imageFile) return 'An image is required.'
    return ''
  }

  const handleSubmit = async () => {
    setError('')
    const validation = validate()
    if (validation) {
      setError(validation)
      return
    }
    setSaving(true)
    try {
      await onSave(
        {
          name: form.name.trim(),
          category: form.category.trim(),
          price: String(Number(form.price)),
          original_price: form.original_price.trim() === '' ? '' : String(Number(form.original_price)),
          stock: String(Number(form.stock)),
          description: form.description.trim(),
          image_url: form.image_url,
          featured: form.featured,
        },
        imageFile ?? undefined,
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

  const previewSrc = imageFile
    ? URL.createObjectURL(imageFile)
    : form.image_url || (product?.image_url ?? '')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-scale-in max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-stone-900">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              {previewSrc ? (
                <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-300">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="mb-2 text-sm font-medium text-stone-700">Product image</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                <UploadCloud className="h-4 w-4" /> {imageFile ? 'Change image' : 'Upload image'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handlePreview(file)
                }}
              />
              <p className="mt-2 text-xs text-stone-500">
                JPG, PNG or WebP. Alternatively paste an image URL below.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="pf-image" className="mb-1.5 block text-sm font-medium text-stone-700">
              Image URL <span className="text-stone-500">(optional if uploaded)</span>
            </label>
            <input
              id="pf-image"
              value={form.image_url.startsWith('blob:') ? '' : form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              placeholder="https://…/photo.jpg"
              className={inputClasses}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium text-stone-700">
                Product name *
              </label>
              <input
                id="pf-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Wireless Headphones"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="pf-category" className="mb-1.5 block text-sm font-medium text-stone-700">
                Category *
              </label>
              <input
                id="pf-category"
                list="pf-category-list"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="e.g. Electronics"
                className={inputClasses}
              />
              <datalist id="pf-category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="pf-price" className="mb-1.5 block text-sm font-medium text-stone-700">
                Price (GH₵) *
              </label>
              <input
                id="pf-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="pf-original" className="mb-1.5 block text-sm font-medium text-stone-700">
                Original price <span className="text-stone-500">(before discount)</span>
              </label>
              <input
                id="pf-original"
                type="number"
                min="0"
                step="0.01"
                value={form.original_price}
                onChange={(e) => set('original_price', e.target.value)}
                placeholder="Leave empty if none"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="pf-stock" className="mb-1.5 block text-sm font-medium text-stone-700">
                Stock count *
              </label>
              <input
                id="pf-stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="0"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="pf-desc" className="mb-1.5 block text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              id="pf-desc"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short product description…"
              className={`${inputClasses} resize-none`}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 accent-emerald-700"
            />
            <span className="text-sm font-medium text-stone-700">Show in Featured products</span>
          </label>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-stone-200 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </div>
    </div>
  )
}