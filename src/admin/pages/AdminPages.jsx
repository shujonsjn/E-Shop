import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, RotateCcw } from 'lucide-react'
import { pages as defaultPages } from '../../data/pages'
import toast from 'react-hot-toast'
import { saveStore } from '../../services/store'

const STORAGE_KEY = 'gb_admin_pages'

const emptyForm = {
  slug: '',
  title: '',
  title_bn: '',
  subtitle: '',
  subtitle_bn: '',
  sections: [],
}

const AdminPages = () => {
  const [pages, setPages] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  // The editor used to be visible all the time because its condition was
  // always true. A dedicated flag makes "Add Page" a real action.
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const list = Object.values(parsed || {}).filter((p) => p && p.slug)
        if (list.length) {
          setPages(list)
          return
        }
      }
    } catch {}
    setPages(Object.values(defaultPages))
  }, [])

  const visiblePages = pages.filter((p) => !p.hidden)
  const hiddenPages = pages.filter((p) => p.hidden)

  const savePages = (next) => {
    const map = {}
    next.forEach((p) => {
      if (p.slug) map[p.slug] = p
    })
    const ok = saveStore('pages', map)
    if (!ok) {
      toast.error('Could not save. Check that you are signed in as admin.')
      return false
    }
    setPages(next)
    window.dispatchEvent(new Event('storage'))
    return true
  }

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        { heading: '', heading_bn: '', body: [''], body_bn: [''], bullets: [], bullets_bn: [] },
      ],
    }))
  }

  const updateSection = (idx, updates) => {
    setForm((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s, i) => (i === idx ? { ...s, ...updates } : s)),
    }))
  }

  const removeSection = (idx) => {
    setForm((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((_, i) => i !== idx),
    }))
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowEditor(true)
  }

  const handleSave = () => {
    const slug = form.slug.trim()
    if (!slug) return toast.error('Slug required')
    if (!form.title.trim()) return toast.error('Title required')
    if (editing) {
      const current = pages.find((p) => p.slug === editing.slug)
      if (!current) return toast.error('This page no longer exists')
      const next = pages.map((p) => (p.slug === editing.slug ? { ...p, ...form } : p))
      if (savePages(next)) toast.success('Page updated')
    } else {
      // Re-using the slug of a deleted page restores it instead of failing with
      // "slug already exists" — the tombstone is replaced by the new content.
      const existing = pages.find((p) => p.slug === slug && !p.hidden)
      if (existing) return toast.error('Slug already exists')
      const next = pages
        .filter((p) => p.slug !== slug)
        .concat({ ...form, hidden: false })
      if (savePages(next)) toast.success('Page added')
    }
    setShowEditor(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleEdit = (page) => {
    setEditing(page)
    setForm(JSON.parse(JSON.stringify(page)))
    setShowEditor(true)
  }

  // A real delete would just fall back to the bundled default page on the next
  // render, so store a tombstone the storefront understands.
  const handleDelete = (slug) => {
    if (!confirm('Delete this page? Visitors will see "Page not found". You can restore it from the Deleted pages list.')) {
      return
    }
    const existing = pages.find((p) => p.slug === slug)
    if (!existing) return
    const next = pages.map((p) =>
      p.slug === slug ? { ...p, hidden: true, hiddenAt: new Date().toISOString() } : p
    )
    if (savePages(next)) toast.success('Page deleted')
  }

  const restorePage = (slug) => {
    const next = pages.map((p) =>
      p.slug === slug ? { ...p, hidden: false, hiddenAt: undefined } : p
    )
    if (savePages(next)) toast.success('Page restored')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 mt-1">Edit static pages content</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add Page
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visiblePages.map((page) => (
              <tr key={page.slug}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {page.title}
                  {page.title_bn ? <span className="ml-2 text-xs text-gray-400">{page.title_bn}</span> : null}
                </td>
                <td className="px-6 py-4 text-gray-500">/page/{page.slug}</td>
                <td className="px-6 py-4 text-gray-500">{(page.sections || []).length}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(page)} className="text-blue-600 hover:text-blue-800" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(page.slug)} className="text-red-600 hover:text-red-800" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visiblePages.length === 0 && (
          <p className="text-center py-8 text-gray-500">No pages yet. Use Add Page to create one.</p>
        )}
      </div>

      {hiddenPages.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900 mb-2">
            Deleted pages ({hiddenPages.length}) — visitors currently get "Page not found"
          </h2>
          <ul className="space-y-2">
            {hiddenPages.map((page) => (
              <li key={page.slug} className="flex items-center justify-between gap-3 text-sm text-amber-900">
                <span>
                  {page.title || page.slug} <span className="text-amber-700">/page/{page.slug}</span>
                </span>
                <button
                  onClick={() => restorePage(page.slug)}
                  className="flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-medium text-amber-900 shadow-sm hover:bg-amber-100"
                >
                  <RotateCcw size={13} /> Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showEditor && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{editing ? 'Edit Page' : 'Add Page'}</h2>
            <button
              onClick={() => {
                setShowEditor(false)
                setEditing(null)
                setForm(emptyForm)
              }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${editing ? 'bg-gray-100 text-gray-500' : ''}`}
                disabled={!!editing}
                placeholder="about-us"
              />
              <p className="text-xs text-gray-500 mt-1">
                {editing
                  ? 'Slug is fixed while editing because links already point to it.'
                  : `/page/${form.slug || 'page-slug'}`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (English) *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (Bangla)</label>
              <input type="text" value={form.title_bn || ''} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle (English)</label>
              <input type="text" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Subtitle (Bangla)</label>
              <input type="text" value={form.subtitle_bn || ''} onChange={(e) => setForm({ ...form, subtitle_bn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Sections</h3>
              <button onClick={addSection} className="flex items-center gap-1 text-sm text-blue-600">
                <Plus size={16} /> Add Section
              </button>
            </div>
            <div className="space-y-4">
              {(form.sections || []).map((section, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Section {idx + 1}</span>
                    <button onClick={() => removeSection(idx)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs mb-1">Heading (EN)</label>
                      <input type="text" value={section.heading || ''} onChange={(e) => updateSection(idx, { heading: e.target.value })} className="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Heading (BN)</label>
                      <input type="text" value={section.heading_bn || ''} onChange={(e) => updateSection(idx, { heading_bn: e.target.value })} className="w-full px-2 py-1 border rounded" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs mb-1">Body Paragraphs (EN, one per line)</label>
                    <textarea value={(section.body || []).join('\n')} onChange={(e) => updateSection(idx, { body: e.target.value.split('\n').filter(Boolean) })} className="w-full px-2 py-1 border rounded" rows={3} />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs mb-1">Body Paragraphs (BN, one per line)</label>
                    <textarea value={(section.body_bn || []).join('\n')} onChange={(e) => updateSection(idx, { body_bn: e.target.value.split('\n').filter(Boolean) })} className="w-full px-2 py-1 border rounded" rows={3} />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs mb-1">Bullets (EN, one per line)</label>
                    <textarea value={(section.bullets || []).join('\n')} onChange={(e) => updateSection(idx, { bullets: e.target.value.split('\n').filter(Boolean) })} className="w-full px-2 py-1 border rounded" rows={3} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Bullets (BN, one per line)</label>
                    <textarea value={(section.bullets_bn || []).join('\n')} onChange={(e) => updateSection(idx, { bullets_bn: e.target.value.split('\n').filter(Boolean) })} className="w-full px-2 py-1 border rounded" rows={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Save size={18} /> Save
            </button>
            <button
              onClick={() => {
                setShowEditor(false)
                setEditing(null)
                setForm(emptyForm)
              }}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPages
