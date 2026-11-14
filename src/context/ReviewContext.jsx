import { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { saveStore } from '../services/store'
import { deleteReviewRemote, fetchReviewsRemote, insertReviewRemote } from '../services/commerce'

const ReviewContext = createContext()
const STORAGE_KEY = 'gb_reviews'
const VERSION_KEY = 'gb_reviews_version'
// v2 removes the bundled demo reviews that used to reappear on every device.
const REVIEW_VERSION = 'gb-reviews-v2'

const isDemoReview = (review) => String(review?.userId || '').startsWith('demo-')

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const cleaned = Array.isArray(parsed) ? parsed.filter((r) => r && !isDemoReview(r)) : []
    if (localStorage.getItem(VERSION_KEY) !== REVIEW_VERSION || cleaned.length !== parsed.length) {
      localStorage.setItem(VERSION_KEY, REVIEW_VERSION)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
    }
    return cleaned
  } catch {
    return []
  }
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
  // Kept in a ref so the one-time cloud merge can read the latest local list
  // without re-running the effect on every change.
  const reviewsRef = useRef(reviews)
  reviewsRef.current = reviews

  useEffect(() => {
    let alive = true

    const sync = async () => {
      const remote = await fetchReviewsRemote()
      // null = Supabase is not configured (or the migration is not run yet),
      // so the local copy stays as-is and the shop still works.
      if (!alive || remote === null) return
      const remoteIds = new Set(remote.map((review) => String(review.id)))
      // Reviews written on this device before the migration are pushed once.
      const localOnly = reviewsRef.current.filter((r) => !remoteIds.has(String(r.id)))
      if (localOnly.length > 0) {
        await Promise.all(localOnly.map((review) => insertReviewRemote(review)))
      }
      const merged = [...localOnly, ...remote].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
      setReviews(merged)
      saveStore('reviews', merged)
    }

    sync()

    const reload = (event) => {
      const keys = event?.detail
      if (Array.isArray(keys) && keys.length > 0 && !keys.includes('reviews')) {
        // Other keys changed; reviews live in their own table now, so a full
        // pull does not notify us. Still re-sync on the boot event.
        if (!keys.includes('settings')) return
      }
      sync()
    }

    window.addEventListener('gb:remote', reload)
    return () => {
      alive = false
      window.removeEventListener('gb:remote', reload)
    }
  }, [])

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
    insertReviewRemote(newReview).catch(() => {})
    toast.success('Review submitted successfully')
    return true
  }

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter((r) => String(r.id) !== String(reviewId)))
    deleteReviewRemote(reviewId).catch(() => {})
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
