import { useRef, useState } from 'react'
import { Upload, Link as LinkIcon, X } from 'lucide-react'

const ImageUpload = ({
  value = '',
  onChange,
  label = 'Image',
  multiple = false,
  onAddMultiple,
  className = '',
}) => {
  const fileInputRef = useRef(null)
  const [uploadMethod, setUploadMethod] = useState('file')
  const [urlInput, setUrlInput] = useState('')

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (multiple && onAddMultiple) {
      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5 MB')
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          onAddMultiple(reader.result)
        }
        reader.readAsDataURL(file)
      })
      e.target.value = null
      return
    }

    // single image
    const file = files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB')
      e.target.value = null
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      if (onChange) onChange(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = null
  }

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    if (multiple && onAddMultiple) {
      onAddMultiple(urlInput.trim())
      setUrlInput('')
      return
    }
    if (onChange) onChange(urlInput.trim())
    setUrlInput('')
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
              <span className="font-semibold">Click to upload</span> from local device
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
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Add
          </button>
        </div>
      )}

      {!multiple && value && (
        <div className="mt-3 relative inline-block">
          <img src={value} alt="Preview" className="h-24 w-24 object-contain border rounded-lg" />
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
