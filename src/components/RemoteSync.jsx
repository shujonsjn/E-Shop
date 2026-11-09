import { useEffect } from 'react'
import { pullStore, subscribeStore } from '../services/store'

// Loads shared data from Supabase (if configured) and keeps every open tab in
// sync. Falls back silently to localStorage when no project is connected.
const RemoteSync = () => {
  useEffect(() => {
    let alive = true

    const notify = (keys) => {
      if (!alive || !keys || keys.length === 0) return
      window.dispatchEvent(new CustomEvent('gb:remote', { detail: keys }))
      // Categories/brands components still listen for the classic storage
      // event; re-fire it so an open tab refreshes without a reload.
      if (keys.some((key) => key === 'categories' || key === 'brands' || key === 'pages')) {
        window.dispatchEvent(new Event('storage'))
      }
    }

    pullStore()
      .then(notify)
      .catch(() => {})

    const unsubscribe = subscribeStore((key) => notify([key]))
    return () => {
      alive = false
      unsubscribe()
    }
  }, [])

  return null
}

export default RemoteSync
