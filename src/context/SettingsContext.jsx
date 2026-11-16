import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { saveStore } from '../services/store'
import { isRealSocialUrl } from '../utils/media'

const SettingsContext = createContext()

const STORAGE_KEY = 'gb_settings'

import { heroSlides as defaultHeroSlides, sideBanners as defaultSideBanners, promoBanners as defaultPromoBanners } from '../data/catalog'

const defaultHomeLayout = [
  { id: 'hero', type: 'hero', enabled: true, order: 0 },
  { id: 'trust', type: 'trust', enabled: true, order: 1 },
  { id: 'categories', type: 'categories', enabled: true, order: 2, title: 'Featured Categories', subtitle: 'Shop by your favorite category', href: '/shop', linkLabel: 'View All Categories' },
  { id: 'flash', type: 'flash', enabled: true, order: 3 },
  { id: 'top', type: 'productRow', enabled: true, order: 4, title: 'Top Selling Products', subtitle: 'Most popular items this week', titleBn: 'সর্বাধিক বিক্রিত পণ্য', subtitleBn: 'এই সপ্তাহের সবচেয়ে জনপ্রিয় পণ্য', href: '/shop?sort=best', linkLabel: 'View All', filter: 'topSelling', limit: 4 },
  { id: 'brands', type: 'brands', enabled: true, order: 5 },
  { id: 'row_new', type: 'productRow', enabled: true, order: 6, title: 'New Arrivals', titleBn: 'নতুন সংগ্রহ', subtitle: 'Fresh picks added to the collection', subtitleBn: 'সংগ্রহে নতুন যোগ হওয়া পণ্য', href: '/shop', linkLabel: 'View All', filter: 'featured', limit: 5 },
  { id: 'promo', type: 'promo', enabled: true, order: 11 },
  { id: 'testimonials', type: 'testimonials', enabled: true, order: 12 },
  { id: 'cta', type: 'cta', enabled: true, order: 13 },
]

const defaultSettings = {
  // Site info
  siteName: 'Gift Shop',
  siteTagline: 'Your Ultimate Choice for Perfect Gifts',
  siteTagline_bn: 'নিখুঁত উপহার ও আকর্ষণীয় শোপিসের জন্য আপনার সেরা পছন্দ',
  siteDescription: '',
  siteLogo: '',
  siteEmail: '',
  sitePhone: '+8801708429595',
  siteAddress: 'Dhaka, Bangladesh',
  whatsappNumber: '+8801708429595',
  callOrderNumber: '+8801708429595',
  facebook: '',
  instagram: '',
  youtube: '',
  // Leave empty to show the free-delivery line generated from the setting below.
  topBarText: '',
  topBarText_bn: '',
  
  // Home Layout
  homeLayout: defaultHomeLayout,

  // Page top banners (shown on Shop/Category, Offer Zone and Brands pages)
  pageBanners: {
    shop: '',
    offer: '',
    brands: '',
  },
  
  // Site Content
  siteContent: {
    heroSlides: defaultHeroSlides,
    sideBanners: defaultSideBanners,
    promoBanners: defaultPromoBanners,
    footerAbout: 'Gift Shop is your trusted online gift & showpiece store in Bangladesh. We deliver carefully selected gifts, showpieces and home décor to your doorstep.',
    footerAbout_bn: 'গিফট শপ বাংলাদেশের বিশ্বস্ত অনলাইন গিফট ও শোপিস স্টোর। আমরা যত্নে বাছাই করা উপহার, শোপিস ও হোম ডেকোর আপনার দরজায় পৌঁছে দিই।',
    footerCopyright: `© ${new Date().getFullYear()} Gift Shop. All rights reserved.`,
    homeSectionTitle: 'Our Products',
    newsletterText: 'Subscribe to get updates on offers and new products',
    ctaTitle: 'Find the perfect gift today',
    ctaTitleBn: 'আজই নিখুঁত উপহার খুঁজে নিন',
    ctaSubtitle: 'Free delivery on orders above ৳1,000 · Cash on delivery available',
    ctaSubtitleBn: '৳১,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি · ক্যাশ অন ডেলিভারি আছে',
    ctaButton: 'Shop Now',
    ctaButtonBn: 'এখনই কিনুন',
    ctaHref: '/shop',
  },
  
  // Delivery
  deliveryCharges: [
    { id: 1, area: 'Inside Dhaka', charge: 60 },
    { id: 2, area: 'Outside Dhaka', charge: 120 },
  ],
  // Orders at or above this amount ship free. 0 disables the offer.
  freeDeliveryThreshold: 1000,
  deliverySlots: [
    { id: 1, label: 'সকাল ১০টা - ১২টা', enabled: true },
    { id: 2, label: 'দুপুর ১২টা - ২টা', enabled: true },
    { id: 3, label: 'বিকেল ৪টা - ৬টা', enabled: true },
    { id: 4, label: 'সন্ধ্যা ৬টা - ৮টা', enabled: true },
  ],
  
  // Payment
  paymentMethods: {
    cod: { enabled: true, name: 'Cash on Delivery' },
    bkash: {
      enabled: true,
      name: 'bKash',
      number: '01321208940',
      instructions: 'Send money to this bKash number, then enter your sender number and transaction ID below.',
    },
    nagad: {
      enabled: true,
      name: 'Nagad',
      number: '01321208940',
      instructions: 'Send money to this Nagad number, then enter your sender number and transaction ID below.',
    },
    rocket: { enabled: true, name: 'Rocket', number: '', instructions: '' },
    card: { enabled: false, name: 'Debit/Credit Card' },
  },
  
  // Coupons
  coupons: [],
  
  // Marketing
  notifications: [],
  
  // Expenses
  expenses: [],
  
  // Staff/roles
  staff: [],
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

const mergeSavedSettings = (parsed) => {
  const merged = JSON.parse(JSON.stringify({ ...defaultSettings, ...parsed }))
  merged.siteContent = JSON.parse(JSON.stringify({ ...defaultSettings.siteContent, ...(parsed.siteContent || {}) }))
  merged.paymentMethods = { ...defaultSettings.paymentMethods, ...(parsed.paymentMethods || {}) }
  merged.pageBanners = { ...defaultSettings.pageBanners, ...(parsed.pageBanners || {}) }
  // Leftover demo contact data from the bundled template must never surface on
  // a store that has its own identity.
  if (typeof merged.siteEmail === 'string' && /@ghorerbazar\.(com|demo)$/i.test(merged.siteEmail.trim())) {
    merged.siteEmail = ''
  }
  // Placeholder social links (https://facebook.com/ and friends) look live but
  // dump visitors on the network home page, so treat them as unset.
  ;['facebook', 'instagram', 'youtube'].forEach((key) => {
    if (!isRealSocialUrl(merged[key])) merged[key] = ''
  })
  // Earlier versions saved a half-baked copyright such as
  // "c 2026 . All rights Giftshop.com" and grocery copy in the footer.
  if (
    typeof merged.siteContent.footerCopyright === 'string' &&
    /^\s*[©c]\s*\d{4}\s*\./i.test(merged.siteContent.footerCopyright)
  ) {
    merged.siteContent.footerCopyright = `© ${new Date().getFullYear()} ${merged.siteName}. All rights reserved.`
  }
  if (
    typeof merged.siteContent.footerAbout === 'string' &&
    (/grocery/i.test(merged.siteContent.footerAbout) ||
      /ghorer\s?bazar/i.test(merged.siteContent.footerAbout))
  ) {
    merged.siteContent.footerAbout = defaultSettings.siteContent.footerAbout
  }
  Object.keys(defaultSettings.paymentMethods).forEach((key) => {
    merged.paymentMethods[key] = {
      ...defaultSettings.paymentMethods[key],
      ...(parsed.paymentMethods?.[key] || {}),
    }
    if (!merged.paymentMethods[key].number) {
      merged.paymentMethods[key].number = defaultSettings.paymentMethods[key].number || ''
    }
  })
  // An explicitly saved (possibly empty) list wins, so deleting the last slide
  // or banner stays deleted instead of the bundled demo content coming back.
  if (Array.isArray(parsed.siteContent?.heroSlides)) {
    merged.siteContent.heroSlides = parsed.siteContent.heroSlides
  } else {
    merged.siteContent.heroSlides = JSON.parse(JSON.stringify(defaultSettings.siteContent.heroSlides))
  }
  if (Array.isArray(parsed.siteContent?.sideBanners)) {
    merged.siteContent.sideBanners = parsed.siteContent.sideBanners
  } else {
    merged.siteContent.sideBanners = JSON.parse(JSON.stringify(defaultSettings.siteContent.sideBanners))
  }
  if (Array.isArray(parsed.siteContent?.promoBanners)) {
    merged.siteContent.promoBanners = parsed.siteContent.promoBanners
  } else {
    merged.siteContent.promoBanners = JSON.parse(JSON.stringify(defaultSettings.siteContent.promoBanners))
  }
  if (!Array.isArray(merged.homeLayout) || merged.homeLayout.length === 0) {
    merged.homeLayout = JSON.parse(JSON.stringify(defaultHomeLayout))
  } else {
    merged.homeLayout = merged.homeLayout.map((item, idx) => ({ order: idx, enabled: true, ...item }))
  }
  return merged
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return mergeSavedSettings(JSON.parse(saved))
      }
    } catch {
      /* ignore */
    }
    return JSON.parse(JSON.stringify(defaultSettings))
  })

  const firstRun = useRef(true)

  useEffect(() => {
    if (settings.siteName) {
      document.title = `${settings.siteName} — Online Shopping in Bangladesh`
      const setMeta = (selector, value) => {
        const el = document.querySelector(selector)
        if (el && value) el.setAttribute('content', value)
      }
      const description =
        settings.siteDescription ||
        'Shop gifts, showpieces, watches, bags and shoes online in Bangladesh with fast home delivery from ' +
          `${settings.siteName}.`
      setMeta('meta[name="description"]', description)
      setMeta('meta[property="og:title"]', settings.siteName)
      setMeta('meta[property="og:description"]', description)
      setMeta('meta[property="og:site_name"]', settings.siteName)

      // Canonical / og:url follow the current page so shared links and search
      // engines point at the real address instead of a stale demo one.
      const pageUrl = `${window.location.origin}${window.location.pathname}`
      const setLink = (rel, href) => {
        let el = document.head.querySelector(`link[rel="${rel}"]`)
        if (!el) {
          el = document.createElement('link')
          el.setAttribute('rel', rel)
          document.head.appendChild(el)
        }
        el.setAttribute('href', href)
      }
      setLink('canonical', pageUrl)
      setMeta('meta[property="og:url"]', pageUrl)
      const ogImage =
        settings.siteLogo && /^https?:/i.test(settings.siteLogo)
          ? settings.siteLogo
          : `${window.location.origin}/images/hero/hero-1.jpg`
      setMeta('meta[property="og:image"]', ogImage)
    }
    // The first run only reflects data that was just loaded from the cloud;
    // saving it again would race the pre-render pull.
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    saveStore('settings', settings)
  }, [settings])

  useEffect(() => {
    const reload = (event) => {
      const keys = event?.detail
      if (Array.isArray(keys) && keys.length > 0 && !keys.includes('settings')) return
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setSettings(mergeSavedSettings(JSON.parse(saved)))
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('gb:remote', reload)
    return () => window.removeEventListener('gb:remote', reload)
  }, [])

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  // Delivery charges
  const addDeliveryCharge = (charge) => {
    setSettings((prev) => ({
      ...prev,
      deliveryCharges: [...prev.deliveryCharges, { ...charge, id: Date.now() }],
    }))
  }
  const updateDeliveryCharge = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      deliveryCharges: prev.deliveryCharges.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }))
  }
  const deleteDeliveryCharge = (id) => {
    setSettings((prev) => ({
      ...prev,
      deliveryCharges: prev.deliveryCharges.filter((c) => c.id !== id),
    }))
  }

  // Delivery slots
  const addDeliverySlot = (slot) => {
    setSettings((prev) => ({
      ...prev,
      deliverySlots: [...prev.deliverySlots, { ...slot, id: Date.now() }],
    }))
  }
  const updateDeliverySlot = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      deliverySlots: prev.deliverySlots.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }
  const deleteDeliverySlot = (id) => {
    setSettings((prev) => ({
      ...prev,
      deliverySlots: prev.deliverySlots.filter((s) => s.id !== id),
    }))
  }

  // Payment methods
  const updatePaymentMethod = (key, updates) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [key]: { ...prev.paymentMethods[key], ...updates },
      },
    }))
  }

  // Coupons
  const addCoupon = (coupon) => {
    setSettings((prev) => ({
      ...prev,
      coupons: [...prev.coupons, { ...coupon, id: Date.now(), usedCount: 0, createdAt: new Date().toISOString() }],
    }))
  }
  const updateCoupon = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      coupons: prev.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }))
  }
  const deleteCoupon = (id) => {
    setSettings((prev) => ({
      ...prev,
      coupons: prev.coupons.filter((c) => c.id !== id),
    }))
  }

  // Notifications
  const addNotification = (notif) => {
    setSettings((prev) => ({
      ...prev,
      notifications: [{ ...notif, id: Date.now(), createdAt: new Date().toISOString() }, ...prev.notifications],
    }))
  }
  const deleteNotification = (id) => {
    setSettings((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }))
  }

  // Expenses
  const addExpense = (expense) => {
    setSettings((prev) => ({
      ...prev,
      expenses: [{ ...expense, id: Date.now(), createdAt: new Date().toISOString() }, ...prev.expenses],
    }))
  }
  const deleteExpense = (id) => {
    setSettings((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }))
  }

  // Staff
  const addStaff = (staff) => {
    setSettings((prev) => ({
      ...prev,
      staff: [...prev.staff, { ...staff, id: Date.now(), createdAt: new Date().toISOString() }],
    }))
  }
  const updateStaff = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }
  const deleteStaff = (id) => {
    setSettings((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== id),
    }))
  }

  // Site Content
  const updateSiteContent = (updates) => {
    setSettings((prev) => ({
      ...prev,
      siteContent: { ...prev.siteContent, ...updates },
    }))
  }
  const addHeroSlide = (slide) => {
    setSettings((prev) => {
      const slides = Array.isArray(prev.siteContent?.heroSlides) ? [...prev.siteContent.heroSlides] : []
      const updated = {
        ...prev,
        siteContent: {
          ...(prev.siteContent || {}),
          heroSlides: [...slides, { ...slide, id: Date.now() + Math.random() }],
        },
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }
  const updateHeroSlide = (id, updates) => {
    setSettings((prev) => {
      const slides = Array.isArray(prev.siteContent?.heroSlides) ? prev.siteContent.heroSlides : []
      const updated = {
        ...prev,
        siteContent: {
          ...(prev.siteContent || {}),
          heroSlides: slides.map((s) => (String(s.id) === String(id) ? { ...s, ...updates } : s)),
        },
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }
  const deleteHeroSlide = (id) => {
    setSettings((prev) => {
      const slides = Array.isArray(prev.siteContent?.heroSlides) ? prev.siteContent.heroSlides : []
      const updated = {
        ...prev,
        siteContent: {
          ...(prev.siteContent || {}),
          heroSlides: slides.filter((s) => String(s.id) !== String(id)),
        },
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }
  const updateSideBanner = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      siteContent: {
        ...prev.siteContent,
        sideBanners: prev.siteContent.sideBanners.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      },
    }))
  }
  const updatePromoBanner = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      siteContent: {
        ...prev.siteContent,
        promoBanners: prev.siteContent.promoBanners.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      },
    }))
  }

  // Home layout
  const updateHomeLayout = (layout) => {
    setSettings((prev) => ({ ...prev, homeLayout: layout }))
  }
  const reorderHomeLayout = (newLayout) => {
    const reordered = newLayout.map((item, idx) => ({ ...item, order: idx, enabled: item.enabled !== false }))
    setSettings((prev) => ({ ...prev, homeLayout: reordered }))
  }
  const toggleHomeSection = (id) => {
    setSettings((prev) => {
      const layout = prev.homeLayout || defaultHomeLayout
      return {
        ...prev,
        homeLayout: layout.map((item) =>
          item.id === id ? { ...item, enabled: item.enabled === false ? true : false } : item
        ),
      }
    })
  }
  const updateHomeSection = (id, updates) => {
    setSettings((prev) => {
      const layout = prev.homeLayout || defaultHomeLayout
      return {
        ...prev,
        homeLayout: layout.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }
    })
  }

  const value = {
    settings,
    updateSettings,
    updateSiteContent,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    updateSideBanner,
    updatePromoBanner,
    addDeliveryCharge,
    updateDeliveryCharge,
    deleteDeliveryCharge,
    addDeliverySlot,
    updateDeliverySlot,
    deleteDeliverySlot,
    updatePaymentMethod,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addNotification,
    deleteNotification,
    addExpense,
    deleteExpense,
    addStaff,
    updateStaff,
    deleteStaff,
    updateHomeLayout,
    reorderHomeLayout,
    toggleHomeSection,
    updateHomeSection,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
