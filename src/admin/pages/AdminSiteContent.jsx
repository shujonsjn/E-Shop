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
    if (!window.confirm('All base64 images will be moved to Supabase Storage. Continue?')) {
      return
    }
    setMigrating(true)
    const loading = toast.loading('Uploading images…')
    try {
      const settingsResult = await migrateDataUrls(settings, 'settings')
      const productsResult = await migrateDataUrls(products, 'products')
      if (settingsResult.uploaded > 0) updateSettings(settingsResult.value)
      if (productsResult.uploaded > 0) replaceProducts(productsResult.value)
      const total = settingsResult.uploaded + productsResult.uploaded
      const failed = settingsResult.failed + productsResult.failed
      if (total === 0) {
        toast.error('No base64 images found', { id: loading })
      } else {
        toast.success(
          `${total} image${total === 1 ? '' : 's'} moved to Storage${failed ? ` · ${failed} failed` : ''}`,
          { id: loading, duration: 8000 }
        )
      }
    } catch {
      toast.error('Could not move the images. Please try again.', { id: loading })
    } finally {
      setMigrating(false)
    }
  }

  const handleHeroSubmit = (e) => {
    e.preventDefault()
    if (!heroForm.image) {
      toast.error('Please add an image')
      return
    }
    if (editingHero) {
      updateHeroSlide(editingHero.id, { ...heroForm })
      toast.success('Hero slide updated')
    } else {
      addHeroSlide({ ...heroForm })
      toast.success('Hero slide added')
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
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-gray-500 mt-1">Manage banners, logo, footer and more</p>
      </div>

      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">Image sizes (auto-fixed on upload)</p>
        <p className="mt-1 text-xs text-blue-800">
          Any image size is automatically resized and cropped to the sizes below when uploaded.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-blue-900 sm:grid-cols-2 lg:grid-cols-3">
          <span>• Site Logo — <b>400 × 100</b> (fit inside)</span>
          <span>• Hero Slide — <b>1400 × 600</b> (7:3)</span>
          <span>• Side Banner — <b>600 × 340</b></span>
          <span>• Promo Banner — <b>1200 × 480</b> (5:2)</span>
          <span>• Category Icon — <b>400 × 400</b> (fit inside)</span>
          <span>• Product Image — <b>800 × 800</b></span>
          <span>• Brand Logo — <b>320 × 100</b> (fit inside)</span>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <CloudUpload size={16} /> Image storage cleanup
            </p>
            <p className="mt-1 max-w-2xl text-xs text-amber-800">
              Old images are stored as base64 inside settings and products, which makes the site and
              localStorage heavy. One click moves every image to Supabase Storage and replaces it
              with a lightweight URL. New uploads go straight to Storage.
            </p>
          </div>
          <button
            type="button"
            onClick={migrateImages}
            disabled={migrating}
            className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            <CloudUpload size={16} />
            {migrating ? 'Moving…' : 'Move images to Storage'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b flex-wrap">
        {['general', 'hero', 'banners', 'footer'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            {tab === 'hero' ? 'Hero Slider' : tab === 'banners' ? 'Banners' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => updateSettings({ siteName: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline (English)</label>
              <input
                type="text"
                value={settings.siteTagline ?? ''}
                onChange={(e) => updateSettings({ siteTagline: e.target.value })}
                placeholder="Your Ultimate Choice for Perfect Gifts"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-1 text-xs text-gray-500">Shown under the logo on desktop. Leave empty to hide it.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline (Bangla)</label>
              <input
                type="text"
                value={settings.siteTagline_bn ?? ''}
                onChange={(e) => updateSettings({ siteTagline_bn: e.target.value })}
                placeholder="Bangla tagline shown under the logo"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">SEO Description (search engine)</label>
              <input
                type="text"
                value={settings.siteDescription ?? ''}
                onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                placeholder="Shop quality products online in Bangladesh with fast home delivery."
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <ImageUpload
              label="Site Logo"
              value={settings.siteLogo || ''}
              onChange={(val) => updateSettings({ siteLogo: val })}
              width={400}
              height={100}
              fit="contain"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={settings.siteEmail} onChange={(e) => updateSettings({ siteEmail: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" value={settings.sitePhone} onChange={(e) => updateSettings({ sitePhone: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <input type="text" value={settings.whatsappNumber} onChange={(e) => updateSettings({ whatsappNumber: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Call for Order Number</label>
              <input type="text" value={settings.callOrderNumber || settings.sitePhone || ''} onChange={(e) => updateSettings({ callOrderNumber: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input type="text" value={settings.siteAddress} onChange={(e) => updateSettings({ siteAddress: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Top Bar Text (English)</label>
              <input
                type="text"
                value={settings.topBarText ?? ''}
                onChange={(e) => updateSettings({ topBarText: e.target.value })}
                placeholder="Free delivery on orders above ৳1,000"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to generate the free-delivery line from Delivery settings.
                If the free-delivery threshold on the Delivery page is 0 (off), any
                free-delivery claim written here is hidden on the site.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Top Bar Text (Bangla)</label>
              <input
                type="text"
                value={settings.topBarText_bn ?? ''}
                onChange={(e) => updateSettings({ topBarText_bn: e.target.value })}
                placeholder="Bangla top bar text"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-1 text-xs text-gray-500">
                Shown in Bengali mode. Falls back to the English text when empty.
              </p>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-3 mt-6">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input type="text" value={settings.facebook} onChange={(e) => updateSettings({ facebook: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input type="text" value={settings.instagram} onChange={(e) => updateSettings({ instagram: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube</label>
              <input type="text" value={settings.youtube} onChange={(e) => updateSettings({ youtube: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-3 mt-6">Home CTA Banner</h3>
          <p className="text-sm text-gray-500 mb-3">
            The black banner at the bottom of the home page ("Find the perfect gift today").
            Default text is used when left empty.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">CTA Title (English)</label>
              <input type="text" value={settings.siteContent?.ctaTitle ?? ''} onChange={(e) => updateSiteContent({ ctaTitle: e.target.value })} placeholder="Find the perfect gift today" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Title (Bangla)</label>
              <input type="text" value={settings.siteContent?.ctaTitleBn ?? ''} onChange={(e) => updateSiteContent({ ctaTitleBn: e.target.value })} placeholder="Bangla CTA title" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Subtitle (English)</label>
              <input type="text" value={settings.siteContent?.ctaSubtitle ?? ''} onChange={(e) => updateSiteContent({ ctaSubtitle: e.target.value })} placeholder="Free delivery on orders above ৳1,000 · Cash on delivery available" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Subtitle (Bangla)</label>
              <input type="text" value={settings.siteContent?.ctaSubtitleBn ?? ''} onChange={(e) => updateSiteContent({ ctaSubtitleBn: e.target.value })} placeholder="Bangla CTA subtitle" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Text (English)</label>
              <input type="text" value={settings.siteContent?.ctaButton ?? ''} onChange={(e) => updateSiteContent({ ctaButton: e.target.value })} placeholder="Shop Now" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Text (Bangla)</label>
              <input type="text" value={settings.siteContent?.ctaButtonBn ?? ''} onChange={(e) => updateSiteContent({ ctaButtonBn: e.target.value })} placeholder="Bangla button text" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Link</label>
              <input type="text" value={settings.siteContent?.ctaHref ?? ''} onChange={(e) => updateSiteContent({ ctaHref: e.target.value })} placeholder="/shop" className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            Amounts in the CTA are checked against the Delivery threshold. When the threshold
            is 0 (off), the free-delivery claim is replaced with cash-on-delivery copy only.
          </p>
          <AutoSaveNote className="mt-4" />
        </div>
      )}

      {activeTab === 'hero' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Hero Slider</h2>
            <div className="flex gap-2">
              <button onClick={() => { setEditingHero(null); setHeroForm({ image: '', href: '', alt: '' }); setShowHeroModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> Add Slide</button>
            </div>
          </div>
          {(settings.siteContent?.heroSlides || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">No slides added yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(settings.siteContent?.heroSlides) && settings.siteContent.heroSlides.map((slide) => (
                <div key={slide.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {slide.image ? <img src={slide.image} alt={slide.alt || 'Hero slide'} className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">Link: {slide.href || '-'}</p>
                    <p className="text-sm text-gray-600 mb-3">Alt: {slide.alt || '-'}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingHero(slide); setHeroForm({ image: slide.image || '', href: slide.href || '', alt: slide.alt || '' }); setShowHeroModal(true) }} className="flex items-center gap-1 text-blue-600 hover:text-blue-800"><Edit2 size={16} /> Edit</button>
                      <button onClick={() => { if (confirm('Delete this slide?')) { deleteHeroSlide(slide.id); toast.success('Deleted') } }} className="flex items-center gap-1 text-red-600 hover:text-red-800"><Trash2 size={16} /> Delete</button>
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
            <h2 className="text-xl font-bold mb-1">Page Banners</h2>
            <p className="text-sm text-gray-500 mb-4">
              Large banner at the top of Shop/Category, Offer Zone and Brands pages. You can give
              each page a different image. With no image the banner shows only the title on a dark
              background — no demo image is used.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUpload
                label="Shop / Category Banner"
                value={settings.pageBanners?.shop || ''}
                onChange={(val) => updateSettings({ pageBanners: { ...(settings.pageBanners || {}), shop: val } })}
                width={1400}
                height={400}
                fit="cover"
              />
              <ImageUpload
                label="Offer Zone Banner"
                value={settings.pageBanners?.offer || ''}
                onChange={(val) => updateSettings({ pageBanners: { ...(settings.pageBanners || {}), offer: val } })}
                width={1400}
                height={400}
                fit="cover"
              />
              <ImageUpload
                label="Brands Page Banner"
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
            <h2 className="text-xl font-bold mb-1">Side Banners</h2>
            <button
              onClick={() => {
                addSideBanner({ image: '', href: '/shop', alt: '' })
                toast.success('Side banner slot added — upload an image')
              }}
              className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Add Side Banner
            </button>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(settings.siteContent?.sideBanners) ? settings.siteContent.sideBanners : []).map((banner) => (
                <div key={banner.id} className="border rounded overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.alt || 'Side banner'} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image yet
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <ImageUpload
                      label="Side Banner Image"
                      value={banner.image}
                      onChange={(val) => updateSideBanner(banner.id, { image: val })}
                      width={600}
                      height={340}
                    />
                    <input type="text" value={banner.href || ''} onChange={(e) => updateSideBanner(banner.id, { href: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" placeholder="Link (e.g. /shop)" />
                    <input type="text" value={banner.alt || ''} onChange={(e) => updateSideBanner(banner.id, { alt: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" placeholder="Alt text" />
                    <button
                      onClick={() => {
                        if (confirm('Delete this side banner?')) {
                          deleteSideBanner(banner.id)
                          toast.success('Side banner deleted')
                        }
                      }}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={15} /> Delete banner
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {(Array.isArray(settings.siteContent?.sideBanners) ? settings.siteContent.sideBanners : []).length === 0 && (
              <p className="text-sm text-gray-500">No side banners yet. Click Add Side Banner above.</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Promo Banners</h2>
              <button
                onClick={() => {
                  addPromoBanner({ image: '', href: '/shop', alt: '' })
                  toast.success('Promo banner slot added — upload an image')
                }}
                className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                <Plus size={16} /> Add Promo Banner
              </button>
            </div>
            <div className="space-y-4">
              {(Array.isArray(settings.siteContent?.promoBanners) ? settings.siteContent.promoBanners : []).map((banner) => (
                <div key={banner.id} className="border rounded overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.alt || 'Promo banner'} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image yet
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <ImageUpload
                      label="Promo Banner Image"
                      value={banner.image}
                      onChange={(val) => updatePromoBanner(banner.id, { image: val })}
                      width={1200}
                      height={480}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input type="text" value={banner.href || ''} onChange={(e) => updatePromoBanner(banner.id, { href: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="Link (e.g. /shop)" />
                      <input type="text" value={banner.alt || ''} onChange={(e) => updatePromoBanner(banner.id, { alt: e.target.value })} className="px-2 py-1 border rounded text-sm" placeholder="Alt text" />
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this promo banner?')) {
                          deletePromoBanner(banner.id)
                          toast.success('Promo banner deleted')
                        }
                      }}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={15} /> Delete banner
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {(Array.isArray(settings.siteContent?.promoBanners) ? settings.siteContent.promoBanners : []).length === 0 && (
              <p className="text-sm text-gray-500">No promo banners yet. Click Add Promo Banner above.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Footer Content</h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Footer About Text (English)</label>
              <textarea value={settings.siteContent?.footerAbout || ''} onChange={(e) => updateSiteContent({ footerAbout: e.target.value })} className="w-full px-3 py-2 border rounded" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Footer About Text (Bangla)</label>
              <textarea value={settings.siteContent?.footerAbout_bn || ''} onChange={(e) => updateSiteContent({ footerAbout_bn: e.target.value })} className="w-full px-3 py-2 border rounded" rows={4} placeholder="Bangla footer text" />
              <p className="mt-1 text-xs text-gray-500">Leave empty to show the English text in Bengali mode.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Copyright Text</label>
              <input type="text" value={settings.siteContent?.footerCopyright || ''} onChange={(e) => updateSiteContent({ footerCopyright: e.target.value })} placeholder="© 2026 Gift Shop. All rights reserved." className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Newsletter Text</label>
              <input type="text" value={settings.siteContent?.newsletterText || ''} onChange={(e) => updateSiteContent({ newsletterText: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <AutoSaveNote className="mt-4" />
        </div>
      )}

      {showHeroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingHero ? 'Edit Slide' : 'Add Slide'}</h2>
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <ImageUpload
                label="Hero Image"
                value={heroForm.image}
                onChange={(val) => setHeroForm({ ...heroForm, image: val })}
                width={1400}
                height={600}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Link (href)</label>
                <input type="text" value={heroForm.href} onChange={(e) => setHeroForm({ ...heroForm, href: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="/shop" />
                <p className="mt-1 text-xs text-gray-500">Use an internal link such as /shop, /offer or /brand/name.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input type="text" value={heroForm.alt} onChange={(e) => setHeroForm({ ...heroForm, alt: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowHeroModal(false); setEditingHero(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSiteContent
