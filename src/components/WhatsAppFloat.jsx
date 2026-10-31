import { MessageCircle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useSettings } from '../context/SettingsContext'

const WhatsAppFloat = () => {
  const { tx } = useLanguage()
  const { settings } = useSettings()
  const phone = (settings.whatsappNumber || settings.sitePhone || '8801321208940').replace(/[^0-9]/g, '')
  return (
    <a
      href={`https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent('Hello ' + (settings.siteName || 'GhorerBazar'))}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-[4.5rem] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 lg:bottom-6 lg:h-12 lg:w-12"
      aria-label={tx('Order on WhatsApp', 'হোয়াটসঅ্যাপে অর্ডার করুন')}
      title={tx('Order on WhatsApp', 'হোয়াটসঅ্যাপে অর্ডার করুন')}
    >
      <MessageCircle size={22} className="fill-white/20" />
    </a>
  )
}

export default WhatsAppFloat
