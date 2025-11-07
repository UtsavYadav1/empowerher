'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaExternalLinkAlt, FaGraduationCap, FaCheckCircle, FaClock, FaRupeeSign, FaFileAlt, FaFilter, FaAward, FaCalendarAlt } from 'react-icons/fa'

interface Scheme {
  id: number
  title: string
  description: string
  eligibility?: string
  applyUrl?: string
  deadline?: string | null
  category?: string
  benefits?: string
  status?: 'Active' | 'Closing Soon' | 'Closed'
  applicants?: number
}

function GirlsSchemesContent() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [appliedSchemes, setAppliedSchemes] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Education', 'Skill Development', 'Entrepreneurship', 'Financial Aid']

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/mock/schemes')
      const data = await response.json()
      if (data.success) {
        // Enrich schemes with additional data
        const enrichedSchemes = data.data.map((scheme: any, index: number) => ({
          ...scheme,
          category: scheme.category || ['Education', 'Skill Development', 'Entrepreneurship', 'Financial Aid'][index % 4],
          benefits: scheme.benefits || `₹${(Math.random() * 50000 + 10000).toFixed(0)} support`,
          status: index < 2 ? 'Closing Soon' : index < 5 ? 'Active' : 'Active',
          applicants: Math.floor(Math.random() * 1000) + 100,
        }))
        setSchemes(enrichedSchemes)
      }
    } catch (e) {
      console.error('Error loading schemes', e)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = (schemeId: number, applyUrl?: string) => {
    if (!appliedSchemes.includes(schemeId)) {
      // Add to applied schemes
      setAppliedSchemes([...appliedSchemes, schemeId])
      
      // Save to localStorage for persistence
      const applied = JSON.parse(localStorage.getItem('appliedSchemes') || '[]')
      applied.push(schemeId)
      localStorage.setItem('appliedSchemes', JSON.stringify(applied))
      
      // Open official application website if URL exists
      if (applyUrl) {
        window.open(applyUrl, '_blank', 'noopener,noreferrer')
      } else {
        // Default government scheme portal
        window.open('https://www.india.gov.in/scheme-women', '_blank', 'noopener,noreferrer')
      }
      
      alert('Redirecting to official application portal. Your application status will be tracked here.')
    }
  }

  // Load applied schemes from localStorage on mount
  useEffect(() => {
    const applied = JSON.parse(localStorage.getItem('appliedSchemes') || '[]')
    setAppliedSchemes(applied)
  }, [])

  const getStatusBadge = (status: string) => {
    const badges = {
      'Active': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Closing Soon': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Closed': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    }
    return badges[status as keyof typeof badges] || badges['Active']
  }

  const filteredSchemes = selectedCategory === 'All' 
    ? schemes 
    : schemes.filter(s => s.category === selectedCategory)

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <FaAward /> Schemes & Scholarships
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Financial support and opportunities for your education and growth</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            >
              <FaAward className="text-3xl mb-2" />
              <div className="text-3xl font-bold">{schemes.length}</div>
              <div className="text-sm opacity-90">Available Schemes</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
            >
              <FaCheckCircle className="text-3xl mb-2" />
              <div className="text-3xl font-bold">{appliedSchemes.length}</div>
              <div className="text-sm opacity-90">Applied</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white"
            >
              <FaRupeeSign className="text-3xl mb-2" />
              <div className="text-3xl font-bold">₹50L+</div>
              <div className="text-sm opacity-90">Total Aid Available</div>
            </motion.div>
          </div>

          {/* Filter */}
          <div className="card bg-white dark:bg-gray-800 mb-8">
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Schemes Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredSchemes.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <FaFileAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No schemes available in this category</p>
                </div>
              ) : (
                filteredSchemes.map((scheme, idx) => (
                  <motion.div
                    key={scheme.id ?? idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{scheme.title}</h3>
                        <span className="text-xs px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full">
                          {scheme.category}
                        </span>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusBadge(scheme.status || 'Active')}`}>
                        {scheme.status || 'Active'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{scheme.description}</p>

                    {/* Benefits */}
                    {scheme.benefits && (
                      <div className="flex items-center gap-2 mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <FaRupeeSign className="text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-800 dark:text-green-300">{scheme.benefits}</span>
                      </div>
                    )}

                    {/* Eligibility */}
                    {scheme.eligibility && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Eligibility:</strong> {scheme.eligibility}
                        </p>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {scheme.deadline && (
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-orange-600" />
                          <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FaFileAlt className="text-blue-600" />
                        <span>{scheme.applicants} applied</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    {appliedSchemes.includes(scheme.id) ? (
                      <button disabled className="btn-secondary w-full flex items-center justify-center gap-2 opacity-75">
                        <FaCheckCircle /> Applied - Check Email for Updates
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(scheme.id, scheme.applyUrl)}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <FaExternalLinkAlt /> Apply Now on Official Portal
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function GirlsSchemesPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl']}>
      <GirlsSchemesContent />
    </ProtectedRoute>
  )
}


