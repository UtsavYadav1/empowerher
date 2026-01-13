'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  FaMapMarkedAlt, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaBoxes,
  FaCalendarPlus,
  FaRoute,
  FaUserPlus,
  FaClipboardCheck,
  FaClock,
  FaMapMarkerAlt,
  FaSync,
  FaChartLine,
  FaAward
} from 'react-icons/fa'

interface Stats {
  overview: {
    villages: number
    workshops: number
    users: number
    products: number
  }
  recentActivities: {
    workshops: Array<{
      id: number
      title: string
      village: string
      date: string
    }>
    users: Array<{
      id: number
      name: string
      village: string | null
      role: string | null
      createdAt: string
    }>
  }
  villageStats: Array<{
    village: string | null
    userCount: number
  }>
  workshopStats: Array<{
    id: number
    title: string
    village: string
    date: string
  }>
}

function FieldAgentDashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/fieldagent/stats')
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

  useEffect(() => {
    fetchStats()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStats()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const statCards = [
    {
      title: 'Villages Covered',
      value: stats?.overview.villages || 0,
      icon: FaMapMarkedAlt,
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-100 dark:bg-pink-900',
      iconColor: 'text-pink-600 dark:text-pink-300',
      description: 'Active locations'
    },
    {
      title: 'Workshops Conducted',
      value: stats?.overview.workshops || 0,
      icon: FaChalkboardTeacher,
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300',
      description: 'Training sessions'
    },
    {
      title: 'Users Registered',
      value: stats?.overview.users || 0,
      icon: FaUsers,
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300',
      description: 'Women & girls'
    },
    {
      title: 'Products Collected',
      value: stats?.overview.products || 0,
      icon: FaBoxes,
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300',
      description: 'Marketplace items'
    },
  ]

  const fieldOperations = [
    {
      title: 'Schedule Workshop',
      icon: FaCalendarPlus,
      description: 'Plan new training session',
      href: '/fieldagent/schedule-workshop',
      gradient: 'from-pink-500 to-rose-600',
      primary: true
    },
    {
      title: 'Visit Village',
      icon: FaRoute,
      description: 'Plan field visit',
      href: '/fieldagent/visit-village',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Register New User',
      icon: FaUserPlus,
      description: 'Add beneficiary',
      href: '/agent',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Product Collection',
      icon: FaClipboardCheck,
      description: 'Collect items',
      href: '/fieldagent/product-collection',
      gradient: 'from-purple-500 to-indigo-600',
    },
  ]

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <FaAward /> Field Agent Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage grassroots operations and community engagement</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary flex items-center gap-2"
              >
                <FaSync className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link href="/agent" className="btn-primary flex items-center gap-2">
                <FaUserPlus />
                Offline Registration
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading statistics...
              </div>
            ) : (
              statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`card bg-gradient-to-br ${card.gradient} text-white relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.iconBg} backdrop-blur-sm`}>
                        <card.icon className={`text-2xl ${card.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">{card.description}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-4xl font-bold mb-1">{card.value}</div>
                      <div className="text-sm font-medium opacity-90">{card.title}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Field Operations */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-lg">
                    <FaChartLine className="text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Field Operations</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {fieldOperations.map((operation, index) => (
                    <motion.div
                      key={operation.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Link
                        href={operation.href}
                        className={`block p-6 rounded-xl ${
                          operation.primary
                            ? `bg-gradient-to-br ${operation.gradient} text-white shadow-lg`
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        } transition-all group`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            operation.primary
                              ? 'bg-white/20'
                              : `bg-gradient-to-br ${operation.gradient}`
                          }`}>
                            <operation.icon className={`text-2xl ${
                              operation.primary ? 'text-white' : 'text-white'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-1 ${
                              operation.primary ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {operation.title}
                            </h3>
                            <p className={`text-sm ${
                              operation.primary ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {operation.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Top Villages */}
              <div className="card bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg">
                    <FaMapMarkedAlt className="text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Top Villages by Engagement</h2>
                </div>
                
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading villages...</div>
                  ) : stats?.villageStats && stats.villageStats.length > 0 ? (
                    stats.villageStats.slice(0, 5).map((village, index) => (
                      <motion.div
                        key={village.village}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {village.village || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {village.userCount} registered users
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {village.userCount}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">No village data available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1">
              <div className="card bg-white dark:bg-gray-800 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg">
                    <FaClock className="text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Recent Activities</h2>
                </div>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading activities...</div>
                  ) : (
                    <>
                      {/* Recent Workshops */}
                      {stats?.recentActivities.workshops && stats.recentActivities.workshops.length > 0 && (
                        <>
                          {stats.recentActivities.workshops.map((workshop, index) => (
                            <motion.div
                              key={`workshop-${workshop.id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-500 p-2 rounded-lg">
                                  <FaChalkboardTeacher className="text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {workshop.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    <span>{workshop.village}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                                    <FaClock />
                                    {getTimeAgo(workshop.date)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </>
                      )}

                      {/* Recent User Registrations */}
                      {stats?.recentActivities.users && stats.recentActivities.users.length > 0 && (
                        <>
                          {stats.recentActivities.users.map((user, index) => (
                            <motion.div
                              key={`user-${user.id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: (stats.recentActivities.workshops.length + index) * 0.05 }}
                              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="bg-green-500 p-2 rounded-lg">
                                  <FaUserPlus className="text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                    New {user.role || 'user'} registered
                                  </p>
                                  <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {user.name}
                                  </div>
                                  {user.village && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      <FaMapMarkerAlt className="text-green-500" />
                                      <span>{user.village}</span>
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                                    <FaClock />
                                    {getTimeAgo(user.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </>
                      )}

                      {!stats?.recentActivities.workshops.length && !stats?.recentActivities.users.length && (
                        <div className="text-center py-8 text-gray-500">No recent activities</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function FieldAgentDashboardPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <FieldAgentDashboardContent />
    </ProtectedRoute>
  )
}


