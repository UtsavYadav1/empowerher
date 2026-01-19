'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout, getDashboardPath } from '@/utils/auth'
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaBell, FaHeart, FaCertificate, FaEdit } from 'react-icons/fa'


function QuickStats() {
  const [stats, setStats] = useState({ certificates: 0, courses: 0, schemes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/girls/stats')
        const data = await response.json()

        // Get schemes from localStorage
        const appliedSchemes = JSON.parse(localStorage.getItem('appliedSchemes') || '[]')

        if (data.success) {
          setStats({
            certificates: data.data?.stats?.certificates || 0,
            courses: (data.data?.stats?.enrolled || 0) + (data.data?.stats?.completed || 0),
            schemes: appliedSchemes.length
          })
        }
      } catch (error) {
        console.error('Failed to fetch user stats', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-4 text-center text-xs text-gray-500">Loading stats...</div>

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <FaCertificate className="text-purple-600 mx-auto mb-1" />
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{stats.certificates}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Certificates</p>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <FaHeart className="text-blue-600 mx-auto mb-1" />
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{stats.courses}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Courses</p>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <FaShieldAlt className="text-green-600 mx-auto mb-1" />
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{stats.schemes}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Schemes</p>
        </div>
      </div>
    </div>
  )
}

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push('/login')
  }

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'girl': 'Girl/Woman',
      'customer': 'Customer',
      'women': 'Women Entrepreneur',
      'agent': 'Agent',
      'fieldagent': 'Field Agent',
      'admin': 'Administrator'
    }
    return roleMap[role] || role
  }

  const getRoleBadgeColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      'girl': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'customer': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'women': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'agent': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'fieldagent': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'admin': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    }
    return colorMap[role] || 'bg-gray-100 text-gray-700'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) return null

  const dashboardPath = user.role ? getDashboardPath(user.role) : '/role-select'

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {getInitials(user.name)}
        </div>

        {/* Name (hidden on mobile) */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {user.name.split(' ')[0]}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getRoleDisplay(user.role)}
          </p>
        </div>

        <FaChevronDown className={`text-gray-500 dark:text-gray-400 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-500 to-pink-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${getRoleBadgeColor(user.role)} bg-white/90`}>
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-2 text-sm">
                {user.email && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaEnvelope className="text-primary-600" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaPhone className="text-primary-600" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.village && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaMapMarkerAlt className="text-primary-600" />
                    <span>{user.village}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats (for Girl/Women role) */}
            {(user.role === 'girl' || user.role === 'women') && (
              <QuickStats />
            )}

            {/* Menu Items */}
            <div className="p-2">
              <Link
                href={dashboardPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaUser className="text-primary-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">My Dashboard</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View your activity</p>
                </div>
              </Link>

              <Link
                href="/profile/edit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaEdit className="text-primary-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Edit Profile</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Update your information</p>
                </div>
              </Link>

              <Link
                href="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaCog className="text-primary-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Privacy & preferences</p>
                </div>
              </Link>

              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaBell className="text-primary-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage alerts</p>
                </div>
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">3</span>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-semibold"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>

            {/* Version */}
            <div className="p-2 bg-gray-50 dark:bg-gray-900/50 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                EmpowerHer v1.0.0 • Secure Connection 🔒
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
