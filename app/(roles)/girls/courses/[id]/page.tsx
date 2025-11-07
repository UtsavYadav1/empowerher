'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaArrowLeft, FaPlay, FaCheckCircle, FaClock, FaStar, FaBook, FaVideo, FaFileAlt, FaDownload, FaCertificate } from 'react-icons/fa'

interface CourseModule {
  id: number
  title: string
  duration: string
  completed: boolean
  type: 'video' | 'reading' | 'quiz'
}

function CourseDetailContent() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.id as string
  const [loading, setLoading] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(45)
  const [completedModules, setCompletedModules] = useState<number[]>([1, 2])

  // Course data based on ID
  const courses: { [key: string]: any } = {
    '1': {
      title: 'Digital Literacy Workshop',
      description: 'Master computer basics, internet navigation, and essential digital tools for the modern world.',
      category: 'Technology',
      instructor: 'Dr. Priya Sharma',
      rating: 4.8,
      students: 1250,
      duration: '6 weeks',
      level: 'Beginner',
      modules: [
        { id: 1, title: 'Introduction to Computers', duration: '30 min', completed: true, type: 'video' },
        { id: 2, title: 'Understanding Operating Systems', duration: '45 min', completed: true, type: 'video' },
        { id: 3, title: 'Internet Basics', duration: '40 min', completed: false, type: 'video' },
        { id: 4, title: 'Email Communication', duration: '35 min', completed: false, type: 'reading' },
        { id: 5, title: 'Online Safety & Security', duration: '50 min', completed: false, type: 'video' },
        { id: 6, title: 'Digital Tools Quiz', duration: '20 min', completed: false, type: 'quiz' },
      ],
    },
    '2': {
      title: 'Creative Writing & Expression',
      description: 'Unlock your creativity through storytelling, poetry, and advanced writing techniques.',
      category: 'Arts',
      instructor: 'Prof. Anjali Verma',
      rating: 4.9,
      students: 892,
      duration: '5 weeks',
      level: 'Intermediate',
      modules: [
        { id: 1, title: 'Introduction to Creative Writing', duration: '35 min', completed: true, type: 'video' },
        { id: 2, title: 'Storytelling Fundamentals', duration: '40 min', completed: true, type: 'video' },
        { id: 3, title: 'Character Development', duration: '45 min', completed: true, type: 'video' },
        { id: 4, title: 'Poetry Basics', duration: '30 min', completed: true, type: 'reading' },
        { id: 5, title: 'Dialogue Writing', duration: '35 min', completed: true, type: 'video' },
        { id: 6, title: 'Editing Techniques', duration: '40 min', completed: true, type: 'reading' },
        { id: 7, title: 'Publishing Your Work', duration: '30 min', completed: true, type: 'video' },
        { id: 8, title: 'Final Writing Project', duration: '60 min', completed: true, type: 'quiz' },
      ],
    },
    '3': {
      title: 'Public Speaking & Confidence Building',
      description: 'Overcome stage fear, master body language, and become a confident public speaker.',
      category: 'Communication',
      instructor: 'Prof. Meera Reddy',
      rating: 4.9,
      students: 890,
      duration: '4 weeks',
      level: 'Intermediate',
      modules: [
        { id: 1, title: 'Overcoming Stage Fear', duration: '35 min', completed: true, type: 'video' },
        { id: 2, title: 'Voice Modulation Techniques', duration: '40 min', completed: false, type: 'video' },
        { id: 3, title: 'Body Language Basics', duration: '30 min', completed: false, type: 'reading' },
        { id: 4, title: 'Crafting Engaging Stories', duration: '45 min', completed: false, type: 'video' },
        { id: 5, title: 'Practice Exercises', duration: '25 min', completed: false, type: 'quiz' },
      ],
    },
    '4': {
      title: 'Financial Literacy & Money Management',
      description: 'Learn budgeting, saving, investing, and smart financial planning for a secure future.',
      category: 'Life Skills',
      instructor: 'CA Sunita Patel',
      rating: 4.7,
      students: 1567,
      duration: '7 weeks',
      level: 'Beginner',
      modules: [
        { id: 1, title: 'Understanding Money & Banking', duration: '40 min', completed: true, type: 'video' },
        { id: 2, title: 'Creating a Budget', duration: '35 min', completed: true, type: 'video' },
        { id: 3, title: 'Saving Strategies', duration: '30 min', completed: true, type: 'reading' },
        { id: 4, title: 'Introduction to Investing', duration: '45 min', completed: true, type: 'video' },
        { id: 5, title: 'Managing Debt', duration: '40 min', completed: true, type: 'video' },
        { id: 6, title: 'Insurance Basics', duration: '35 min', completed: true, type: 'reading' },
        { id: 7, title: 'Tax Planning', duration: '40 min', completed: true, type: 'video' },
        { id: 8, title: 'Retirement Planning', duration: '45 min', completed: false, type: 'video' },
        { id: 9, title: 'Investment Portfolio', duration: '50 min', completed: false, type: 'reading' },
        { id: 10, title: 'Final Financial Plan Quiz', duration: '30 min', completed: false, type: 'quiz' },
      ],
    },
    '5': {
      title: 'Entrepreneurship & Business Basics',
      description: 'Transform your ideas into reality - learn to start, manage, and grow your own business.',
      category: 'Business',
      instructor: 'Dr. Kavita Singh',
      rating: 4.8,
      students: 2103,
      duration: '8 weeks',
      level: 'Intermediate',
      modules: [
        { id: 1, title: 'Introduction to Entrepreneurship', duration: '40 min', completed: true, type: 'video' },
        { id: 2, title: 'Identifying Business Opportunities', duration: '45 min', completed: true, type: 'video' },
        { id: 3, title: 'Market Research', duration: '50 min', completed: true, type: 'video' },
        { id: 4, title: 'Business Plan Development', duration: '60 min', completed: true, type: 'reading' },
        { id: 5, title: 'Legal Structures', duration: '40 min', completed: true, type: 'video' },
        { id: 6, title: 'Financial Management', duration: '45 min', completed: true, type: 'video' },
        { id: 7, title: 'Marketing Strategies', duration: '50 min', completed: true, type: 'video' },
        { id: 8, title: 'Sales Techniques', duration: '40 min', completed: true, type: 'video' },
        { id: 9, title: 'Team Building', duration: '35 min', completed: true, type: 'reading' },
        { id: 10, title: 'Scaling Your Business', duration: '45 min', completed: true, type: 'video' },
        { id: 11, title: 'Digital Marketing', duration: '50 min', completed: true, type: 'video' },
        { id: 12, title: 'Final Business Plan', duration: '90 min', completed: true, type: 'quiz' },
      ],
    },
    '6': {
      title: 'Web Development Fundamentals',
      description: 'Build your first website - HTML, CSS, JavaScript basics and responsive design.',
      category: 'Technology',
      instructor: 'Rohit Kumar',
      rating: 4.6,
      students: 1834,
      duration: '10 weeks',
      level: 'Beginner',
      modules: [
        { id: 1, title: 'Introduction to Web Development', duration: '35 min', completed: true, type: 'video' },
        { id: 2, title: 'HTML Basics', duration: '50 min', completed: true, type: 'video' },
        { id: 3, title: 'HTML Forms & Tables', duration: '45 min', completed: true, type: 'video' },
        { id: 4, title: 'CSS Fundamentals', duration: '60 min', completed: true, type: 'video' },
        { id: 5, title: 'CSS Layouts & Flexbox', duration: '55 min', completed: true, type: 'video' },
        { id: 6, title: 'JavaScript Basics', duration: '50 min', completed: false, type: 'video' },
        { id: 7, title: 'DOM Manipulation', duration: '45 min', completed: false, type: 'video' },
        { id: 8, title: 'Events & Functions', duration: '40 min', completed: false, type: 'reading' },
        { id: 9, title: 'Responsive Design', duration: '50 min', completed: false, type: 'video' },
        { id: 10, title: 'Bootstrap Framework', duration: '55 min', completed: false, type: 'video' },
        { id: 11, title: 'jQuery Basics', duration: '40 min', completed: false, type: 'video' },
        { id: 12, title: 'Form Validation', duration: '35 min', completed: false, type: 'reading' },
        { id: 13, title: 'APIs & AJAX', duration: '45 min', completed: false, type: 'video' },
        { id: 14, title: 'Final Project Setup', duration: '50 min', completed: false, type: 'video' },
        { id: 15, title: 'Portfolio Website Project', duration: '120 min', completed: false, type: 'quiz' },
      ],
    },
    '7': {
      title: 'Graphic Design with Canva',
      description: 'Create stunning graphics, social media posts, and marketing materials using Canva.',
      category: 'Arts',
      instructor: 'Neha Gupta',
      rating: 4.9,
      students: 1423,
      duration: '4 weeks',
      level: 'Beginner',
      modules: [
        { id: 1, title: 'Introduction to Canva', duration: '30 min', completed: true, type: 'video' },
        { id: 2, title: 'Design Principles', duration: '40 min', completed: true, type: 'video' },
        { id: 3, title: 'Creating Social Media Graphics', duration: '50 min', completed: true, type: 'video' },
        { id: 4, title: 'Branding & Logos', duration: '45 min', completed: true, type: 'video' },
        { id: 5, title: 'Marketing Materials', duration: '40 min', completed: false, type: 'reading' },
        { id: 6, title: 'Final Design Portfolio', duration: '60 min', completed: false, type: 'quiz' },
      ],
    },
  }

  const course = courses[courseId] || {
    title: 'Course Not Found',
    description: 'This course is currently unavailable.',
    category: 'General',
    instructor: 'N/A',
    rating: 0,
    students: 0,
    duration: 'N/A',
    level: 'N/A',
    modules: [],
  }

  const handleModuleComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId]
      setCompletedModules(newCompleted)
      const newProgress = Math.round((newCompleted.length / course.modules.length) * 100)
      setCurrentProgress(newProgress)
      
      // Update in database (would be real in production)
      console.log('Module completed:', moduleId)
    }
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <FaVideo className="text-blue-600" />
      case 'reading': return <FaBook className="text-green-600" />
      case 'quiz': return <FaFileAlt className="text-purple-600" />
      default: return <FaPlay />
    }
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Link
            href="/girls/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 mb-6"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          {/* Course Header */}
          <div className="card bg-gradient-to-r from-primary-500 to-purple-600 text-white mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <span className="text-sm opacity-90 mb-2 block">{course.category}</span>
                <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
                <p className="text-lg opacity-90 mb-4">{course.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-300" />
                    <span>{course.rating} Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBook />
                    <span>{course.students} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{course.duration}</span>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full">
                    {course.level}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{currentProgress}%</div>
                <div className="text-sm opacity-90">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-white h-3 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - Modules */}
            <div className="lg:col-span-2">
              <div className="card bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBook className="text-primary-600" /> Course Modules
                </h2>

                <div className="space-y-3">
                  {course.modules.map((module: CourseModule, index: number) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        completedModules.includes(module.id)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">
                            {completedModules.includes(module.id) ? (
                              <FaCheckCircle className="text-green-600" />
                            ) : (
                              getModuleIcon(module.type)
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {index + 1}. {module.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <FaClock className="text-xs" />
                              <span>{module.duration}</span>
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {module.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {completedModules.includes(module.id) ? (
                          <span className="text-sm font-semibold text-green-600">Completed</span>
                        ) : (
                          <button
                            onClick={() => handleModuleComplete(module.id)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            <FaPlay className="inline mr-1" /> Start
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor */}
              <div className="card bg-white dark:bg-gray-800">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Instructor</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{course.instructor}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expert Instructor</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/girls/forum" className="btn-secondary w-full flex items-center justify-center gap-2">
                    <FaFileAlt /> Ask Question
                  </Link>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    <FaDownload /> Download Resources
                  </button>
                  {currentProgress === 100 && (
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                      <FaCertificate /> Get Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl', 'woman']}>
      <CourseDetailContent />
    </ProtectedRoute>
  )
}
