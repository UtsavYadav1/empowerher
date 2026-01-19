'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaChartBar, FaEdit, FaTrash, FaSearch, FaArrowLeft, FaEye, FaUsers, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import Link from 'next/link'

interface Workshop {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  instructor: string
  category: string
  capacity: number
  registered: number
  fee: number
  status: string
  createdAt: string
}

function ManageWorkshopsContent() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewWorkshop, setViewWorkshop] = useState<Workshop | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops')
      const result = await response.json()

      if (result.success) {
        setWorkshops(result.data)
      }
    } catch (error) {
      console.error('Error fetching workshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkshop = async (workshopId: number) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return

    try {
      const response = await fetch(`/api/workshops?id=${workshopId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        alert('Workshop deleted successfully!')
        fetchWorkshops()
      } else {
        alert('Failed to delete workshop')
      }
    } catch (error) {
      console.error('Error deleting workshop:', error)
      alert('Error deleting workshop')
    }
  }

  const handleViewWorkshop = (workshop: Workshop) => {
    setViewWorkshop(workshop)
    setShowViewModal(true)
  }

  const filteredWorkshops = workshops.filter(workshop =>
    (workshop.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (workshop.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (workshop.instructor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (workshop.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'skill development': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'business': return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
      case 'health': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'technology': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const upcomingWorkshops = workshops.filter(w => w.status?.toLowerCase() === 'upcoming')
  const ongoingWorkshops = workshops.filter(w => w.status?.toLowerCase() === 'ongoing')
  const completedWorkshops = workshops.filter(w => w.status?.toLowerCase() === 'completed')
  const totalRegistrations = workshops.reduce((sum, w) => sum + w.registered, 0)

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
                <FaChartBar /> Manage Workshops
              </h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage all platform workshops</p>
            </div>

            <Link
              href="/admin/workshops/new"
              className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <FaEdit /> Add New Workshop
            </Link>
          </div>

          {/* Search */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <div className="text-sm opacity-90">Total Workshops</div>
              <div className="text-3xl font-bold">{workshops.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <div className="text-sm opacity-90">Upcoming</div>
              <div className="text-3xl font-bold">{upcomingWorkshops.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
              <div className="text-sm opacity-90">Ongoing</div>
              <div className="text-3xl font-bold">{ongoingWorkshops.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-pink-500 to-pink-700 text-white">
              <div className="text-sm opacity-90">Total Registrations</div>
              <div className="text-3xl font-bold">{totalRegistrations}</div>
            </div>
          </div>

          {/* Workshops Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading workshops...
              </div>
            ) : filteredWorkshops.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No workshops found
              </div>
            ) : (
              filteredWorkshops.map((workshop) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="card bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                      <FaChartBar className="text-2xl text-primary-600" />
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workshop.status)}`}>
                        {workshop.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{workshop.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {workshop.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendar className="text-primary-600" />
                      <span>{new Date(workshop.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaMapMarkerAlt className="text-primary-600" />
                      <span className="truncate">{workshop.location || workshop.village}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaUsers className="text-primary-600" />
                      <span>{workshop.registered}/{workshop.capacity} registered</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(workshop.category)}`}>
                      {workshop.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      ₹{workshop.fee}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Instructor: <span className="font-semibold text-gray-900 dark:text-gray-100">{workshop.instructor}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/workshops/${workshop.id}`}
                      className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleViewWorkshop(workshop)}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkshop(workshop.id)}
                      className="btn-secondary text-sm py-2 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* View Modal */}
      {showViewModal && viewWorkshop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full my-8"
          >
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-lg">
                <FaChartBar className="text-3xl text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{viewWorkshop.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewWorkshop.status)}`}>
                    {viewWorkshop.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(viewWorkshop.category)}`}>
                    {viewWorkshop.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{viewWorkshop.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-600 mb-2">
                    <FaCalendar />
                    <span className="font-semibold">Date & Time</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {new Date(viewWorkshop.date).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">{viewWorkshop.time}</div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-600 mb-2">
                    <FaMapMarkerAlt />
                    <span className="font-semibold">Location</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">{viewWorkshop.location}</div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-600 mb-2">
                    <FaUsers />
                    <span className="font-semibold">Capacity</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {viewWorkshop.registered} / {viewWorkshop.capacity} registered
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(viewWorkshop.registered / viewWorkshop.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration Fee</div>
                  <div className="text-3xl font-bold text-primary-600">₹{viewWorkshop.fee}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Instructor</div>
                    <div className="font-semibold">{viewWorkshop.instructor}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                    <div className="font-semibold">{new Date(viewWorkshop.createdAt).toLocaleDateString()}</div>
                  </div>
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

export default function ManageWorkshopsPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <ManageWorkshopsContent />
    </ProtectedRoute>
  )
}

