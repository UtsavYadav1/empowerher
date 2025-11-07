'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/utils/auth'
import { FaArrowLeft, FaShieldAlt, FaBell, FaGlobe, FaMoon, FaSun, FaLock, FaEye, FaUserSecret, FaCheckCircle } from 'react-icons/fa'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    updates: true,
    marketing: false
  })
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showActivity: false,
    showLocation: true
  })
  const [language, setLanguage] = useState('en')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    
    // Load saved preferences
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const savedLang = localStorage.getItem('language') || 'en'
    setDarkMode(savedDarkMode)
    setLanguage(savedLang)
  }, [router])

  const handleSaveSettings = () => {
    // Save to localStorage (in production, save to backend)
    localStorage.setItem('darkMode', darkMode.toString())
    localStorage.setItem('language', language)
    localStorage.setItem('notifications', JSON.stringify(notifications))
    localStorage.setItem('privacy', JSON.stringify(privacy))
    
    setSuccess('✅ Settings saved successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your preferences and privacy</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 flex items-center gap-2"
            >
              <FaCheckCircle />
              {success}
            </motion.div>
          )}

          {/* Appearance Settings */}
          <div className="card bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaMoon className="text-primary-600" /> Appearance
            </h2>
            
            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {darkMode ? <FaMoon className="text-xl" /> : <FaSun className="text-xl text-yellow-500" />}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark theme</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => {
                      setDarkMode(e.target.checked)
                      if (e.target.checked) {
                        document.documentElement.classList.add('dark')
                      } else {
                        document.documentElement.classList.remove('dark')
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Language */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FaGlobe className="text-xl text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Language</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred language</p>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="hin">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaBell className="text-primary-600" /> Notifications
            </h2>
            
            <div className="space-y-3">
              {Object.entries({
                email: 'Email Notifications',
                sms: 'SMS Notifications',
                push: 'Push Notifications',
                updates: 'Product Updates',
                marketing: 'Marketing Emails'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaUserSecret className="text-primary-600" /> Privacy
            </h2>
            
            <div className="space-y-3">
              {Object.entries({
                showProfile: 'Show profile to other users',
                showActivity: 'Show my activity status',
                showLocation: 'Show my location'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy[key as keyof typeof privacy]}
                      onChange={(e) => setPrivacy({
                        ...privacy,
                        [key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="card bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-primary-600" /> Security
            </h2>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <FaLock className="text-xl" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Change Password</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update your password</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <FaEye className="text-xl" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Active Sessions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your logged-in devices</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSettings}
            className="w-full btn-primary py-4 text-lg font-semibold"
          >
            💾 Save All Settings
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
