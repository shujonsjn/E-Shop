import { createContext, useContext, useEffect, useState } from 'react'
import { saveStore } from '../services/store'

const SettingsContext = createContext()

const STORAGE_KEY = 'gb_settings'

import { heroSlides as defaultHeroSlides, sideBanners as defaultSideBanners, promoBanners as defaultPromoBanners } from '../data/catalog'

const defaultHomeLayout = [
  { id: 'hero', type: 'hero', enabled: true, order: 0 },
  { id: 'trust', type: 'trust', enabled: true, order: 1 },
  { id: 'categories', type: 'categories', enabled: true, order: 2, title: 'Featured Categories', subtitle: 'Shop by your favorite category', href: '/shop', linkLabel: 'View All Categories' },
  { id: 'flash', type: 'flash', enabled: true, order: 3 },
  { id: 'top', type: 'productRow', enabled: true, order: 4, title: 'Top Selling Products', subtitle: 'Most popular items this week', href: '/shop?sort=best', linkLabel: 'View All', filter: 'topSelling', limit: 4 },
  { id: 'brands', type: 'brands', enabled: true, order: 5 },
  { id: 'row_honey', type: 'productRow', enabled: true, order: 6, title: 'All Natural Honey', titleBn: 'খাঁটি প্রাকৃতিক মধু', subtitle: 'Raw, unfiltered and collected from trusted beekeepers', subtitleBn: 'খাঁটি, আনফিল্টারড — বিশ্বস্ত মৌচাষীদের কাছ থেকে', href: '/collections/honey', linkLabel: 'View All', filter: 'category', category: 'honey', limit: 5 },
  { id: 'row_dates', type: 'productRow', enabled: true, order: 7, title: 'Premium Dates', titleBn: 'প্রিমিয়াম খেজুর', subtitle: 'Soft, plump dates for iftar, snacking and gifting', subtitleBn: 'ইফতার, নাস্তা ও উপহারের জন্য নরম-মোলায়েম খেজুর', href: '/collections/dates', linkLabel: 'View All', filter: 'category', category: 'dates', limit: 5 },
  { id: 'row_cooking', type: 'productRow', enabled: true, order: 8, title: 'Cooking Essentials', titleBn: 'রান্নার প্রয়োজনীয়', subtitle: 'Ghee, cooking oil and everyday pantry staples', subtitleBn: 'ঘি, রান্নার তেল ও প্রতিদিনের নিত্যপণ্য', href: '/collections/oil-ghee', linkLabel: 'View All', filter: 'category', category: 'oil-ghee', limit: 5 },
  { id: 'row_organic', type: 'productRow', enabled: true, order: 9, title: 'Organic Certified', titleBn: 'অর্গানিক সার্টিফাইড', subtitle: 'Grown and processed without synthetic chemicals', subtitleBn: 'কৃত্রিম রাসায়নিক ছাড়া উৎপাদিত ও প্রসেসড', href: '/shop?flag=organic', linkLabel: 'View All', filter: 'organic', limit: 5 },
  { id: 'row_featured', type: 'productRow', enabled: true, order: 10, title: 'Just For You', titleBn: 'শুধু আপনার জন্য', subtitle: 'Handpicked products just for you', subtitleBn: 'আপনার জন্য বাছাই করা পণ্যসমূহ', href: '/shop', linkLabel: 'View All', filter: 'featured', limit: 5 },
  { id: 'promo', type: 'promo', enabled: true, order: 11 },
  { id: 'testimonials', type: 'testimonials', enabled: true, order: 12 },
  { id: 'cta', type: 'cta', enabled: true, order: 13 },
]

const defaultSettings = {
  // Site info
  siteName: 'GhorerBazar',
  siteLogo: '',
  siteEmail: 'info@ghorerbazar.com',
  sitePhone: '+8809642922922',
  siteAddress: 'Dhaka, Bangladesh',
  whatsappNumber: '+8801321208940',
  callOrderNumber: '+8809642922922',
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  youtube: 'https://youtube.com/',
  topBarText: 'Free Delivery on Orders Above ৳1000',
  
  // Home Layout
  homeLayout: defaultHomeLayout,
  
  // Site Content
  siteContent: {
    heroSlides: defaultHeroSlides,
    sideBanners: defaultSideBanners,
    promoBanners: defaultPromoBanners,
    footerAbout: 'GhorerBazar is your trusted online grocery store in Bangladesh. We deliver fresh, pure and quality products right to your doorstep.',
    footerCopyright: '© 2026 GhorerBazar. All rights reserved.',
    homeSectionTitle: 'Our Products',
    newsletterText: 'Subscribe to get updates on offers and new products',
  },
  
  // Delivery
  deliveryCharges: [
    { id: 1, area: 'Inside Dhaka', charge: 60 },
    { id: 2, area: 'Outside Dhaka', charge: 120 },
  ],
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
  flashSales: [],
  comboOffers: [],
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
  Object.keys(defaultSettings.paymentMethods).forEach((key) => {
    merged.paymentMethods[key] = {
      ...defaultSettings.paymentMethods[key],
      ...(parsed.paymentMethods?.[key] || {}),
    }
    if (!merged.paymentMethods[key].number) {
      merged.paymentMethods[key].number = defaultSettings.paymentMethods[key].number || ''
    }
  })
  if (Array.isArray(parsed.siteContent?.heroSlides) && parsed.siteContent.heroSlides.length > 0) {
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

  useEffect(() => {
    if (settings.siteName) {
      document.title = `${settings.siteName} — Online Shopping in Bangladesh`
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

  // Flash sales
  const addFlashSale = (sale) => {
    setSettings((prev) => ({
      ...prev,
      flashSales: [...prev.flashSales, { ...sale, id: Date.now() }],
    }))
  }
  const updateFlashSale = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      flashSales: prev.flashSales.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }
  const deleteFlashSale = (id) => {
    setSettings((prev) => ({
      ...prev,
      flashSales: prev.flashSales.filter((s) => s.id !== id),
    }))
  }

  // Combo offers
  const addComboOffer = (offer) => {
    setSettings((prev) => ({
      ...prev,
      comboOffers: [...prev.comboOffers, { ...offer, id: Date.now() }],
    }))
  }
  const updateComboOffer = (id, updates) => {
    setSettings((prev) => ({
      ...prev,
      comboOffers: prev.comboOffers.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    }))
  }
  const deleteComboOffer = (id) => {
    setSettings((prev) => ({
      ...prev,
      comboOffers: prev.comboOffers.filter((o) => o.id !== id),
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
    addFlashSale,
    updateFlashSale,
    deleteFlashSale,
    addComboOffer,
    updateComboOffer,
    deleteComboOffer,
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
