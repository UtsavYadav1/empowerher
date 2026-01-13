'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { setToken, setCurrentUser, getCurrentUser, hasRole, getDashboardPath } from '@/utils/auth'
import { FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserCircle, FaShieldAlt } from 'react-icons/fa'

function LoginContent() {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
  const [identifier, setIdentifier] = useState('') // Can be phone or email
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if already logged in
    const user = getCurrentUser()
    if (user) {
      const redirectPath = searchParams.get('redirect') || (hasRole() ? getDashboardPath(user.role) : '/role-select')
      router.push(redirectPath)
    }

    // Check for remembered credentials
    const remembered = localStorage.getItem('rememberedUser')
    if (remembered) {
      const { identifier: savedIdentifier, method } = JSON.parse(remembered)
      setIdentifier(savedIdentifier)
      setLoginMethod(method)
      setRememberMe(true)
    }
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@')
      const loginData = isEmail
        ? { email: identifier, password }
        : { phone: identifier, password }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
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

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({
            identifier,
            method: loginMethod
          }))
        } else {
          localStorage.removeItem('rememberedUser')
        }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card max-w-md w-full bg-white dark:bg-gray-800"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 mb-4">
            <FaUserCircle className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Login to continue your journey</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${loginMethod === 'phone'
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-md'
              : 'text-gray-600 dark:text-gray-400'
              }`}
          >
            <FaPhone /> Phone
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${loginMethod === 'email'
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-md'
              : 'text-gray-600 dark:text-gray-400'
              }`}
          >
            <FaEnvelope /> Email
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone or Email Input */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              {loginMethod === 'phone' ? (
                <><FaPhone className="text-primary-600" /> Phone Number</>
              ) : (
                <><FaEnvelope className="text-primary-600" /> Email Address</>
              )}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={loginMethod === 'phone' ? '+91 9876543210' : 'your.email@example.com'}
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaLock className="text-primary-600" /> Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
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
              <>
                <FaShieldAlt /> Login
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-300 text-center">
            🔒 Your connection is secure. We never store your password in plain text.
          </p>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
            Create one now
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginContent />
    </Suspense>
  )
}

