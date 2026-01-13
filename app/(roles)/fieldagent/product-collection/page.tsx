'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaClipboardCheck, FaArrowLeft, FaBox, FaUser, FaMapMarkerAlt, FaCheckCircle, FaImage, FaRupeeSign } from 'react-icons/fa'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

function ProductCollectionContent() {
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerPhone: '',
    village: '',
    productName: '',
    description: '',
    category: '',
    price: '',
    stock: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = [
    'Handicrafts',
    'Textiles',
    'Jewelry',
    'Home Decor',
    'Food Products',
    'Art & Paintings',
    'Traditional Crafts',
    'Accessories',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, check if seller exists or create new one
      const productData = {
        name: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        sellerId: 1, // Default seller ID for field collections
        images: [],
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setFormData({
          sellerName: '',
          sellerPhone: '',
          village: '',
          productName: '',
          description: '',
          category: '',
          price: '',
          stock: '',
        })
        
        setTimeout(() => setSuccess(false), 3000)
      } else {
        alert('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link href="/fieldagent/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <FaClipboardCheck /> Product Collection
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Collect handmade products from women and girls for the marketplace</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg flex items-center gap-3"
            >
              <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
              <div>
                <div className="font-bold text-green-800 dark:text-green-200">Product Added Successfully!</div>
                <div className="text-sm text-green-700 dark:text-green-300">The product has been added to the marketplace.</div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <div className="card bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seller Information Section */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <FaUser />
                  Seller Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Seller Name
                    </label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleChange}
                      required
                      placeholder="Woman/Girl's name"
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={handleChange}
                      required
                      placeholder="10-digit phone number"
                      className="input-field w-full"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    Village
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                    placeholder="Village name"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Product Information Section */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                  <FaBox />
                  Product Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Handwoven Cotton Saree"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Select category...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Describe the product, materials used, craftsmanship..."
                      className="input-field w-full"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <FaRupeeSign className="text-green-600" />
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Price in rupees"
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <FaBox className="text-purple-600" />
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Available quantity"
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Add to Marketplace
                    </>
                  )}
                </button>
                <Link href="/fieldagent/dashboard" className="btn-secondary flex items-center justify-center px-6">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <FaBox className="text-3xl mb-2" />
              <h3 className="font-bold mb-1">Quality Check</h3>
              <p className="text-sm opacity-90">Ensure all products meet quality standards</p>
            </div>
            <div className="card bg-gradient-to-br from-pink-500 to-rose-600 text-white">
              <FaRupeeSign className="text-3xl mb-2" />
              <h3 className="font-bold mb-1">Fair Pricing</h3>
              <p className="text-sm opacity-90">Help sellers set competitive prices</p>
            </div>
            <div className="card bg-gradient-to-br from-rose-500 to-red-600 text-white">
              <FaImage className="text-3xl mb-2" />
              <h3 className="font-bold mb-1">Photo Documentation</h3>
              <p className="text-sm opacity-90">Take clear photos of products for listing</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ProductCollectionPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <ProductCollectionContent />
    </ProtectedRoute>
  )
}

