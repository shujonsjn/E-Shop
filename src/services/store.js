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

const remember = (name, value) => {
  try {
    lastSynced.set(name, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

const pushRow = (name, value) => {
  if (!supabase) return
  supabase
    .from('store')
    .upsert({ key: name, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .then(({ error }) => {
      if (error) {
        lastSynced.delete(name)
        console.warn(`[supabase] could not save "${name}": ${error.message}`)
      }
    })
}

/** Writes locally right away and mirrors to Supabase when configured. */
export const saveStore = (name, value) => {
  const ok = writeLocal(name, value)
  if (!ok) return false
  if (!isSupabaseConfigured) return true
  // Until the first pull finishes, only cache locally; otherwise bundled
  // defaults would overwrite the shared data before it has been fetched.
  if (!remoteReady) return true
  let json = ''
  try {
    json = JSON.stringify(value)
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
    if (JSON.stringify(current) === JSON.stringify(row.value)) {
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
