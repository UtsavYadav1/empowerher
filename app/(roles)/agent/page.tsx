'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaSync, FaWifi, FaCheckCircle, FaExclamationTriangle, FaSignal, FaUserPlus, FaClock } from 'react-icons/fa'
import localforage from 'localforage'

interface OfflineUser {
  id: string
  name: string
  phone: string
  village: string
  role: string
  timestamp: string
  synced: boolean
}

export default function AgentPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [pendingUsers, setPendingUsers] = useState<OfflineUser[]>([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    role: 'woman',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load pending users from IndexedDB
    loadPendingUsers()

    // Auto-sync when coming online
    if (navigator.onLine) {
      syncPendingUsers()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadPendingUsers = async () => {
    try {
      const users = await localforage.getItem<OfflineUser[]>('pendingUsers') || []
      setPendingUsers(users.filter(u => !u.synced))
      setLoading(false)
    } catch (error) {
      console.error('Error loading pending users:', error)
      setLoading(false)
    }
  }

  const saveOfflineUser = async (user: OfflineUser) => {
    try {
      const existing = await localforage.getItem<OfflineUser[]>('pendingUsers') || []
      existing.push(user)
      await localforage.setItem('pendingUsers', existing)
      setPendingUsers(existing.filter(u => !u.synced))
    } catch (error) {
      console.error('Error saving offline user:', error)
    }
  }

  const syncPendingUsers = async () => {
    if (!isOnline) return

    setSyncStatus('syncing')
    try {
      const pending = await localforage.getItem<OfflineUser[]>('pendingUsers') || []
      const unsynced = pending.filter(u => !u.synced)

      if (unsynced.length === 0) {
        setSyncStatus('idle')
        return
      }

      // Sync each user
      for (const user of unsynced) {
        try {
          const response = await fetch('/api/mock/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              phone: user.phone,
              village: user.village,
              role: user.role,
              password: 'temp_password_' + Date.now(),
            }),
          })

          if (response.ok) {
            user.synced = true
          }
        } catch (error) {
          console.error('Error syncing user:', error)
        }
      }

      // Update IndexedDB
      await localforage.setItem('pendingUsers', pending)
      setPendingUsers(pending.filter(u => !u.synced))
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (error) {
      console.error('Error syncing:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const offlineUser: OfflineUser = {
      id: `offline_${Date.now()}_${Math.random()}`,
      name: formData.name,
      phone: formData.phone,
      village: formData.village,
      role: formData.role,
      timestamp: new Date().toISOString(),
      synced: false,
    }

    if (isOnline) {
      // Try to sync immediately
      try {
        const response = await fetch('/api/mock/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            village: formData.village,
            role: formData.role,
            password: 'temp_password_' + Date.now(),
          }),
        })

        if (response.ok) {
          offlineUser.synced = true
          alert('User registered successfully!')
        } else {
          throw new Error('Sync failed')
        }
      } catch (error) {
        console.error('Error syncing:', error)
        // Save offline if sync fails
      }
    }

    // Save to IndexedDB
    await saveOfflineUser(offlineUser)

    // Reset form
    setFormData({
      name: '',
      phone: '',
      village: '',
      role: 'woman',
    })

    if (!isOnline) {
      alert('User saved offline. Will sync when connection is restored.')
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <CardSkeleton />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true}>
      <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" role="main">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Offline Registration Portal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Register users even without internet connection</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Online/Offline Status */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md ${
                    isOnline
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                  }`}
                >
                  {isOnline ? <FaWifi className="text-lg" /> : <FaExclamationTriangle className="text-lg" />}
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </motion.div>

                {/* Sync Button */}
                <motion.button
                  whileHover={{ scale: pendingUsers.length > 0 && isOnline ? 1.05 : 1 }}
                  whileTap={{ scale: pendingUsers.length > 0 && isOnline ? 0.95 : 1 }}
                  onClick={syncPendingUsers}
                  disabled={!isOnline || syncStatus === 'syncing' || pendingUsers.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-md ${
                    syncStatus === 'syncing'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                      : syncStatus === 'success'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : syncStatus === 'error'
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                      : isOnline && pendingUsers.length > 0
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Sync pending registrations"
                >
                  <FaSync className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                  {syncStatus === 'syncing' ? 'Syncing...' : 
                   syncStatus === 'success' ? 'Synced!' :
                   syncStatus === 'error' ? 'Error' :
                   `Sync (${pendingUsers.length})`}
                </motion.button>
              </div>
            </div>

          {/* Sync Status Indicator */}
          {syncStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2"
              role="alert"
            >
              <FaCheckCircle />
              <span className="text-lg">All pending users synced successfully!</span>
            </motion.div>
          )}

          {syncStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2"
              role="alert"
            >
              <FaExclamationTriangle />
              <span className="text-lg">Sync failed. Please try again.</span>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Registration Form */}
            <div className="card bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Register New User
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="village" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Village *
                  </label>
                  <input
                    type="text"
                    id="village"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Role *
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="girl">Girl</option>
                    <option value="woman">Woman</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full text-lg py-4"
                  aria-label="Register user"
                >
                  {isOnline ? 'Register User' : 'Save Offline'}
                </button>
              </form>
            </div>

            {/* Pending Sync List */}
            <div className="card bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Pending Sync ({pendingUsers.length})
              </h2>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    No pending registrations. All users are synced!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{user.phone}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{user.village}</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm font-semibold">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Saved: {new Date(user.timestamp).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

