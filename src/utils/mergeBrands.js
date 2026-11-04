import { brands as defaultBrands } from '../data/catalog'

const STORAGE_KEY = 'gb_admin_brands'

export const getMergedBrands = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch {}
  return defaultBrands
}

export default getMergedBrands
