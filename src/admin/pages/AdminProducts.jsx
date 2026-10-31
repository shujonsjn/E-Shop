import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../context/ProductsContext'
import { categories as defaultCategories, products as catalogProducts } from '../../data/catalog'
import toast from 'react-hot-toast'

const categoryName = (slug) => {
  try {
    const saved = localStorage.getItem('gb_admin_categories')
    if (saved) {
      const adminCats = JSON.parse(saved)
      const found = adminCats.find((c) => c.slug === slug)
      if (found) return found.name
    }
  } catch {}
  return defaultCategories.find((category) => category.slug === slug)?.name || slug
}

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

  const resetCatalog = () => {
    if (confirm('Reset all products to default catalog? This will replace current products.')) {
      try {
        localStorage.setItem('gb_products', JSON.stringify(catalogProducts))
        localStorage.setItem('gb_catalog_version', 'gb-v2')
        window.location.reload()
      } catch {
        toast.error('Failed to reset')
      }
    }
  }

  const handleAdd = () => {
    navigate('/admin/products/add')
  }

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCatalog}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <RotateCcw size={18} />
            Import from Catalog
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center bg-[#EF4A23] text-white px-4 py-2 rounded-lg hover:bg-[#d63a16] transition"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProducts
