import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AutoSaveNote from '../../components/admin/AutoSaveNote'

// Stored values stay English; only the labels are Bengali.
const expenseCategories = [
  { value: 'Purchase', label: 'পণ্য কেনা' },
  { value: 'Delivery', label: 'ডেলিভারি' },
  { value: 'Rent', label: 'ভাড়া' },
  { value: 'Salary', label: 'বেতন' },
  { value: 'Utilities', label: 'ইউটিলিটি' },
  { value: 'Other', label: 'অন্যান্য' },
]

const statusLabels = {
  Pending: 'অপেক্ষমাণ',
  Confirmed: 'কনফার্মড',
  Packed: 'প্যাক করা হয়েছে',
  Shipped: 'শিপড',
  'Out for Delivery': 'ডেলিভারির পথে',
  Delivered: 'ডেলিভারি সম্পন্ন',
  Cancelled: 'বাতিল',
}

const AdminAccounts = () => {
  const { orders } = useAuth()
  const { settings, addExpense, deleteExpense } = useSettings()
  const [activeTab, setActiveTab] = useState('revenue')
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: '', date: '', note: '' })

  // Cancelled orders never earned money, so they must not inflate revenue or
  // profit. Only non-cancelled orders count.
  const paidOrders = orders.filter((o) => o.status !== 'Cancelled')
  const expenses = Array.isArray(settings.expenses) ? settings.expenses : []
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const netProfit = totalRevenue - totalExpenses

  const expenseCategoryLabel = (value) =>
    expenseCategories.find((c) => c.value === value)?.label || value || '-'

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    addExpense({ ...expenseForm, amount: Number(expenseForm.amount) })
    toast.success('খরচ যোগ করা হয়েছে')
    setShowExpenseModal(false)
    setExpenseForm({ title: '', amount: '', category: '', date: '', note: '' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">পেমেন্ট ও হিসাব</h1>
      <p className="mb-4 text-sm text-gray-500">
        আয় আসল অর্ডার থেকে হিসাব হয়। খরচ নিজে যোগ করতে হবে।
      </p>
      <AutoSaveNote className="mb-6">খরচ যোগ বা মুছে ফেললে সাথে সাথে সেভ হয়।</AutoSaveNote>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm mb-1">মোট আয়</p>
          <p className="text-2xl font-bold text-green-600">৳{totalRevenue}</p>
          <p className="text-xs text-gray-400 mt-1">বাতিল অর্ডার বাদ দেওয়া হয়েছে</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm mb-1">মোট খরচ</p>
          <p className="text-2xl font-bold text-red-600">৳{totalExpenses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm mb-1">নিট লাভ</p>
          <p className="text-2xl font-bold text-blue-600">৳{netProfit}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setActiveTab('revenue')} className={`px-4 py-2 font-medium ${activeTab === 'revenue' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>আয়</button>
        <button onClick={() => setActiveTab('expenses')} className={`px-4 py-2 font-medium ${activeTab === 'expenses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>খরচ</button>
      </div>

      {activeTab === 'revenue' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার আইডি</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাস্টমার</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পরিমাণ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paidOrders.slice(0, 20).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.userName}</td>
                  <td className="px-6 py-4 font-medium">৳{order.total}</td>
                  <td className="px-6 py-4">{statusLabels[order.status] || order.status}</td>
                  <td className="px-6 py-4">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">খরচ</h2>
            <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> খরচ যোগ করুন</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">শিরোনাম</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">খরচের ধরন</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পরিমাণ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4">{expense.title}</td>
                    <td className="px-6 py-4">{expenseCategoryLabel(expense.category)}</td>
                    <td className="px-6 py-4 font-medium text-red-600">৳{expense.amount}</td>
                    <td className="px-6 py-4">{expense.date}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { if (confirm('খরচটি মুছে ফেলবেন?')) { deleteExpense(expense.id); toast.success('মুছে ফেলা হয়েছে') } }} className="text-red-600 hover:text-red-800" title="মুছুন"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && <p className="text-center py-8 text-gray-500">এখনো কোনো খরচ নেই</p>}
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">খরচ যোগ করুন</h2>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">শিরোনাম</label>
                <input type="text" value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">খরচের ধরন</label>
                <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="w-full px-3 py-2 border rounded" required>
                  <option value="">বেছে নিন</option>
                  {expenseCategories.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">পরিমাণ (৳)</label>
                  <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">তারিখ</label>
                  <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">নোট</label>
                <textarea value={expenseForm.note} onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })} className="w-full px-3 py-2 border rounded" rows={2} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">যোগ করুন</button>
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAccounts
