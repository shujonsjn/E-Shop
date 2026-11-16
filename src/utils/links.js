import { getMergedCategories } from './mergeCategories'

// Old banner and slider links pointed at demo categories (honey, dates,
// oil-ghee). If that category no longer exists the click would land on an empty
// page, so such links fall back to the shop instead.
export const safeHref = (href, fallback = '/shop') => {
  if (!href || typeof href !== 'string') return fallback
  const match = href.match(/^\/collections\/([^/?#]+)/)
  if (!match) return href
  try {
    const slugs = new Set()
    getMergedCategories().forEach((category) => {
      if (category?.slug) slugs.add(category.slug)
      ;(category?.children || []).forEach((child) => {
        if (child?.slug) slugs.add(child.slug)
      })
    })
    return slugs.has(match[1]) ? href : fallback
  } catch {
    return fallback
  }
}
