import { categories as defaultCategories } from '../data/catalog'

const STORAGE_KEY = 'gb_admin_categories'
const DELETED_KEY = 'gb_admin_categories_deleted'
const MIGRATION_KEY = 'gb_categories_fix_v2'

const runMigration = () => {
  try {
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

    const map = new Map()

    // Add default categories (skip deleted)
    defaultCategories.forEach((c) => {
      if (!c || !c.slug) return
      if (c.slug === 'showpiece') {
        map.set(c.slug, {
          ...c,
          children: Array.isArray(c.children) ? [...c.children] : [],
        })
        return
      }
      if (deleted.includes(c.slug)) return
      map.set(c.slug, {
        ...c,
        children: Array.isArray(c.children) ? [...c.children] : [],
      })
    })

    if (!saved) {
      return Array.from(map.values())
    }

    const adminCats = JSON.parse(saved)
    if (!Array.isArray(adminCats)) return Array.from(map.values())

    // Merge admin categories
    if (Array.isArray(adminCats)) {
      adminCats.forEach((ac) => {
        if (!ac.slug) return
        if (ac.slug === 'showpiece') return
        if (deleted.includes(ac.slug)) return

        if (map.has(ac.slug)) {
          const existing = map.get(ac.slug)
          const existingChildrenMap = new Map(
            (existing.children || []).map((ch) => [ch.slug, { ...ch }])
          )

          if (Array.isArray(ac.subcategoryList) && ac.subcategoryList.length > 0) {
            ac.subcategoryList.forEach((sub) => {
              if (!sub) return
              const slug = typeof sub === 'string' ? sub : sub.slug || sub.name
              if (!slug) return
              existingChildrenMap.set(slug, {
                slug,
                name: typeof sub === 'string' ? sub : sub.name || slug,
                name_bn: typeof sub === 'string' ? sub : sub.name_bn || sub.name || slug,
              })
            })
          } else if (Array.isArray(ac.subcategories)) {
            ac.subcategories.forEach((sub) => {
              if (!sub) return
              if (!existingChildrenMap.has(sub)) {
                existingChildrenMap.set(sub, {
                  slug: sub,
                  name: sub,
                  name_bn: sub,
                })
              }
            })
          }

          map.set(ac.slug, {
            ...existing,
            name: ac.name || existing.name,
            name_bn: ac.name_bn || existing.name_bn || ac.name,
            image: /cdn\.ghorerbazar\.com/.test(ac.image || '') ? existing.image : (ac.image || existing.image),
            children: Array.from(existingChildrenMap.values()),
          })
        } else {
          const children = Array.isArray(ac.subcategoryList) && ac.subcategoryList.length > 0
            ? ac.subcategoryList.map((sub) => {
                if (typeof sub === 'string') return { slug: sub.toLowerCase().replace(/\s+/g, '-'), name: sub, name_bn: sub }
                return { slug: sub.slug || sub.name, name: sub.name, name_bn: sub.name_bn || sub.name }
              })
            : (ac.subcategories || [])
                .filter(Boolean)
                .map((sub) => ({
                  slug: sub.toLowerCase ? sub.toLowerCase().replace(/\s+/g, '-') : sub,
                  name: sub,
                  name_bn: sub,
                }))
          map.set(ac.slug, {
            id: ac.id || Date.now(),
            slug: ac.slug,
            name: ac.name,
            name_bn: ac.name_bn || ac.name,
            image: /cdn\.ghorerbazar\.com/.test(ac.image || '') ? '' : (ac.image || ''),
            children: children.filter((c) => c.slug),
          })
        }
      })
    }

    return Array.from(map.values())
  } catch {
    return defaultCategories
  }
}
