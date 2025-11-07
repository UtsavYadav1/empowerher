'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/utils/auth'
import { FaArrowLeft, FaBell, FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaGift, FaTrash, FaCheck, FaEnvelope } from 'react-icons/fa'

interface Notification {
  id: number
  type: 'success' | 'info' | 'warning' | 'gift'
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Course Available',
      message: 'A new course "Advanced Digital Marketing" is now available for enrollment.',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'gift',
      title: 'Scholarship Opportunity',
      message: 'Google Women Techmakers Scholarship applications are now open! Apply before Nov 30.',
      time: '1 day ago',
      read: false
    },
    {
      id: 4,
      type: 'warning',
      title: 'Deadline Approaching',
      message: 'Your course "Web Development Basics" assignment is due in 2 days.',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      type: 'info',
      title: 'Event Reminder',
      message: 'Digital Literacy Workshop starts tomorrow at 2:00 PM.',
      time: '2 days ago',
      read: true
    }
  ])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
  }, [router])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500" />
      case 'info': return <FaInfoCircle className="text-blue-500" />
      case 'warning': return <FaExclamationTriangle className="text-orange-500" />
      case 'gift': return <FaGift className="text-pink-500" />
      default: return <FaBell />
    }
  }

  const getBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50 dark:bg-gray-800/50'
    
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500'
      case 'gift': return 'bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-500'
      default: return 'bg-white dark:bg-gray-800'
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="card bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <FaBell className="text-primary-600" /> Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaCheck /> Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="card bg-white dark:bg-gray-800 text-center py-12">
              <FaEnvelope className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Notifications</h2>
              <p className="text-gray-600 dark:text-gray-400">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card ${getBgColor(notification.type, notification.read)} transition-all hover:shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-3xl mt-1">
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-primary-600 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <FaCheck />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Notification Settings Link */}
          <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-300 mb-3">
              Want to change how you receive notifications?
            </p>
            <button
              onClick={() => router.push('/profile/settings')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Go to Settings →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
