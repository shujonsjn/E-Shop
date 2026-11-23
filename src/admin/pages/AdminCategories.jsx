import { useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/admin/ImageUpload'
import { getMergedCategories, runCategoryMigration } from '../../utils/mergeCategories'
import { saveStore } from '../../services/store'
import { useProducts } from '../../context/ProductsContext'

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Subcategory names may be typed in Bangla. Keep non-Latin letters instead of
// reducing the slug to an empty string.
const subSlug = (value) =>
  slugify(value) || String(value || '').trim().toLowerCase().replace(/\s+/g, '-')

const emptyForm = { name: '', name_bn: '', slug: '', subcategories: '', image: '', subcategoryList: [] }

const AdminCategories = () => {
  const { products } = useProducts()
  const [categories, setCategories] = useState(() => {
    runCategoryMigration()
    // Show exactly the synced list. Bundled demo categories are only used when
    // nothing has ever been saved, so they can never come back after a delete.
    try {
      return getMergedCategories()
    } catch {
      return []
    }
  })
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const [newSub, setNewSub] = useState({ name: '', name_bn: '' })

  const addSubcategory = () => {
    const name = newSub.name.trim()
    if (!name) return
    setForm((prev) => ({
      ...prev,
      subcategoryList: [
        ...(prev.subcategoryList || []),
        { slug: subSlug(name), name, name_bn: newSub.name_bn.trim() },
      ],
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
    const name = form.name.trim()
    if (!name) {
      toast.error('ক্যাটাগরির নাম দিতে হবে')
      return
    }
    // Slugs are the key products use. A duplicate would make products vanish
    // from every category page, so refuse it.
    const slug = editing ? form.slug : slugify(form.slug || name)
    if (!slug) {
      toast.error('URL স্লাগ তৈরি করা যায়নি — ইংরেজি অক্ষর ব্যবহার করুন')
      return
    }
    const duplicate = categories.some(
      (c) => c.slug === slug && (!editing || c.slug !== editing.slug)
    )
    if (duplicate) {
      toast.error('আরেকটি ক্যাটাগরি ইতিমধ্যে এই URL স্লাগ ব্যবহার করছে')
      return
    }
    const subs = form.subcategoryList && form.subcategoryList.length > 0
      ? form.subcategoryList.map((s) => (typeof s === 'string' ? s : s.slug || s.name))
      : form.subcategories.split(',').map((s) => s.trim()).filter(Boolean)
    const subList = form.subcategoryList && form.subcategoryList.length > 0
      ? form.subcategoryList
      : subs.map((s) => ({ slug: subSlug(s), name: s, name_bn: s }))
    let updated
    if (editing) {
      updated = categories.map((c) =>
        c.slug === editing.slug
          ? { ...c, name, name_bn: form.name_bn, slug, subcategories: subs, subcategoryList: subList, image: form.image }
          : c
      )
    } else {
      updated = [...categories, { id: Date.now(), name, name_bn: form.name_bn, slug, subcategories: subs, subcategoryList: subList, image: form.image, enabled: true }]
    }
    setCategories(updated)
    if (saveStore('categories', updated)) {
      window.dispatchEvent(new Event('storage'))
      toast.success(editing ? 'ক্যাটাগরি আপডেট হয়েছে' : 'ক্যাটাগরি যোগ হয়েছে')
    } else {
      toast.error('সেভ করা যায়নি। অ্যাডমিন হিসেবে লগইন আছে কিনা দেখুন।')
    }
    setShowModal(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleEdit = (cat) => {
    setEditing(cat)
    const subList = Array.isArray(cat.subcategoryList) && cat.subcategoryList.length > 0
      ? cat.subcategoryList
      : (Array.isArray(cat.subcategories) ? cat.subcategories : [])
          .filter(Boolean)
          .map((s) =>
            typeof s === 'string'
              ? { slug: subSlug(s), name: s, name_bn: s }
              : { slug: s.slug || subSlug(s.name), name: s.name || s.slug || '', name_bn: s.name_bn || s.name || '' }
          )
    setForm({
      name: cat.name,
      name_bn: cat.name_bn || '',
      slug: cat.slug,
      subcategories: Array.isArray(cat.subcategories)
        ? cat.subcategories.map((s) => (typeof s === 'string' ? s : s.name || s.slug || '')).join(', ')
        : '',
      image: cat.image || '',
      subcategoryList: subList,
    })
    setShowModal(true)
  }

  const handleDelete = (slug) => {
    const cat = categories.find((c) => c.slug === slug)
    if (!cat) return
    const used = products.filter((p) => p.category === cat.slug).length
    if (used > 0) {
      toast.error(
        `${used}টি পণ্য এখনো এই ক্যাটাগরি ব্যবহার করছে। আগে সেগুলো অন্য ক্যাটাগরিতে সরান।`
      )
      return
    }
    if (!confirm(`ক্যাটাগরি "${cat.name}" মুছে ফেলবেন?`)) return
    const updated = categories.filter((c) => c.slug !== slug)
    setCategories(updated)
    if (saveStore('categories', updated)) {
      window.dispatchEvent(new Event('storage'))
      toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে')
      return
    }
    setCategories(categories)
    toast.error('মুছে ফেলা যায়নি। অ্যাডমিন হিসেবে লগইন আছে কিনা দেখুন।')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ক্যাটাগরি</h1>
          <p className="text-gray-500 mt-1">পণ্যের ক্যাটাগরি পরিচালনা করুন</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true) }} className="flex items-center gap-2 bg-[#EF4A23] text-white px-4 py-2 rounded-lg hover:bg-[#d63a16]">
          <Plus size={18} /> নতুন ক্যাটাগরি
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">আইকন</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম (ইংরেজি)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম (বাংলা)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL স্লাগ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">উপ-ক্যাটাগরি</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.slug}>
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
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800" title="এডিট"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(cat.slug)} className="text-red-600 hover:text-red-800" title="মুছুন"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-700 font-medium">এখনো কোনো ক্যাটাগরি নেই</p>
            <p className="mt-1 text-sm text-gray-500">“নতুন ক্যাটাগরি” চেপে প্রথম ক্যাটাগরি তৈরি করুন।</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'ক্যাটাগরি এডিট' : 'নতুন ক্যাটাগরি'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ক্যাটাগরির নাম (ইংরেজি)</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ক্যাটাগরির নাম (বাংলা)</label>
                <input type="text" value={form.name_bn || ''} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="বাংলা নাম" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL স্লাগ</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={`w-full px-3 py-2 border rounded ${editing ? 'bg-gray-100 text-gray-500' : ''}`}
                  placeholder="নাম থেকে নিজে থেকে তৈরি হবে"
                  readOnly={Boolean(editing)}
                  required={Boolean(editing)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editing
                    ? 'এডিটের সময় URL স্লাগ বদলানো যায় না, কারণ পণ্য ও লিংক এটির উপর নির্ভর করে। বদলাতে হলে নতুন ক্যাটাগরি তৈরি করুন।'
                    : `/category/${form.slug || slugify(form.name) || 'category-name'}`}
                </p>
              </div>
              <ImageUpload
                label="ক্যাটাগরির আইকন/ছবি"
                value={form.image || ''}
                onChange={(val) => setForm({ ...form, image: val })}
                width={400}
                height={400}
                fit="contain"
              />
              <div>
                <label className="block text-sm font-medium mb-1">উপ-ক্যাটাগরি</label>
                <div className="space-y-2 mb-2">
                  {(form.subcategoryList || []).map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{sub.name}</p>
                        {sub.name_bn && <p className="text-xs text-gray-500">{sub.name_bn}</p>}
                      </div>
                      <button type="button" onClick={() => removeSubcategory(idx)} className="text-red-600" title="মুছুন"><X size={16} /></button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="উপ-ক্যাটাগরি (ইংরেজি)" />
                  <input type="text" value={newSub.name_bn} onChange={(e) => setNewSub({ ...newSub, name_bn: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="উপ-ক্যাটাগরি (বাংলা)" />
                </div>
                <button type="button" onClick={addSubcategory} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus size={14} /> উপ-ক্যাটাগরি যোগ করুন</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">দ্রুত যোগ (কমা দিয়ে আলাদা, ইংরেজি)</label>
                <input type="text" value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="vase, gift box, wall clock" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">সেভ করুন</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); setForm(emptyForm) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories
