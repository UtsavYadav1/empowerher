'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CourseCard from '@/components/CourseCard'
import ProgressChart from '@/components/ProgressChart'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentUser } from '@/utils/auth'
import { generateCertificate } from '@/utils/certificate'
import { FaGraduationCap, FaBriefcase, FaBook, FaUserFriends, FaChartLine, FaComments, FaCalendar, FaCertificate, FaTrophy, FaRocket, FaAward } from 'react-icons/fa'

function GirlsDashboardContent() {
  const user = getCurrentUser()
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [stats, setStats] = useState({
    enrolled: 12,
    completed: 5,
    inProgress: 7,
    schemesApplied: 3,
    certificates: 2,
  })

  const courses = [
    {
      id: 1,
      title: 'Introduction to Coding',
      description: 'Learn the basics of programming',
      category: 'Technology',
      progress: 45,
    },
    {
      id: 2,
      title: 'Creative Writing',
      description: 'Express yourself through writing',
      category: 'Arts',
      progress: 100,
    },
    {
      id: 3,
      title: 'Public Speaking',
      description: 'Build confidence in speaking',
      category: 'Communication',
      progress: 30,
    },
  ]

  const handleCompleteCourse = (courseTitle: string) => {
    setSelectedCourse(courseTitle)
    setShowCertificateModal(true)
  }

  const handleGenerateCertificate = () => {
    if (user && selectedCourse) {
      generateCertificate(user.name, selectedCourse)
      setShowCertificateModal(false)
    }
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-gradient-to-r from-primary-600 to-blue-600 text-white p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
                <p className="text-xl opacity-90">Continue your journey towards empowerment</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{stats.certificates}</div>
                  <div className="text-sm opacity-90">Certificates</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/girls/forum" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaComments className="text-5xl text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Community Forum</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Connect & Share</p>
          </Link>
          <Link href="/girls/events" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaCalendar className="text-5xl text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Events</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upcoming Opportunities</p>
          </Link>
          <Link href="/girls/schemes" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaGraduationCap className="text-5xl text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Schemes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Scholarships & Support</p>
          </Link>
          <Link href="/girls/career" className="card hover:shadow-2xl transition-all hover:scale-105 bg-white dark:bg-gray-800 text-center group">
            <FaBriefcase className="text-5xl text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Career Guidance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Plan Your Future</p>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-xl transition-all"
          >
            <FaBook className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Enrolled</h3>
            <p className="text-4xl font-bold">{stats.enrolled}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all"
          >
            <FaTrophy className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Completed</h3>
            <p className="text-4xl font-bold">{stats.completed}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all"
          >
            <FaRocket className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">In Progress</h3>
            <p className="text-4xl font-bold">{stats.inProgress}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all"
          >
            <FaAward className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Schemes</h3>
            <p className="text-4xl font-bold">{stats.schemesApplied}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all"
          >
            <FaCertificate className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Certificates</h3>
            <p className="text-4xl font-bold">{stats.certificates}</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaChartLine className="text-primary-600" /> My Progress
            </h2>
            <ProgressChart />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaBook className="text-primary-600" /> Recent Courses
            </h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id}>
                  <CourseCard course={course} />
                  {course.progress === 100 && (
                    <button
                      onClick={() => handleCompleteCourse(course.title)}
                      className="mt-2 btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaCertificate /> Generate Certificate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md w-full bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Generate Certificate</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Generate a certificate for completing: <strong className="text-primary-600 dark:text-primary-400">{selectedCourse}</strong></p>
            <div className="flex gap-4">
              <button onClick={handleGenerateCertificate} className="btn-primary flex-1">
                Generate & Download
              </button>
              <button onClick={() => setShowCertificateModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function GirlsDashboardPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl']}>
      <GirlsDashboardContent />
    </ProtectedRoute>
  )
}
