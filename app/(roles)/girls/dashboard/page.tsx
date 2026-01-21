'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentUser } from '@/utils/auth'
import { generateCertificate } from '@/utils/certificate'
import { FaGraduationCap, FaBriefcase, FaBook, FaUserFriends, FaChartLine, FaComments, FaCalendar, FaCertificate, FaTrophy, FaRocket, FaAward, FaSync, FaPlay, FaCheckCircle, FaClock, FaStar, FaDownload, FaLightbulb, FaSearch } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Course {
  id: number
  title: string
  description: string
  category: string
  progress: number
  isCompleted: boolean
  instructor?: string
  duration?: string
  totalModules?: number
  completedModules?: number
  enrolled?: boolean
  startDate?: string
  completedDate?: string
  rating?: number
  students?: number
}

function GirlsDashboardContent() {
  const user = getCurrentUser()
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    inProgress: 0,
    schemesApplied: 0,
    certificates: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [statsModalType, setStatsModalType] = useState<'enrolled' | 'completed' | 'inProgress' | 'schemes' | 'certificates' | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user.id || 1 // Fallback to 1 for demo

      const response = await fetch(`/api/girls/stats?userId=${userId}`)
      const result = await response.json()

      if (result.success) {
        setStats(result.data.stats)
        setChartData(result.data.chartData)
        setCourses(result.data.recentCourses)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleGenerateCertificateClick = (course: Course) => {
    if (course.isCompleted) {
      setSelectedCourse(course)
      setShowCertificateModal(true)
    }
  }

  const handleGenerateCertificate = () => {
    if (user && selectedCourse) {
      generateCertificate(user.name, selectedCourse.title)
      setShowCertificateModal(false)
      setSelectedCourse(null)
    }
  }

  const handleStatsCardClick = (type: 'enrolled' | 'completed' | 'inProgress' | 'schemes' | 'certificates') => {
    setStatsModalType(type)
    setShowStatsModal(true)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Arts': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'Communication': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Life Skills': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Business': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    }
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  const getFilteredCourses = () => {
    if (!statsModalType) return []

    if (statsModalType === 'enrolled') return courses
    if (statsModalType === 'completed') return courses.filter(c => c.isCompleted)
    if (statsModalType === 'inProgress') return courses.filter(c => !c.isCompleted && c.progress > 0)
    if (statsModalType === 'certificates') return courses.filter(c => c.isCompleted)

    return []
  }

  const getAppliedSchemes = () => {
    const applied = JSON.parse(localStorage.getItem('appliedSchemes') || '[]')
    const schemes = [
      { id: 1, title: 'Beti Bachao Beti Padhao', category: 'Education' },
      { id: 2, title: 'Sukanya Samriddhi Yojana', category: 'Financial Aid' },
      { id: 3, title: 'CBSE Udaan Scheme', category: 'Education' },
      { id: 4, title: 'National Scholarship Portal', category: 'Scholarships' },
      { id: 5, title: 'Pradhan Mantri Kaushal Vikas Yojana', category: 'Skill Development' },
    ]
    return schemes.filter(s => applied.includes(s.id))
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
            className="card bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 text-white p-8 mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
                <p className="text-xl opacity-90">Continue your journey towards empowerment</p>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchDashboardData}
                  disabled={refreshing}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
                >
                  <FaSync className={refreshing ? 'animate-spin' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </motion.button>
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

        {/* Stats Cards - Clickable */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatsCardClick('enrolled')}
            className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-2xl transition-all cursor-pointer text-left"
          >
            <FaBook className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Enrolled</h3>
            <p className="text-4xl font-bold">{stats.enrolled}</p>
            <p className="text-xs opacity-75 mt-2">Click to view all</p>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatsCardClick('completed')}
            className="card bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl transition-all cursor-pointer text-left"
          >
            <FaTrophy className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Completed</h3>
            <p className="text-4xl font-bold">{stats.completed}</p>
            <p className="text-xs opacity-75 mt-2">Click to view courses</p>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatsCardClick('inProgress')}
            className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl transition-all cursor-pointer text-left"
          >
            <FaRocket className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">In Progress</h3>
            <p className="text-4xl font-bold">{stats.inProgress}</p>
            <p className="text-xs opacity-75 mt-2">Click to continue</p>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatsCardClick('schemes')}
            className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all cursor-pointer text-left"
          >
            <FaAward className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Schemes</h3>
            <p className="text-4xl font-bold">{stats.schemesApplied}</p>
            <p className="text-xs opacity-75 mt-2">Click to view applied</p>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatsCardClick('certificates')}
            className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-2xl transition-all cursor-pointer text-left"
          >
            <FaCertificate className="text-3xl mb-3 opacity-90" />
            <h3 className="text-lg font-semibold mb-2 opacity-90">Certificates</h3>
            <p className="text-4xl font-bold">{stats.certificates}</p>
            <p className="text-xs opacity-75 mt-2">Click to download</p>
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaChartLine className="text-primary-600" /> My Progress
            </h2>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <FaSync className="animate-spin text-4xl text-primary-600" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#e91e63"
                    strokeWidth={3}
                    dot={{ fill: '#e91e63', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaBook className="text-primary-600" /> Recent Courses
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FaBook className="text-3xl text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No courses enrolled yet</p>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Start your learning journey today by exploring our wide range of courses.</p>
                  <Link href="/girls/courses" className="btn-primary flex items-center gap-2 px-6 py-2">
                    <FaSearch /> Explore Courses
                  </Link>
                </div>
              ) : (
                courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                  >
                    {/* Header with Status Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getCategoryColor(course.category)}`}>
                        {course.category}
                      </span>
                      {course.isCompleted ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                          <FaCheckCircle /> Completed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                          <FaClock /> In Progress
                        </div>
                      )}
                    </div>

                    {/* Course Title & Description */}
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Course Meta Info */}
                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaUserFriends className="text-primary-600" />
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaClock className="text-blue-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaStar className="text-yellow-500" />
                        <span>{course.rating} ({course.students?.toLocaleString()} students)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaBook className="text-purple-600" />
                        <span>{course.completedModules}/{course.totalModules} modules</span>
                      </div>
                    </div>

                    {/* Enrollment Date */}
                    {course.startDate && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                        Enrolled: {new Date(course.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {course.completedDate && (
                          <span className="ml-2">
                            • Completed: {new Date(course.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Course Progress
                        </span>
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 h-2.5 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {course.isCompleted ? (
                        <>
                          <button
                            onClick={() => handleGenerateCertificateClick(course)}
                            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
                          >
                            <FaCertificate /> Get Certificate
                          </button>
                          <Link
                            href={`/girls/courses/${course.id}`}
                            className="px-4 btn-secondary flex items-center justify-center"
                          >
                            <FaPlay />
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/girls/courses/${course.id}`}
                            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
                          >
                            <FaPlay /> Continue Learning
                          </Link>
                          <button className="px-4 btn-secondary flex items-center justify-center">
                            <FaBook />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Certificate Modal */}
      {showCertificateModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md w-full bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <FaCertificate className="text-primary-600" />
              Generate Certificate
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Congratulations! Generate your certificate for completing:
            </p>
            <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg mb-4">
              <strong className="text-primary-600 dark:text-primary-400 text-lg">{selectedCourse.title}</strong>
            </div>
            <div className="flex gap-4">
              <button onClick={handleGenerateCertificate} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FaDownload /> Generate & Download
              </button>
              <button onClick={() => setShowCertificateModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats Details Modal */}
      {showStatsModal && statsModalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-4xl w-full bg-white dark:bg-gray-800 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                {statsModalType === 'enrolled' && <><FaBook className="text-primary-600" /> All Enrolled Courses</>}
                {statsModalType === 'completed' && <><FaTrophy className="text-green-600" /> Completed Courses</>}
                {statsModalType === 'inProgress' && <><FaRocket className="text-blue-600" /> Courses In Progress</>}
                {statsModalType === 'schemes' && <><FaAward className="text-purple-600" /> Applied Schemes</>}
                {statsModalType === 'certificates' && <><FaCertificate className="text-orange-600" /> Available Certificates</>}
              </h2>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {statsModalType === 'schemes' ? (
              /* Schemes List */
              <div className="space-y-4">
                {getAppliedSchemes().length === 0 ? (
                  <div className="text-center py-12">
                    <FaAward className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No schemes applied yet</p>
                    <Link href="/girls/schemes" className="btn-primary mt-4 inline-flex items-center gap-2">
                      Browse Schemes
                    </Link>
                  </div>
                ) : (
                  getAppliedSchemes().map((scheme, idx) => (
                    <motion.div
                      key={scheme.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 border-2 border-purple-200 dark:border-purple-700 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{scheme.title}</h3>
                          <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                            {scheme.category}
                          </span>
                        </div>
                        <FaCheckCircle className="text-2xl text-green-600" />
                      </div>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Application Status: <strong className="text-green-600">Submitted</strong>
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              /* Courses List */
              <div className="space-y-4">
                {getFilteredCourses().length === 0 ? (
                  <div className="text-center py-12">
                    <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {statsModalType === 'completed' && 'No courses completed yet'}
                      {statsModalType === 'inProgress' && 'No courses in progress'}
                      {statsModalType === 'enrolled' && 'No courses enrolled'}
                      {statsModalType === 'certificates' && 'No certificates available'}
                    </p>
                    <Link href="/girls/courses" className="btn-primary mt-4 inline-flex items-center gap-2">
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  getFilteredCourses().map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-all bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getCategoryColor(course.category)}`}>
                          {course.category}
                        </span>
                        {course.isCompleted && (
                          <FaCheckCircle className="text-2xl text-green-500" />
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaUserFriends className="text-primary-600" />
                          <span>{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaClock className="text-blue-600" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaStar className="text-yellow-500" />
                          <span>{course.rating} ({course.students?.toLocaleString()} students)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaBook className="text-purple-600" />
                          <span>{course.completedModules}/{course.totalModules} modules</span>
                        </div>
                      </div>

                      {!course.isCompleted && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                            <span className="text-sm font-bold text-primary-600">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {course.isCompleted ? (
                          <button
                            onClick={() => {
                              setShowStatsModal(false)
                              handleGenerateCertificateClick(course)
                            }}
                            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
                          >
                            <FaCertificate /> Get Certificate
                          </button>
                        ) : (
                          <Link
                            href={`/girls/courses/${course.id}`}
                            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
                            onClick={() => setShowStatsModal(false)}
                          >
                            <FaPlay /> Continue Learning
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowStatsModal(false)}
                className="btn-secondary w-full"
              >
                Close
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

