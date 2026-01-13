'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import AdminChart from '@/components/AdminChart'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaUsers, FaCheckCircle, FaTimesCircle, FaFileExport, FaCog, FaShoppingCart, FaBox, FaChartLine, FaMoneyBillWave, FaUserShield, FaGraduationCap, FaChartBar, FaSync, FaBell, FaExclamationTriangle, FaArrowUp, FaArrowDown, FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

interface Stats {
  overview: {
    totalUsers: number
    totalProducts: number
    totalOrders: number
    totalSchemes: number
    totalRevenue: number
  }
  usersByRole: Array<{ role: string; count: number }>
  productsByCategory: Array<{ category: string; count: number }>
  monthlyData: Array<{ month: string; users: number; orders: number; revenue: number }>
  recentActivity: Array<{ id: number; name: string; phone: string; role: string | null; village: string | null; verified: boolean; createdAt: string }>
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area')
  const [refreshing, setRefreshing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleExportCSV = () => {
    // Mock CSV export
    const csvContent = 'data:text/csv;charset=utf-8,Name,Email,Role\nUser1,user1@example.com,admin\nUser2,user2@example.com,user'
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'users_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']

  const getPercentageChange = () => {
    if (!stats || stats.monthlyData.length < 2) return 0
    const latest = stats.monthlyData[stats.monthlyData.length - 1]
    const previous = stats.monthlyData[stats.monthlyData.length - 2]
    const change = ((latest.users - previous.users) / previous.users) * 100
    return Math.round(change)
  }

  const roleChartData = stats?.usersByRole.map((role, index) => ({
    name: role.role || 'Unknown',
    value: role.count,
    color: COLORS[index % COLORS.length]
  })) || []

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
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time platform analytics and management</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchStats()}
                disabled={refreshing}
                className="btn-secondary flex items-center gap-2 relative"
              >
                <FaSync className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn-secondary flex items-center gap-2 relative"
              >
                <FaBell />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats?.recentActivity.length || 0}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="btn-primary flex items-center gap-2"
              >
                <FaFileExport />
                Export CSV
              </motion.button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white border-none shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 opacity-90">Total Users</h3>
                      <p className="text-4xl font-bold">{stats?.overview.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <FaUsers className="text-3xl" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getPercentageChange() > 0 ? (
                      <>
                        <FaArrowUp className="text-green-300" />
                        <span className="text-green-300">+{getPercentageChange()}%</span>
                      </>
                    ) : (
                      <>
                        <FaArrowDown className="text-red-300" />
                        <span className="text-red-300">{getPercentageChange()}%</span>
                      </>
                    )}
                    <span className="opacity-75">vs last month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -5 }}
                  className="card bg-gradient-to-br from-pink-500 to-pink-700 text-white border-none shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 opacity-90">Total Products</h3>
                      <p className="text-4xl font-bold">{stats?.overview.totalProducts.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <FaBox className="text-3xl" />
                    </div>
                  </div>
                  <div className="text-sm opacity-75">Active listings</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="card bg-gradient-to-br from-green-500 to-emerald-700 text-white border-none shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 opacity-90">Total Orders</h3>
                      <p className="text-4xl font-bold">{stats?.overview.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <FaShoppingCart className="text-3xl" />
                    </div>
                  </div>
                  <div className="text-sm opacity-75">Completed transactions</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5 }}
                  className="card bg-gradient-to-br from-blue-500 to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 opacity-90">Total Revenue</h3>
                      <p className="text-4xl font-bold">₹{stats?.overview.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <FaMoneyBillWave className="text-3xl" />
                    </div>
                  </div>
                  <div className="text-sm opacity-75">All-time earnings</div>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 card bg-white dark:bg-gray-800 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaChartLine className="text-primary-600" />
                      Platform Analytics
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartType('area')}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                          chartType === 'area'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Area
                      </button>
                      <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                          chartType === 'line'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                          chartType === 'bar'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Bar
                      </button>
                    </div>
                  </div>
                  <AdminChart type={chartType} />
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaUserShield className="text-pink-600" />
                    Users by Role
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={roleChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {stats?.usersByRole.map((role, index) => (
                      <div key={role.role} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="capitalize">{role.role}</span>
                        </div>
                        <span className="font-bold">{role.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Management Tools & Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card bg-white dark:bg-gray-800 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaCog className="text-blue-600" />
                    Management Tools
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/admin/users"
                      className="btn-primary text-center py-4 hover:scale-105 transition-transform"
                    >
                      <FaUsers className="text-2xl mx-auto mb-2" />
                      <div className="font-semibold">Manage Users</div>
                      <div className="text-sm opacity-75">{stats?.overview.totalUsers} total</div>
                    </Link>
                    <Link
                      href="/admin/products"
                      className="btn-secondary text-center py-4 hover:scale-105 transition-transform"
                    >
                      <FaBox className="text-2xl mx-auto mb-2" />
                      <div className="font-semibold">Manage Products</div>
                      <div className="text-sm opacity-75">{stats?.overview.totalProducts} listings</div>
                    </Link>
                    <Link
                      href="/admin/schemes"
                      className="btn-secondary text-center py-4 hover:scale-105 transition-transform"
                    >
                      <FaGraduationCap className="text-2xl mx-auto mb-2" />
                      <div className="font-semibold">Manage Schemes</div>
                      <div className="text-sm opacity-75">{stats?.overview.totalSchemes} active</div>
                    </Link>
                    <Link
                      href="/admin/workshops"
                      className="btn-secondary text-center py-4 hover:scale-105 transition-transform"
                    >
                      <FaChartBar className="text-2xl mx-auto mb-2" />
                      <div className="font-semibold">Manage Workshops</div>
                      <div className="text-sm opacity-75">View all</div>
                    </Link>
                  </div>
                </div>

                <div className="card bg-white dark:bg-gray-800 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaBell className="text-amber-600" />
                    Recent Activity
                  </h2>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {stats?.recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                          <FaUsers className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {activity.name}
                            {!activity.verified && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                Pending
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Role: <span className="capitalize">{activity.role}</span> • {activity.village}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          href={`/admin/users`}
                          className="text-primary-600 hover:text-primary-700 p-2"
                        >
                          <FaEye />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}


