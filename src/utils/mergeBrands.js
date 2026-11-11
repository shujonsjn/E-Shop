const STORAGE_KEY = 'gb_admin_brands'

export const getMergedBrands = () => {
  const localLogos = new Set(['ghorerbazar', 'glarvest', 'khejuri', 'shosti-food', 'honeyraj'])
  const sanitize = (brand) => {
    if (!brand || typeof brand !== 'object') return brand
    const logo = String(brand.logo || '')
    if (!logo || logo.includes('cdn.ghorerbazar.com')) {
      const slug = brand.slug
      return { ...brand, logo: `/images/brands/${localLogos.has(slug) ? slug : 'ghorerbazar'}.svg` }
    }
    return brand
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed.map(sanitize)
      }
    }
  } catch {}
  // No saved brands: the storefront shows none. The bundled demo brands are
  // not used automatically, otherwise deleted demo data would return on every
  // new device.
  return []
}

export default getMergedBrands
