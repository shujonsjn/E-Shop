import { Trash2, Star } from 'lucide-react'
import { useReview } from '../../context/ReviewContext'
import { useProducts } from '../../context/ProductsContext'

const AdminReviews = () => {
  const { reviews, deleteReview } = useReview()
  const { products } = useProducts()

  const getProductName = (productId) => {
    const product = products.find((p) => String(p.id) === String(productId))
    return product ? product.name : 'Unknown Product'
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 text-gray-900">{getProductName(review.productId)}</td>
                <td className="px-6 py-4 text-gray-900">{review.userName}</td>
                <td className="px-6 py-4">{renderStars(review.rating)}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{review.comment}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this review?')) {
                        deleteReview(review.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">No reviews yet</div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews
