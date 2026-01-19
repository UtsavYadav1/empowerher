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
  FaChartLine
} from 'react-icons/fa'
import { getCurrentUser } from '@/utils/auth'

// Helper function to get product-specific images based on category and name
const getProductImage = (category: string, productName: string, productId: number) => {
  const name = productName.toLowerCase()

  // Match specific product names first
  if (name.includes('mango') || name.includes('aam')) {
    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop&q=80'
  }
  if (name.includes('spicy') || name.includes('chili') || name.includes('mirch')) {
    return 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop&q=80'
  }
  if (name.includes('coconut') || name.includes('nariyal')) {
    return 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=400&fit=crop&q=80'
  }
  if (name.includes('lemon') || name.includes('nimbu')) {
    return 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&q=80'
  }
  if (name.includes('garlic') || name.includes('lahsun')) {
    return 'https://images.unsplash.com/photo-1580797542185-90ce4a22e7c4?w=400&h=400&fit=crop&q=80'
  }

  // Category-specific diverse images
  const categoryImages: { [key: string]: string[] } = {
    pickles: [
      'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599909533650-d0dbde68a7b4?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=400&fit=crop&q=80',
    ],
    diya: [
      'https://images.unsplash.com/photo-1605815797511-d87b62d4c7eb?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578663248855-df9b85c039cd?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?w=400&h=400&fit=crop&q=80',
    ],
    crafts: [
      'https://images.unsplash.com/photo-1582547534946-b6d906a87e09?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611048269832-64f29e1e4fd6?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop&q=80',
    ],
    textiles: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea3c8bf5?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519057560463-2e2d5b61f099?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop&q=80',
    ],
    jewelry: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&q=80',
    ],
    home_decor: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&h=400&fit=crop&q=80',
    ],
    handmade: [
      'https://images.unsplash.com/photo-1582547534946-b6d906a87e09?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop&q=80',
    ],
  }

  const images = categoryImages[category.toLowerCase()] || [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80',
  ]

  return images[productId % images.length]
}

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
      const response = await fetch('/api/products?limit=6')
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
      let allOrders: any[] = []

      // Fetch orders from database if user is logged in
      if (user?.id) {
        try {
          const response = await fetch(`/api/orders?customerId=${user.id}`)
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            allOrders = data.data
          }
        } catch (dbError) {
          console.error('Error fetching orders from database:', dbError)
        }
      }

      // Also check localStorage for any pending orders not yet synced
      try {
        const ordersStr = localStorage.getItem('customerOrders')
        const localOrders = ordersStr ? JSON.parse(ordersStr) : []
        if (Array.isArray(localOrders) && localOrders.length > 0) {
          // Merge with database orders (avoid duplicates by id)
          const dbOrderIds = new Set(allOrders.map(o => o.id))
          const uniqueLocalOrders = localOrders.filter((o: any) => !dbOrderIds.has(o.id))
          allOrders = [...allOrders, ...uniqueLocalOrders]
        }
      } catch (localError) {
        console.error('Error reading localStorage:', localError)
      }

      if (Array.isArray(allOrders)) {
        setStats({
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter((o: any) =>
            o.status === 'pending' || o.status === 'processing' || o.status === 'shipped'
          ).length,
          completedOrders: allOrders.filter((o: any) => o.status === 'delivered').length,
          totalSpent: allOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
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
                <FaChartLine className="text-2xl text-purple-600 dark:text-purple-400" />
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
                  // Only override if product has actual custom images
                  if (Array.isArray(product.images) && product.images.length > 0 &&
                    product.images[0] && typeof product.images[0] === 'string' &&
                    product.images[0].trim().length > 0) {
                    imageUrl = product.images[0]
                  } else {
                    // Fallback to generated image
                    imageUrl = getProductImage(product.category || 'handmade', product.title || 'Product', product.id || index)
                  }

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

