const STORAGE_KEY = 'gb_admin_brands'

export const getMergedBrands = () => {
  // Old deleted demo brands pointed at a CDN that no longer serves them.
  // Drop such a logo instead of swapping in another brand's demo logo, which
  // made it look like the old demo brands had come back.
  const sanitize = (brand) => {
    if (!brand || typeof brand !== 'object') return brand
    const logo = String(brand.logo || '')
    if (!logo || logo.includes('cdn.ghorerbazar.com')) {
      return { ...brand, logo: '' }
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
