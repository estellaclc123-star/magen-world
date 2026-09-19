import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck, PackagePlus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import {
  deleteProduct,
  getProducts,
  upsertProduct,
} from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { CATEGORY_NAMES, orderCategories } from '../../lib/categories'
import type { Product } from '../../lib/types'
import { Spinner } from '../../components/Spinner'
import { useToast } from '../../context/ToastContext'
import {
  ProductFormModal,
  type ProductFormState,
} from './ProductFormModal'

export function ProductsPanel({ isAdmin }: { isAdmin: boolean }) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  const categories = orderCategories([
    ...CATEGORY_NAMES,
    ...(products ?? []).map((p) => p.category),
  ])

  const load = async () => {
    try {
      setProducts(await getProducts())
    } catch {
      setProducts([])
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleSave = async (state: ProductFormState, imageFile?: File) => {
    try {
      await upsertProduct(
        {
          id: editing?.id,
          name: state.name,
          category: state.category,
          price: Number(state.price),
          original_price:
            state.original_price.trim() === '' ? null : Number(state.original_price),
          description: state.description,
          image_url: state.image_url,
          stock: Number(state.stock),
          featured: state.featured,
        },
        imageFile,
      )
      toast(editing ? 'Product updated.' : 'Product added.')
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save product.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteProduct(confirmDelete.id)
      toast('Product deleted.')
      setConfirmDelete(null)
      await load()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not delete product.', 'error')
    }
  }

  const filtered = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  )

  if (!products) {
    return <Spinner label="Loading products…" />
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-stone-900">Products</h2>
          <p className="text-sm text-stone-500">
            {products?.length ?? 0} products in your catalogue
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          <PackagePlus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-sm rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <PackageCheck className="h-8 w-8 text-stone-300" />
          <p className="text-sm text-stone-500">No products found.</p>
          <button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs text-stone-500 uppercase">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 transition hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-11 w-11 shrink-0 rounded-lg bg-stone-100 object-cover"
                      />
                      <div>
                        <p className="font-medium text-stone-900">{p.name}</p>
                        <p className="text-xs text-stone-500">
                          {p.featured && <span className="text-amber-700">Featured · </span>}
                          {p.original_price ? 'On offer' : 'Full price'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-stone-900">{formatPrice(p.price)}</p>
                    {p.original_price && p.original_price > p.price && (
                      <p className="text-xs text-stone-500 line-through">
                        {formatPrice(p.original_price)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        p.stock <= 0
                          ? 'text-rose-600'
                          : p.stock <= 5
                            ? 'text-amber-700'
                            : 'text-stone-700'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Link
                        to={`/product/${p.id}`}
                        title="View on storefront"
                        className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-emerald-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditing(p)
                          setModalOpen(true)
                        }}
                        className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-emerald-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setConfirmDelete(p)}
                        className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onCancel={() => {
            setModalOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="animate-scale-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-stone-900">Delete product?</h3>
            <p className="mt-2 text-sm text-stone-600">
              &quot;{confirmDelete.name}&quot; will be permanently removed from your store.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {!isAdmin && (
        <p className="mt-4 text-xs text-stone-500">
          You are viewing products in demo mode — changes are stored locally in your browser.
        </p>
      )}
    </div>
  )
}