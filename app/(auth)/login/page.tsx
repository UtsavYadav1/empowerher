'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { setToken, setCurrentUser, getCurrentUser, hasRole } from '@/utils/auth'
import { getDashboardPath } from '@/utils/auth'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if already logged in
    const user = getCurrentUser()
    if (user) {
      const redirectPath = searchParams.get('redirect') || (hasRole() ? getDashboardPath(user.role) : '/role-select')
      router.push(redirectPath)
    }
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Store token and user in localStorage
      if (data.data && data.data.token && data.data.user) {
        setToken(data.data.token)
        setCurrentUser(data.data.user)

        // Get redirect path from query params or use default
        const redirectPath = searchParams.get('redirect') || 
          (data.data.user.role ? getDashboardPath(data.data.user.role) : '/role-select')
        
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          router.push(redirectPath)
        }, 100)
      } else {
        setError('Invalid response from server')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card max-w-md w-full bg-white dark:bg-gray-800"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">Login</h1>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="phone" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+91 9876543210"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full text-lg py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-lg">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
