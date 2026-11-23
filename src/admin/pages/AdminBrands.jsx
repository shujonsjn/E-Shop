import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/admin/ImageUpload'
import { getMergedBrands } from '../../utils/mergeBrands'
import { saveStore } from '../../services/store'
import { useProducts } from '../../context/ProductsContext'

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const emptyForm = { name: '', name_bn: '', slug: '', description: '', description_bn: '', logo: '' }

const AdminBrands = () => {
  const [brands, setBrands] = useState([])
  const { products, replaceProducts } = useProducts()

  useEffect(() => {
    setBrands(getMergedBrands())
  }, [])

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      toast.error('ব্র্যান্ডের নাম দিতে হবে')
      return
    }
    const slug = slugify(form.slug || name)
    if (!slug) {
      toast.error('URL স্লাগ তৈরি করা যায়নি — ইংরেজি অক্ষর ব্যবহার করুন')
      return
    }
    const duplicate = brands.some(
      (b) => b.slug === slug && (!editing || b.slug !== editing.slug)
    )
    if (duplicate) {
      toast.error('আরেকটি ব্র্যান্ড ইতিমধ্যে এই URL স্লাগ ব্যবহার করছে')
      return
    }

    const nextBrand = {
      ...form,
      name,
      slug,
      description: form.description.trim(),
      description_bn: form.description_bn.trim(),
    }

    const updated = editing
      ? brands.map((b) => (b.slug === editing.slug ? { ...b, ...nextBrand } : b))
      : [...brands, nextBrand]

    setBrands(updated)
    const ok = saveStore('brands', updated)
    if (!ok) {
      toast.error('সেভ করা যায়নি। অ্যাডমিন হিসেবে লগইন আছে কিনা দেখুন।')
      return
    }

    // Products store the brand *name*, so renaming a brand must follow through
    // or the brand page (and shop filter) would go empty.
    if (editing && editing.name && editing.name !== name) {
      const renamed = products.map((p) =>
        String(p.brand || '') === String(editing.name)
          ? { ...p, brand: name }
          : p
      )
      const changed = renamed.some((p, i) => p !== products[i])
      if (changed) replaceProducts(renamed)
    }

    window.dispatchEvent(new Event('storage'))
    toast.success(editing ? 'ব্র্যান্ড আপডেট হয়েছে' : 'ব্র্যান্ড যোগ হয়েছে')
    setShowModal(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleEdit = (brand) => {
    setEditing(brand)
    setForm({
      name: brand.name || '',
      name_bn: brand.name_bn || '',
      slug: brand.slug || '',
      description: brand.description || '',
      description_bn: brand.description_bn || '',
      logo: brand.logo || '',
    })
    setShowModal(true)
  }

  const handleDelete = (slug) => {
    if (
      !confirm(
        'এই ব্র্যান্ডটি মুছে ফেলবেন? পণ্য নিজের ব্র্যান্ডের নাম ধরে রাখবে, তাই সেগুলো শুধু ব্র্যান্ড পেজে দেখানো বন্ধ হবে।'
      )
    ) {
      return
    }
    const updated = brands.filter((b) => b.slug !== slug)
    setBrands(updated)
    if (saveStore('brands', updated)) {
      window.dispatchEvent(new Event('storage'))
      toast.success('ব্র্যান্ড মুছে ফেলা হয়েছে')
    } else {
      toast.error('মুছে ফেলা যায়নি। অ্যাডমিন হিসেবে লগইন আছে কিনা দেখুন।')
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ব্র্যান্ড</h1>
          <p className="text-gray-500 mt-1">পণ্যের ব্র্যান্ড পরিচালনা করুন</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#EF4A23] text-white px-4 py-2 rounded-lg hover:bg-[#d63a16]"
        >
          <Plus size={18} /> নতুন ব্র্যান্ড
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">লোগো</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম (ইংরেজি)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম (বাংলা)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL স্লাগ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand.slug}>
                <td className="px-6 py-4">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-10 w-10 object-contain" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded" />
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                <td className="px-6 py-4 text-gray-500">{brand.name_bn || '-'}</td>
                <td className="px-6 py-4 text-gray-500">{brand.slug}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(brand)} className="text-blue-600 hover:text-blue-800" title="এডিট">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(brand.slug)} className="text-red-600 hover:text-red-800" title="মুছুন">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {brands.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-700 font-medium">এখনো কোনো ব্র্যান্ড নেই</p>
            <p className="mt-1 text-sm text-gray-500">“নতুন ব্র্যান্ড” চেপে প্রথম ব্র্যান্ড তৈরি করুন।</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'ব্র্যান্ড এডিট' : 'নতুন ব্র্যান্ড'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ব্র্যান্ডের নাম (ইংরেজি) *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ব্র্যান্ডের নাম (বাংলা)</label>
                <input
                  type="text"
                  value={form.name_bn}
                  onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="বাংলা নাম"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL স্লাগ</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="নাম থেকে নিজে থেকে তৈরি হবে"
                />
                <p className="text-xs text-gray-500 mt-1">/brand/{form.slug || slugify(form.name) || 'brand-name'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">বিবরণ (ইংরেজি)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="ব্র্যান্ড পেজে দেখানো সংক্ষিপ্ত পরিচিতি"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  value={form.description_bn}
                  onChange={(e) => setForm({ ...form, description_bn: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="ব্র্যান্ড পেজে দেখানো সংক্ষিপ্ত বাংলা পরিচিতি"
                />
              </div>
              <ImageUpload
                label="ব্র্যান্ড লোগো"
                value={form.logo}
                onChange={(val) => setForm({ ...form, logo: val })}
                width={320}
                height={100}
                fit="contain"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  সেভ করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditing(null)
                    setForm(emptyForm)
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBrands
