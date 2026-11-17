import { useState } from 'react'
import { useSettings, defaultHomeLayout } from '../../context/SettingsContext'
import { GripVertical, Eye, EyeOff, Edit2, Save, X, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMergedCategories } from '../../utils/mergeCategories'

const sectionTypes = {
  hero: 'Hero Slider + Side Banners',
  trust: 'Trust Strip',
  categories: 'Categories Grid',
  flash: 'Flash Sale',
  productRow: 'Product Row',
  brands: 'Brands',
  promo: 'Promo Banners',
  testimonials: 'Testimonials',
  cta: 'CTA Strip',
}

const AdminHomeLayout = () => {
  const { settings, reorderHomeLayout, toggleHomeSection, updateHomeSection, removeHomeSection, updateHomeLayout } = useSettings()
  const layout = [...(settings.homeLayout || [])]
    .map((item, idx) => ({ order: idx, enabled: true, ...item }))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  const [draggedId, setDraggedId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const categorySlugs = getMergedCategories().map((c) => c.slug)
  const formCategoryMissing =
    form.type === 'productRow' && form.category && !categorySlugs.includes(form.category)

  const handleDragStart = (id) => {
    setDraggedId(id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (targetId) => {
    if (!draggedId || draggedId === targetId) return
    const items = [...layout]
    const draggedIdx = items.findIndex((i) => i.id === draggedId)
    const targetIdx = items.findIndex((i) => i.id === targetId)
    const [removed] = items.splice(draggedIdx, 1)
    items.splice(targetIdx, 0, removed)
    reorderHomeLayout(items)
    setDraggedId(null)
    toast.success('Layout reordered')
  }

  const startEdit = (item) => {
    setEditing(item.id)
    setForm({ ...item })
  }

  const saveEdit = () => {
    updateHomeSection(editing, form)
    setEditing(null)
    toast.success('Section updated')
  }

  const handleRemove = (item) => {
    if (item.type !== 'productRow' && item.type !== 'categories') return
    if (!confirm('Remove this section from the home page? The section can be added back later by editing the layout data.')) {
      return
    }
    removeHomeSection(item.id)
    toast.success('Section removed')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Layout</h1>
          <p className="text-gray-500 mt-1">Drag & drop to reorder, show/hide or edit sections</p>
        </div>
        <button
          onClick={() => {
            if (
              confirm(
                'Restore the default home layout? This puts back every default section and removes custom product rows.'
              )
            ) {
              updateHomeLayout(defaultHomeLayout.map((item) => ({ ...item })))
              toast.success('Default layout restored')
            }
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Restore default layout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {layout.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(item.id)}
              className={`flex items-center gap-4 p-4 ${item.enabled ? 'bg-white' : 'bg-gray-50 opacity-70'}`}
            >
              <GripVertical className="text-gray-400 cursor-move" size={20} />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{sectionTypes[item.type] || item.type}</h3>
                  {item.type === 'productRow' && item.title && <span className="text-sm text-gray-500">- {item.title}</span>}
                  {item.type === 'categories' && <span className="text-sm text-gray-500">- {item.title || 'Categories'}</span>}
                  {item.type === 'productRow' && item.category && !categorySlugs.includes(item.category) && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                      <AlertTriangle size={11} /> category "{item.category}" missing
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">ID: {item.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { toggleHomeSection(item.id); toast.success(item.enabled ? 'Section hidden' : 'Section shown') }} className="p-2 hover:bg-gray-100 rounded-lg" title={item.enabled ? 'Hide' : 'Show'}>
                  {item.enabled ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}
                </button>
                {(item.type === 'productRow' || item.type === 'categories') && (
                  <button onClick={() => startEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                    <Edit2 size={18} className="text-blue-600" />
                  </button>
                )}
                {(item.type === 'productRow' || item.type === 'categories') && (
                  <button onClick={() => handleRemove(item)} className="p-2 hover:bg-red-50 rounded-lg" title="Remove section">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {layout.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            সব সেকশন মুছে ফেলা হয়েছে। উপরের "Restore default layout" চেপে ফিরিয়ে আনুন।
          </p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Section</h2>
              <button onClick={() => setEditing(null)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title (English)</label>
                <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (Bangla)</label>
                <input type="text" value={form.titleBn || ''} onChange={(e) => setForm({ ...form, titleBn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle (English)</label>
                <input type="text" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle (Bangla)</label>
                <input type="text" value={form.subtitleBn || ''} onChange={(e) => setForm({ ...form, subtitleBn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link (href)</label>
                <input type="text" value={form.href || ''} onChange={(e) => setForm({ ...form, href: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link Label</label>
                <input type="text" value={form.linkLabel || ''} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              {form.type === 'productRow' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Limit</label>
                    <input type="number" value={form.limit || 5} onChange={(e) => setForm({ ...form, limit: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category Slug</label>
                    <select
                      value={form.category || ''}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="">Any category (uses all products)</option>
                      {categorySlugs.map((slug) => (
                        <option key={slug} value={slug}>{slug}</option>
                      ))}
                      {form.category && !categorySlugs.includes(form.category) && (
                        <option value={form.category}>{form.category} (missing)</option>
                      )}
                    </select>
                    {formCategoryMissing && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-amber-700">
                        <AlertTriangle size={12} /> এই ক্যাটাগরিটি আর নেই — রো-টি খালি দেখাবে।
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"><Save size={18} /> Save</button>
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminHomeLayout
