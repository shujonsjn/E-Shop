import { useRef, useState } from 'react'
import { Upload, Link as LinkIcon, X } from 'lucide-react'

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

// Renders whatever the admin uploads into the exact slot size the site uses,
// so a 4000px photo and a 300px photo both end up identical (and light).
const renderToSize = async (source, { width, height, fit = 'cover', quality = 0.85 } = {}) => {
  if (!width || !height) return null
  const img = await loadImage(source)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (fit === 'contain') {
    const scale = Math.min(width / img.width, height / img.height)
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))
    ctx.drawImage(img, Math.round((width - w) / 2), Math.round((height - h) / 2), w, h)
  } else {
    const scale = Math.max(width / img.width, height / img.height)
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
  }

  const out = canvas.toDataURL('image/webp', quality)
  return out.startsWith('data:image/webp') ? out : canvas.toDataURL('image/jpeg', quality)
}

export const optimizeImage = async (file, options = {}) => {
  const original = await readAsDataUrl(file)
  const isVector = file.type === 'image/svg+xml' || file.type === 'image/gif'
  if (!file.type?.startsWith('image/') || isVector) return original

  try {
    if (options.width && options.height) {
      return await renderToSize(original, options)
    }
    const img = await loadImage(original)
    const maxSide = options.maxSide || 900
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    if (scale === 1 && file.size <= 120 * 1024) return original
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.width * scale))
    canvas.height = Math.max(1, Math.round(img.height * scale))
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const optimized = canvas.toDataURL('image/webp', 0.85)
    return optimized && optimized.length < original.length ? optimized : original
  } catch {
    return original
  }
}

// Remote URLs are only rewritten when the host allows CORS; otherwise the
// original URL is kept so the admin never loses the value they typed.
const optimizeUrl = async (url, options = {}) => {
  if (!options.width || !options.height) return url
  if (url.startsWith('data:')) return url
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) return url
    const blob = await res.blob()
    if (!blob.type.startsWith('image/')) return url
    const file = new File([blob], 'remote-image', { type: blob.type })
    return await optimizeImage(file, options)
  } catch {
    return url
  }
}

const ImageUpload = ({
  value = '',
  onChange,
  label = 'Image',
  multiple = false,
  onAddMultiple,
  width,
  height,
  fit = 'cover',
  className = '',
}) => {
  const fileInputRef = useRef(null)
  const [uploadMethod, setUploadMethod] = useState('file')
  const [urlInput, setUrlInput] = useState('')
  const [busy, setBusy] = useState(false)

  const options = { width, height, fit }
  const sizeLabel = width && height ? `${width} × ${height} px` : 'auto'

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setBusy(true)
    try {
      if (multiple && onAddMultiple) {
        for (const file of files) {
          if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5 MB')
            continue
          }
          onAddMultiple(await optimizeImage(file, options))
        }
        e.target.value = null
        return
      }

      const file = files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5 MB')
        e.target.value = null
        return
      }
      const dataUrl = await optimizeImage(file, options)
      if (onChange) onChange(dataUrl)
      e.target.value = null
    } finally {
      setBusy(false)
    }
  }

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return
    const url = urlInput.trim()
    setBusy(true)
    try {
      const finalUrl = multiple ? url : await optimizeUrl(url, options)
      if (multiple && onAddMultiple) {
        onAddMultiple(finalUrl)
      } else if (onChange) {
        onChange(finalUrl)
      }
      setUrlInput('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
            uploadMethod === 'file'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload size={16} />
          <span>Upload from Device</span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
            uploadMethod === 'url'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <LinkIcon size={16} />
          <span>Add URL</span>
        </button>
      </div>

      {uploadMethod === 'file' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{busy ? 'Processing…' : 'Click to upload'}</span> from local device
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG (max 5 MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={busy}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
          >
            {busy ? '…' : 'Add'}
          </button>
        </div>
      )}

      <p className="mt-2 text-[11px] text-gray-500">
        Auto-fixed size: <span className="font-semibold text-gray-700">{sizeLabel}</span>
        {width && height ? ` (${fit === 'contain' ? 'fit inside, trimmed' : 'cropped to fill'})` : ''}
      </p>

      {!multiple && value && (
        <div className="mt-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-24 w-24 object-contain border rounded-lg bg-white"
          />
          {onChange && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
