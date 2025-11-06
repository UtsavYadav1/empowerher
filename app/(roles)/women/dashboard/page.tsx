'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BusinessChart from '@/components/BusinessChart'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaVideo, FaMoneyBillWave, FaComments, FaShoppingBag, FaBox, FaChartBar, FaRocket, FaTrophy, FaUsers, FaRupeeSign } from 'react-icons/fa'

function WomenDashboardContent() {
  const [stats, setStats] = useState({
    revenue: 12500,
    orders: 34,
    products: 12,
    customers: 89,
    revenueGrowth: 15.5,
    ordersGrowth: 8.2,
  })

  return (
    <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-gradient-to-r from-primary-600 via-red-600 to-orange-600 text-white p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Women Entrepreneur Dashboard 👩‍💼</h1>
                <p className="text-xl opacity-90">Grow your business with our tools and resources</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Revenue</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Links */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Link href="/women/tutorials" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaVideo className="text-4xl text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Tutorials</h3>
          </Link>
          <Link href="/women/finance" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaMoneyBillWave className="text-4xl text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Finance</h3>
          </Link>
          <Link href="/women/feedback" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaComments className="text-4xl text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Feedback</h3>
          </Link>
          <Link href="/women/sell" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaShoppingBag className="text-4xl text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Sell</h3>
          </Link>
          <Link href="/women/orders" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaBox className="text-4xl text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Orders</h3>
          </Link>
          <Link href="/women/analytics" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaChartBar className="text-4xl text-pink-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Analytics</h3>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <FaRupeeSign className="text-3xl opacity-90" />
              <FaRocket className="text-green-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Revenue</h3>
            <p className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">+{stats.revenueGrowth}% growth</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <FaBox className="text-3xl opacity-90" />
              <FaRocket className="text-green-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Orders</h3>
            <p className="text-3xl font-bold">{stats.orders}</p>
            <p className="text-sm mt-2 opacity-90">+{stats.ordersGrowth}% growth</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all"
          >
            <FaShoppingBag className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Products</h3>
            <p className="text-3xl font-bold">{stats.products}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all"
          >
            <FaUsers className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Customers</h3>
            <p className="text-3xl font-bold">{stats.customers}</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaChartBar className="text-primary-600" /> Business Analytics
            </h2>
            <BusinessChart />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaRocket className="text-primary-600" /> Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/women/sell" className="btn-primary w-full flex items-center justify-center gap-2">
                <FaShoppingBag /> Add New Product
              </Link>
              <Link href="/women/orders" className="btn-secondary w-full flex items-center justify-center gap-2">
                <FaBox /> View Orders
              </Link>
              <Link href="/women/analytics" className="btn-secondary w-full flex items-center justify-center gap-2">
                <FaChartBar /> View Analytics
              </Link>
              <Link href="/women/tutorials" className="btn-secondary w-full flex items-center justify-center gap-2">
                <FaVideo /> Learn Skills
              </Link>
            </div>
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
