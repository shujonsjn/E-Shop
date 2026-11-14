import { supabase } from '../lib/supabase'

// Orders and reviews live in their own Postgres tables (see
// supabase/security-v2.sql) instead of the shared jsonb "store" rows, so a
// guest can place an order without being able to rewrite everyone else's.
//
// Everything here degrades to a no-op when Supabase is not configured or the
// migration has not been run yet; the storefront keeps working offline from
// localStorage.

const warn = (what, error) => {
  if (error) console.warn(`[supabase] ${what}: ${error.message}`)
}

// Product images are stored as base64 in this project. Copying them into every
// order would create megabyte rows, so only small image references are kept.
const slimImage = (value) =>
  typeof value === 'string' && value.length > 0 && value.length < 2048 ? value : null

const slimItem = (item) => ({
  id: item.id,
  name: item.name,
  name_bn: item.name_bn,
  slug: item.slug,
  price: item.price,
  quantity: item.quantity,
  unit: item.unit || '',
  image: slimImage(item.image || (Array.isArray(item.images) ? item.images[0] : '')),
})

const toSlimOrder = (order) => ({
  ...order,
  items: (order.items || []).map(slimItem),
})

const rowToOrder = (row) => ({
  ...(row.data || {}),
  id: row.id,
  status: row.status,
  createdAt: (row.data && row.data.createdAt) || row.created_at,
})

/* ------------------------------------------------------------------ orders */

export const insertOrder = async (order) => {
  if (!supabase) return { ok: false }
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    user_id: order.userId != null ? String(order.userId) : null,
    phone: order.phone || order.shippingAddress?.phone || null,
    status: 'Pending',
    data: toSlimOrder(order),
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  warn('could not save order', error)
  return { ok: !error, error }
}

/** Admin only (RLS). Returns null when the table is missing or not readable. */
export const fetchOrders = async () => {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, data, created_at')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) {
    warn('could not load orders', error)
    return null
  }
  return (data || []).map(rowToOrder)
}

export const pushOrderUpdate = async (order) => {
  if (!supabase) return
  const { error } = await supabase
    .from('orders')
    .update({
      status: order.status,
      data: toSlimOrder(order),
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id)
  warn('could not update order', error)
}

export const deleteOrderRemote = async (orderId) => {
  if (!supabase) return
  const { error } = await supabase.from('orders').delete().eq('id', orderId)
  warn('could not delete order', error)
}

/** Guest lookup with id + phone. Returns `{ order, error }`. */
export const trackOrderRemote = async (orderId, phone) => {
  if (!supabase) return { order: null, error: null }
  const id = Number(String(orderId).replace(/\D/g, ''))
  if (!Number.isFinite(id) || id <= 0) return { order: null, error: null }
  const { data, error } = await supabase.rpc('track_order', {
    p_id: id,
    p_phone: String(phone || ''),
  })
  if (error) {
    warn('could not track order', error)
    return { order: null, error }
  }
  if (!data) return { order: null, error: null }
  return { order: { ...rowToOrder(data), userId: data.user_id }, error: null }
}

/** Guest cancellation with id + phone. Resolves 'cancelled' | 'locked' | 'not_found'. */
export const cancelOrderRemote = async (orderId, phone) => {
  if (!supabase) return 'not_found'
  const id = Number(String(orderId).replace(/\D/g, ''))
  if (!Number.isFinite(id) || id <= 0) return 'not_found'
  const { data, error } = await supabase.rpc('cancel_order', {
    p_id: id,
    p_phone: String(phone || ''),
  })
  if (error) {
    warn('could not cancel order', error)
    return 'not_found'
  }
  return data || 'not_found'
}

/** Best-effort stock deduction. Never blocks checkout. */
export const decrementStockRemote = async (items) => {
  if (!supabase || !Array.isArray(items) || items.length === 0) return
  const payload = items.map((item) => ({ id: item.id, quantity: item.quantity }))
  const { error } = await supabase.rpc('decrement_stock', { p_items: payload })
  warn('could not update stock', error)
}

/* ----------------------------------------------------------------- reviews */

export const fetchReviewsRemote = async () => {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('reviews')
    .select('id, product_id, user_id, user_name, rating, comment, created_at')
    .order('created_at', { ascending: false })
    .limit(1000)
  if (error) {
    warn('could not load reviews', error)
    return null
  }
  return (data || []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    userName: row.user_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  }))
}

export const insertReviewRemote = async (review) => {
  if (!supabase) return { ok: false }
  const { error } = await supabase.from('reviews').insert({
    id: review.id,
    product_id: String(review.productId),
    user_id: review.userId != null ? String(review.userId) : null,
    user_name: review.userName || 'Customer',
    rating: Number(review.rating) || 5,
    comment: review.comment || '',
    created_at: review.createdAt || new Date().toISOString(),
  })
  // 23505 = this customer already reviewed this product; the client already
  // blocks it, so a duplicate is not worth reporting.
  if (error && error.code !== '23505') warn('could not save review', error)
  return { ok: !error, error }
}

export const deleteReviewRemote = async (reviewId) => {
  if (!supabase) return
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
  warn('could not delete review', error)
}
