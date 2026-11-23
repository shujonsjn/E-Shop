import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Edit2, Trash2, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm = { name: '', email: '', phone: '', role: 'manager' }

const AdminStaff = () => {
  const { settings, addStaff, updateStaff, deleteStaff } = useSettings()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // `value` is stored as-is; only the label is Bengali.
  const roles = [
    { value: 'manager', label: 'ম্যানেজার' },
    { value: 'delivery_coordinator', label: 'ডেলিভারি কোঅর্ডিনেটর' },
    { value: 'data_entry', label: 'ডেটা এন্ট্রি অপারেটর' },
  ]

  const staffList = Array.isArray(settings.staff) ? settings.staff : []

  const roleLabel = (value) =>
    roles.find((r) => r.value === value)?.label || String(value || '—').replace(/_/g, ' ')

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role || 'manager',
    }
    if (!payload.name || !payload.email) {
      toast.error('নাম ও ইমেইল দুটোই দিতে হবে')
      return
    }
    if (editing) {
      updateStaff(editing.id, payload)
      toast.success('স্টাফের তথ্য আপডেট হয়েছে')
    } else {
      addStaff(payload)
      toast.success('স্টাফ যোগ করা হয়েছে')
    }
    setShowModal(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleEdit = (staff) => {
    setEditing(staff)
    setForm({
      name: staff.name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      role: staff.role || 'manager',
    })
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">স্টাফ ব্যবস্থাপনা</h1>
        <button
          onClick={() => {
            setEditing(null)
            setForm(emptyForm)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={20} /> স্টাফ যোগ করুন
        </button>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          এই পেজে শুধু স্টাফদের যোগাযোগের তথ্য রাখা হয়। এখানে কাউকে যোগ করলে অ্যাডমিন
          লগইন তৈরি হয় না — নতুন অ্যাডমিন লগইন Supabase Auth থেকে তৈরি করতে হবে।
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ইমেইল</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ফোন</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পদ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{staff.name || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{staff.email || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{staff.phone || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{roleLabel(staff.role)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(staff)} className="text-blue-600 hover:text-blue-800" title="এডিট">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('এই স্টাফ রেকর্ডটি মুছে ফেলবেন?')) {
                          deleteStaff(staff.id)
                          toast.success('স্টাফ মুছে ফেলা হয়েছে')
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="মুছুন"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staffList.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-700 font-medium">এখনো কোনো স্টাফ যোগ করা হয়নি</p>
            <p className="mt-1 text-sm text-gray-500">“স্টাফ যোগ করুন” চেপে কর্মীর তথ্য যোগ করুন।</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'স্টাফ এডিট' : 'স্টাফ যোগ করুন'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">নাম</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ইমেইল</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ফোন</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">পদ</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded">
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">এটি শুধু একটি লেবেল — এই পদ নিজে থেকে প্যানেলে কোনো অ্যাক্সেস দেয় না।</p>
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

export default AdminStaff
