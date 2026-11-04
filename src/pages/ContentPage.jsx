import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronRight, FileQuestion, Mail, MessageCircle, Phone } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageBanner } from '../components/ui'
import { bannerImage } from '../data/catalog'
import { getPage, pages as defaultPages } from '../data/pages'
import { useLanguage } from '../i18n/LanguageContext'
import { useSettings } from '../context/SettingsContext'

const quickLinks = [
  ['about-us', 'About Us', 'আমাদের সম্পর্কে'],
  ['contact-us', 'Contact Us', 'যোগাযোগ'],
  ['how-to-order', 'How to Order', 'কীভাবে অর্ডার করবেন'],
  ['shipping', 'Shipping', 'শিপিং'],
  ['payment', 'Payment', 'পেমেন্ট'],
  ['faq', 'FAQ', 'সাধারণ প্রশ্ন'],
  ['happy-return', 'Happy Return', 'হ্যাপি রিটার্ন'],
  ['refund-policy', 'Refund Policy', 'রিফান্ড নীতি'],
  ['terms-and-conditions', 'Terms & Conditions', 'শর্তাবলি'],
  ['privacy-policy', 'Privacy Policy', 'প্রাইভেসি পলিসি'],
]

const ContentPage = () => {
  const { slug } = useParams()
  const { t, tx, isBn } = useLanguage()
  const { settings } = useSettings()
  const [pagesData, setPagesData] = useState(defaultPages)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gb_admin_pages')
      if (saved) {
        const parsed = JSON.parse(saved)
        setPagesData({ ...defaultPages, ...parsed })
      }
    } catch {}
  }, [slug])

  const page = pagesData[slug] || getPage(slug)
  const pagesList = pagesData

  if (!page) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }]} />
        <div className="card mt-2">
          <EmptyState
            icon={FileQuestion}
            title={tx('Page not found', 'পেজটি পাওয়া যায়নি')}
            subtitle={tx(
              'The page you are looking for does not exist or was moved.',
              'আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।'
            )}
            action={
              <Link to="/" className="btn-primary">
                {t('notFound.home')}
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const title = isBn && page.title_bn ? page.title_bn : page.title
  const subtitle = isBn && page.subtitle_bn ? page.subtitle_bn : page.subtitle
  const availableLinks = quickLinks.filter(([linkSlug]) => pagesList[linkSlug])

  return (
    <div className="container-gb py-3">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: title }]} />

      <PageBanner title={title} subtitle={subtitle} image={bannerImage('nr4nq1788005117-1000x400.png')} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
        <article className="card p-5 sm:p-7">
          <div className="space-y-7">
            {page.sections.map((section, index) => {
              const heading = isBn && section.heading_bn ? section.heading_bn : section.heading
              const body = isBn && section.body_bn ? section.body_bn : section.body
              const bullets = isBn && section.bullets_bn ? section.bullets_bn : section.bullets
              const paragraphs = Array.isArray(body) ? body : body ? [body] : []
              const list = Array.isArray(bullets) ? bullets : []

              return (
                <section key={`${heading}-${index}`} className={index > 0 ? 'border-t border-gray-100 pt-6' : ''}>
                  <h2 className="text-base font-bold text-ink sm:text-lg">{heading}</h2>
                  {paragraphs.length > 0 && (
                    <div className="prose-gb mt-2">
                      {paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {list.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13.5px] leading-6 text-ink-muted">
                          <ChevronRight size={15} className="mt-1 shrink-0 text-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>

          <div className="mt-7 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
            <Link to="/shop" className="btn-primary px-4 py-2 text-xs">
              {t('common.continueShopping')}
            </Link>
            <Link to="/page/contact-us" className="btn-outline px-4 py-2 text-xs">
              {t('nav.contact')}
            </Link>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <h2 className="border-b border-gray-100 bg-cream/70 px-4 py-2.5 text-[13px] font-bold text-ink">
              {t('footer.support')}
            </h2>
            <ul className="p-2">
              {availableLinks.map(([linkSlug, en, bn]) => (
                <li key={linkSlug}>
                  <Link
                    to={`/page/${linkSlug}`}
                    className={`flex items-center justify-between rounded px-2.5 py-1.5 text-[12.5px] transition hover:bg-cream hover:text-brand ${
                      linkSlug === slug ? 'font-bold text-brand' : 'text-ink-muted'
                    }`}
                  >
                    {tx(en, bn)}
                    <ChevronRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4">
            <h2 className="text-[13px] font-bold text-ink">{t('track.needHelp')}</h2>
            <ul className="mt-2 space-y-2 text-[12px] text-ink-muted">
              <li>
                <a href={`tel:${settings?.callOrderNumber || settings?.sitePhone || '+8809642922922'}`} className="flex items-center gap-2 hover:text-brand">
                  <Phone size={13} className="text-brand" /> {settings?.callOrderNumber || settings?.sitePhone || '+8809642922922'}
                </a>
              </li>
              <li>
                <a
                  href={`https://api.whatsapp.com/send/?phone=${String(settings?.whatsappNumber || settings?.callOrderNumber || '').replace(/[^0-9]/g, '')}&text=${encodeURIComponent('Hello ' + (settings?.siteName || ''))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-brand"
                >
                  <MessageCircle size={13} className="text-brand" /> {settings?.whatsappNumber || settings?.callOrderNumber || '+8801321208940'}
                </a>
              </li>
              <li>
                <a href="mailto:hello@ghorerbazar.demo" className="flex items-center gap-2 hover:text-brand">
                  <Mail size={13} className="text-brand" /> hello@ghorerbazar.demo
                </a>
              </li>
            </ul>
            <Link to="/page/contact-us" className="btn-outline mt-3 w-full py-2 text-[11px]">
              {t('track.contact')}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ContentPage
