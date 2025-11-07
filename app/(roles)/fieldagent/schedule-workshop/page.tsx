'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarPlus, FaArrowLeft, FaChalkboardTeacher, FaMapMarkerAlt, FaClock, FaUsers, FaCheckCircle } from 'react-icons/fa'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

function ScheduleWorkshopContent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    village: '',
    date: '',
    time: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/mock/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setFormData({
          title: '',
          description: '',
          village: '',
          date: '',
          time: '',
        })
        
        setTimeout(() => setSuccess(false), 3000)
      } else {
        alert('Failed to schedule workshop')
      }
    } catch (error) {
      console.error('Error scheduling workshop:', error)
      alert('Error scheduling workshop')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
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
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <FaCalendarPlus /> Schedule Workshop
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Plan and organize a new training session for the community</p>
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
                <div className="font-bold text-green-800 dark:text-green-200">Workshop Scheduled Successfully!</div>
                <div className="text-sm text-green-700 dark:text-green-300">The workshop has been added to the system.</div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <div className="card bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workshop Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaChalkboardTeacher className="text-pink-600" />
                  Workshop Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Digital Literacy Workshop"
                  className="input-field w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe the workshop objectives and topics..."
                  className="input-field w-full"
                />
              </div>

              {/* Village */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Village Location
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Muradnagar"
                  className="input-field w-full"
                />
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FaClock className="text-purple-600" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FaClock className="text-purple-600" />
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaCalendarPlus />
                      Schedule Workshop
                    </>
                  )}
                </button>
                <Link href="/fieldagent/dashboard" className="btn-secondary flex items-center justify-center px-6">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="card bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FaChalkboardTeacher className="text-2xl" />
                <h3 className="font-bold">Training Impact</h3>
              </div>
              <p className="text-sm opacity-90">Empower women and girls through skill development workshops</p>
            </div>
            <div className="card bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FaUsers className="text-2xl" />
                <h3 className="font-bold">Community Reach</h3>
              </div>
              <p className="text-sm opacity-90">Each workshop reaches 20-30 participants on average</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ScheduleWorkshopPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <ScheduleWorkshopContent />
    </ProtectedRoute>
  )
}
