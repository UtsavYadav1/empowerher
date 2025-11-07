'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaBox, FaEdit, FaTrash, FaSearch, FaFilter, FaArrowLeft, FaEye } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  sellerId: number
  createdAt: string
}

function ManageProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/mock/products')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/mock/products?id=${productId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Product deleted successfully!')
        fetchProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleViewProduct = (product: Product) => {
    setViewProduct(product)
    setShowViewModal(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category)))

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' }
  }

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length
  const outOfStockCount = products.filter(p => p.stock === 0).length

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-2">
                <FaArrowLeft /> Back to Dashboard
              </Link>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <FaBox /> Manage Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage all marketplace products</p>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <div className="text-sm opacity-90">Total Products</div>
              <div className="text-3xl font-bold">{products.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
              <div className="text-sm opacity-90">Total Value</div>
              <div className="text-3xl font-bold">₹{totalValue.toLocaleString()}</div>
            </div>
            <div className="card bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <div className="text-sm opacity-90">Low Stock</div>
              <div className="text-3xl font-bold">{lowStockCount}</div>
            </div>
            <div className="card bg-gradient-to-br from-red-500 to-red-700 text-white">
              <div className="text-sm opacity-90">Out of Stock</div>
              <div className="text-3xl font-bold">{outOfStockCount}</div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="card bg-white dark:bg-gray-800 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <FaBox className="text-4xl" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-primary-600">₹{product.price}</div>
                          <div className="text-xs text-gray-500">Stock: {product.stock} units</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Category</div>
                          <div className="text-sm font-semibold">{product.category}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn-secondary text-sm py-2 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* View Modal */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full my-8"
          >
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Images */}
              <div>
                <div className="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                  {viewProduct.images && viewProduct.images.length > 0 ? (
                    <Image
                      src={viewProduct.images[0]}
                      alt={viewProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <FaBox className="text-6xl" />
                    </div>
                  )}
                </div>
                {viewProduct.images && viewProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {viewProduct.images.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="relative h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                        <Image src={img} alt={`${viewProduct.name} ${idx + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{viewProduct.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{viewProduct.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Price</span>
                    <span className="text-2xl font-bold text-primary-600">₹{viewProduct.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Stock</span>
                    <span className="font-semibold">{viewProduct.stock} units</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-semibold">{viewProduct.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Seller ID</span>
                    <span className="font-semibold">{viewProduct.sellerId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Listed On</span>
                    <span className="font-semibold">{new Date(viewProduct.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowViewModal(false)} className="btn-primary w-full mt-6">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function ManageProductsPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <ManageProductsContent />
    </ProtectedRoute>
  )
}
