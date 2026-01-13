'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentUser } from '@/utils/auth'
import { TableSkeleton } from '@/components/LoadingSkeleton'
import { FaBox, FaEdit, FaTrash, FaEye, FaChartLine } from 'react-icons/fa'

interface Product {
  id: number
  title: string
  description: string
  category: string
  images: string[]
  price: number
  stock: number
  sellerId: number
  village: string
  createdAt: string
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    images: [] as string[],
  })
  const [saving, setSaving] = useState(false)
  const user = getCurrentUser()

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const fetchMyProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        // Filter products by current user's sellerId
        const myProducts = data.data.filter((p: Product) => p.sellerId === user?.id)
        setProducts(myProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        alert('Product deleted successfully! ✅')
        fetchMyProducts() // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to delete product')
      }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      alert(`Failed to delete product: ${error.message}`)
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setEditForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      images: Array.isArray(product.images) ? product.images : [],
    })
  }

  const closeEditModal = () => {
    setEditingProduct(null)
    setSaving(false)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setSaving(true)
    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          price: editForm.price,
          stock: editForm.stock,
          images: editForm.images,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Product updated successfully! ✅')
        closeEditModal()
        fetchMyProducts() // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to update product')
      }
    } catch (error: any) {
      console.error('Error updating product:', error)
      alert(`Failed to update product: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300' }
    if (stock <= 5) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' }
    return { text: 'In Stock', color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' }
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const outOfStock = products.filter(p => p.stock === 0).length
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length

  if (loading) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <TableSkeleton />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaBox className="text-purple-600" /> My Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Track and manage your listed products</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            >
              <FaBox className="text-3xl mb-2 opacity-90" />
              <h3 className="text-lg font-semibold mb-1 opacity-90">Total Products</h3>
              <p className="text-4xl font-bold">{totalProducts}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
            >
              <FaChartLine className="text-3xl mb-2 opacity-90" />
              <h3 className="text-lg font-semibold mb-1 opacity-90">Total Stock</h3>
              <p className="text-4xl font-bold">{totalStock}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
            >
              <FaBox className="text-3xl mb-2 opacity-90" />
              <h3 className="text-lg font-semibold mb-1 opacity-90">Low Stock</h3>
              <p className="text-4xl font-bold">{lowStock}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-red-500 to-red-600 text-white"
            >
              <FaBox className="text-3xl mb-2 opacity-90" />
              <h3 className="text-lg font-semibold mb-1 opacity-90">Out of Stock</h3>
              <p className="text-4xl font-bold">{outOfStock}</p>
            </motion.div>
          </div>

          {/* Products Table */}
          {products.length === 0 ? (
            <div className="card text-center py-12 bg-white dark:bg-gray-800">
              <FaBox className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                You haven't listed any products yet.
              </p>
              <a href="/women/sell" className="btn-primary inline-block">
                List Your First Product
              </a>
            </div>
          ) : (
            <div className="card bg-white dark:bg-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product, index) => {
                      const status = getStockStatus(product.stock)
                      // Use category-based image as default
                      let imageUrl = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&q=80`
                      
                      if (Array.isArray(product.images) && product.images.length > 0 && product.images[0] &&
                          typeof product.images[0] === 'string' && product.images[0].startsWith('http')) {
                        imageUrl = product.images[0]
                      }
                      
                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={imageUrl}
                                alt={product.title}
                                className="w-16 h-16 rounded-lg object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=100&h=100&fit=crop&q=80`
                                }}
                              />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {product.title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">
                              ₹{product.price.toFixed(2)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {product.stock}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => window.location.href = `/customer/products`}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                title="View Product"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => openEditModal(product)}
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Edit Product
                </h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                      Description *
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                        Category *
                      </label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="pickles">Pickles</option>
                        <option value="diya">Diyas & Crafts</option>
                        <option value="handmade">Handmade Items</option>
                        <option value="food">Food Products</option>
                        <option value="textiles">Textiles</option>
                        <option value="jewelry">Jewelry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      disabled={saving}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

