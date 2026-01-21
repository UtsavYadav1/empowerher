'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaUserShield, FaCheckCircle, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaShieldAlt, FaUserTie, FaShoppingCart, FaUserCheck } from 'react-icons/fa'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [village, setVillage] = useState('')
  const [role, setRole] = useState<'girl' | 'woman' | 'customer' | ''>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  useEffect(() => {
    calculatePasswordStrength(password)
  }, [password])

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
    if (/\d/.test(pwd)) strength += 25
    if (/[!@#$%^&*]/.test(pwd)) strength += 25
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500'
    if (passwordStrength <= 50) return 'bg-orange-500'
    if (passwordStrength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak'
    if (passwordStrength <= 50) return 'Fair'
    if (passwordStrength <= 75) return 'Good'
    return 'Strong'
  }

  const handlePrevStep = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateStep3()) return

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          village: village || undefined,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      setSuccess('Registration successful! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  // Simplified Validation
  const validateStep1 = () => {
    if (!name.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (passwordStrength < 50) {
      setError('Password is too weak. Please choose a stronger password.')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!role) {
      setError('Please select your role')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')

    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card max-w-2xl w-full bg-white dark:bg-gray-800 relative overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="pt-6">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Step {step} of 3 - {step === 1 ? 'Personal Information' : step === 2 ? 'Security' : 'Role Selection'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2"
            >
              <FaCheckCircle />
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaUser className="text-primary-600" /> Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Email without Verification */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaEnvelope className="text-primary-600" /> Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="your.email@example.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaPhone className="text-primary-600" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+91 9876543210"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Village */}
                  <div>
                    <label htmlFor="village" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary-600" /> Village / City (Optional)
                    </label>
                    <input
                      type="text"
                      id="village"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your location"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaLock className="text-primary-600" /> Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Create a strong password"
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

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength:</span>
                          <span className={`text-xs font-semibold ${passwordStrength <= 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${getPasswordStrengthColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Use 8+ characters with uppercase, lowercase, numbers & symbols
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaLock className="text-primary-600" /> Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Re-enter your password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {confirmPassword && (
                      <div className="mt-2 flex items-center gap-2">
                        {password === confirmPassword ? (
                          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <FaCheckCircle /> Passwords match
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <FaShieldAlt /> Security Tips
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• Use a unique password you haven't used elsewhere</li>
                      <li>• Avoid personal information like names or birthdays</li>
                      <li>• Consider using a password manager</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaUserShield className="text-primary-600" /> Select Your Role *
                    </label>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Girl Option */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRole('girl')}
                        className={`p-6 rounded-xl border-3 transition-all ${role === 'girl'
                          ? 'border-pink-600 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:border-pink-400'
                          }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${role === 'girl'
                            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            <FaUser className="text-2xl" />
                          </div>
                          <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Girl</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Access educational resources and courses
                          </p>
                          {role === 'girl' && (
                            <FaCheckCircle className="text-pink-600 text-xl mt-3" />
                          )}
                        </div>
                      </motion.button>

                      {/* Woman Option */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRole('woman')}
                        className={`p-6 rounded-xl border-3 transition-all ${role === 'woman'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                          }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${role === 'woman'
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            <FaUserTie className="text-2xl" />
                          </div>
                          <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Woman</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Business tools and professional development
                          </p>
                          {role === 'woman' && (
                            <FaCheckCircle className="text-purple-600 text-xl mt-3" />
                          )}
                        </div>
                      </motion.button>

                      {/* Customer Option */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRole('customer')}
                        className={`p-6 rounded-xl border-3 transition-all ${role === 'customer'
                          ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                          }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${role === 'customer'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            <FaShoppingCart className="text-2xl" />
                          </div>
                          <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Customer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Support women-owned businesses
                          </p>
                          {role === 'customer' && (
                            <FaCheckCircle className="text-green-600 text-xl mt-3" />
                          )}
                        </div>
                      </motion.button>

                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <p className="text-sm text-purple-900 dark:text-purple-300">
                      <strong>Note:</strong> Choose the role that best describes you. This determines which dashboard and features you'll have access to.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <FaArrowLeft /> Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 btn-primary py-3 font-semibold flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

