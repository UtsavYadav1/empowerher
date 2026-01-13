'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentUser } from '@/utils/auth'
import { FaPlus, FaImage, FaRupeeSign, FaBox, FaTag } from 'react-icons/fa'

export default function SellPage() {
  const user = getCurrentUser()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pickles',
    price: '',
    stock: '',
    images: [] as string[],
    village: user?.village || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = [
    { value: 'pickles', label: 'Pickles' },
    { value: 'diya', label: 'Diyas & Crafts' },
    { value: 'handmade', label: 'Handmade Items' },
    { value: 'food', label: 'Food Products' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'jewelry', label: 'Jewelry' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      console.log('Submitting product:', {
        ...formData,
        sellerId: user?.id,
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: formData.price,
          stock: formData.stock,
          sellerId: user?.id || 1,
          village: formData.village,
          images: formData.images.length > 0 ? formData.images : [],
        }),
      })

      const data = await response.json()
      console.log('Server response:', data)

      if (response.ok && data.success) {
        setSuccess(true)
        alert('Product listed successfully! 🎉')
        setFormData({
          title: '',
          description: '',
          category: 'pickles',
          price: '',
          stock: '',
          images: [],
          village: user?.village || '',
        })
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error(data.error || 'Failed to list product')
      }
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert(`Failed to create product: ${error.message}. Please check the console and try again.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaPlus className="text-green-600" /> List Your Product
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Add your products to start selling</p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg text-lg"
              role="alert"
            >
              ✓ Product listed successfully! It will be visible to customers shortly.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="card bg-white dark:bg-gray-800 space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Spicy Mango Pickle"
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product in detail..."
                rows={5}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <FaTag /> Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <FaRupeeSign /> Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="150"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBox /> Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="10"
                  min="1"
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Village *
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Your village name"
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                <FaImage /> Product Images (URLs)
              </label>
              <input
                type="text"
                placeholder="Enter image URL (optional)"
                onBlur={(e) => {
                  if (e.target.value) {
                    setFormData({
                      ...formData,
                      images: [...formData.images, e.target.value],
                    })
                    e.target.value = ''
                  }
                }}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {formData.images.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Listing...' : (
                <>
                  <FaPlus /> List Product
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}


