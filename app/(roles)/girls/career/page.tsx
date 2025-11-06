'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { FaBriefcase, FaExternalLinkAlt } from 'react-icons/fa'

interface Resource {
  id: number
  title: string
  description: string
  link: string
}

const defaultResources: Resource[] = [
  { id: 1, title: 'Career Aptitude Test', description: 'Find careers matching your strengths.', link: 'https://www.123test.com/career-test/' },
  { id: 2, title: 'Scholarships for Girls (Govt)', description: 'Explore scholarship portals.', link: 'https://scholarships.gov.in/' },
  { id: 3, title: 'Free Coding Courses', description: 'Learn to code with free resources.', link: 'https://www.freecodecamp.org/' },
  { id: 4, title: 'Spoken English Practice', description: 'Improve communication skills.', link: 'https://www.duolingo.com/' },
]

function CareerGuidanceContent() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from `/api/mock/career` if available
    setTimeout(() => {
      setResources(defaultResources)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-4">
          <FaBriefcase className="text-purple-600" /> Career Guidance
        </h1>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-2">{r.title}</h3>
                <p className="text-gray-700 mb-4">{r.description}</p>
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                  Explore <FaExternalLinkAlt />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function CareerGuidancePage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl']}>
      <CareerGuidanceContent />
    </ProtectedRoute>
  )
}


