'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaCheckCircle, FaCircle, FaPlay, FaClock, FaTag } from 'react-icons/fa'

interface Tutorial {
  id: number
  title: string
  description: string
  youtubeId: string
  duration: string
  category: string
  watched: boolean
}

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchTutorials()
  }, [filter])

  const fetchTutorials = async () => {
    try {
      const url = filter !== 'all' ? `/api/tutorials?category=${filter}` : '/api/tutorials'
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setTutorials(data.data)
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkWatched = async (tutorialId: number, watched: boolean) => {
    try {
      const response = await fetch('/api/tutorials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialId, watched: !watched }),
      })
      const data = await response.json()
      if (data.success) {
        setTutorials(tutorials.map(t => t.id === tutorialId ? data.data : t))
        if (selectedTutorial?.id === tutorialId) {
          setSelectedTutorial(data.data)
        }
      }
    } catch (error) {
      console.error('Error marking tutorial:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'marketing': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'finance': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const watchedCount = tutorials.filter(t => t.watched).length
  const progress = tutorials.length > 0 ? (watchedCount / tutorials.length) * 100 : 0

  return (
    <ProtectedRoute requireRole={true}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaPlay className="text-red-600" /> Skill Tutorials
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Learn new skills to grow your business</p>
          </div>

          {/* Progress Bar */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Learning Progress</span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{watchedCount}/{tutorials.length} Watched</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary-500 to-red-500 h-4 rounded-full"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'business', 'marketing', 'finance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === cat
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tutorial List */}
            <div className="lg:col-span-2 space-y-4">
              {selectedTutorial ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card bg-white dark:bg-gray-800"
                >
                  <button
                    onClick={() => setSelectedTutorial(null)}
                    className="mb-4 text-primary-600 hover:underline flex items-center gap-2"
                  >
                    ← Back to Tutorials
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{selectedTutorial.title}</h2>
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedTutorial.youtubeId}`}
                      className="w-full h-full"
                      allowFullScreen
                      title={selectedTutorial.title}
                    />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">{selectedTutorial.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaClock /> {selectedTutorial.duration}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedTutorial.category)}`}>
                        <FaTag className="inline mr-1" />
                        {selectedTutorial.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleMarkWatched(selectedTutorial.id, selectedTutorial.watched)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${selectedTutorial.watched
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {selectedTutorial.watched ? (
                        <>
                          <FaCheckCircle /> Watched
                        </>
                      ) : (
                        <>
                          <FaCircle /> Mark as Watched
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                tutorials.map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="card bg-white dark:bg-gray-800 cursor-pointer hover:shadow-2xl transition-all"
                    onClick={() => {
                      setSelectedTutorial(tutorial)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 relative">
                        <div className="w-32 h-20 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={`https://img.youtube.com/vi/${tutorial.youtubeId}/mqdefault.jpg`}
                            alt={tutorial.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <FaPlay className="text-white text-2xl" />
                          </div>
                        </div>
                        {tutorial.watched && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                            <FaCheckCircle className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{tutorial.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{tutorial.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaClock /> {tutorial.duration}
                              </span>
                              <span className={`px-2 py-1 rounded ${getCategoryColor(tutorial.category)}`}>
                                {tutorial.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="card bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Progress Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Overall Progress</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-red-500 h-3 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">By Category</h4>
                  <div className="space-y-2">
                    {['business', 'marketing', 'finance'].map((cat) => {
                      const catTutorials = tutorials.filter(t => t.category === cat)
                      const catWatched = catTutorials.filter(t => t.watched).length
                      const catProgress = catTutorials.length > 0 ? (catWatched / catTutorials.length) * 100 : 0
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300 capitalize">{cat}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{catWatched}/{catTutorials.length}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full transition-all"
                              style={{ width: `${catProgress}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

