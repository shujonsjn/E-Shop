import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../context/ProductsContext'
import { getMergedCategories } from '../../utils/mergeCategories'

const categoryName = (slug) =>
  getMergedCategories().find((category) => category.slug === slug)?.name || slug

const AdminProducts = () => {
  const { products, deleteProduct } = useProducts()
  const navigate = useNavigate()
  const [adminCategories, setAdminCategories] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gb_admin_categories')
      if (saved) setAdminCategories(JSON.parse(saved))
    } catch {}
  }, [])

  const handleAdd = () => {
    navigate('/admin/products/add')
  }

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`)
  }

  const handleDelete = (id) => {
    if (confirm('আপনি কি নিশ্চিত এই পণ্যটি মুছে ফেলতে চান?')) {
      deleteProduct(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">পণ্য</h1>
          <p className="text-gray-500 mt-1">আপনার পণ্যের তালিকা পরিচালনা করুন</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center bg-[#EF4A23] text-white px-4 py-2 rounded-lg hover:bg-[#d63a16] transition"
          >
            <Plus size={18} className="mr-2" />
            নতুন পণ্য
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ছবি</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ক্যাটাগরি</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">দাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <img src={product.images?.[0] || product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{categoryName(product.category)}</span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">৳{product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="এডিট">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="মুছুন">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-700 font-medium">এখনো কোনো পণ্য নেই</p>
            <p className="mt-1 text-sm text-gray-500">
              “নতুন পণ্য” চেপে প্রথম পণ্যটি যোগ করুন। কোনো ডেমো পণ্য নিজে থেকে আসে না।
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
