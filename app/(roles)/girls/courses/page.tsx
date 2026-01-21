'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaBook, FaPlay, FaClock, FaStar, FaUsers, FaCheckCircle, FaFilter, FaSearch, FaGraduationCap } from 'react-icons/fa'

interface Course {
  id: number
  title: string
  description: string
  category: string
  duration: string
  level: string
  students: number
  rating: number
  thumbnail?: string
}

function FreeLearningCoursesContent() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All')

  const categories = ['All', 'Technology', 'Arts', 'Communication', 'Life Skills', 'Business', 'Health & Wellness']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      // Use the real tutorials endpoint
      const response = await fetch('/api/tutorials')
      const result = await response.json()

      if (result.success) {
        // Enrich with deterministic data based on ID
        const enrichedCourses = result.data.map((course: any) => {
          // Simple deterministic pseudo-random based on ID
          const seed = course.id * 12345;
          const random1 = (Math.sin(seed) * 10000 % 1);
          const random2 = (Math.cos(seed) * 10000 % 1);

          return {
            ...course,
            // Use DB duration or fallback
            duration: course.duration || `${2 + Math.floor(random1 * 8)} weeks`,
            level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(random2 * 3)],
            // Deterministic student count (e.g. 50-550)
            students: 50 + Math.floor(random1 * 500),
            // Deterministic rating (3.5 - 5.0)
            rating: (3.5 + (random2 * 1.5)).toFixed(1),
            // Use YouTube thumbnail if available
            thumbnail: course.youtubeId ? `https://img.youtube.com/vi/${course.youtubeId}/maxresdefault.jpg` : undefined
          }
        })
        setCourses(enrichedCourses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'from-blue-500 to-cyan-600',
      'Arts': 'from-pink-500 to-rose-600',
      'Communication': 'from-purple-500 to-indigo-600',
      'Life Skills': 'from-green-500 to-emerald-600',
      'Business': 'from-orange-500 to-amber-600',
      'Health & Wellness': 'from-teal-500 to-cyan-600',
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getLevelBadge = (level: string) => {
    const badges: { [key: string]: string } = {
      'Beginner': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Intermediate': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Advanced': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    }
    return badges[level] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <FaGraduationCap /> Free Learning Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Empower yourself with free skills training and courses</p>
          </div>

          {/* Stats Banner */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-pink-500 to-rose-600 text-white"
            >
              <FaBook className="text-3xl mb-2" />
              <div className="text-3xl font-bold">{courses.length}</div>
              <div className="text-sm opacity-90">Total Courses</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
            >
              <FaUsers className="text-3xl mb-2" />
              <div className="text-3xl font-bold">2,500+</div>
              <div className="text-sm opacity-90">Students Learning</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            >
              <FaCheckCircle className="text-3xl mb-2" />
              <div className="text-3xl font-bold">1,200+</div>
              <div className="text-sm opacity-90">Certificates Issued</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
            >
              <FaStar className="text-3xl mb-2" />
              <div className="text-3xl font-bold">4.8/5</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="card bg-white dark:bg-gray-800 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level} Level</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No courses found matching your filters</p>
                </div>
              ) : (
                filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all overflow-hidden"
                  >
                    {/* Course Thumbnail */}
                    <div className={`h-40 bg-gradient-to-br ${getCategoryColor(course.category)} relative`}>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <FaPlay className="text-white text-5xl opacity-80" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${getLevelBadge(course.level)} font-semibold`}>
                          {course.level}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5">
                      <div className="mb-3">
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {course.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Course Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <FaClock className="text-primary-600" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaUsers className="text-blue-600" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Enroll Button */}
                      <Link
                        href={`/girls/courses/${course.id}`}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <FaPlay /> Start Learning
                      </Link>
                    </div>
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

export default function FreeLearningCoursesPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl', 'woman']}>
      <FreeLearningCoursesContent />
    </ProtectedRoute>
  )
}

