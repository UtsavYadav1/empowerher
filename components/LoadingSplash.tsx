'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingSplash() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-24 h-24 mx-auto mb-6"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              aria-hidden="true"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ec4899"
                strokeWidth="4"
                strokeDasharray="251.2"
                strokeDashoffset="251.2"
                animate={{
                  strokeDashoffset: [251.2, 0, 251.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="24"
                fontWeight="bold"
                fill="#ec4899"
                className="font-bold"
              >
                EH
              </text>
            </svg>
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4"
        >
          EmpowerHer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-400 text-lg"
        >
          Loading{dots}
          <span className="sr-only">Please wait while the page loads</span>
        </motion.p>
      </div>
    </div>
  )
}
