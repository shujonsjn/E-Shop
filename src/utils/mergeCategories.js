import { categories as defaultCategories } from '../data/catalog'

const STORAGE_KEY = 'gb_admin_categories'

// Kept for backwards compatibility. Older builds tried to "repair" the
// category list by restoring the whole demo catalog whenever every demo
// category had been deleted — which is exactly why deleted categories kept
// coming back. Nothing should be repaired automatically anymore.
export const runCategoryMigration = () => {}

export const getMergedCategories = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    const safeImage = (value, fallback) => {
      if (!value) return fallback
      if (typeof value !== 'string') return fallback
      if (/cdn\.ghorerbazar\.com/.test(value)) return fallback
      return value
    }

    const buildChildren = (c) => {
      if (Array.isArray(c.children) && c.children.length > 0) {
        return c.children.map((ch) => ({ ...ch }))
      }
      const list = Array.isArray(c.subcategoryList)
        ? c.subcategoryList
        : Array.isArray(c.subcategories)
          ? c.subcategories
          : []
      return list
        .filter(Boolean)
        .map((sub) => {
          if (typeof sub === 'string') {
            return {
              slug: sub.toLowerCase().replace(/\s+/g, '-'),
              name: sub,
              name_bn: sub,
            }
          }
          return {
            ...sub,
            slug: sub.slug || String(sub.name || '').toLowerCase().replace(/\s+/g, '-'),
            name: sub.name || sub.slug || '',
            name_bn: sub.name_bn || sub.name || sub.slug || '',
          }
        })
        .filter((sub) => sub.slug)
    }

    // Once the admin has saved categories, that list is the source of truth
    // (synced through Supabase). The bundled demo categories are only used
    // before anything is saved, so deleted categories never come back — not
    // even on another device/phone.
    if (saved) {
      const adminCats = JSON.parse(saved)
      if (Array.isArray(adminCats)) {
        return adminCats
          .filter((c) => c && c.slug)
          .map((c) => ({
            ...c,
            image: safeImage(c.image, c.image),
            children: buildChildren(c),
          }))
      }
    }
    // Nothing saved yet: fall back to the bundled demo categories.
    return defaultCategories
      .filter((c) => c && c.slug)
      .map((c) => ({
        ...c,
        image: safeImage(c.image, c.image),
        children: Array.isArray(c.children) ? c.children.map((ch) => ({ ...ch })) : [],
      }))
  } catch {
    return []
  }
}
