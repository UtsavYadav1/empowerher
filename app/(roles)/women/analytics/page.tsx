'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { getCurrentUser } from '@/utils/auth'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FaChartLine, FaRupeeSign, FaBox, FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa'

const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

export default function AnalyticsPage() {
  const user = getCurrentUser()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
  })

  const [revenueData, setRevenueData] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      if (!user?.id) {
        setLoading(false)
        return
      }

      // Fetch real-time stats
      const statsResponse = await fetch(`/api/women/stats?sellerId=${user.id}`)
      const statsData = await statsResponse.json()
      
      if (statsData.success) {
        setStats({
          totalRevenue: statsData.data.revenue,
          totalOrders: statsData.data.orders,
          totalProducts: statsData.data.products,
          totalCustomers: statsData.data.customers,
          revenueChange: statsData.data.revenueGrowth,
          ordersChange: statsData.data.ordersGrowth,
        })
      }

      // Fetch real analytics data
      const analyticsResponse = await fetch(`/api/women/analytics?sellerId=${user.id}`)
      const analyticsData = await analyticsResponse.json()
      
      if (analyticsData.success) {
        // Use real data from database
        setRevenueData(analyticsData.data.revenueByMonth.length > 0 
          ? analyticsData.data.revenueByMonth 
          : [{ month: 'No Data', revenue: 0 }]
        )

        setSalesData(analyticsData.data.salesByProduct.length > 0 
          ? analyticsData.data.salesByProduct 
          : [{ product: 'No Sales Yet', sales: 0 }]
        )

        setCategoryData(analyticsData.data.salesByCategory.length > 0 
          ? analyticsData.data.salesByCategory 
          : [{ name: 'No Data', value: 1 }]
        )
      } else {
        // Fallback to empty data if no analytics yet
        setRevenueData([{ month: 'No Data', revenue: 0 }])
        setSalesData([{ product: 'No Sales Yet', sales: 0 }])
        setCategoryData([{ name: 'No Data', value: 1 }])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Show empty state on error
      setRevenueData([{ month: 'Error', revenue: 0 }])
      setSalesData([{ product: 'Error Loading', sales: 0 }])
      setCategoryData([{ name: 'Error', value: 1 }])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaChartLine className="text-purple-600" /> Business Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Track your business performance and growth</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-primary-500 to-pink-600 text-white"
            >
              <div className="flex items-center justify-between mb-3">
                <FaRupeeSign className="text-3xl opacity-90" />
                {stats.revenueChange > 0 ? (
                  <FaArrowUp className="text-green-300" />
                ) : (
                  <FaArrowDown className="text-red-300" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-90">
                {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}% from last month
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            >
              <div className="flex items-center justify-between mb-3">
                <FaBox className="text-3xl opacity-90" />
                {stats.ordersChange > 0 ? (
                  <FaArrowUp className="text-green-300" />
                ) : (
                  <FaArrowDown className="text-red-300" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 opacity-90">Total Orders</h3>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
              <p className="text-sm mt-2 opacity-90">
                {stats.ordersChange > 0 ? '+' : ''}{stats.ordersChange}% from last month
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
            >
              <FaBox className="text-3xl mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2 opacity-90">Active Products</h3>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
            >
              <FaUsers className="text-3xl mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2 opacity-90">Total Customers</h3>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-white dark:bg-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-white dark:bg-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sales by Product</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}


