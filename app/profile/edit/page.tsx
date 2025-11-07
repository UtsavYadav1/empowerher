'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCurrentUser, setCurrentUser } from '@/utils/auth'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaArrowLeft, FaUserShield, FaEdit, FaCheckCircle } from 'react-icons/fa'

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [village, setVillage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    setName(currentUser.name || '')
    setEmail(currentUser.email || '')
    setPhone(currentUser.phone || '')
    setVillage(currentUser.village || '')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate API call (in real app, update via API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data in localStorage
      const updatedUser = {
        ...user,
        name,
        email,
        phone,
        village
      }
      
      setCurrentUser(updatedUser)
      setUser(updatedUser)
      
      setSuccess('✅ Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
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
          className="card bg-white dark:bg-gray-800"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 mb-4 text-white text-2xl font-bold">
              {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Update your personal information</p>
            
            <div className="mt-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                <FaUserShield /> {getRoleDisplay(user.role)}
              </span>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2"
            >
              <FaCheckCircle />
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                <FaUser className="text-primary-600" /> Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                <FaEnvelope className="text-primary-600" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                <FaPhone className="text-primary-600" /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Village/City */}
            <div>
              <label htmlFor="village" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-600" /> Village / City
              </label>
              <input
                type="text"
                id="village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>Note:</strong> To change your password or role, please visit the Settings page or contact support.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
