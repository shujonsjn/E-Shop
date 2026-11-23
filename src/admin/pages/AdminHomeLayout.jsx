import { useState } from 'react'
import { useSettings, defaultHomeLayout } from '../../context/SettingsContext'
import { GripVertical, Eye, EyeOff, Edit2, Save, X, Trash2, AlertTriangle, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AutoSaveNote from '../../components/admin/AutoSaveNote'
import { getMergedCategories } from '../../utils/mergeCategories'

const sectionTypes = {
  hero: 'হিরো স্লাইডার + সাইড ব্যানার',
  trust: 'ট্রাস্ট স্ট্রিপ',
  categories: 'ক্যাটাগরি গ্রিড',
  flash: 'ফ্ল্যাশ সেল',
  productRow: 'পণ্যের সারি',
  brands: 'ব্র্যান্ড',
  promo: 'প্রমো ব্যানার',
  testimonials: 'কাস্টমার রিভিউ',
  cta: 'CTA স্ট্রিপ',
}

const filterLabels = {
  all: 'সব পণ্য',
  topSelling: 'সর্বাধিক বিক্রিত',
  featured: 'ফিচার্ড পণ্য',
  flash: 'ফ্ল্যাশ সেলে থাকা',
  organic: 'অর্গানিক ব্যাজ',
  category: 'নির্দিষ্ট ক্যাটাগরি',
}

// Kept in one place so both the Add and Edit modals offer the same choices.
const filterOptions = ['all', 'topSelling', 'featured', 'flash', 'organic', 'category']

const emptyAddForm = {
  type: 'productRow',
  title: '',
  titleBn: '',
  subtitle: '',
  subtitleBn: '',
  href: '/shop',
  linkLabel: '',
  filter: 'all',
  category: '',
  limit: 4,
}

const AdminHomeLayout = () => {
  const { settings, reorderHomeLayout, toggleHomeSection, updateHomeSection, removeHomeSection, updateHomeLayout, addHomeSection } = useSettings()
  const layout = [...(settings.homeLayout || [])]
    .map((item, idx) => ({ order: idx, enabled: true, ...item }))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  const [draggedId, setDraggedId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState(emptyAddForm)
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
    toast.success('সেকশনের ক্রম বদলানো হয়েছে')
  }

  const startEdit = (item) => {
    setEditing(item.id)
    setForm({ ...item })
  }

  const saveEdit = () => {
    updateHomeSection(editing, form)
    setEditing(null)
    toast.success('সেকশন আপডেট হয়েছে')
  }

  const handleRemove = (item) => {
    if (item.type !== 'productRow' && item.type !== 'categories') return
    if (
      !confirm(
        'এই সেকশনটি হোম পেজ থেকে মুছে ফেলবেন? পরে "সেকশন যোগ করুন" দিয়ে আবার যোগ করতে পারবেন।'
      )
    ) {
      return
    }
    removeHomeSection(item.id)
    toast.success('সেকশন মুছে ফেলা হয়েছে')
  }

  const openAdd = () => {
    setAddForm(emptyAddForm)
    setShowAdd(true)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    const title = addForm.title.trim()
    if (!title) {
      toast.error('ইংরেজি শিরোনাম লিখুন')
      return
    }
    if (addForm.type === 'productRow' && addForm.filter === 'category' && !addForm.category) {
      toast.error('কোন ক্যাটাগরির পণ্য দেখাবে সেটি বেছে নিন')
      return
    }

    const payload = {
      type: addForm.type,
      title,
      titleBn: addForm.titleBn.trim(),
      subtitle: addForm.subtitle.trim(),
      subtitleBn: addForm.subtitleBn.trim(),
      href: addForm.href.trim() || '/shop',
    }
    const linkLabel = addForm.linkLabel.trim()
    if (linkLabel) payload.linkLabel = linkLabel

    if (addForm.type === 'productRow') {
      payload.filter = addForm.filter
      payload.limit = Math.max(1, Math.round(Number(addForm.limit) || 4))
      if (addForm.filter === 'category') payload.category = addForm.category
    }

    addHomeSection(payload)
    toast.success('নতুন সেকশন হোম পেজে যোগ হয়েছে')
    setShowAdd(false)
    setAddForm(emptyAddForm)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">হোম লেআউট</h1>
          <p className="text-gray-500 mt-1">টেনে সাজান, দেখান/লুকান, এডিট করুন বা নতুন সেকশন যোগ করুন</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#EF4A23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63a16]"
          >
            <PlusCircle size={18} /> সেকশন যোগ করুন
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  'ডিফল্ট হোম লেআউট ফিরিয়ে আনবেন? এতে সব ডিফল্ট সেকশন ফিরে আসবে এবং কাস্টম পণ্যের সারি মুছে যাবে।'
                )
              ) {
                updateHomeLayout(defaultHomeLayout.map((item) => ({ ...item })))
                toast.success('ডিফল্ট লেআউট ফিরিয়ে আনা হয়েছে')
              }
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ডিফল্ট লেআউট ফিরিয়ে আনুন
          </button>
        </div>
      </div>

      <AutoSaveNote className="mb-4">
        ক্রম, দৃশ্যমানতা ও এডিট — সব পরিবর্তন সাথে সাথে সেভ হয়।
      </AutoSaveNote>

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
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{sectionTypes[item.type] || item.type}</h3>
                  {item.type === 'productRow' && item.title && (
                    <span className="text-sm text-gray-500">- {item.title}</span>
                  )}
                  {item.type === 'productRow' && item.filter && item.filter !== 'all' && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                      {filterLabels[item.filter] || item.filter}
                    </span>
                  )}
                  {item.type === 'categories' && (
                    <span className="text-sm text-gray-500">- {item.title || 'ক্যাটাগরি'}</span>
                  )}
                  {item.type === 'productRow' && item.filter === 'category' && item.category && !categorySlugs.includes(item.category) && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                      <AlertTriangle size={11} /> {`ক্যাটাগরি "${item.category}" আর নেই`}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{`আইডি: ${item.id}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { toggleHomeSection(item.id); toast.success(item.enabled ? 'সেকশন লুকানো হয়েছে' : 'সেকশন দেখানো হয়েছে') }} className="p-2 hover:bg-gray-100 rounded-lg" title={item.enabled ? 'লুকান' : 'দেখান'}>
                  {item.enabled ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}
                </button>
                {(item.type === 'productRow' || item.type === 'categories') && (
                  <button onClick={() => startEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg" title="এডিট">
                    <Edit2 size={18} className="text-blue-600" />
                  </button>
                )}
                {(item.type === 'productRow' || item.type === 'categories') && (
                  <button onClick={() => handleRemove(item)} className="p-2 hover:bg-red-50 rounded-lg" title="সেকশন মুছুন">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {layout.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            সব সেকশন মুছে ফেলা হয়েছে। উপরের &quot;ডিফল্ট লেআউট ফিরিয়ে আনুন&quot; অথবা &quot;সেকশন যোগ করুন&quot; চাপুন।
          </p>
        )}
      </div>

      {/* Add Section */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">নতুন সেকশন</h2>
              <button onClick={() => setShowAdd(false)} aria-label="বন্ধ করুন"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">সেকশনের ধরন</label>
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="productRow">পণ্যের সারি (Product Row)</option>
                  <option value="categories">ক্যাটাগরি গ্রিড (Categories)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  পণ্যের সারিতে বেছে নেওয়া ফিল্টার অনুযায়ী পণ্য দেখাবে।
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">শিরোনাম (ইংরেজি) *</label>
                <input
                  type="text"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Best Sellers"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={addForm.titleBn}
                  onChange={(e) => setAddForm({ ...addForm, titleBn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="যেমন: সর্বাধিক বিক্রিত পণ্য"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">উপ-শিরোনাম (ইংরেজি)</label>
                <input
                  type="text"
                  value={addForm.subtitle}
                  onChange={(e) => setAddForm({ ...addForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">উপ-শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={addForm.subtitleBn}
                  onChange={(e) => setAddForm({ ...addForm, subtitleBn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {addForm.type === 'productRow' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">কোন পণ্য দেখাবে</label>
                    <select
                      value={addForm.filter}
                      onChange={(e) => setAddForm({ ...addForm, filter: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      {filterOptions.map((value) => (
                        <option key={value} value={value}>{filterLabels[value]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">সর্বোচ্চ কতটি পণ্য</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={addForm.limit}
                      onChange={(e) => setAddForm({ ...addForm, limit: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  {addForm.filter === 'category' && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">ক্যাটাগরি</label>
                      <select
                        value={addForm.category}
                        onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        required
                      >
                        <option value="">ক্যাটাগরি বেছে নিন</option>
                        {categorySlugs.map((slug) => (
                          <option key={slug} value={slug}>{slug}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">লিংক (href)</label>
                  <input
                    type="text"
                    value={addForm.href}
                    onChange={(e) => setAddForm({ ...addForm, href: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="/shop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">লিংক লেবেল</label>
                  <input
                    type="text"
                    value={addForm.linkLabel}
                    onChange={(e) => setAddForm({ ...addForm, linkLabel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="খালি রাখলে ডিফল্ট দেখাবে"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  <PlusCircle size={18} /> যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setAddForm(emptyAddForm) }}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">সেকশন এডিট</h2>
              <button onClick={() => setEditing(null)} aria-label="বন্ধ করুন"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">শিরোনাম (ইংরেজি)</label>
                <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">শিরোনাম (বাংলা)</label>
                <input type="text" value={form.titleBn || ''} onChange={(e) => setForm({ ...form, titleBn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">উপ-শিরোনাম (ইংরেজি)</label>
                <input type="text" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">উপ-শিরোনাম (বাংলা)</label>
                <input type="text" value={form.subtitleBn || ''} onChange={(e) => setForm({ ...form, subtitleBn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">লিংক (href)</label>
                <input type="text" value={form.href || ''} onChange={(e) => setForm({ ...form, href: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">লিংক লেবেল</label>
                <input type="text" value={form.linkLabel || ''} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              {form.type === 'productRow' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">কোন পণ্য দেখাবে</label>
                      <select
                        value={form.filter || 'all'}
                        onChange={(e) => setForm({ ...form, filter: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        {filterOptions.map((value) => (
                          <option key={value} value={value}>{filterLabels[value]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">সর্বোচ্চ কতটি পণ্য</label>
                      <input type="number" min="1" max="20" value={form.limit || 5} onChange={(e) => setForm({ ...form, limit: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ক্যাটাগরি (ক্যাটাগরি ফিল্টারে প্রয়োজন)</label>
                    <select
                      value={form.category || ''}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="">কোনো নির্দিষ্ট ক্যাটাগরি নয় (সব পণ্য)</option>
                      {categorySlugs.map((slug) => (
                        <option key={slug} value={slug}>{slug}</option>
                      ))}
                      {form.category && !categorySlugs.includes(form.category) && (
                        <option value={form.category}>{form.category} (আর নেই)</option>
                      )}
                    </select>
                    {formCategoryMissing && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-amber-700">
                        <AlertTriangle size={12} /> এই ক্যাটাগরিটি আর নেই — সারিটি খালি দেখাবে।
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"><Save size={18} /> সেভ করুন</button>
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminHomeLayout
