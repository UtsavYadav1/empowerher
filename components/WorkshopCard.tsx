'use client'

import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaSpinner } from 'react-icons/fa'

interface WorkshopCardProps {
  workshop: {
    id: number
    title: string
    description: string
    date: string
    location: string
    capacity: number
    enrolled: number
  }
  onRegister?: () => void
  isRegistered?: boolean
  isRegistering?: boolean
}

export default function WorkshopCard({ workshop, onRegister, isRegistered = false, isRegistering = false }: WorkshopCardProps) {
  const availability = workshop.capacity - workshop.enrolled
  const isFull = availability === 0

  return (
    <motion.div
      className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
      whileHover={{ scale: 1.02, y: -5 }}
      role="article"
      aria-labelledby={`workshop-${workshop.id}-title`}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-pink-500 text-white p-6 -m-6 mb-6">
        <h3 id={`workshop-${workshop.id}-title`} className="text-2xl font-bold text-white">
          {workshop.title}
        </h3>
      </div>

      <div className="px-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">{workshop.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FaCalendarAlt className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <span className="font-semibold">Date: </span>
              <span>{new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FaMapMarkerAlt className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <span className="font-semibold">Location: </span>
              <span>{workshop.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FaUsers className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <span className="font-semibold">Availability: </span>
              <span className={availability > 10 ? 'text-green-600 dark:text-green-400' : availability > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>
                {availability} spots available
              </span>
              <span className="text-gray-500 dark:text-gray-400"> ({workshop.enrolled}/{workshop.capacity})</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Capacity</span>
            <span>{Math.round((workshop.enrolled / workshop.capacity) * 100)}% filled</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                workshop.enrolled / workshop.capacity > 0.9
                  ? 'bg-red-500'
                  : workshop.enrolled / workshop.capacity > 0.7
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          </div>
        </div>

        <button
          onClick={onRegister}
          className={`w-full py-4 rounded-lg font-semibold transition-all text-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50 flex items-center justify-center gap-2 ${
            isRegistered
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-default'
              : isFull
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : isRegistering
              ? 'bg-primary-400 text-white cursor-wait'
              : 'btn-primary hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
          disabled={isFull || isRegistered || isRegistering}
          aria-label={isRegistered ? 'Already registered' : isFull ? 'Workshop is full' : isRegistering ? 'Registering...' : `Register for ${workshop.title}`}
        >
          {isRegistering ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FaSpinner />
              </motion.div>
              Registering...
            </>
          ) : isRegistered ? (
            <>
              <FaCheckCircle />
              Registered Successfully
            </>
          ) : isFull ? (
            'Workshop Full'
          ) : (
            'Register Now'
          )}
        </button>
      </div>
    </motion.div>
  )
}

