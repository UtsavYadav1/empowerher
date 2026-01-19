'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaGraduationCap, FaPlus, FaEdit, FaTrash, FaSearch, FaExternalLinkAlt } from 'react-icons/fa'

interface Scheme {
  id: number
  title: string
  description: string
  deadline: string | null
  applyUrl: string
}

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/schemes')
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/schemes/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        setSchemes(schemes.filter(s => s.id !== id))
        alert('Scheme deleted successfully')
      } else {
        alert('Failed to delete scheme: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting scheme:', error)
      alert('An error occurred while deleting')
    } finally {
      setDeleting(null)
    }
  }

  const filteredSchemes = schemes.filter(scheme =>
    scheme.title.toLowerCase().includes(search.toLowerCase()) ||
    scheme.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['admin']}>
      <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaGraduationCap className="text-primary-600" /> Manage Schemes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Add or remove government and private schemes</p>
            </div>
            <Link
              href="/admin/schemes/new"
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus /> Add New Scheme
            </Link>
          </div>

          <div className="card bg-white dark:bg-gray-800 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredSchemes.map((scheme) => (
                  <motion.div
                    key={scheme.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{scheme.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{scheme.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          {scheme.deadline && (
                            <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                          )}
                          <a href={scheme.applyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            View Source <FaExternalLinkAlt className="text-xs" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Link
                          href={`/admin/schemes/${scheme.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(scheme.id)}
                          disabled={deleting === scheme.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deleting === scheme.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredSchemes.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No schemes found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
