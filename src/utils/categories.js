// Helpers for the single category source of truth: the Mega Menu tree
// (main category -> subcategories -> brands/types).

export const getCategoryGroups = (menu = []) =>
  (Array.isArray(menu) ? menu : [])
    .map((main) => ({
      name: (main?.name || '').trim(),
      children: (main?.children || [])
        .map((sub) => (sub?.name || '').trim())
        .filter(Boolean),
    }))
    .filter((group) => group.name)

// Unique category names in tree order (main category first, then its subcategories).
export const getUniqueCategoryNames = (menu = []) => {
  const seen = new Set()
  const names = []

  const push = (name) => {
    const clean = (name || '').trim()
    const key = clean.toLowerCase()
    if (!clean || key === 'all' || seen.has(key)) return
    seen.add(key)
    names.push(clean)
  }

  getCategoryGroups(menu).forEach((group) => {
    push(group.name)
    group.children.forEach(push)
  })

  return names
}

// A main category also matches the products assigned to its subcategories.
export const getCategoryMatchSet = (menu = [], selected = '') => {
  const key = (selected || '').trim().toLowerCase()
  const group = getCategoryGroups(menu).find((g) => g.name.toLowerCase() === key)

  if (!group) return new Set([key])

  return new Set([group.name, ...group.children].map((name) => name.toLowerCase()))
}
