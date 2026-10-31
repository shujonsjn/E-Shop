import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminStaff = () => {
  const { settings, addStaff, updateStaff, deleteStaff } = useSettings()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'manager', permissions: [] })

  const roles = [
    { value: 'manager', label: 'Manager' },
    { value: 'delivery_coordinator', label: 'Delivery Coordinator' },
    { value: 'data_entry', label: 'Data Entry Operator' },
  ]

  const permissionsList = [
    { value: 'products', label: 'Products' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'reports', label: 'Reports' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editing) {
      updateStaff(editing.id, form)
      toast.success('Staff updated')
    } else {
      addStaff(form)
      toast.success('Staff added')
    }
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', email: '', phone: '', role: 'manager', permissions: [] })
  }

  const handleEdit = (staff) => {
    setEditing(staff)
    setForm(staff)
    setShowModal(true)
  }

  const togglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', role: 'manager', permissions: [] }); setShowModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={20} /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {settings.staff.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{staff.name}</td>
                <td className="px-6 py-4 text-gray-500">{staff.email}</td>
                <td className="px-6 py-4 text-gray-500">{staff.phone}</td>
                <td className="px-6 py-4 text-gray-500 capitalize">{staff.role.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-gray-500">{(staff.permissions || []).join(', ')}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(staff)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => { if (confirm('Delete?')) { deleteStaff(staff.id); toast.success('Deleted') } }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {settings.staff.length === 0 && <p className="text-center py-8 text-gray-500">No staff added yet</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded">
                  {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-2">
                  {permissionsList.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2">
                      <input type="checkbox" checked={(form.permissions || []).includes(perm.value)} onChange={() => togglePermission(perm.value)} />
                      <span className="text-sm">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStaff
