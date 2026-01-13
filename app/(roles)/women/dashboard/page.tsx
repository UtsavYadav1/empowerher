'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BusinessChart from '@/components/BusinessChart'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentUser } from '@/utils/auth'
import { FaVideo, FaMoneyBillWave, FaComments, FaShoppingBag, FaBox, FaChartBar, FaRocket, FaTrophy, FaUsers, FaRupeeSign, FaArrowUp, FaArrowDown, FaStar, FaFire, FaBolt, FaGem, FaCrown, FaHeart, FaBell, FaPlus, FaEye, FaCheckCircle, FaClock, FaTag } from 'react-icons/fa'

function WomenDashboardContent() {
  const user = getCurrentUser()
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchActivity()
  }, [])

  const fetchStats = async () => {
    try {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const response = await fetch(`/api/women/stats?sellerId=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivity = async () => {
    try {
      if (!user?.id) {
        setActivityLoading(false)
        return
      }

      const response = await fetch(`/api/women/activity?sellerId=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setRecentActivity(data.data)
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setActivityLoading(false)
    }
  }

  // Helper function to calculate relative time
  const getRelativeTime = (timestamp: string | Date) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return past.toLocaleDateString()
  }

  // Calculate achievements
  const achievements = [
    { id: 1, title: 'First Sale', icon: FaTrophy, color: 'text-yellow-500', achieved: stats.orders > 0 },
    { id: 2, title: 'Rising Star', icon: FaStar, color: 'text-purple-500', achieved: stats.revenue > 5000 },
    { id: 3, title: 'Top Seller', icon: FaCrown, color: 'text-orange-500', achieved: stats.orders > 10 },
    { id: 4, title: 'Customer Favorite', icon: FaHeart, color: 'text-pink-500', achieved: stats.customers > 5 },
  ]

  const achievedCount = achievements.filter(a => a.achieved).length

  return (
    <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Section - Glass Morphism */}
        <div className="mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-orange-500/90 shadow-2xl border border-white/20"
          >
            {/* Animated Gradient Overlay */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 bg-[length:200%_200%]"
            />
            
            <div className="relative p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-5xl"
                      >
                        👩‍💼
                      </motion.div>
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
                          Welcome Back, {user?.name?.split(' ')[0] || 'Entrepreneur'}!
                        </h1>
                        <p className="text-lg text-white/90 flex items-center gap-2">
                          <FaFire className="text-orange-300" />
                          Grow your business with powerful tools
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Revenue Highlight with Animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                    <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FaRupeeSign className="text-2xl text-yellow-300" />
                        <span className="text-sm font-semibold text-white/80">Total Revenue</span>
                      </div>
                      <motion.div
                        key={stats.revenue}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-bold text-white mb-1"
                      >
                        ₹{stats.revenue.toLocaleString()}
                      </motion.div>
                      {stats.revenueGrowth > 0 && (
                        <div className="flex items-center gap-1 text-green-300 text-sm font-semibold">
                          <FaArrowUp /> +{stats.revenueGrowth}% growth
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Achievement Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <FaTrophy className="text-yellow-300" /> Achievements
                  </span>
                  <span className="text-white/90 text-sm">{achievedCount} of {achievements.length}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievedCount / achievements.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Links - Enhanced with Hover Effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('tutorials')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/tutorials" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'tutorials' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaVideo className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">Tutorials</h3>
                <p className="text-xs mt-1 opacity-90">Learn new skills</p>
              </div>
              {hoveredCard === 'tutorials' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('finance')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/finance" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'finance' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaMoneyBillWave className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">Finance</h3>
                <p className="text-xs mt-1 opacity-90">Manage money</p>
              </div>
              {hoveredCard === 'finance' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-green-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('feedback')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/feedback" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'feedback' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaComments className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">Feedback</h3>
                <p className="text-xs mt-1 opacity-90">Customer reviews</p>
              </div>
              {hoveredCard === 'feedback' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-blue-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('sell')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/sell" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'sell' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaShoppingBag className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">Sell</h3>
                <p className="text-xs mt-1 opacity-90">Add products</p>
              </div>
              {hoveredCard === 'sell' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-purple-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('products')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/my-products" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'products' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaBox className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">My Products</h3>
                <p className="text-xs mt-1 opacity-90">Manage items</p>
              </div>
              {hoveredCard === 'products' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-indigo-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('orders')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/orders" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'orders' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaBox className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">Orders</h3>
                <p className="text-xs mt-1 opacity-90">Track sales</p>
              </div>
              {hoveredCard === 'orders' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-orange-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard('analytics')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href="/women/analytics" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600"></div>
              <div className="relative p-6 text-white text-center">
                <motion.div
                  animate={{ rotate: hoveredCard === 'analytics' ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaChartBar className="text-4xl mx-auto mb-3" />
                </motion.div>
                <h3 className="font-bold text-base">Analytics</h3>
                <p className="text-xs mt-1 opacity-90">View insights</p>
              </div>
              {hoveredCard === 'analytics' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 bg-white text-pink-600 rounded-full p-1"
                >
                  <FaBolt className="text-sm" />
                </motion.div>
              )}
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards - Glass Morphism with Advanced Animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
                  <FaRupeeSign className="text-2xl text-white" />
                </div>
                {stats.revenueGrowth > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold"
                  >
                    <FaArrowUp /> {stats.revenueGrowth}%
                  </motion.div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Revenue</h3>
              <motion.p
                key={stats.revenue}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                ₹{stats.revenue.toLocaleString()}
              </motion.p>
              <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <FaBox className="text-2xl text-white" />
                </div>
                {stats.ordersGrowth > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold"
                  >
                    <FaArrowUp /> {stats.ordersGrowth}%
                  </motion.div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Orders</h3>
              <motion.p
                key={stats.orders}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {stats.orders}
              </motion.p>
              <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <FaShoppingBag className="text-2xl text-white" />
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="text-green-500"
                >
                  <FaStar />
                </motion.div>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">My Products</h3>
              <motion.p
                key={stats.products}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {stats.products}
              </motion.p>
              <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-purple-500"
                >
                  <FaHeart />
                </motion.div>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Customers</h3>
              <motion.p
                key={stats.customers}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {stats.customers}
              </motion.p>
              <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievement Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 relative z-10"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaTrophy className="text-yellow-500" /> Your Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`relative p-4 rounded-xl text-center transition-all ${
                      achievement.achieved
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400 dark:border-yellow-600'
                        : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 opacity-50'
                    }`}
                  >
                    {achievement.achieved && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                      >
                        <FaCheckCircle className="text-sm" />
                      </motion.div>
                    )}
                    <Icon className={`text-4xl mx-auto mb-2 ${achievement.achieved ? achievement.color : 'text-gray-400'}`} />
                    <p className={`text-sm font-semibold ${achievement.achieved ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      {achievement.title}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Content - 3 Columns Layout */}
        <div className="grid lg:grid-cols-3 gap-6 relative z-10">
          {/* Business Analytics - Glass Morphism */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <FaChartBar className="text-white" />
                  </div>
                  Business Analytics
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <FaEye /> View Details
                </motion.button>
              </div>
              <BusinessChart sellerId={user?.id} />
            </div>

            {/* Recent Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <FaBell className="text-orange-500" /> Recent Activity
                  </h2>
                  <motion.button
                    whileHover={{ rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setActivityLoading(true)
                      fetchActivity()
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Refresh activity"
                  >
                    <motion.div
                      animate={{ rotate: activityLoading ? 360 : 0 }}
                      transition={{ duration: 1, repeat: activityLoading ? Infinity : 0, ease: 'linear' }}
                    >
                      🔄
                    </motion.div>
                  </motion.button>
                </div>
                
                {activityLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-pulse">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBell className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start selling to see activity here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                    >
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'sale' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                        activity.type === 'product' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      }`}>
                        {activity.type === 'sale' ? <FaRupeeSign /> :
                         activity.type === 'product' ? <FaEye /> :
                         <FaUsers />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaClock className="text-xs text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{getRelativeTime(activity.timestamp)}</span>
                        </div>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₹{activity.amount}
                          </p>
                        </div>
                      )}
                      <FaArrowUp className="text-gray-400 group-hover:text-primary-600 transition-colors rotate-45" />
                    </motion.div>
                  ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-6"
          >
            {/* Quick Actions Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg">
                  <FaRocket className="text-white" />
                </div>
                Quick Actions
              </h2>
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/women/sell" className="block p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaPlus className="text-2xl" />
                        <div>
                          <p className="font-bold">Add Product</p>
                          <p className="text-xs opacity-90">List new item</p>
                        </div>
                      </div>
                      <FaBolt className="text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/women/orders" className="block p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                          <FaBox />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">View Orders</p>
                          <p className="text-xs text-gray-500">Manage sales</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/women/analytics" className="block p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                          <FaChartBar />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Analytics</p>
                          <p className="text-xs text-gray-500">View insights</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/women/tutorials" className="block p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                          <FaVideo />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Tutorials</p>
                          <p className="text-xs text-gray-500">Learn skills</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Tips & Insights Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-orange-200 dark:border-orange-800/30"
            >
              <div className="flex items-center gap-2 mb-3">
                <FaGem className="text-2xl text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pro Tip</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Add high-quality photos to your products to increase sales by up to 40%!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Learn more →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function WomenDashboardPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <WomenDashboardContent />
    </ProtectedRoute>
  )
}

