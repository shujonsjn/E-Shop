import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { useProducts } from '../../context/ProductsContext'
import { getMergedCategories } from '../../utils/mergeCategories'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/admin/ImageUpload'
import { getMergedBrands } from '../../utils/mergeBrands'

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const emptyForm = {
  name: '',
  name_bn: '',
  slug: '',
  category: '',
  subcategory: '',
  brand: '',
  unit: '',
  price: '',
  oldPrice: '',
  stock: '10',
  badges: '',
  description: '',
  description_bn: '',
  images: [],
  imageUrl: '',
  featured: false,
  top: false,
}

const AdminProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  const { products, addProduct, updateProduct, getProductById } = useProducts()

  const [formData, setFormData] = useState(emptyForm)
  // using ImageUpload component now

  const existingProduct = isEditMode ? getProductById(id) : null

  const [brands, setBrands] = useState([])
  useEffect(() => {
    const load = () => {
      try {
        const savedB = localStorage.getItem('gb_admin_brands')
        if (savedB) {
          const parsed = JSON.parse(savedB)
          if (Array.isArray(parsed)) setBrands(parsed)
          else setBrands(getMergedBrands())
        } else {
          setBrands(getMergedBrands())
        }
      } catch {
        setBrands(getMergedBrands())
      }
    }
    load()
    window.addEventListener('storage', load)
    window.addEventListener('focus', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('focus', load)
    }
  }, [])

  const mergedCategories = getMergedCategories()

  const selectedCategory = mergedCategories.find((category) => category.slug === formData.category)

  useEffect(() => {
    if (!isEditMode) return
    const product = getProductById(id)
    if (!product) return

    const productImages = product.images || product.gallery || (product.image ? [product.image] : [])
    setFormData({
      name: product.name || '',
      name_bn: product.name_bn || '',
      slug: product.slug || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      unit: product.unit || '',
      price: product.price ?? '',
      oldPrice: product.oldPrice || '',
      stock: product.stock ?? 10,
      badges: Array.isArray(product.badges) ? product.badges.join(', ') : '',
      description: Array.isArray(product.description)
        ? product.description.join('\n')
        : product.description || '',
      description_bn: Array.isArray(product.description_bn)
        ? product.description_bn.join('\n')
        : product.description_bn || '',
      images: productImages,
      imageUrl: '',
      featured: Boolean(product.featured),
      top: Boolean(product.top),
    })
  }, [id, isEditMode, getProductById])

  const handleAddImage = (val) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, val],
    }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.images.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    if (!formData.price) {
      toast.error('Enter the current price')
      return
    }

    const slug = slugify(formData.slug || formData.name)
    if (!slug) {
      toast.error('Enter a product name or slug')
      return
    }

    const duplicateSlug = products.some(
      (p) => p.slug === slug && String(p.id) !== String(id)
    )
    if (duplicateSlug) {
      toast.error('Another product already uses this slug')
      return
    }

    const price = Math.max(0, Math.round(Number(formData.price) || 0))
    const oldPrice = formData.oldPrice ? Math.max(0, Math.round(Number(formData.oldPrice))) : 0
    const stock = formData.stock === '' ? 0 : Math.max(0, Math.round(Number(formData.stock)))

    const productData = {
      name: formData.name.trim(),
      name_bn: formData.name_bn.trim() || formData.name.trim(),
      slug,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand || '',
      unit: formData.unit.trim(),
      price,
      oldPrice: oldPrice > price ? oldPrice : 0,
      stock,
      badges: formData.badges
        .split(',')
        .map((badge) => badge.trim())
        .filter(Boolean),
      description: formData.description,
      description_bn: formData.description_bn || formData.description,
      images: formData.images,
      image: formData.images[0],
      gallery: formData.images,
      featured: formData.featured,
      top: formData.top,
      rating: existingProduct?.rating ?? 0,
      reviewCount: existingProduct?.reviewCount ?? 0,
      sold: existingProduct?.sold ?? 0,
    }

    if (isEditMode) {
      updateProduct(id, productData)
      toast.success('Product updated successfully')
    } else {
      addProduct(productData)
      toast.success('New product added successfully')
    }
    navigate('/admin/products')
  }

  const fieldClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name (English) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g. Sundarban Honey 1kg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name (Bangla)</label>
                  <input
                    type="text"
                    value={formData.name_bn}
                    onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                    className={fieldClass}
                    placeholder="যেমন সুন্দরবনের মধু ১ কেজি"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className={fieldClass}
                    placeholder="Auto-generated from the name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    /products/{slugify(formData.slug || formData.name) || 'product-name'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit / Size</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g. 1 kg, 500 g, 1 L, 24 pcs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className={fieldClass}
                    placeholder="Write details about the product..."
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Bangla)</label>
                  <textarea
                    value={formData.description_bn}
                    onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                    rows="4"
                    className={fieldClass}
                    placeholder="বাংলায় পণ্যের বিবরণ লিখুন..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Falls back to English when left empty.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              <ImageUpload label="" multiple width={800} height={800} onAddMultiple={handleAddImage} />

              {formData.images.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({formData.images.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X size={16} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md">
                            Main Image
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing &amp; Stock</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (৳) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={fieldClass}
                    placeholder="2125"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (৳)</label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className={fieldClass}
                    placeholder="2500"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Shown crossed out when higher than the current price.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={fieldClass}
                    placeholder="10"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value, subcategory: '' })
                    }
                    className={`${fieldClass} bg-white`}
                    required
                  >
                    <option value="">Select Category</option>
                    {mergedCategories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className={`${fieldClass} bg-white`}
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {(selectedCategory?.children || []).map((child) => (
                      <option key={child.slug} value={child.slug}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className={`${fieldClass} bg-white`}
                  >
                    {brands.map((brand) => (
                      <option key={brand.slug} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badges</label>
                  <input
                    type="text"
                    value={formData.badges}
                    onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                    className={fieldClass}
                    placeholder="Best Selling, Organic"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma separated. Known badges: Best Selling, New Arrival, Offered, Premium, Organic.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    Show in Featured Products
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.top}
                      onChange={(e) => setFormData({ ...formData, top: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    Show in Top Products
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg hover:from-gray-800 hover:to-gray-700 transition font-medium shadow-md hover:shadow-lg"
              >
                {isEditMode ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm
