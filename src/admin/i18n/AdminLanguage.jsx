import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ADMIN_EN, ADMIN_BN, ADMIN_EN_PATTERNS, ADMIN_BN_PATTERNS } from './adminEn'

const STORAGE_KEY = 'gb_admin_lang'

const readStoredLang = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'bn'
  } catch {
    return 'bn'
  }
}

let currentLang = readStoredLang()

export const getAdminLang = () => currentLang

/**
 * Translate one admin UI string. Unknown strings are returned untouched, so the
 * Bengali source in the components remains the fallback for every label.
 */
export const translateAdminString = (value, lang = currentLang) => {
  if (typeof value !== 'string' || value.length === 0) return value
  const trimmed = value.trim()
  if (!trimmed) return value
  // JSX keeps line breaks and indentation in longer help texts, so compare with
  // collapsed whitespace while preserving the original leading/trailing spacing.
  const core = trimmed.replace(/\s+/g, ' ')

  const dict = lang === 'en' ? ADMIN_EN : ADMIN_BN
  let result = dict[core]

  if (!result) {
    const patterns = lang === 'en' ? ADMIN_EN_PATTERNS : ADMIN_BN_PATTERNS
    for (let i = 0; i < patterns.length; i += 1) {
      const [pattern, replacement] = patterns[i]
      if (pattern.test(core)) {
        result = core.replace(pattern, replacement)
        break
      }
    }
  }

  if (!result || result === core) return value
  const leading = value.slice(0, value.length - value.trimStart().length)
  const trailing = value.slice(value.trimEnd().length)
  return `${leading}${result}${trailing}`
}

const ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt']

// Elements whose text content must never be rewritten (user input, code, raw data).
const TEXT_SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'KBD', 'SAMP'])
// Elements that have no translatable children but do have translatable attributes.
const ATTRIBUTE_ONLY_TAGS = new Set(['INPUT', 'TEXTAREA', 'IMG', 'AREA', 'META', 'LINK'])

const nearestSkip = (element) => {
  let node = element
  while (node && node !== document.body) {
    if (node.nodeType === 1 && node.hasAttribute('data-no-i18n')) return true
    node = node.parentElement
  }
  return false
}

const translateAttributes = (element, lang) => {
  for (const attr of ATTRIBUTES) {
    const current = element.getAttribute(attr)
    if (!current) continue
    const next = translateAdminString(current, lang)
    if (next !== current) element.setAttribute(attr, next)
  }
}

const translateNode = (node, lang) => {
  if (!node) return

  if (node.nodeType === 3) {
    const parent = node.parentElement
    if (!parent || TEXT_SKIP_TAGS.has(parent.tagName)) return
    if (nearestSkip(parent)) return
    const next = translateAdminString(node.nodeValue, lang)
    if (next !== node.nodeValue) node.nodeValue = next
    return
  }

  if (node.nodeType !== 1) return
  if (nearestSkip(node)) return

  translateAttributes(node, lang)
  if (ATTRIBUTE_ONLY_TAGS.has(node.tagName)) return

  for (let child = node.firstChild; child; child = child.nextSibling) {
    translateNode(child, lang)
  }
}

const translateTree = (root, lang) => {
  if (!root) return
  for (let child = root.firstChild; child; child = child.nextSibling) {
    translateNode(child, lang)
  }
}

const AdminLanguageContext = createContext({
  lang: currentLang,
  setLang: () => {},
  t: (value) => value,
})

export const useAdminLang = () => useContext(AdminLanguageContext)

export const AdminLanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = useCallback((next) => {
    const value = next === 'en' ? 'en' : 'bn'
    currentLang = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage can be blocked in private mode; the in-memory value still works */
    }
    setLangState(value)
  }, [])

  useEffect(() => {
    currentLang = lang
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'bn')
    document.documentElement.setAttribute('data-admin-lang', lang)
    return () => {
      // Leaving the panel should not leave the storefront marked as English.
      try {
        document.documentElement.setAttribute(
          'lang',
          localStorage.getItem('gb_lang') === 'bn' ? 'bn' : 'en'
        )
      } catch {
        document.documentElement.setAttribute('lang', 'en')
      }
    }
  }, [lang])

  useEffect(() => {
    // Native dialogs are not part of the DOM, so translate their text at call time.
    const nativeConfirm = window.confirm
    const nativeAlert = window.alert
    window.confirm = (message) => nativeConfirm(translateAdminString(String(message), lang))
    window.alert = (message) => nativeAlert(translateAdminString(String(message), lang))
    return () => {
      window.confirm = nativeConfirm
      window.alert = nativeAlert
    }
  }, [lang])

  useEffect(() => {
    // The admin pages are rendered from the body, and toast notifications live in
    // a portal on document.body as well, so the whole body is translated.
    const root = document.body
    translateTree(root, lang)

    let queued = false
    const flush = () => {
      queued = false
      translateTree(root, lang)
    }
    const observer = new MutationObserver(() => {
      if (queued) return
      queued = true
      // setTimeout (not requestAnimationFrame) so translation still runs when the
      // admin tab is in the background; rAF is paused in hidden tabs and the
      // panel would stay half-Bengali the moment the user switches back.
      setTimeout(flush, 0)
    })

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES,
    })

    return () => observer.disconnect()
  }, [lang])

  const value = useMemo(
    () => ({ lang, setLang, t: (text) => translateAdminString(text, lang) }),
    [lang, setLang]
  )

  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>
}

export default AdminLanguageProvider
