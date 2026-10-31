import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()
export const LANG_KEY = 'gb_lang'

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      return saved === 'bn' ? 'bn' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang)
      document.documentElement.lang = lang
    } catch {
      /* ignore */
    }
  }, [lang])

  const value = useMemo(() => {
    const setLang = (next) => setLangState(next === 'bn' ? 'bn' : 'en')
    const toggle = () => setLangState((prev) => (prev === 'en' ? 'bn' : 'en'))
    const t = (key, vars) => {
      let text = translations[lang]?.[key] ?? translations.en?.[key] ?? key
      if (vars && typeof text === 'string') {
        Object.entries(vars).forEach(([name, val]) => {
          text = text.split(`{${name}}`).join(String(val))
        })
      }
      return text
    }
    const tx = (en, bn) => (lang === 'bn' && bn ? bn : en)
    return { lang, isBn: lang === 'bn', setLang, toggle, t, tx }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
