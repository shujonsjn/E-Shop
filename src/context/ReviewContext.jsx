import { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { saveStore } from '../services/store'
import { deleteReviewRemote, fetchReviewsRemote, insertReviewRemote } from '../services/commerce'

const ReviewContext = createContext()
const STORAGE_KEY = 'gb_reviews'
const VERSION_KEY = 'gb_reviews_version'
// Deleted ids are kept as tombstones. Without them the boot-time cloud merge
// treats a locally deleted review as "local only" and pushes it back up, so a
// deleted review used to reappear on the next sync.
const DELETED_KEY = 'gb_reviews_deleted'
// v2 removes the bundled demo reviews that used to reappear on every device.
const REVIEW_VERSION = 'gb-reviews-v2'

const isDemoReview = (review) => String(review?.userId || '').startsWith('demo-')

const loadDeletedIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed.map((id) => String(id)) : [])
  } catch {
    return new Set()
  }
}

const saveDeletedIds = (ids) => {
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]))
  } catch {
    /* storage can be full or blocked; deleting still applies to this session */
  }
}

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const deleted = loadDeletedIds()
    const cleaned = Array.isArray(parsed)
      ? parsed.filter(
          (r) => r && !isDemoReview(r) && !deleted.has(String(r.id))
        )
      : []
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
  // Reviews deleted on this device, so neither the initial merge nor a later
  // cloud refresh can bring them back.
  const deletedRef = useRef(loadDeletedIds())

  useEffect(() => {
    let alive = true

    const sync = async () => {
      const remote = await fetchReviewsRemote()
      // null = Supabase is not configured (or the migration is not run yet),
      // so the local copy stays as-is and the shop still works.
      if (!alive || remote === null) return
      const deleted = deletedRef.current
      const remoteIds = new Set(remote.map((review) => String(review.id)))
      // Reviews written on this device before the migration are pushed once.
      // Tombstoned ones are skipped, otherwise a delete would be undone here.
      const localOnly = reviewsRef.current.filter(
        (r) => !remoteIds.has(String(r.id)) && !deleted.has(String(r.id))
      )
      if (localOnly.length > 0) {
        await Promise.all(localOnly.map((review) => insertReviewRemote(review)))
      }
      const merged = [...localOnly, ...remote.filter((r) => !deleted.has(String(r.id)))].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
      reviewsRef.current = merged
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

    const next = [newReview, ...reviews]
    reviewsRef.current = next
    setReviews(next)
    saveStore('reviews', next)
    insertReviewRemote(newReview).catch(() => {})
    toast.success('Review submitted successfully')
    return true
  }

  const deleteReview = async (reviewId) => {
    const id = String(reviewId)
    // Remember the deletion locally before touching the network, so a failed or
    // slow cloud delete can never resurrect the review from the local cache.
    deletedRef.current.add(id)
    saveDeletedIds(deletedRef.current)

    const next = reviewsRef.current.filter((r) => String(r.id) !== id)
    reviewsRef.current = next
    setReviews(next)
    saveStore('reviews', next)

    const result = await deleteReviewRemote(id)
    if (result && result.ok === false) {
      toast.error('Review could not be removed from the cloud. Check that you are signed in as an admin.')
      return false
    }
    toast.success('Review deleted')
    return true
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
