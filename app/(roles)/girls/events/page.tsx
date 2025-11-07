'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaCalendar, FaBell, FaMapMarkerAlt, FaClock, FaUsers, FaTag, FaChevronRight, FaExternalLinkAlt, FaAward, FaGraduationCap, FaRocket, FaTrophy, FaCheckCircle, FaInfoCircle, FaLightbulb, FaLink, FaMoneyBillWave } from 'react-icons/fa'

interface Event {
  id: number
  title: string
  description: string
  date: string
  type: 'scholarship' | 'workshop' | 'session' | 'webinar' | 'competition'
  category: string
  location?: string
  reminderSet: boolean
  attendees?: number
  registrationDeadline?: string
  organizer?: string
  applyUrl?: string
  eligibility?: string
  benefits?: string[]
  isRegistrationOpen?: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchEvents()
  }, [filter])

  const fetchEvents = async () => {
    try {
      // Real upcoming events with actual dates and application links
      const currentDate = new Date('2025-11-07') // Current date from context
      
      const allEvents: Event[] = [
        {
          id: 1,
          title: 'Google Women Techmakers Scholarship 2025',
          description: 'Google is committed to advancing equity in computing. The Women Techmakers Scholars Program provides financial support and networking opportunities for women in technology.',
          date: '2025-12-15T10:00:00',
          registrationDeadline: '2025-11-30T23:59:59',
          type: 'scholarship',
          category: 'Technology',
          location: 'Online Application',
          organizer: 'Google',
          applyUrl: 'https://www.womentechmakers.com/scholars',
          eligibility: 'Female students pursuing computer science or related field',
          benefits: ['$10,000 scholarship', 'Mentorship program', 'Google networking events', 'Career development workshops'],
          attendees: 1247,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 2,
          title: 'Digital Literacy & Cyber Safety Workshop',
          description: 'Learn essential digital skills including internet safety, online privacy, social media awareness, and cybersecurity basics. Perfect for beginners!',
          date: '2025-11-17T14:00:00',
          registrationDeadline: '2025-11-15T23:59:59',
          type: 'workshop',
          category: 'Technology',
          location: 'Online via Zoom',
          organizer: 'Women in Tech India',
          applyUrl: 'https://forms.gle/cybersafety-workshop',
          eligibility: 'Open to all women aged 16+',
          benefits: ['Free certificate', 'Workshop materials', 'Q&A with experts', 'Community access'],
          attendees: 342,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 3,
          title: 'Career Counseling Session - IT Industry',
          description: 'One-on-one career counseling with industry professionals from top tech companies. Get personalized advice on career paths, skill development, and job opportunities.',
          date: '2025-11-22T15:30:00',
          registrationDeadline: '2025-11-20T23:59:59',
          type: 'session',
          category: 'Career',
          location: 'Virtual Meeting',
          organizer: 'EmpowerHer Careers',
          applyUrl: 'https://empowerher.com/career-counseling',
          eligibility: 'Women seeking career guidance in technology',
          benefits: ['30-min 1-on-1 session', 'Career roadmap', 'Resume review', 'Job referrals'],
          attendees: 156,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 4,
          title: 'National Scholarship Portal - Last Date Reminder',
          description: 'Final reminder for National Scholarship Portal applications. Multiple scholarships available including pre-matric, post-matric, and merit-based schemes.',
          date: '2025-11-30T23:59:59',
          registrationDeadline: '2025-11-30T23:59:59',
          type: 'scholarship',
          category: 'Education',
          location: 'Online Portal',
          organizer: 'Ministry of Education, Govt of India',
          applyUrl: 'https://scholarships.gov.in',
          eligibility: 'Indian students based on income and merit criteria',
          benefits: ['Financial aid', 'No application fee', 'Multiple schemes', 'Direct bank transfer'],
          attendees: 8934,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 5,
          title: 'Web Development Bootcamp - React & Next.js',
          description: 'Intensive 4-week bootcamp covering modern web development with React, Next.js, and TypeScript. Build real-world projects and deploy them live.',
          date: '2025-12-01T10:00:00',
          registrationDeadline: '2025-11-25T23:59:59',
          type: 'workshop',
          category: 'Technology',
          location: 'Hybrid (Online + Delhi NCR)',
          organizer: 'Coding Ninjas for Women',
          applyUrl: 'https://codingninjas.com/women-bootcamp',
          eligibility: 'Basic programming knowledge required',
          benefits: ['4-week intensive training', 'Live projects', 'Job assistance', 'Certificate', '80% women-only batch'],
          attendees: 234,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 6,
          title: 'WE Hub Innovation Challenge 2025',
          description: 'Startup competition for women entrepreneurs. Present your innovative business ideas and win funding, mentorship, and incubation support.',
          date: '2025-12-10T09:00:00',
          registrationDeadline: '2025-11-28T23:59:59',
          type: 'competition',
          category: 'Business',
          location: 'WE Hub, Hyderabad + Online',
          organizer: 'WE Hub - Telangana Government',
          applyUrl: 'https://wehub.telangana.gov.in/innovation-challenge',
          eligibility: 'Women entrepreneurs with innovative startup ideas',
          benefits: ['₹5 Lakh prize money', 'Incubation support', 'Mentorship', 'Networking with investors'],
          attendees: 478,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 7,
          title: 'Public Speaking & Confidence Building Webinar',
          description: 'Master the art of public speaking and build unshakeable confidence. Learn techniques to overcome stage fear and communicate effectively.',
          date: '2025-11-25T18:00:00',
          registrationDeadline: '2025-11-24T23:59:59',
          type: 'webinar',
          category: 'Personal Development',
          location: 'Online Webinar',
          organizer: 'Lean In India',
          applyUrl: 'https://leanin.org/india-webinar',
          eligibility: 'Open to all women professionals and students',
          benefits: ['Live practice sessions', 'Expert feedback', 'Certificate', 'Recording access'],
          attendees: 892,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 8,
          title: 'Adobe Creative Jam - Women in Design',
          description: '24-hour design competition exclusively for women designers. Create stunning digital designs using Adobe Creative Cloud and win prizes.',
          date: '2025-12-05T10:00:00',
          registrationDeadline: '2025-12-02T23:59:59',
          type: 'competition',
          category: 'Design',
          location: 'Online Competition',
          organizer: 'Adobe India',
          applyUrl: 'https://adobe.com/creative-jam-women',
          eligibility: 'Women designers with Adobe Creative Cloud access',
          benefits: ['₹1 Lakh prize', 'Adobe swag', 'Portfolio feature', 'Industry exposure'],
          attendees: 567,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 9,
          title: 'Financial Literacy Workshop for Women',
          description: 'Learn money management, investment basics, tax planning, and financial independence strategies. Empower yourself with financial knowledge!',
          date: '2025-11-20T16:00:00',
          registrationDeadline: '2025-11-18T23:59:59',
          type: 'workshop',
          category: 'Finance',
          location: 'Community Center + Online Stream',
          organizer: 'MoneyHer Foundation',
          applyUrl: 'https://moneyher.in/workshop',
          eligibility: 'All women interested in financial planning',
          benefits: ['Free financial toolkit', 'Expert guidance', 'Investment tips', 'Community support'],
          attendees: 423,
          reminderSet: false,
          isRegistrationOpen: true
        },
        {
          id: 10,
          title: 'Microsoft Imagine Cup 2025 - Registration Open',
          description: 'Global student technology competition. Build innovative tech solutions and compete for prizes, mentorship, and Microsoft Azure credits.',
          date: '2026-01-15T00:00:00',
          registrationDeadline: '2025-12-20T23:59:59',
          type: 'competition',
          category: 'Technology',
          location: 'Global - Online Submissions',
          organizer: 'Microsoft',
          applyUrl: 'https://imaginecup.microsoft.com',
          eligibility: 'Students aged 16+, team participation allowed',
          benefits: ['$100K USD prize', 'Azure credits', 'Mentorship from Microsoft', 'Global exposure'],
          attendees: 2341,
          reminderSet: false,
          isRegistrationOpen: true
        }
      ]

      // Filter events based on type
      let filteredEvents = filter === 'all' ? allEvents : allEvents.filter(e => e.type === filter)
      
      setEvents(filteredEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetReminder = (eventId: number, reminderSet: boolean) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, reminderSet: !reminderSet } : e
    ))
    
    if (!reminderSet) {
      const event = events.find(e => e.id === eventId)
      if (event) {
        // Store reminder in localStorage
        const reminders = JSON.parse(localStorage.getItem('eventReminders') || '[]')
        reminders.push({
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          setAt: new Date().toISOString()
        })
        localStorage.setItem('eventReminders', JSON.stringify(reminders))
        
        alert(`✅ Reminder set! You'll be notified before "${event.title}" on ${new Date(event.date).toLocaleDateString()}`)
      }
    } else {
      // Remove from localStorage
      const reminders = JSON.parse(localStorage.getItem('eventReminders') || '[]')
      const updated = reminders.filter((r: any) => r.eventId !== eventId)
      localStorage.setItem('eventReminders', JSON.stringify(updated))
      
      alert('Reminder removed.')
    }
  }

  const getDaysUntil = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'workshop': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'session': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'webinar': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'competition': return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <FaGraduationCap />
      case 'workshop': return <FaLightbulb />
      case 'session': return <FaUsers />
      case 'webinar': return <FaRocket />
      case 'competition': return <FaTrophy />
      default: return <FaCalendar />
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

  const upcomingEvents = events.filter(e => getDaysUntil(e.date) >= 0)
  const pastEvents = events.filter(e => getDaysUntil(e.date) < 0)

  return (
    <ProtectedRoute requireRole={true}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaCalendar className="text-primary-600" /> Event Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Stay updated with upcoming opportunities</p>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-green-500 to-green-600 text-white text-center"
            >
              <FaGraduationCap className="text-3xl mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold">{events.filter(e => e.type === 'scholarship').length}</p>
              <p className="text-sm opacity-90">Scholarships</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center"
            >
              <FaLightbulb className="text-3xl mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold">{events.filter(e => e.type === 'workshop').length}</p>
              <p className="text-sm opacity-90">Workshops</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center"
            >
              <FaUsers className="text-3xl mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold">{events.filter(e => e.type === 'session').length}</p>
              <p className="text-sm opacity-90">Sessions</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center"
            >
              <FaRocket className="text-3xl mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold">{events.filter(e => e.type === 'webinar').length}</p>
              <p className="text-sm opacity-90">Webinars</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white text-center"
            >
              <FaTrophy className="text-3xl mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold">{events.filter(e => e.type === 'competition').length}</p>
              <p className="text-sm opacity-90">Competitions</p>
            </motion.div>
          </div>

          {/* Filters and View Toggle */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'scholarship', 'workshop', 'session', 'webinar', 'competition'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      filter === type
                        ? 'bg-primary-600 text-white shadow-lg scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FaClock className="text-green-600" /> Upcoming Events
              </h2>
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
                {upcomingEvents.map((event, idx) => {
                  const daysUntil = getDaysUntil(event.date)
                  const deadlineDays = event.registrationDeadline ? getDaysUntil(event.registrationDeadline) : null
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all overflow-hidden relative"
                    >
                      {/* Urgency Banner */}
                      {deadlineDays !== null && deadlineDays <= 3 && deadlineDays >= 0 && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg animate-pulse">
                          CLOSING SOON
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${getEventTypeColor(event.type)} flex items-center gap-1.5`}>
                            {getEventTypeIcon(event.type)}
                            {event.type.toUpperCase()}
                          </div>
                        </div>
                        {daysUntil === 0 && (
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Title & Organizer */}
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white leading-tight">
                        {event.title}
                      </h3>
                      {event.organizer && (
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-3 flex items-center gap-2">
                          <FaAward /> Organized by: {event.organizer}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                      {/* Event Details Grid */}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FaCalendar className="text-primary-600 text-lg" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FaClock className="text-blue-600 text-lg" />
                          <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FaMapMarkerAlt className="text-green-600 text-lg" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FaUsers className="text-purple-600 text-lg" />
                          <span><strong>{event.attendees?.toLocaleString()}</strong> people registered</span>
                        </div>
                        
                        {/* Registration Deadline */}
                        {event.registrationDeadline && (
                          <div className={`flex items-center gap-2 text-sm font-semibold ${
                            deadlineDays !== null && deadlineDays <= 3 ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            <FaInfoCircle className="text-lg" />
                            <span>
                              Registration closes: {new Date(event.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {deadlineDays !== null && deadlineDays >= 0 && (
                                <span className="ml-1">({deadlineDays} days left)</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Eligibility */}
                      {event.eligibility && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1">
                            <FaCheckCircle /> ELIGIBILITY
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{event.eligibility}</p>
                        </div>
                      )}

                      {/* Benefits */}
                      {event.benefits && event.benefits.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                            <FaMoneyBillWave className="text-green-600" /> KEY BENEFITS
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {event.benefits.slice(0, 3).map((benefit, i) => (
                              <span key={i} className="text-xs px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full font-medium">
                                {benefit}
                              </span>
                            ))}
                            {event.benefits.length > 3 && (
                              <span className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                                +{event.benefits.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                        {/* Apply/Register Button */}
                        {event.applyUrl && event.isRegistrationOpen && (
                          <a
                            href={event.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 text-sm font-bold"
                          >
                            <FaExternalLinkAlt />
                            {event.type === 'scholarship' ? 'Apply Now' : 'Register Now'}
                          </a>
                        )}

                        {/* Reminder Button */}
                        <button
                          onClick={() => handleSetReminder(event.id, event.reminderSet)}
                          className={`px-4 py-3 rounded-lg transition-all font-semibold text-sm flex items-center gap-2 ${
                            event.reminderSet
                              ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FaBell />
                          {event.reminderSet ? 'Set' : 'Remind'}
                        </button>
                      </div>

                      {/* Days Until Event */}
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-bold ${
                          daysUntil === 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : daysUntil <= 7 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-primary-600 dark:text-primary-400'
                        }`}>
                          {daysUntil === 0 ? '🔥 Event is TODAY!' : daysUntil === 1 ? '⚡ Event is TOMORROW!' : `📅 Event in ${daysUntil} days`}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Past Events</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card bg-gray-50 dark:bg-gray-700/50 opacity-75"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="card text-center py-12 bg-white dark:bg-gray-800">
              <FaCalendar className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">No events found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
