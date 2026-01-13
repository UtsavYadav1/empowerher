'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaRoute, FaArrowLeft, FaMapMarkerAlt, FaUsers, FaCalendar, FaCheckCircle, FaChalkboardTeacher } from 'react-icons/fa'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Village {
  village: string | null
  userCount: number
}

function VisitVillageContent() {
  const [villages, setVillages] = useState<Village[]>([])
  const [selectedVillage, setSelectedVillage] = useState('')
  const [visitDetails, setVisitDetails] = useState({
    purpose: '',
    date: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchVillages()
  }, [])

  const fetchVillages = async () => {
    try {
      const response = await fetch('/api/fieldagent/stats')
      const result = await response.json()
      
      if (result.success) {
        setVillages(result.data.villageStats)
      }
    } catch (error) {
      console.error('Error fetching villages:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Log the visit (you can create a visits table/API later)
      console.log('Village visit logged:', {
        village: selectedVillage,
        ...visitDetails,
        timestamp: new Date(),
      })

      setSuccess(true)
      setSelectedVillage('')
      setVisitDetails({
        purpose: '',
        date: '',
        notes: '',
      })
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error logging visit:', error)
      alert('Error logging visit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link href="/fieldagent/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <FaRoute /> Visit Village
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Plan and track field visits to rural communities</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg flex items-center gap-3"
            >
              <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
              <div>
                <div className="font-bold text-green-800 dark:text-green-200">Visit Logged Successfully!</div>
                <div className="text-sm text-green-700 dark:text-green-300">Your field visit has been recorded.</div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Visit Form */}
            <div className="lg:col-span-2">
              <div className="card bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg">
                    <FaCalendar className="text-white" />
                  </div>
                  Plan Field Visit
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Village Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      Select Village
                    </label>
                    <select
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Choose a village...</option>
                      {villages.map((v) => (
                        <option key={v.village} value={v.village || ''}>
                          {v.village || 'Unknown'} ({v.userCount} users)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Purpose of Visit
                    </label>
                    <select
                      value={visitDetails.purpose}
                      onChange={(e) => setVisitDetails({ ...visitDetails, purpose: e.target.value })}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Select purpose...</option>
                      <option value="workshop">Conduct Workshop</option>
                      <option value="registration">User Registration Drive</option>
                      <option value="product-collection">Product Collection</option>
                      <option value="survey">Community Survey</option>
                      <option value="follow-up">Follow-up Visit</option>
                      <option value="awareness">Awareness Campaign</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FaCalendar className="text-purple-600" />
                      Visit Date
                    </label>
                    <input
                      type="date"
                      value={visitDetails.date}
                      onChange={(e) => setVisitDetails({ ...visitDetails, date: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field w-full"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes & Objectives
                    </label>
                    <textarea
                      value={visitDetails.notes}
                      onChange={(e) => setVisitDetails({ ...visitDetails, notes: e.target.value })}
                      rows={4}
                      placeholder="Add any specific objectives or notes for this visit..."
                      className="input-field w-full"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Logging...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Log Visit
                        </>
                      )}
                    </button>
                    <Link href="/fieldagent/dashboard" className="btn-secondary flex items-center justify-center px-6">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Village List */}
            <div className="lg:col-span-1">
              <div className="card bg-white dark:bg-gray-800 sticky top-24">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  Active Villages
                </h2>

                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {villages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No villages found</div>
                  ) : (
                    villages.map((village, index) => (
                      <motion.div
                        key={village.village}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedVillage === village.village
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                        onClick={() => setSelectedVillage(village.village || '')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {village.village || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <FaUsers className="text-green-600" />
                              {village.userCount} registered users
                            </div>
                          </div>
                          {selectedVillage === village.village && (
                            <FaCheckCircle className="text-blue-600" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 card bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <div className="flex items-center gap-4">
              <FaChalkboardTeacher className="text-4xl" />
              <div>
                <h3 className="font-bold text-lg mb-1">Field Visit Guidelines</h3>
                <p className="text-sm opacity-90">Always carry identification, inform local contacts, and document your activities for better impact tracking.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function VisitVillagePage() {
  return (
    <ProtectedRoute requireRole={true}>
      <VisitVillageContent />
    </ProtectedRoute>
  )
}

