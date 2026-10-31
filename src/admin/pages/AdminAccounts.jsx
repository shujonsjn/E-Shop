import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminAccounts = () => {
  const { orders } = useAuth()
  const { settings, addExpense, deleteExpense } = useSettings()
  const [activeTab, setActiveTab] = useState('revenue')
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: '', date: '', note: '' })

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalExpenses = settings.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const netProfit = totalRevenue - totalExpenses

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    addExpense({ ...expenseForm, amount: Number(expenseForm.amount) })
    toast.success('Expense added')
    setShowExpenseModal(false)
    setExpenseForm({ title: '', amount: '', category: '', date: '', note: '' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment & Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">৳{totalRevenue}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">৳{totalExpenses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-blue-600">৳{netProfit}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setActiveTab('revenue')} className={`px-4 py-2 font-medium ${activeTab === 'revenue' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Revenue</button>
        <button onClick={() => setActiveTab('expenses')} className={`px-4 py-2 font-medium ${activeTab === 'expenses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Expenses</button>
      </div>

      {activeTab === 'revenue' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.slice(0, 20).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.userName}</td>
                  <td className="px-6 py-4 font-medium">৳{order.total}</td>
                  <td className="px-6 py-4">{order.status}</td>
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
            <h2 className="text-xl font-bold">Expenses</h2>
            <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> Add Expense</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {settings.expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4">{expense.title}</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td className="px-6 py-4 font-medium text-red-600">৳{expense.amount}</td>
                    <td className="px-6 py-4">{expense.date}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { if (confirm('Delete?')) { deleteExpense(expense.id); toast.success('Deleted') } }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {settings.expenses.length === 0 && <p className="text-center py-8 text-gray-500">No expenses yet</p>}
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="w-full px-3 py-2 border rounded" required>
                  <option value="">Select</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (৳)</label>
                  <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea value={expenseForm.note} onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })} className="w-full px-3 py-2 border rounded" rows={2} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add</button>
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAccounts
