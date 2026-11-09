import { useEffect, useState } from 'react'
import { useProducts } from '../../context/ProductsContext'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/admin/ImageUpload'
import { categories as defaultCategories } from '../../data/catalog'
import { runCategoryMigration } from '../../utils/mergeCategories'
import { saveStore } from '../../services/store'

const STORAGE_KEY = 'gb_admin_categories'
const DELETED_KEY = 'gb_admin_categories_deleted'

const AdminCategories = () => {
  const { products } = useProducts()
  const [categories, setCategories] = useState(() => {
    runCategoryMigration()
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      let deleted = []
      try {
        deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
      } catch {}
      
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((c) => c && c.slug && !deleted.includes(c.slug))
          // Also check which default cats are missing
          defaultCategories.forEach((dc) => {
            if (deleted.includes(dc.slug)) return
            const exists = filtered.find((c) => c.slug === dc.slug)
            if (!exists) {
              filtered.push({
                id: dc.id,
                name: dc.name,
                name_bn: dc.name_bn,
                slug: dc.slug,
                image: dc.image,
                subcategories: (dc.children || []).map((ch) => ch.slug),
                subcategoryList: (dc.children || []).map((ch) => ({ slug: ch.slug, name: ch.name, name_bn: ch.name_bn })),
                enabled: true,
              })
            }
          })
          // Remove default cats that were deleted before
          const result = filtered.filter((c) => {
            if (defaultCategories.find((dc) => dc.slug === c.slug)) {
              return !deleted.includes(c.slug)
            }
            return true
          })
          if (result.length > 0) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(result)) } catch {}
            return result
          }
        }
      }
      // Import from catalog but filter deleted
      const initial = defaultCategories
        .filter((c) => c && c.slug && !deleted.includes(c.slug))
        .map((cat, idx) => ({
          id: cat.id || idx + 1,
          name: cat.name,
          name_bn: cat.name_bn,
          slug: cat.slug,
          image: cat.image,
          subcategories: (cat.children || []).map((ch) => ch.slug),
          subcategoryList: (cat.children || []).map((ch) => ({ slug: ch.slug, name: ch.name, name_bn: ch.name_bn })),
          enabled: true,
        }))
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      } catch {}
      return initial
    } catch {
      /* ignore */
    }
    try {
      let deleted = []
      try { deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]') } catch {}
      const cats = [...new Set(products.map((p) => p.category).filter(Boolean))].filter((c) => !deleted.includes(c))
      const initial = cats.map((cat, idx) => ({
        id: idx + 1,
        name: cat,
        slug: cat,
        subcategories: [...new Set(products.filter((p) => p.category === cat).map((p) => p.subcategory).filter(Boolean))],
        enabled: true,
      }))
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      } catch {
        /* ignore */
      }
      return initial
    } catch {}
    return []
  })

  useEffect(() => {
    try {
      const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
      const filtered = categories.filter((c) => c && c.slug && !deleted.includes(c.slug))
      saveStore('categories', filtered)
    } catch {
      saveStore('categories', categories)
    }
  }, [categories])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', name_bn: '', slug: '', subcategories: '', image: '', subcategoryList: [] })

  const [newSub, setNewSub] = useState({ name: '', name_bn: '' })

  const addSubcategory = () => {
    if (!newSub.name.trim()) return
    setForm((prev) => ({
      ...prev,
      subcategoryList: [...(prev.subcategoryList || []), { slug: newSub.name.trim().toLowerCase().replace(/\s+/g, '-'), name: newSub.name.trim(), name_bn: newSub.name_bn.trim() }],
      newSub: { name: '', name_bn: '' },
    }))
    setNewSub({ name: '', name_bn: '' })
  }

  const removeSubcategory = (idx) => {
    setForm((prev) => ({
      ...prev,
      subcategoryList: (prev.subcategoryList || []).filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subs = form.subcategoryList && form.subcategoryList.length > 0
      ? form.subcategoryList.map((s) => (typeof s === 'string' ? s : s.slug || s.name))
      : form.subcategories.split(',').map((s) => s.trim()).filter(Boolean)
    const subList = form.subcategoryList && form.subcategoryList.length > 0
      ? form.subcategoryList
      : subs.map((s) => ({ slug: s.toLowerCase().replace(/\s+/g, '-'), name: s, name_bn: s }))
    let updated
    if (editing) {
      updated = categories.map((c) => (c.id === editing.id ? { ...c, name: form.name, name_bn: form.name_bn, slug: form.slug, subcategories: subs, subcategoryList: subList, image: form.image } : c))
    } else {
      updated = [...categories, { id: Date.now(), name: form.name, name_bn: form.name_bn, slug: form.slug, subcategories: subs, subcategoryList: subList, image: form.image, enabled: true }]
    }
    setCategories(updated)
    if (saveStore('categories', updated)) {
      window.dispatchEvent(new Event('storage'))
      toast.success(editing ? 'Category updated' : 'Category added')
    } else {
      toast.error('Could not save — browser storage is full. Try a smaller image.')
    }
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', name_bn: '', slug: '', subcategories: '', image: '', subcategoryList: [] })
  }

  const handleEdit = (cat) => {
    setEditing(cat)
    const subList = Array.isArray(cat.subcategoryList) && cat.subcategoryList.length > 0
      ? cat.subcategoryList
      : (cat.subcategories || []).map((s) => ({ slug: s.toLowerCase().replace(/\s+/g, '-'), name: s, name_bn: s }))
    setForm({ name: cat.name, name_bn: cat.name_bn || '', slug: cat.slug, subcategories: (cat.subcategories || []).join(', '), image: cat.image || '', subcategoryList: subList })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      const cat = categories.find((c) => c.id === id)
      const updated = categories.filter((c) => c.id !== id)
      setCategories(updated)
      try {
        try {
          const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
          if (cat?.slug && !deleted.includes(cat.slug)) {
            const newDeleted = [...deleted, cat.slug]
            localStorage.setItem(DELETED_KEY, JSON.stringify([...new Set(newDeleted)]))
          }
        } catch {}
        saveStore('categories', updated)
        window.dispatchEvent(new Event('storage'))
        // Force reload to update all components
        setTimeout(() => window.location.reload(), 500)
      } catch {
        /* ignore */
      }
      toast.success('Category deleted')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage product categories</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', name_bn: '', slug: '', subcategories: '', image: '', subcategoryList: [] }); setShowModal(true) }} className="flex items-center gap-2 bg-[#EF4A23] text-white px-4 py-2 rounded-lg hover:bg-[#d63a16]">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (EN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (BN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="h-10 w-10 object-contain" /> : <div className="h-10 w-10 bg-gray-100 rounded-full" />}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500">{cat.name_bn || '-'}</td>
                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-gray-500">
                  {(Array.isArray(cat.subcategoryList) && cat.subcategoryList.length > 0)
                    ? cat.subcategoryList.map((s) => (typeof s === 'string' ? s : s.name_bn ? `${s.name} / ${s.name_bn}` : s.name)).join(', ')
                    : (cat.subcategories || []).join(', ') || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name (English)</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category Name (Bangla)</label>
                <input type="text" value={form.name_bn || ''} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="বাংলা নাম" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <ImageUpload
                label="Category Icon/Image"
                value={form.image || ''}
                onChange={(val) => setForm({ ...form, image: val })}
                width={400}
                height={400}
                fit="contain"
              />
              <div>
                <label className="block text-sm font-medium mb-1">Subcategories</label>
                <div className="space-y-2 mb-2">
                  {(form.subcategoryList || []).map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{sub.name}</p>
                        {sub.name_bn && <p className="text-xs text-gray-500">{sub.name_bn}</p>}
                      </div>
                      <button type="button" onClick={() => removeSubcategory(idx)} className="text-red-600"><X size={16} /></button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="Subcategory (EN)" />
                  <input type="text" value={newSub.name_bn} onChange={(e) => setNewSub({ ...newSub, name_bn: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="Subcategory (BN)" />
                </div>
                <button type="button" onClick={addSubcategory} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus size={14} /> Add Subcategory</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quick add (comma separated EN)</label>
                <input type="text" value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="rice, lentils, oil" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); setForm({ name: '', name_bn: '', slug: '', subcategories: '', image: '', subcategoryList: [] }) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories
