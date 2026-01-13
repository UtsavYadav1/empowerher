'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaExternalLinkAlt, FaRupeeSign, FaPercent, FaCheckCircle, FaInfoCircle, FaFileAlt } from 'react-icons/fa'

interface FinanceScheme {
  id: number
  title: string
  description: string
  amount: string
  interestRate: string
  eligibility: string
  applyUrl: string
  deadline: string | null
  category: string
}

export default function FinancePage() {
  const [schemes, setSchemes] = useState<FinanceScheme[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchSchemes()
  }, [filter])

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/finance')
      const data = await response.json()
      if (data.success) {
        let filtered = data.data
        if (filter !== 'all') {
          filtered = data.data.filter((s: FinanceScheme) => s.category === filter)
        }
        setSchemes(filtered)
      }
    } catch (error) {
      console.error('Error fetching finance schemes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaRupeeSign className="text-green-600" /> Micro-Finance Guidance
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Explore government loan schemes and financial assistance programs for women entrepreneurs
            </p>
          </div>

          {/* Filter */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="flex flex-wrap gap-2">
              {['all', 'business', 'startup', 'expansion'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === cat
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="card mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Application Tips</h3>
                <p className="text-blue-800 dark:text-blue-400 text-sm">
                  Before applying, ensure you have all required documents ready including ID proof, business plan, bank statements, and income certificates. Most schemes require minimum 18 years of age and a valid business registration.
                </p>
              </div>
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">{scheme.title}</h3>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
                    {scheme.category}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">{scheme.description}</p>
                
                <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <FaRupeeSign className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</p>
                      <p className="font-bold text-green-600 dark:text-green-400 text-lg">{scheme.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <FaPercent className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{scheme.interestRate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Eligibility Criteria</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scheme.eligibility}</p>
                    </div>
                  </div>
                </div>

                {scheme.deadline && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      <strong>Application Deadline:</strong> {new Date(scheme.deadline).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                )}

                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3"
                >
                  <FaFileAlt /> Apply Now
                  <FaExternalLinkAlt className="text-sm" />
                </a>
              </motion.div>
            ))}
          </div>

          {schemes.length === 0 && (
            <div className="card text-center py-12 bg-white dark:bg-gray-800">
              <FaRupeeSign className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">No finance schemes available in this category.</p>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

