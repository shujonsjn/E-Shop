import { supabase } from '../lib/supabase'

// Base64 images inside `settings` / `products` made the store rows huge
// (settings alone was ~700 KB) and could fill localStorage on phones. This
// helper moves them into the public `media` bucket and replaces the value with
// its public URL. Requires the admin session (storage RLS) and the `media`
// bucket from supabase/security-v2.sql.

const DATA_URL_RE = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/i

export const isDataUrl = (value) => typeof value === 'string' && DATA_URL_RE.test(value)

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

const dataUrlToBlob = (dataUrl) => {
  const comma = dataUrl.indexOf(',')
  const meta = dataUrl.slice(0, comma)
  const base64 = dataUrl.slice(comma + 1)
  const mime = (meta.match(/data:([^;]+)/) || [])[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return { blob: new Blob([bytes], { type: mime }), mime }
}

export const uploadDataUrl = async (dataUrl, prefix = 'media') => {
  if (!supabase || !isDataUrl(dataUrl)) return null
  try {
    const { blob, mime } = dataUrlToBlob(dataUrl)
    const ext = EXTENSIONS[mime.toLowerCase()] || 'jpg'
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage
      .from('media')
      .upload(path, blob, { contentType: mime, upsert: false })
    if (error) {
      console.warn(`[storage] upload failed: ${error.message}`)
      return null
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    return data?.publicUrl || null
  } catch (error) {
    console.warn(`[storage] upload failed: ${error.message}`)
    return null
  }
}

/**
 * Walks any JSON value, uploads every base64 image it finds once, and returns
 * the same shape with public URLs instead. Objects that fail to upload keep
 * their original value, so a partial network failure never loses content.
 */
export const migrateDataUrls = async (value, prefix = 'media') => {
  const cache = new Map()
  let uploaded = 0
  let failed = 0

  const walk = async (input) => {
    if (typeof input === 'string') {
      if (!isDataUrl(input)) return input
      if (cache.has(input)) return cache.get(input)
      const url = await uploadDataUrl(input, prefix)
      if (url) {
        uploaded += 1
        cache.set(input, url)
        return url
      }
      failed += 1
      return input
    }
    if (Array.isArray(input)) {
      const out = []
      for (const item of input) out.push(await walk(item))
      return out
    }
    if (input && typeof input === 'object') {
      const out = {}
      for (const [key, item] of Object.entries(input)) {
        out[key] = await walk(item)
      }
      return out
    }
    return input
  }

  const result = await walk(value)
  return { value: result, uploaded, failed }
}
