'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon, FiGlobe } from 'react-icons/fi'
import { FaHandHoldingHeart, FaStar } from 'react-icons/fa'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, getCurrentUser, logout, getDashboardPath } from '@/utils/auth'
import UserProfile from './UserProfile'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hin'>('en')
  const router = useRouter()
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      if (authenticated) {
        setUser(getCurrentUser())
      }
    }

    checkAuth()
    const interval = setInterval(checkAuth, 1000)
    
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    // Check for language preference
    const savedLang = localStorage.getItem('language') as 'en' | 'hin' | null
    if (savedLang) {
      setLanguage(savedLang)
    }

    return () => clearInterval(interval)
  }, [pathname])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUser(null)
    router.push('/login')
  }

  const getDashboardLink = () => {
    if (!user?.role) return null
    return getDashboardPath(user.role)
  }

  const dashboardLink = getDashboardLink()

  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      gallery: 'Gallery',
      workshops: 'Workshops',
      contact: 'Contact',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
    },
    hin: {
      home: 'होम',
      about: 'के बारे में',
      gallery: 'गैलरी',
      workshops: 'कार्यशालाएं',
      contact: 'संपर्क',
      dashboard: 'डैशबोर्ड',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
    },
  }

  const t = translations[language]

  return (
    <>
      <nav 
        className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="h-1 bg-primary-600 origin-left"
          style={{ scaleX }}
          aria-hidden="true"
        />
        
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
              aria-label="EmpowerHer Home"
            >
              <div className="relative">
                <FaHandHoldingHeart className="text-3xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                <FaStar className="text-xs text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 dark:from-primary-400 dark:to-pink-400 bg-clip-text text-transparent">
                EmpowerHer
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg"
                aria-label={t.home}
              >
                {t.home}
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg"
                aria-label={t.about}
              >
                {t.about}
              </Link>
              <Link 
                href="/gallery" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg"
                aria-label={t.gallery}
              >
                {t.gallery}
              </Link>
              <Link 
                href="/workshops" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg"
                aria-label={t.workshops}
              >
                {t.workshops}
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg"
                aria-label={t.contact}
              >
                {t.contact}
              </Link>

              {/* Language Toggle - Enhanced */}
              <motion.button
                onClick={() => {
                  const newLang = language === 'en' ? 'hin' : 'en'
                  setLanguage(newLang)
                  localStorage.setItem('language', newLang)
                  // You can add translation logic here
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-pink-500 text-white hover:from-primary-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
                title={`Current: ${language === 'en' ? 'English' : 'हिंदी'} - Click to switch`}
              >
                <FiGlobe className="text-lg" />
                <span className="font-semibold text-sm">
                  {language === 'en' ? 'EN' : 'हिं'}
                </span>
              </motion.button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <FiSun className="text-xl text-gray-700 dark:text-gray-300" />
                ) : (
                  <FiMoon className="text-xl text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {isLoggedIn ? (
                <UserProfile />
              ) : (
                <Link 
                  href="/login" 
                  className="btn-primary text-sm px-4 py-2"
                  aria-label={t.login}
                >
                  {t.login}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 dark:text-gray-300 p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-3"
            >
              <Link 
                href="/" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.home}
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.about}
              </Link>
              <Link 
                href="/gallery" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.gallery}
              </Link>
              <Link 
                href="/workshops" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.workshops}
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-lg"
                onClick={() => setIsOpen(false)}
              >
                {t.contact}
              </Link>
              <div className="flex gap-2 pt-2">
                <motion.button
                  onClick={() => {
                    const newLang = language === 'en' ? 'hin' : 'en'
                    setLanguage(newLang)
                    localStorage.setItem('language', newLang)
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-pink-500 text-white hover:from-primary-600 hover:to-pink-600 transition-all shadow-md"
                >
                  <FiGlobe className="text-lg" />
                  <span className="font-semibold text-sm">
                    {language === 'en' ? 'English' : 'हिंदी'}
                  </span>
                </motion.button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
                </button>
              </div>
              {isLoggedIn ? (
                <>
                  {dashboardLink && (
                    <Link 
                      href={dashboardLink} 
                      className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {t.dashboard}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full btn-primary text-center"
                  >
                    {t.logout}
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="block btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {t.login}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </nav>
    </>
  )
}
