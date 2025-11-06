'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { 
  FaShoppingBag, 
  FaHistory, 
  FaShoppingCart, 
  FaBox, 
  FaClock, 
  FaCheckCircle, 
  FaArrowRight, 
  FaTrendingUp 
} from 'react-icons/fa'
import { getCurrentUser } from '@/utils/auth'

function CustomerDashboardContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  })

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/mock/products?limit=6')
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data.slice(0, 6))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const ordersStr = localStorage.getItem('customerOrders')
      const orders = ordersStr ? JSON.parse(ordersStr) : []
      
      if (Array.isArray(orders)) {
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length,
          completedOrders: orders.filter((o: any) => o.status === 'delivered').length,
          totalSpent: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const user = getCurrentUser()

  // Safety check for all components
  if (typeof ProductCard === 'undefined') {
    console.error('ProductCard is undefined')
    return <div>Error: ProductCard component not found</div>
  }

  if (typeof CardSkeleton === 'undefined') {
    console.error('CardSkeleton is undefined')
    return <div>Error: CardSkeleton component not found</div>
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Banner */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary-600 to-pink-600 text-white rounded-2xl p-8 shadow-xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back, {user?.name || 'Customer'}! 👋
            </h1>
            <p className="text-xl opacity-90">
              Discover amazing products from women entrepreneurs
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-all border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FaBox className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-all border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <FaClock className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-all border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedOrders}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-all border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <FaTrendingUp className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link href="/customer/products" className="card bg-gradient-to-br from-primary-500 to-pink-500 text-white hover:shadow-2xl transition-all block h-full">
              <FaShoppingBag className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-2">Browse Products</h3>
              <p className="opacity-90 mb-4">Explore our wide range of products</p>
              <div className="flex items-center gap-2 text-sm font-semibold">
                Shop Now <FaArrowRight />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link href="/customer/cart" className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-2xl transition-all block h-full">
              <FaShoppingCart className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-2">Shopping Cart</h3>
              <p className="opacity-90 mb-4">Review your selected items</p>
              <div className="flex items-center gap-2 text-sm font-semibold">
                View Cart <FaArrowRight />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link href="/customer/orders" className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:shadow-2xl transition-all block h-full">
              <FaHistory className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-2">Order History</h3>
              <p className="opacity-90 mb-4">Track your orders and deliveries</p>
              <div className="flex items-center gap-2 text-sm font-semibold">
                View Orders <FaArrowRight />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <Link 
              href="/customer/products" 
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-2"
            >
              View All <FaArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card bg-white dark:bg-gray-800 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(p => p && p.id && p.title && typeof p.price === 'number')
                .map((product, index) => {
                  const imageUrl = Array.isArray(product.images) && product.images[0] 
                    ? product.images[0] 
                    : `https://images.unsplash.com/photo-${1500000000000 + (product.id || index)}?w=400&h=400&fit=crop&q=80`
                  
                  return (
                    <motion.div
                      key={product.id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard 
                        product={{
                          id: product.id || index,
                          name: product.title || 'Product',
                          description: product.description || '',
                          price: product.price || 0,
                          imageUrl: imageUrl,
                        }} 
                      />
                    </motion.div>
                  )
                })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  )
}
