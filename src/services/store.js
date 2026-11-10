import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Every admin-managed collection lives in one table (`store`) as jsonb so the
// whole app can sync without a schema change for each new field.
export const LOCAL_KEYS = {
  settings: 'gb_settings',
  products: 'gb_products',
  categories: 'gb_admin_categories',
  brands: 'gb_admin_brands',
  orders: 'shoeshop_orders',
  users: 'shoeshop_users',
  reviews: 'gb_reviews',
  pages: 'gb_admin_pages',
}

const lastSynced = new Map()
let remoteReady = false

// Site content, catalog and pages may only be written by a signed-in admin
// (enforced by Supabase RLS). Orders/reviews/users stay writable by guests.
export const ADMIN_KEYS = new Set(['settings', 'products', 'categories', 'brands', 'pages'])
let adminSignedIn = false

/** Called by AuthContext whenever the Supabase admin session changes. */
export const setAdminSignedIn = (value) => {
  adminSignedIn = Boolean(value)
}

export const readLocal = (name) => {
  try {
    const raw = localStorage.getItem(LOCAL_KEYS[name])
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const writeLocal = (name, value) => {
  try {
    localStorage.setItem(LOCAL_KEYS[name], JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Postgres `jsonb` reorders object keys, so a plain JSON.stringify of the
// remote row will never equal the local object even when the data is the same.
// That mismatch used to cause an endless write -> realtime -> write echo loop.
// Comparable values are therefore serialised with sorted keys.
const stableStringify = (value) => {
  const seen = new WeakSet()
  const walk = (v) => {
    if (v === null || typeof v !== 'object') return v
    if (seen.has(v)) return null
    seen.add(v)
    if (Array.isArray(v)) return v.map(walk)
    return Object.keys(v)
      .sort()
      .reduce((acc, key) => {
        acc[key] = walk(v[key])
        return acc
      }, {})
  }
  try {
    return JSON.stringify(walk(value))
  } catch {
    return ''
  }
}

const remember = (name, value) => {
  lastSynced.set(name, stableStringify(value))
}

// Writes are debounced per key and then executed strictly one after another.
// Without this, typing in a field fires many saves and a slower earlier
// request can land after a newer one, reverting the value everywhere.
const pendingValues = new Map()
const pushTimers = new Map()
const pushChains = new Map()

const pushRow = (name, value) => {
  if (!supabase) return
  pendingValues.set(name, value)
  if (pushTimers.has(name)) clearTimeout(pushTimers.get(name))
  pushTimers.set(
    name,
    setTimeout(() => {
      pushTimers.delete(name)
      const latest = pendingValues.get(name)
      pendingValues.delete(name)
      if (latest === undefined) return

      const run = async () => {
        const { error } = await supabase
          .from('store')
          .upsert(
            { key: name, value: latest, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          )
        if (error) {
          lastSynced.delete(name)
          console.warn(`[supabase] could not save "${name}": ${error.message}`)
        }
      }

      const previous = pushChains.get(name) || Promise.resolve()
      const next = previous.then(run, run)
      pushChains.set(name, next)
      next.finally(() => {
        if (pushChains.get(name) === next) pushChains.delete(name)
      })
    }, 200)
  )
}

/** Writes locally right away and mirrors to Supabase when configured. */
export const saveStore = (name, value) => {
  const ok = writeLocal(name, value)
  if (!ok) return false
  if (!isSupabaseConfigured) return true
  // Until the first pull finishes, only cache locally; otherwise bundled
  // defaults would overwrite the shared data before it has been fetched.
  if (!remoteReady) return true
  // Never try to write admin-only rows without an authenticated admin; RLS
  // would reject the request and the storefront would log errors on every load.
  if (ADMIN_KEYS.has(name) && !adminSignedIn) return true
  let json = ''
  try {
    json = stableStringify(value)
  } catch {
    return true
  }
  if (lastSynced.get(name) === json) return true
  lastSynced.set(name, json)
  pushRow(name, value)
  return true
}

/** Pulls remote rows into localStorage. Returns the list of keys that changed. */
export const pullStore = async () => {
  if (!supabase) {
    remoteReady = true
    return []
  }
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    adminSignedIn = sessionData?.session?.user?.app_metadata?.role === 'admin'
  } catch {
    adminSignedIn = false
  }
  const { data, error } = await supabase.from('store').select('key, value')
  if (error || !Array.isArray(data)) {
    if (error) console.warn(`[supabase] could not load store: ${error.message}`)
    remoteReady = true
    return []
  }

  const remoteKeys = new Set(data.map((row) => row.key))
  const changed = []

  data.forEach((row) => {
    if (!(row.key in LOCAL_KEYS)) return
    const current = readLocal(row.key)
    if (stableStringify(current) === stableStringify(row.value)) {
      remember(row.key, row.value)
      return
    }
    if (writeLocal(row.key, row.value)) {
      remember(row.key, row.value)
      changed.push(row.key)
    }
  })

  // First run with an empty project: upload the bundled defaults once.
  Object.keys(LOCAL_KEYS).forEach((name) => {
    if (remoteKeys.has(name)) return
    if (ADMIN_KEYS.has(name) && !adminSignedIn) return
    const local = readLocal(name)
    if (local === null || local === undefined) return
    remember(name, local)
    pushRow(name, local)
  })

  remoteReady = true
  return changed
}

/** Live updates for other browsers/tabs. Returns an unsubscribe function. */
export const subscribeStore = (onChange) => {
  if (!supabase) return () => {}
  let channel
  try {
    channel = supabase
      .channel('store-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store' }, (payload) => {
        const row = payload.new
        if (!row || !(row.key in LOCAL_KEYS)) return
        remember(row.key, row.value)
        if (writeLocal(row.key, row.value)) onChange?.(row.key)
      })
      .subscribe()
  } catch {
    return () => {}
  }
  return () => {
    try {
      supabase.removeChannel(channel)
    } catch {
      /* ignore */
    }
  }
}
