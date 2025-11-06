'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa'

interface Scheme {
  id: number
  title: string
  description: string
  eligibility?: string
  applyUrl?: string
  deadline?: string | null
}

function GirlsSchemesContent() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      // Prefer real girls schemes if available; fallback to finance as demo
      let response = await fetch('/api/mock/schemes')
      if (!response.ok) {
        response = await fetch('/api/mock/finance')
      }
      const data = await response.json()
      if (data.success) {
        setSchemes(data.data)
      }
    } catch (e) {
      console.error('Error loading schemes', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-4">
          <FaGraduationCap className="text-primary-600" /> Schemes & Scholarships
        </h1>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.length === 0 ? (
              <p className="text-gray-600">No schemes available right now.</p>
            ) : (
              schemes.map((s: any, idx: number) => (
                <motion.div
                  key={s.id ?? idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="card"
                >
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-700 mb-3">{s.description}</p>
                  {s.eligibility && (
                    <p className="text-sm text-gray-600 mb-3"><strong>Eligibility:</strong> {s.eligibility}</p>
                  )}
                  <div className="flex justify-between items-center">
                    {s.deadline && (
                      <span className="text-xs text-gray-500">Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                    )}
                    {s.applyUrl && (
                      <a href={s.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                        Apply <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>
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


