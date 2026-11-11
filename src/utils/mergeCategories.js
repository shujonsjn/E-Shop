import { categories as defaultCategories } from '../data/catalog'

const STORAGE_KEY = 'gb_admin_categories'
const DELETED_KEY = 'gb_admin_categories_deleted'
const MIGRATION_KEY = 'gb_categories_fix_v2'

const runMigration = () => {  try {
    if (localStorage.getItem(MIGRATION_KEY)) return
    const defaultSlugs = defaultCategories
      .map((c) => c && c.slug)
      .filter((slug) => slug && slug !== 'showpiece')
    let deleted = []
    try {
      deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
    } catch {
      deleted = []
    }
    const allDeleted = Array.isArray(deleted) && defaultSlugs.every((slug) => deleted.includes(slug))
    // Safety net: an earlier build could mark every default category as deleted,
    // which left the storefront with a single category. Restore the catalog.
    if (allDeleted) {
      localStorage.removeItem(DELETED_KEY)
      localStorage.removeItem(STORAGE_KEY)
    }
    localStorage.setItem(MIGRATION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export const runCategoryMigration = runMigration

export const getMergedCategories = () => {
  runMigration()
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    let deleted = []
    try {
      deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
    } catch {
      deleted = []
    }
    if (!Array.isArray(deleted)) deleted = []

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
      if (Array.isArray(adminCats) && adminCats.length > 0) {
        return adminCats
          .filter((c) => c && c.slug && (c.slug === 'showpiece' || !deleted.includes(c.slug)))
          .map((c) => ({
            ...c,
            image: safeImage(c.image, c.image),
            children: buildChildren(c),
          }))
      }
    }
    // Nothing saved yet: fall back to the bundled demo categories.
    return defaultCategories
      .filter((c) => c && c.slug && (c.slug === 'showpiece' || !deleted.includes(c.slug)))
      .map((c) => ({
        ...c,
        image: safeImage(c.image, c.image),
        children: Array.isArray(c.children) ? c.children.map((ch) => ({ ...ch })) : [],
      }))
  } catch {
    return defaultCategories
  }
}
