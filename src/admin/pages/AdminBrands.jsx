import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/admin/ImageUpload'
import { getMergedBrands } from '../../utils/mergeBrands'

const STORAGE_KEY = 'gb_admin_brands'

const AdminBrands = () => {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    setBrands(getMergedBrands())
  }, [])

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', name_bn: '', slug: '', logo: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    let updated
    if (editing) {
      updated = brands.map((b) => (b.slug === editing.slug ? { ...b, ...form } : b))
      toast.success('Brand updated')
    } else {
      updated = [...brands, { ...form }]
      toast.success('Brand added')
    }
    setBrands(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('storage'))
    } catch {}
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', name_bn: '', slug: '', logo: '' })
  }

  const handleEdit = (brand) => {
    setEditing(brand)
    setForm({ name: brand.name, name_bn: brand.name_bn || '', slug: brand.slug, logo: brand.logo || '' })
    setShowModal(true)
  }

  const handleDelete = (slug) => {
    if (confirm('Delete this brand?')) {
      const updated = brands.filter((b) => b.slug !== slug)
      setBrands(updated)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        window.dispatchEvent(new Event('storage'))
      } catch {}
      toast.success('Brand deleted')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500 mt-1">Manage product brands</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', name_bn: '', slug: '', logo: '' }); setShowModal(true) }} className="flex items-center gap-2 bg-[#EF4A23] text-white px-4 py-2 rounded-lg hover:bg-[#d63a16]">
          <Plus size={18} /> Add Brand
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (EN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (BN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand.slug}>
                <td className="px-6 py-4">
                  {brand.logo ? <img src={brand.logo} alt={brand.name} className="h-10 w-10 object-contain" /> : <div className="h-10 w-10 bg-gray-100 rounded" />}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                <td className="px-6 py-4 text-gray-500">{brand.name_bn || '-'}</td>
                <td className="px-6 py-4 text-gray-500">{brand.slug}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(brand)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(brand.slug)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Brand' : 'Add Brand'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand Name (English)</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand Name (Bangla)</label>
                <input type="text" value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="বাংলা নাম" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <ImageUpload label="Brand Logo" value={form.logo} onChange={(val) => setForm({ ...form, logo: val })} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); setForm({ name: '', name_bn: '', slug: '', logo: '' }) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBrands
