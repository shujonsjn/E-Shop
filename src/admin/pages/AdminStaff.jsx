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

  const roles = [
    { value: 'manager', label: 'Manager' },
    { value: 'delivery_coordinator', label: 'Delivery Coordinator' },
    { value: 'data_entry', label: 'Data Entry Operator' },
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
      toast.error('Name and email are required')
      return
    }
    if (editing) {
      updateStaff(editing.id, payload)
      toast.success('Staff updated')
    } else {
      addStaff(payload)
      toast.success('Staff added')
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
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={() => {
            setEditing(null)
            setForm(emptyForm)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={20} /> Add Staff
        </button>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          এটি শুধু স্টাফদের নাম-ফোনের তালিকা (কর্মীদের তথ্য সংরক্ষণ)। এখানে যোগ করলে
          অ্যাডমিন প্যানেলে আলাদা লগইন তৈরি হয় না। নতুন অ্যাডমিন লগইন তৈরি করতে হবে
          Supabase Auth থেকে।
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                    <button onClick={() => handleEdit(staff)} className="text-blue-600 hover:text-blue-800" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this staff record?')) {
                          deleteStaff(staff.id)
                          toast.success('Staff deleted')
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
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
            <p className="mt-1 text-sm text-gray-500">Add Staff চেপে কর্মীর তথ্য যোগ করুন।</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Staff' : 'Add Staff'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded">
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Only a label — the role gives no panel access by itself.</p>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); setForm(emptyForm) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStaff
