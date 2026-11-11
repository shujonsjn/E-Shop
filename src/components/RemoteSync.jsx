import { useEffect } from 'react'
import { subscribeStore } from '../services/store'

// Keeps every open tab in sync once the app has loaded. The first pull happens
// in main.jsx before React renders, so no cached list can race a user action.
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

    const unsubscribe = subscribeStore((key) => notify([key]))
    return () => {
      alive = false
      unsubscribe()
    }
  }, [])

  return null
}

export default RemoteSync
