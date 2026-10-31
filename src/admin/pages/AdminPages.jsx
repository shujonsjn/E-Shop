import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { pages as defaultPages } from '../../data/pages'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'gb_admin_pages'

const AdminPages = () => {
  const [pages, setPages] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ slug: '', title: '', title_bn: '', subtitle: '', subtitle_bn: '', sections: [] })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setPages(Object.values(parsed))
        return
      }
    } catch {}
    setPages(Object.values(defaultPages))
  }, [])

  const savePages = (next) => {
    const map = {}
    next.forEach((p) => {
      if (p.slug) map[p.slug] = p
    })
    setPages(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
      window.dispatchEvent(new Event('storage'))
    } catch {}
  }

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), { heading: '', heading_bn: '', body: [''], body_bn: [''], bullets: [], bullets_bn: [] }],
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

  const handleSave = () => {
    if (!form.slug) return toast.error('Slug required')
    const exists = pages.find((p) => p.slug === form.slug && p.slug !== editing?.slug)
    if (exists) return toast.error('Slug already exists')
    let next
    if (editing) {
      next = pages.map((p) => (p.slug === editing.slug ? form : p))
      toast.success('Page updated')
    } else {
      next = [...pages, form]
      toast.success('Page added')
    }
    savePages(next)
    setEditing(null)
    setForm({ slug: '', title: '', title_bn: '', subtitle: '', subtitle_bn: '', sections: [] })
  }

  const handleEdit = (page) => {
    setEditing(page)
    setForm(JSON.parse(JSON.stringify(page)))
  }

  const handleDelete = (slug) => {
    if (!confirm('Delete this page?')) return
    const next = pages.filter((p) => p.slug !== slug)
    savePages(next)
    toast.success('Page deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 mt-1">Edit static pages content</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ slug: '', title: '', title_bn: '', subtitle: '', subtitle_bn: '', sections: [] }) }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
            {pages.map((page) => (
              <tr key={page.slug}>
                <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                <td className="px-6 py-4 text-gray-500">/page/{page.slug}</td>
                <td className="px-6 py-4 text-gray-500">{(page.sections || []).length}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(page)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(page.slug)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing !== null || form.slug === '' && pages.length >= 0) && editing !== undefined && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{editing ? 'Edit Page' : 'Add Page'}</h2>
            <button onClick={() => setEditing(null)}><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" disabled={!!editing} />
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
              <button onClick={addSection} className="flex items-center gap-1 text-sm text-blue-600"><Plus size={16} /> Add Section</button>
            </div>
            <div className="space-y-4">
              {(form.sections || []).map((section, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Section {idx + 1}</span>
                    <button onClick={() => removeSection(idx)} className="text-red-600"><Trash2 size={16} /></button>
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
            <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Save size={18} /> Save</button>
            <button onClick={() => setEditing(null)} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPages
