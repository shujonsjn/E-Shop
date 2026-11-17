import { Save } from 'lucide-react'

/**
 * Shared status line for admin pages that persist every edit immediately.
 * Entity forms (products, pages, brands…) keep an explicit Save button, so this
 * note is only used where there is nothing to submit.
 */
const AutoSaveNote = ({ children, className = '' }) => (
  <div
    className={`flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 ${className}`}
  >
    <Save size={16} className="mt-0.5 shrink-0" />
    <p>{children || 'Changes on this page save automatically — no separate Save button needed.'}</p>
  </div>
)

export default AutoSaveNote
