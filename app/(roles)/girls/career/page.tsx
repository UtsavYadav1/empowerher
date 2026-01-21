'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  FaBriefcase, FaExternalLinkAlt, FaRocket, FaChartLine, FaUserTie,
  FaFileAlt, FaMicrophone, FaLightbulb, FaGraduationCap, FaTrophy,
  FaUsers, FaClock, FaMapMarkerAlt, FaRupeeSign, FaStar, FaBook,
  FaVideo, FaCalendarAlt, FaCheckCircle, FaArrowRight, FaSearch,
  FaFilter, FaHeart, FaBookmark, FaShare, FaPlay
} from 'react-icons/fa'

interface CareerPath {
  id: number
  title: string
  category: string
  description: string
  avgSalary: string
  demand: 'High' | 'Medium' | 'Growing'
  requiredSkills: string[]
  timeToLearn: string
  jobOpenings: string
  trending: boolean
}

interface Mentor {
  id: number
  name: string
  role: string
  company: string
  expertise: string[]
  experience: string
  rating: number
  sessions: number
  available: boolean
  image: string
}

interface Resource {
  id: number
  title: string
  description: string
  link: string
  category: string
  icon: string
  popular: boolean
}

interface Assessment {
  id: number
  title: string
  description: string
  duration: string
  questions: number
  completed: boolean
}

function CareerGuidanceContent() {
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [bookmarkedPaths, setBookmarkedPaths] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Career Paths Data
  // Career Paths Data (Keep existing static data as it's informational)
  const careerPaths: CareerPath[] = [
    {
      id: 1,
      title: 'Software Developer',
      category: 'Technology',
      description: 'Build applications, websites, and software solutions using programming languages',
      avgSalary: '₹6-15 LPA',
      demand: 'High',
      requiredSkills: ['JavaScript', 'React', 'Python', 'Problem Solving'],
      timeToLearn: '6-12 months',
      jobOpenings: 'High',
      trending: true,
    },
    // ... (Keep other paths or add more if needed)
    {
      id: 2,
      title: 'Data Scientist',
      category: 'Technology',
      description: 'Analyze complex data to help companies make better business decisions',
      avgSalary: '₹8-20 LPA',
      demand: 'High',
      requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
      timeToLearn: '8-14 months',
      jobOpenings: 'High',
      trending: true,
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      category: 'Marketing',
      description: 'Create and manage online marketing campaigns to grow brand presence',
      avgSalary: '₹4-10 LPA',
      demand: 'Growing',
      requiredSkills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
      timeToLearn: '4-8 months',
      jobOpenings: 'Moderate',
      trending: false,
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      category: 'Design',
      description: 'Design user-friendly interfaces and experiences for digital products',
      avgSalary: '₹5-12 LPA',
      demand: 'High',
      requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Visual Design'],
      timeToLearn: '5-10 months',
      jobOpenings: 'High',
      trending: true,
    },
    {
      id: 5,
      title: 'Content Writer',
      category: 'Creative',
      description: 'Create engaging written content for websites, blogs, and marketing materials',
      avgSalary: '₹3-8 LPA',
      demand: 'Medium',
      requiredSkills: ['Writing', 'SEO', 'Research', 'Editing'],
      timeToLearn: '3-6 months',
      jobOpenings: 'Moderate',
      trending: false,
    },
    {
      id: 6,
      title: 'Business Analyst',
      category: 'Business',
      description: 'Bridge gap between IT and business using data analytics to assess processes',
      avgSalary: '₹6-14 LPA',
      demand: 'High',
      requiredSkills: ['Excel', 'SQL', 'Business Intelligence', 'Communication'],
      timeToLearn: '6-10 months',
      jobOpenings: 'Very High',
      trending: true,
    },
  ]

  // Mentors Data
  // Fetch sessions for Mentorship instead of static mentors
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      // Fetch events with type=session
      const res = await fetch('/api/events?type=session')
      const data = await res.json()
      if (data.success) {
        setSessions(data.data)
      }
    } catch (e) {
      console.error('Error fetching mentorship sessions', e)
    }
  }

  // Resources Data
  // Resources Data - Real Links
  const resources: Resource[] = [
    {
      id: 1,
      title: 'National Career Service',
      description: 'Career counselling, job matching, and skill assessments by Govt of India',
      link: 'https://www.ncs.gov.in/',
      category: 'Government',
      icon: 'clipboard',
      popular: true,
    },
    {
      id: 2,
      title: 'Resume Builder (Canva)',
      description: 'Create professional resumes for free with beautiful templates',
      link: 'https://www.canva.com/resumes/templates/',
      category: 'Tools',
      icon: 'file',
      popular: true,
    },
    {
      id: 3,
      title: 'Interview Preparation (Pramp)',
      description: 'Free mock interviews with peers and experts',
      link: 'https://www.pramp.com/',
      category: 'Practice',
      icon: 'microphone',
      popular: true,
    },
    {
      id: 4,
      title: 'Skill India Digital',
      description: 'Discover courses and certifications to boost your employability',
      link: 'https://www.skillindiadigital.gov.in/',
      category: 'Learning',
      icon: 'chart',
      popular: false,
    },
    {
      id: 5,
      title: 'Government Scholarships',
      description: 'Access 500+ scholarships and financial aid programs',
      link: 'https://scholarships.gov.in/',
      category: 'Scholarships',
      icon: 'graduation',
      popular: true,
    },
    {
      id: 6,
      title: 'freeCodeCamp',
      description: 'Learn to code for free - Web Design, JS, Python & more',
      link: 'https://www.freecodecamp.org/',
      category: 'Learning',
      icon: 'code',
      popular: true,
    },
    {
      id: 7,
      title: 'LinkedIn Learning',
      description: 'Expert-led courses for every step of your career',
      link: 'https://www.linkedin.com/learning/',
      category: 'Learning',
      icon: 'video',
      popular: false,
    },
    {
      id: 8,
      title: 'Naukri FastForward',
      description: 'Resume writing services and career booster tools',
      link: 'https://resume.naukri.com/',
      category: 'Resources',
      icon: 'trending',
      popular: false,
    },
  ]

  const handleJoinSession = (url?: string) => {
    if (url) window.open(url, '_blank')
    else alert('Session details will be sent to your email.')
  }

  // Assessments
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizScore, setQuizScore] = useState<Record<string, number>>({})
  const [quizResult, setQuizResult] = useState<CareerPath | null>(null)

  const quizQuestions = [
    {
      q: "What do you enjoy doing most in your free time?", options: [
        { text: "Solving puzzles or coding", type: "Technology" },
        { text: "Drawing, painting, or designing", type: "Design" },
        { text: "Writing stories or blogs", type: "Creative" },
        { text: "Analyzing trends or managing money", type: "Business" }
      ]
    },
    {
      q: "Which subject did you like most in school?", options: [
        { text: "Computer Science / Math", type: "Technology" },
        { text: "Art / Geography", type: "Design" },
        { text: "English / Literature", type: "Creative" },
        { text: "Economics / Business Studies", type: "Business" }
      ]
    },
    {
      q: "What kind of work environment do you prefer?", options: [
        { text: "Quiet, focused technical work", type: "Technology" },
        { text: "Creative studio or collaborative space", type: "Design" },
        { text: "Media house or publishing", type: "Creative" },
        { text: "Corporate office or meeting rooms", type: "Business" }
      ]
    }
  ]

  const handleQuizAnswer = (type: string) => {
    setQuizScore(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }))
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    // Find highest score type
    const topType = Object.entries(quizScore).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Technology'
    const recommended = careerPaths.find(p => p.category === topType) || careerPaths[0]
    setQuizResult(recommended)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setQuizScore({})
    setQuizResult(null)
    setShowAssessmentModal(false)
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800)

    // Load bookmarks from localStorage
    const saved = localStorage.getItem('bookmarkedCareerPaths')
    if (saved) setBookmarkedPaths(JSON.parse(saved))
  }, [])

  const handleBookmark = (pathId: number) => {
    const updated = bookmarkedPaths.includes(pathId)
      ? bookmarkedPaths.filter(id => id !== pathId)
      : [...bookmarkedPaths, pathId]
    setBookmarkedPaths(updated)
    localStorage.setItem('bookmarkedCareerPaths', JSON.stringify(updated))
  }

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setShowAssessmentModal(true)
  }

  const getDemandColor = (demand: string) => {
    const colors = {
      'High': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Growing': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    }
    return colors[demand as keyof typeof colors]
  }

  const categories = ['All', 'Technology', 'Marketing', 'Design', 'Creative', 'Business']

  const filteredPaths = careerPaths.filter(path =>
    (selectedCategory === 'All' || path.category === selectedCategory) &&
    (searchQuery === '' || path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <FaRocket className="text-4xl text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Career Guidance & Development
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover your dream career, connect with mentors, and access personalized resources to achieve your professional goals
            </p>
          </div>

          {/* Stats Banner */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
            >
              <FaBriefcase className="text-3xl mb-2" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-90">Job Opportunities</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white"
            >
              <FaUserTie className="text-3xl mb-2" />
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-90">Expert Mentors</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            >
              <FaTrophy className="text-3xl mb-2" />
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm opacity-90">Success Stories</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-orange-500 to-red-600 text-white"
            >
              <FaGraduationCap className="text-3xl mb-2" />
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm opacity-90">Free Resources</div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            {['overview', 'career-paths', 'mentorship', 'resources', 'assessments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700"
                  >
                    <FaLightbulb className="text-4xl text-purple-600 mb-3" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Find Your Path</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Take our AI-powered assessment to discover careers that match your personality and skills</p>
                    <button
                      onClick={() => setSelectedTab('assessments')}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaRocket /> Start Assessment
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700"
                  >
                    <FaUsers className="text-4xl text-blue-600 mb-3" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Connect with Mentors</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Get 1-on-1 guidance from industry experts at top companies</p>
                    <button
                      onClick={() => setSelectedTab('mentorship')}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaUserTie /> Browse Mentors
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700"
                  >
                    <FaBook className="text-4xl text-green-600 mb-3" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Free Resources</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Access resume builders, mock interviews, and learning materials</p>
                    <button
                      onClick={() => setSelectedTab('resources')}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaGraduationCap /> Explore Resources
                    </button>
                  </motion.div>
                </div>

                {/* Featured Career Paths */}
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                  <FaTrophy className="text-yellow-500" /> Trending Career Paths
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {careerPaths.filter(p => p.trending).slice(0, 4).map((path, idx) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="card bg-white dark:bg-gray-800 hover:shadow-2xl"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full font-semibold">
                          {path.category}
                        </span>
                        <span className="text-xs px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full font-semibold flex items-center gap-1">
                          <FaChartLine /> Trending
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{path.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{path.description}</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FaRupeeSign className="text-green-600" />
                          <span className="font-semibold">{path.avgSalary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaBriefcase className="text-blue-600" />
                          <span>{path.jobOpenings.toLocaleString()} jobs</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTab('career-paths')}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        Learn More <FaArrowRight />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'career-paths' && (
              <motion.div
                key="career-paths"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search and Filter */}
                <div className="mb-8 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search career paths..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-gray-500" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Career Paths Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPaths.map((path, idx) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="card bg-white dark:bg-gray-800 hover:shadow-2xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full">
                            {path.category}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getDemandColor(path.demand)}`}>
                            {path.demand} Demand
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookmark(path.id)}
                          className={`p-2 rounded-full transition-all ${bookmarkedPaths.includes(path.id)
                            ? 'text-red-500 bg-red-100 dark:bg-red-900/30'
                            : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                          <FaBookmark />
                        </button>
                      </div>

                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{path.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{path.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaRupeeSign className="text-green-600" />
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Avg Salary</div>
                            <div className="font-bold text-gray-900 dark:text-white">{path.avgSalary}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-600" />
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Time to Learn</div>
                            <div className="font-bold text-gray-900 dark:text-white">{path.timeToLearn}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBriefcase className="text-purple-600" />
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Job Openings</div>
                            <div className="font-bold text-gray-900 dark:text-white">{path.jobOpenings.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaChartLine className="text-orange-600" />
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Market Trend</div>
                            <div className="font-bold text-gray-900 dark:text-white">{path.demand}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Required Skills:</div>
                        <div className="flex flex-wrap gap-2">
                          {path.requiredSkills.map((skill, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <FaRocket /> Start Learning Path
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'mentorship' && (
              <motion.div
                key="mentorship"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Connect with Industry Experts</h2>
                  <p className="text-gray-600 dark:text-gray-400">Get personalized career guidance from professionals at top companies</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mentors.map((mentor, idx) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="card bg-white dark:bg-gray-800 hover:shadow-2xl"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{mentor.name}</h3>
                          <p className="text-purple-600 dark:text-purple-400 font-semibold">{mentor.role}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.company}</p>
                        </div>
                        {mentor.available && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                            Available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span className="font-bold">{mentor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <FaUsers />
                          <span>{mentor.sessions} sessions</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <FaClock />
                          <span>{mentor.experience}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Expertise:</div>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((exp, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>

                      <FaCalendarAlt /> {mentor.available ? 'Book Session' : 'Not Available'}
                    </button>
                    </motion.div>
            ))}

            {sessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card bg-white dark:bg-gray-800 hover:shadow-xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl">
                    <FaVideo />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{session.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{session.organizer}</p>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      Upcoming Session
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{session.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(session.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FaUserTie /> {session.category}</span>
                </div>
                <button
                  onClick={() => handleJoinSession(session.applyUrl)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FaExternalLinkAlt /> Join Session
                </button>
              </motion.div>
            ))}

            {sessions.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <FaUserTie className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-4">No specific mentor sessions scheduled right now.</p>
                <button onClick={() => alert('Request sent! An admin will contact you.')} className="btn-secondary">
                  Request Specific Guidance
                </button>
              </div>
            )}
          </div>
        </motion.div>
            )}

        {selectedTab === 'resources' && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Career Development Resources</h2>
              <p className="text-gray-600 dark:text-gray-400">Tools, courses, and materials to accelerate your career growth</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((resource, idx) => {
                const IconComponent = resource.icon === 'clipboard' ? FaFileAlt :
                  resource.icon === 'file' ? FaFileAlt :
                    resource.icon === 'microphone' ? FaMicrophone :
                      resource.icon === 'chart' ? FaChartLine :
                        resource.icon === 'graduation' ? FaGraduationCap :
                          resource.icon === 'code' ? FaBook :
                            resource.icon === 'video' ? FaVideo :
                              FaLightbulb

                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="card bg-white dark:bg-gray-800 hover:shadow-2xl relative"
                  >
                    {resource.popular && (
                      <span className="absolute top-4 right-4 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full font-semibold flex items-center gap-1">
                        <FaStar /> Popular
                      </span>
                    )}

                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="text-3xl text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{resource.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{resource.description}</p>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        {resource.category}
                      </span>
                    </div>

                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                      onClick={(e) => {
                        if (resource.link === '#') {
                          e.preventDefault()
                          alert('This feature is coming soon!')
                        }
                      }}
                    >
                      <FaExternalLinkAlt /> Access Now
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {selectedTab === 'assessments' && (
          <motion.div
            key="assessments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Career Assessments</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover your strengths and find the perfect career match</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {assessments.map((assessment, idx) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="card bg-white dark:bg-gray-800 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-2xl text-white" />
                    </div>
                    {assessment.completed && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full flex items-center gap-1">
                        <FaCheckCircle /> Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{assessment.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{assessment.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{assessment.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaFileAlt />
                      <span>{assessment.questions} questions</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startAssessment(assessment)}
                    className={assessment.completed ? 'btn-secondary w-full' : 'btn-primary w-full flex items-center justify-center gap-2'}
                  >
                    {assessment.completed ? (
                      <>View Results</>
                    ) : (
                      <>
                        <FaPlay /> Start Assessment
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assessment Modal */}
      {showAssessmentModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-lg w-full bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{selectedAssessment.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedAssessment.description}</p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedAssessment.duration}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedAssessment.questions}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowAssessmentModal(false)
                  alert('Assessment started! This is a demo - full assessment coming soon.')
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <FaPlay /> Begin Assessment
              </button>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
      </div >
    </div >
  )
}

export default function CareerGuidancePage() {
  return (
    <ProtectedRoute requireRole={true} allowedRoles={['girl']}>
      <CareerGuidanceContent />
    </ProtectedRoute>
  )
}



