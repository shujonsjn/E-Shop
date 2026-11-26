import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useProducts } from '../../context/ProductsContext'
import { Plus, Edit2, Trash2, CloudUpload } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/admin/ImageUpload'
import AutoSaveNote from '../../components/admin/AutoSaveNote'
import { migrateDataUrls } from '../../services/media'

const AdminSiteContent = () => {
  const { settings, updateSettings, updateSiteContent, updateHeroSlide, addHeroSlide, deleteHeroSlide, updateSideBanner, deleteSideBanner, addSideBanner, updatePromoBanner, deletePromoBanner, addPromoBanner } = useSettings()
  const { products, replaceProducts } = useProducts()
  const [activeTab, setActiveTab] = useState('general')
  const [showHeroModal, setShowHeroModal] = useState(false)
  const [editingHero, setEditingHero] = useState(null)
  const [heroForm, setHeroForm] = useState({ image: '', href: '', alt: '' })
  const [migrating, setMigrating] = useState(false)

  // Moves every base64 image currently stored in settings/products into the
  // public `media` bucket and swaps them for their URL. This is what keeps the
  // shared store rows small and localStorage under the browser quota.
  const migrateImages = async () => {
    if (!window.confirm('সব base64 ছবি Supabase Storage-এ সরিয়ে নেওয়া হবে। চালিয়ে যাবেন?')) {
      return
    }
    setMigrating(true)
    const loading = toast.loading('ছবিগুলো আপলোড হচ্ছে…')
    try {
      const settingsResult = await migrateDataUrls(settings, 'settings')
      const productsResult = await migrateDataUrls(products, 'products')
      if (settingsResult.uploaded > 0) updateSettings(settingsResult.value)
      if (productsResult.uploaded > 0) replaceProducts(productsResult.value)
      const total = settingsResult.uploaded + productsResult.uploaded
      const failed = settingsResult.failed + productsResult.failed
      if (total === 0) {
        toast.error('কোনো base64 ছবি পাওয়া যায়নি', { id: loading })
      } else {
        toast.success(
          `${total}টি ছবি Storage-এ সরানো হয়েছে${failed ? ` · ${failed}টি ব্যর্থ` : ''}`,
          { id: loading, duration: 8000 }
        )
      }
    } catch {
      toast.error('ছবি সরানো যায়নি, আবার চেষ্টা করুন।', { id: loading })
    } finally {
      setMigrating(false)
    }
  }

  const handleHeroSubmit = (e) => {
    e.preventDefault()
    if (!heroForm.image) {
      toast.error('একটি ছবি যোগ করুন')
      return
    }
    if (editingHero) {
      updateHeroSlide(editingHero.id, { ...heroForm })
      toast.success('হিরো স্লাইড আপডেট হয়েছে')
    } else {
      addHeroSlide({ ...heroForm })
      toast.success('হিরো স্লাইড যোগ হয়েছে')
    }
    setTimeout(() => {
      setShowHeroModal(false)
      setEditingHero(null)
      setHeroForm({ image: '', href: '', alt: '' })
    }, 100)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">সাইট কনটেন্ট</h1>
        <p className="text-gray-500 mt-1">ব্যানার, লোগো, ফুটার ও অন্যান্য তথ্য পরিচালনা করুন</p>
      </div>

      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">ছবির সাইজ (আপলোডে স্বয়ংক্রিয় ঠিক হয়)</p>
        <p className="mt-1 text-xs text-blue-800">
          যেকোনো সাইজের ছবি আপলোড করলেও নিচের সাইজে অটো রিসাইজ/ক্রপ হয়ে সেভ হবে।
        </p>
        <div className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-blue-900 sm:grid-cols-2 lg:grid-cols-3">
          <span>• সাইট লোগো — <b>400 × 100</b> (ভেতরে ফিট)</span>
          <span>• হিরো স্লাইড — <b>1400 × 600</b> (৭:৩)</span>
          <span>• সাইড ব্যানার — <b>600 × 340</b></span>
          <span>• প্রমো ব্যানার — <b>1200 × 480</b> (৫:২)</span>
          <span>• ক্যাটাগরি আইকন — <b>400 × 400</b> (ভেতরে ফিট)</span>
          <span>• পণ্যের ছবি — <b>800 × 800</b></span>
          <span>• ব্র্যান্ড লোগো — <b>320 × 100</b> (ভেতরে ফিট)</span>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <CloudUpload size={16} /> ছবির স্টোরেজ পরিষ্কার করুন
            </p>
            <p className="mt-1 max-w-2xl text-xs text-amber-800">
              পুরোনো ছবিগুলো base64 হিসেবে সেটিংস ও পণ্যের ভেতরে আছে, তাই সাইট ও
              localStorage ভারী হচ্ছে। একবার চাপলে সব ছবি Supabase Storage-এ চলে যাবে এবং
              হালকা URL দিয়ে বদলে যাবে। নতুন আপলোডও এখন সরাসরি Storage-এ যাবে।
            </p>
          </div>
          <button
            type="button"
            onClick={migrateImages}
            disabled={migrating}
            className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            <CloudUpload size={16} />
            {migrating ? 'সরানো হচ্ছে…' : 'ছবি Storage-এ সরান'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b flex-wrap">
        {[
          { key: 'general', label: 'সাধারণ' },
          { key: 'hero', label: 'হিরো স্লাইডার' },
          { key: 'banners', label: 'ব্যানার' },
          { key: 'footer', label: 'ফুটার' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 font-medium ${activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">সাধারণ সেটিংস</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">সাইটের নাম</label>
              <input type="text" value={settings.siteName} onChange={(e) => updateSettings({ siteName: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ট্যাগলাইন (ইংরেজি)</label>
              <input
                type="text"
                value={settings.siteTagline ?? ''}
                onChange={(e) => updateSettings({ siteTagline: e.target.value })}
                placeholder="Your Ultimate Choice for Perfect Gifts"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-1 text-xs text-gray-500">ডেস্কটপে লোগোর নিচে দেখানো হয়। খালি রাখলে দেখাবে না।</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ট্যাগলাইন (বাংলা)</label>
              <input
                type="text"
                value={settings.siteTagline_bn ?? ''}
                onChange={(e) => updateSettings({ siteTagline_bn: e.target.value })}
                placeholder="লোগোর নিচে দেখানো বাংলা ট্যাগলাইন"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">SEO বিবরণ (সার্চ ইঞ্জিনের জন্য)</label>
              <input
                type="text"
                value={settings.siteDescription ?? ''}
                onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                placeholder="দ্রুত হোম ডেলিভারিসহ বাংলাদেশে অনলাইনে মানসম্মত পণ্য কিনুন।"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <ImageUpload
              label="সাইট লোগো"
              value={settings.siteLogo || ''}
              onChange={(val) => updateSettings({ siteLogo: val })}
              width={400}
              height={100}
              fit="contain"
            />
            <div>
              <label className="block text-sm font-medium mb-1">ইমেইল</label>
              <input type="email" value={settings.siteEmail} onChange={(e) => updateSettings({ siteEmail: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ফোন</label>
              <input type="text" value={settings.sitePhone} onChange={(e) => updateSettings({ sitePhone: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">হোয়াটসঅ্যাপ নম্বর</label>
              <input type="text" value={settings.whatsappNumber} onChange={(e) => updateSettings({ whatsappNumber: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">অর্ডারের জন্য কল নম্বর</label>
              <input type="text" value={settings.callOrderNumber || settings.sitePhone || ''} onChange={(e) => updateSettings({ callOrderNumber: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ঠিকানা</label>
              <input type="text" value={settings.siteAddress} onChange={(e) => updateSettings({ siteAddress: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">টপ বার লেখা (ইংরেজি)</label>
              <input
                type="text"
                value={settings.topBarText ?? ''}
                onChange={(e) => updateSettings({ topBarText: e.target.value })}
                placeholder="Free delivery on orders above ৳2,000"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-1 text-xs text-gray-500">
                খালি রাখলে ডেলিভারি সেটিং থেকে ফ্রি ডেলিভারির লেখা নিজে থেকেই তৈরি হবে।
                Delivery পেজে ফ্রি ডেলিভারির সীমা 0 (বন্ধ) থাকলে এখানে লেখা &quot;ফ্রি
                ডেলিভারি&quot; সাইটে দেখানো হবে না।
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">টপ বার লেখা (বাংলা)</label>
              <input
                type="text"
                value={settings.topBarText_bn ?? ''}
                onChange={(e) => updateSettings({ topBarText_bn: e.target.value })}
                placeholder="৳১,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-1 text-xs text-gray-500">
                বাংলা মোডে এটি দেখাবে। খালি রাখলে ইংরেজি লেখাটাই ব্যবহার হবে।
              </p>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-3 mt-6">সোশ্যাল লিংক</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">ফেসবুক</label>
              <input type="text" value={settings.facebook} onChange={(e) => updateSettings({ facebook: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ইনস্টাগ্রাম</label>
              <input type="text" value={settings.instagram} onChange={(e) => updateSettings({ instagram: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ইউটিউব</label>
              <input type="text" value={settings.youtube} onChange={(e) => updateSettings({ youtube: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-3 mt-6">হোম CTA ব্যানার</h3>
          <p className="text-sm text-gray-500 mb-3">
            হোম পেজের নিচের কালো ব্যানার (&quot;Find the perfect gift today&quot;)।
            খালি রাখলে ডিফল্ট লেখা দেখাবে।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">CTA শিরোনাম (ইংরেজি)</label>
              <input type="text" value={settings.siteContent?.ctaTitle ?? ''} onChange={(e) => updateSiteContent({ ctaTitle: e.target.value })} placeholder="Find the perfect gift today" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA শিরোনাম (বাংলা)</label>
              <input type="text" value={settings.siteContent?.ctaTitleBn ?? ''} onChange={(e) => updateSiteContent({ ctaTitleBn: e.target.value })} placeholder="আজই নিখুঁত উপহার খুঁজে নিন" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA উপ-শিরোনাম (ইংরেজি)</label>
              <input type="text" value={settings.siteContent?.ctaSubtitle ?? ''} onChange={(e) => updateSiteContent({ ctaSubtitle: e.target.value })} placeholder="Free delivery on orders above ৳2,000 · Cash on delivery available" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA উপ-শিরোনাম (বাংলা)</label>
              <input type="text" value={settings.siteContent?.ctaSubtitleBn ?? ''} onChange={(e) => updateSiteContent({ ctaSubtitleBn: e.target.value })} placeholder="৳১,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">বাটনের লেখা (ইংরেজি)</label>
              <input type="text" value={settings.siteContent?.ctaButton ?? ''} onChange={(e) => updateSiteContent({ ctaButton: e.target.value })} placeholder="Shop Now" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">বাটনের লেখা (বাংলা)</label>
              <input type="text" value={settings.siteContent?.ctaButtonBn ?? ''} onChange={(e) => updateSiteContent({ ctaButtonBn: e.target.value })} placeholder="এখনই কিনুন" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">বাটনের লিংক</label>
              <input type="text" value={settings.siteContent?.ctaHref ?? ''} onChange={(e) => updateSiteContent({ ctaHref: e.target.value })} placeholder="/shop" className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            CTA-তে ফ্রি ডেলিভারির অঙ্ক লেখা থাকলে সেটি Delivery পেজের সীমার সাথে মিলিয়ে দেখানো হয়।
            সীমা 0 (বন্ধ) থাকলে ফ্রি ডেলিভারির দাবি বাদ দিয়ে শুধু &quot;ক্যাশ অন ডেলিভারি&quot; দেখাবে।
          </p>
          <AutoSaveNote className="mt-4" />
        </div>
      )}

      {activeTab === 'hero' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">হিরো স্লাইডার</h2>
            <div className="flex gap-2">
              <button onClick={() => { setEditingHero(null); setHeroForm({ image: '', href: '', alt: '' }); setShowHeroModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> স্লাইড যোগ করুন</button>
            </div>
          </div>
          {(settings.siteContent?.heroSlides || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">এখনো কোনো স্লাইড যোগ করা হয়নি</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(settings.siteContent?.heroSlides) && settings.siteContent.heroSlides.map((slide) => (
                <div key={slide.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {slide.image ? <img src={slide.image} alt={slide.alt || 'হিরো স্লাইড'} className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">কোনো ছবি নেই</div>}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">লিংক: {slide.href || '-'}</p>
                    <p className="text-sm text-gray-600 mb-3">Alt: {slide.alt || '-'}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingHero(slide); setHeroForm({ image: slide.image || '', href: slide.href || '', alt: slide.alt || '' }); setShowHeroModal(true) }} className="flex items-center gap-1 text-blue-600 hover:text-blue-800"><Edit2 size={16} /> এডিট</button>
                      <button onClick={() => { if (confirm('এই স্লাইডটি মুছে ফেলবেন?')) { deleteHeroSlide(slide.id); toast.success('মুছে ফেলা হয়েছে') } }} className="flex items-center gap-1 text-red-600 hover:text-red-800"><Trash2 size={16} /> মুছুন</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-1">পেজ ব্যানার</h2>
            <p className="text-sm text-gray-500 mb-4">
              Shop/ক্যাটাগরি, Offer Zone ও Brands পেজের উপরের বড় ব্যানার। প্রতিটি
              পেজের জন্য আলাদা ছবি দিতে পারবেন। ছবি না দিলে ব্যানারটি শুধু কালো
              ব্যাকগ্রাউন্ডে শিরোনামসহ দেখাবে — কোনো ডেমো ছবি বসবে না।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUpload
                label="Shop / ক্যাটাগরি ব্যানার"
                value={settings.pageBanners?.shop || ''}
                onChange={(val) => updateSettings({ pageBanners: { ...(settings.pageBanners || {}), shop: val } })}
                width={1400}
                height={400}
                fit="cover"
              />
              <ImageUpload
                label="Offer Zone ব্যানার"
                value={settings.pageBanners?.offer || ''}
                onChange={(val) => updateSettings({ pageBanners: { ...(settings.pageBanners || {}), offer: val } })}
                width={1400}
                height={400}
                fit="cover"
              />
              <ImageUpload
                label="Brands পেজের ব্যানার"
                value={settings.pageBanners?.brands || ''}
                onChange={(val) => updateSettings({ pageBanners: { ...(settings.pageBanners || {}), brands: val } })}
                width={1400}
                height={400}
                fit="cover"
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold mb-1">সাইড ব্যানার</h2>
            <button
              onClick={() => {
                addSideBanner({ image: '', href: '/shop', alt: '' })
                toast.success('সাইড ব্যানার স্লট যোগ হয়েছে — ছবি আপলোড করুন')
              }}
              className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              <Plus size={16} /> সাইড ব্যানার যোগ করুন
            </button>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(settings.siteContent?.sideBanners) ? settings.siteContent.sideBanners : []).map((banner) => (
                <div key={banner.id} className="border rounded overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.alt || 'সাইড ব্যানার'} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      এখনো কোনো ছবি নেই
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <ImageUpload
                      label="সাইড ব্যানারের ছবি"
                      value={banner.image}
                      onChange={(val) => updateSideBanner(banner.id, { image: val })}
                      width={600}
                      height={340}
                    />
                    <input type="text" value={banner.href || ''} onChange={(e) => updateSideBanner(banner.id, { href: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" placeholder="লিংক (যেমন /shop)" />
                    <input type="text" value={banner.alt || ''} onChange={(e) => updateSideBanner(banner.id, { alt: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" placeholder="Alt টেক্সট" />
                    <button
                      onClick={() => {
                        if (confirm('এই সাইড ব্যানারটি মুছে ফেলবেন?')) {
                          deleteSideBanner(banner.id)
                          toast.success('সাইড ব্যানার মুছে ফেলা হয়েছে')
                        }
                      }}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={15} /> ব্যানার মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {(Array.isArray(settings.siteContent?.sideBanners) ? settings.siteContent.sideBanners : []).length === 0 && (
              <p className="text-sm text-gray-500">কোনো সাইড ব্যানার নেই। উপরে “সাইড ব্যানার যোগ করুন” চাপুন।</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">প্রমো ব্যানার</h2>
              <button
                onClick={() => {
                  addPromoBanner({ image: '', href: '/shop', alt: '' })
                  toast.success('প্রমো ব্যানার স্লট যোগ হয়েছে — ছবি আপলোড করুন')
                }}
                className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                <Plus size={16} /> প্রমো ব্যানার যোগ করুন
              </button>
            </div>
            <div className="space-y-4">
              {(Array.isArray(settings.siteContent?.promoBanners) ? settings.siteContent.promoBanners : []).map((banner) => (
                <div key={banner.id} className="border rounded overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.alt || 'প্রমো ব্যানার'} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      এখনো কোনো ছবি নেই
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <ImageUpload
                      label="প্রমো ব্যানারের ছবি"
                      value={banner.image}
                      onChange={(val) => updatePromoBanner(banner.id, { image: val })}
                      width={1200}
                      height={480}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input type="text" value={banner.href || ''} onChange={(e) => updatePromoBanner(banner.id, { href: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="লিংক (যেমন /shop)" />
                      <input type="text" value={banner.alt || ''} onChange={(e) => updatePromoBanner(banner.id, { alt: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="Alt টেক্সট" />
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('এই প্রমো ব্যানারটি মুছে ফেলবেন?')) {
                          deletePromoBanner(banner.id)
                          toast.success('প্রমো ব্যানার মুছে ফেলা হয়েছে')
                        }
                      }}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={15} /> ব্যানার মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {(Array.isArray(settings.siteContent?.promoBanners) ? settings.siteContent.promoBanners : []).length === 0 && (
              <p className="text-sm text-gray-500">কোনো প্রমো ব্যানার নেই। উপরে “প্রমো ব্যানার যোগ করুন” চাপুন।</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">ফুটার কনটেন্ট</h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">ফুটার পরিচিতি (ইংরেজি)</label>
              <textarea value={settings.siteContent?.footerAbout || ''} onChange={(e) => updateSiteContent({ footerAbout: e.target.value })} className="w-full px-3 py-2 border rounded" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ফুটার পরিচিতি (বাংলা)</label>
              <textarea value={settings.siteContent?.footerAbout_bn || ''} onChange={(e) => updateSiteContent({ footerAbout_bn: e.target.value })} className="w-full px-3 py-2 border rounded" rows={4} placeholder="বাংলায় দেখাতে চাইলে এখানে লিখুন" />
              <p className="mt-1 text-xs text-gray-500">খালি রাখলে বাংলা মোডে ইংরেজি লেখাটাই দেখাবে।</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">কপিরাইট লেখা (ইংরেজি)</label>
              <input type="text" value={settings.siteContent?.footerCopyright || ''} onChange={(e) => updateSiteContent({ footerCopyright: e.target.value })} placeholder="© 2026 Gift Shop. All rights reserved." className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">কপিরাইট লেখা (বাংলা)</label>
              <input type="text" value={settings.siteContent?.footerCopyrightBn || ''} onChange={(e) => updateSiteContent({ footerCopyrightBn: e.target.value })} placeholder="© ২০২৬ গিফট শপ। সর্বস্বত্ব সংরক্ষিত।" className="w-full px-3 py-2 border rounded" />
              <p className="mt-1 text-xs text-gray-500">খালি রাখলে বাংলা মোডে ইংরেজি লেখাটাই দেখাবে।</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">নিউজলেটার লেখা (ইংরেজি)</label>
              <input type="text" value={settings.siteContent?.newsletterText || ''} onChange={(e) => updateSiteContent({ newsletterText: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">নিউজলেটার লেখা (বাংলা)</label>
              <input type="text" value={settings.siteContent?.newsletterTextBn || ''} onChange={(e) => updateSiteContent({ newsletterTextBn: e.target.value })} placeholder="নতুন অফার ও পণ্যের খবর পেতে সাবস্ক্রাইব করুন" className="w-full px-3 py-2 border rounded" />
              <p className="mt-1 text-xs text-gray-500">খালি রাখলে বাংলা মোডে ইংরেজি লেখাটাই দেখাবে।</p>
            </div>
          </div>
          <AutoSaveNote className="mt-4" />
        </div>
      )}

      {showHeroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingHero ? 'স্লাইড এডিট' : 'স্লাইড যোগ করুন'}</h2>
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <ImageUpload
                label="হিরো ছবি"
                value={heroForm.image}
                onChange={(val) => setHeroForm({ ...heroForm, image: val })}
                width={1400}
                height={600}
              />
              <div>
                <label className="block text-sm font-medium mb-1">লিংক (href)</label>
                <input type="text" value={heroForm.href} onChange={(e) => setHeroForm({ ...heroForm, href: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="/shop" />
                <p className="mt-1 text-xs text-gray-500">সাইটের ভেতরের লিংক দিন — যেমন /shop, /offer বা /brand/নাম।</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alt টেক্সট</label>
                <input type="text" value={heroForm.alt} onChange={(e) => setHeroForm({ ...heroForm, alt: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">সেভ করুন</button>
                <button type="button" onClick={() => { setShowHeroModal(false); setEditingHero(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSiteContent
