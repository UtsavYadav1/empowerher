'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { generateCertificate } from '@/utils/certificate'
import { FaArrowLeft, FaPlay, FaCheckCircle, FaClock, FaStar, FaBook, FaVideo, FaFileAlt, FaDownload, FaCertificate, FaTimes } from 'react-icons/fa'

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
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<any>(null)
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [playingVideo, setPlayingVideo] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [])

  const fetchCourseData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user.id || 1

      const response = await fetch(`/api/tutorials/${courseId}?userId=${userId}`)
      const result = await response.json()

      if (result.success) {
        setCourse(result.data)
        if (result.data.isCompleted) {
          setCurrentProgress(100)
          setCompletedModules([1, 2, 3])
        } else {
          // Default progress for enrolled but not finished
          setCurrentProgress(result.data.userProgress || 0)
        }
      } else {
        // Fallback or error handling
      }
    } catch (error) {
      console.error('Error fetching course', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModuleComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId]
      setCompletedModules(newCompleted)

      const newProgress = Math.round((newCompleted.length / 3) * 100)
      setCurrentProgress(newProgress)

      if (moduleId === 1) {
        setPlayingVideo(true)
      }
    } else if (moduleId === 1) {
      setPlayingVideo(true)
    }
  }

  const handleDownloadResources = () => {
    const element = document.createElement("a");
    const file = new Blob(["Course Resources: \n\n1. Module Summary\n2. Key Glossary\n3. Practice Questions"], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${course?.title || 'Course'}_Resources.txt`;
    document.body.appendChild(element);
    element.click();
    alert("Resources downloaded successfully!")
  }

  const handleGetCertificate = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    generateCertificate(user.name || 'Student', course.title)
    setShowCertificateModal(false)
  }

  if (loading) return <div className="p-20 text-center">Loading course...</div>
  if (!course) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
      <Link href="/girls/courses" className="btn-primary">Back to Courses</Link>
    </div>
  )

  const modules: CourseModule[] = [
    { id: 1, title: 'Main Video Tutorial', duration: course.duration || '30 min', completed: true, type: 'video' },
    { id: 2, title: 'Key Takeaways & Summary', duration: '15 min', completed: false, type: 'reading' },
    { id: 3, title: 'Knowledge Check Quiz', duration: '10 min', completed: false, type: 'quiz' },
  ]

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
        >
          {/* Back Button */}
          <Link
            href="/girls/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 mb-6"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          {/* Player Area (If Playing) */}
          <AnimatePresence>
            {playingVideo && course.youtubeId && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative bg-black"
              >
                <button
                  onClick={() => setPlayingVideo(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white"
                >
                  <FaTimes />
                </button>
                <div className="aspect-w-16 aspect-h-9 w-full h-[500px]">
                  <iframe
                    src={`https://www.youtube.com/embed/${course.youtubeId}?autoplay=1`}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


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
                    <span>4.8 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{course.duration}</span>
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
                  className="bg-white h-3 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Modules List */}
            <div className="lg:col-span-2">
              <div className="card bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBook className="text-primary-600" /> Learning Path
                </h2>

                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div
                      key={module.id}
                      className={`p-4 rounded-lg border-2 transition-all ${completedModules.includes(module.id)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">
                            {getModuleIcon(module.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{module.title}</h3>
                            <p className="text-xs text-gray-500">{module.duration} • {module.type}</p>
                          </div>
                        </div>

                        {completedModules.includes(module.id) ? (
                          <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                            <FaCheckCircle /> Done
                          </span>
                        ) : (
                          <button
                            onClick={() => handleModuleComplete(module.id)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            <FaPlay className="inline mr-1" /> Start
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={handleDownloadResources} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <FaDownload /> Download Resources
                  </button>
                  {currentProgress === 100 && (
                    <button onClick={() => setShowCertificateModal(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                      <FaCertificate /> Get Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
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
              Complete your course to unlock the certificate!
            </p>
            <div className="flex gap-4">
              <button onClick={handleGetCertificate} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FaDownload /> Download Now
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

export default function CourseDetailPage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl', 'woman']}>
      <CourseDetailContent />
    </ProtectedRoute>
  )
}
