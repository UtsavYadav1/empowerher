'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaGraduationCap, FaEdit, FaTrash, FaSearch, FaPlus, FaArrowLeft, FaEye } from 'react-icons/fa'
import Link from 'next/link'

interface Scheme {
  id: number
  title: string
  description: string
  category: string
  deadline: string
  benefits: string[]
  eligibility: string[]
  createdAt: string
}

function ManageSchemesContent() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewScheme, setViewScheme] = useState<Scheme | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/mock/schemes')
      const result = await response.json()
      
      if (result.success) {
        setSchemes(result.data)
      }
    } catch (error) {
      console.error('Error fetching schemes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScheme = async (schemeId: number) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return

    try {
      const response = await fetch(`/api/mock/schemes?id=${schemeId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Scheme deleted successfully!')
        fetchSchemes()
      } else {
        alert('Failed to delete scheme')
      }
    } catch (error) {
      console.error('Error deleting scheme:', error)
      alert('Error deleting scheme')
    }
  }

  const handleViewScheme = (scheme: Scheme) => {
    setViewScheme(scheme)
    setShowViewModal(true)
  }

  const filteredSchemes = schemes.filter(scheme =>
    (scheme.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (scheme.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (scheme.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'education': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'health': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'business': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'skill development': return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const isExpired = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const activeSchemes = schemes.filter(s => !isExpired(s.deadline))
  const expiredSchemes = schemes.filter(s => isExpired(s.deadline))

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-2">
                <FaArrowLeft /> Back to Dashboard
              </Link>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <FaGraduationCap /> Manage Schemes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage educational schemes & scholarships</p>
            </div>
          </div>

          {/* Search */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <div className="text-sm opacity-90">Total Schemes</div>
              <div className="text-3xl font-bold">{schemes.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
              <div className="text-sm opacity-90">Active</div>
              <div className="text-3xl font-bold">{activeSchemes.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-red-500 to-red-700 text-white">
              <div className="text-sm opacity-90">Expired</div>
              <div className="text-3xl font-bold">{expiredSchemes.length}</div>
            </div>
          </div>

          {/* Schemes List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading schemes...
              </div>
            ) : filteredSchemes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No schemes found
              </div>
            ) : (
              filteredSchemes.map((scheme) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="card bg-white dark:bg-gray-800"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                          <FaGraduationCap className="text-2xl text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{scheme.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {scheme.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(scheme.category)}`}>
                              {scheme.category}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              isExpired(scheme.deadline)
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {isExpired(scheme.deadline) ? 'Expired' : 'Active'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleViewScheme(scheme)}
                        className="btn-secondary text-sm flex items-center gap-2 justify-center px-4"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(scheme.id)}
                        className="btn-secondary text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* View Modal */}
      {showViewModal && viewScheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full my-8"
          >
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-lg">
                <FaGraduationCap className="text-3xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{viewScheme.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(viewScheme.category)}`}>
                    {viewScheme.category}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isExpired(viewScheme.deadline)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isExpired(viewScheme.deadline) ? 'Expired' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{viewScheme.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {viewScheme.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Eligibility</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {viewScheme.eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Deadline</div>
                  <div className="font-semibold">{new Date(viewScheme.deadline).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                  <div className="font-semibold">{new Date(viewScheme.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowViewModal(false)} className="btn-primary w-full mt-6">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function ManageSchemesPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <ManageSchemesContent />
    </ProtectedRoute>
  )
}
