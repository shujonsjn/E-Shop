import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ReviewContext = createContext()
const STORAGE_KEY = 'gb_reviews'
const VERSION_KEY = 'gb_reviews_version'
const REVIEW_VERSION = 'gb-reviews-v1'

const seedReviews = [
  { productId: 1, userId: 'demo-1', userName: 'Farhana Akter', rating: 5, comment: 'Genuine raw honey — the aroma filled the room as soon as I opened the jar. Will reorder.', createdAt: '2026-09-18T09:20:00.000Z' },
  { productId: 1, userId: 'demo-2', userName: 'Rashed Khan', rating: 5, comment: 'Third time buying. Consistent quality and the jar was sealed properly.', createdAt: '2026-09-02T14:05:00.000Z' },
  { productId: 1, userId: 'demo-3', userName: 'Mitu Saha', rating: 4, comment: 'Very good honey, though I wish the 500g option was also available for this variety.', createdAt: '2026-08-21T11:40:00.000Z' },
  { productId: 13, userId: 'demo-4', userName: 'Tanvir Ahmed', rating: 5, comment: 'Soft, large and fresh. Perfect for iftar — the whole family loved them.', createdAt: '2026-09-25T17:30:00.000Z' },
  { productId: 13, userId: 'demo-5', userName: 'Nusrat Jahan', rating: 5, comment: 'Worth the price. No dry pieces at the bottom of the pack.', createdAt: '2026-09-10T08:15:00.000Z' },
  { productId: 21, userId: 'demo-6', userName: 'Sumaiya Islam', rating: 5, comment: 'The ghee smells exactly like homemade. Great for polao and everyday cooking.', createdAt: '2026-09-12T12:00:00.000Z' },
  { productId: 21, userId: 'demo-7', userName: 'Imran Hossain', rating: 4, comment: 'Good quality, but the jar is a bit hard to open the first time.', createdAt: '2026-08-30T19:10:00.000Z' },
  { productId: 34, userId: 'demo-8', userName: 'Rakib Hasan', rating: 5, comment: 'The masala combo has a fresh, strong aroma. Restaurant-style kala bhuna at home.', createdAt: '2026-09-22T13:45:00.000Z' },
  { productId: 40, userId: 'demo-9', userName: 'Sharmin Akter', rating: 5, comment: 'Cashews were crunchy and evenly sized. Used half for baking and half for snacking.', createdAt: '2026-09-05T10:25:00.000Z' },
  { productId: 23, userId: 'demo-10', userName: 'Mahmudul Hasan', rating: 5, comment: 'Olive oil quality is excellent for salads. Bottle arrived well wrapped.', createdAt: '2026-09-19T16:35:00.000Z' },
]

const loadReviews = () => {
  try {
    if (localStorage.getItem(VERSION_KEY) !== REVIEW_VERSION) {
      localStorage.setItem(VERSION_KEY, REVIEW_VERSION)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedReviews))
      return seedReviews
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  return seedReviews
}

export const useReview = () => {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider')
  }
  return context
}

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(loadReviews)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    } catch {
      /* ignore */
    }
  }, [reviews])

  const addReview = (reviewData) => {
    const existingReview = reviews.find(
      (r) => String(r.productId) === String(reviewData.productId) && r.userId === reviewData.userId
    )
    if (existingReview) {
      toast.error('You have already reviewed this product')
      return false
    }

    const newReview = {
      id: Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString(),
    }

    setReviews([newReview, ...reviews])
    toast.success('Review submitted successfully')
    return true
  }

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter((r) => r.id !== reviewId))
    toast.success('Review deleted')
  }

  const getProductReviews = (productId) =>
    reviews.filter((r) => String(r.productId) === String(productId))

  const getAverageRating = (productId) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((total, review) => total + review.rating, 0)
    return (sum / productReviews.length).toFixed(1)
  }

  const getReviewCount = (productId) => getProductReviews(productId).length

  const hasUserReviewed = (productId, userId) =>
    reviews.some((r) => String(r.productId) === String(productId) && r.userId === userId)

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        deleteReview,
        getProductReviews,
        getAverageRating,
        getReviewCount,
        hasUserReviewed,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}
