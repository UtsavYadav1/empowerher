'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WorkshopCard from '@/components/WorkshopCard'
import { getCurrentUser } from '@/utils/auth'

interface Workshop {
  id: number
  title: string
  description: string
  date: string
  location: string
  capacity: number
  enrolled: number
}

// Separate component that uses hooks - this is the correct way
function WorkshopCardWrapper({ 
  workshop, 
  index, 
  onRegister, 
  isRegistered, 
  isRegistering 
}: { 
  workshop: Workshop
  index: number
  onRegister: () => void
  isRegistered: boolean
  isRegistering: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      role="listitem"
    >
      <WorkshopCard 
        workshop={workshop} 
        onRegister={onRegister}
        isRegistered={isRegistered}
        isRegistering={isRegistering}
      />
    </motion.div>
  )
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [registered, setRegistered] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user for registration
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    // Fetch workshops from API
    fetchWorkshops()
    
    // Check existing registrations
    checkRegistrations()
  }, [])

  // Handle pending workshop registration after login - separate effect
  useEffect(() => {
    if (user) {
      const pendingWorkshopId = sessionStorage.getItem('pendingWorkshopRegistration')
      if (pendingWorkshopId) {
        sessionStorage.removeItem('pendingWorkshopRegistration')
        // Auto-register after login
        const workshopId = parseInt(pendingWorkshopId)
        setTimeout(() => {
          handleRegister(workshopId)
        }, 500)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/mock/workshops')
      const data = await response.json()
      
      if (data.success) {
        // Transform API data to match our interface
        const transformedWorkshops = data.data.map((w: any) => ({
          id: w.id,
          title: w.title,
          description: w.description,
          date: w.date,
          location: w.village || 'Online',
          capacity: 50, // Default capacity
          enrolled: 0, // Will be updated from registrations
        }))
        setWorkshops(transformedWorkshops)
      } else {
        // Fallback to hardcoded workshops if API fails
        setWorkshops([
          {
            id: 1,
            title: 'Leadership Skills for Young Women',
            description: 'Learn essential leadership skills and build confidence',
            date: '2024-03-15',
            location: 'Online',
            capacity: 50,
            enrolled: 32,
          },
          {
            id: 2,
            title: 'Entrepreneurship Basics',
            description: 'Introduction to starting your own business',
            date: '2024-03-20',
            location: 'Conference Center',
            capacity: 30,
            enrolled: 15,
          },
          {
            id: 3,
            title: 'Digital Marketing Masterclass',
            description: 'Master social media and digital marketing strategies',
            date: '2024-03-25',
            location: 'Online',
            capacity: 100,
            enrolled: 67,
          },
          {
            id: 4,
            title: 'Financial Literacy Workshop',
            description: 'Understanding money management and investments',
            date: '2024-04-01',
            location: 'Community Center',
            capacity: 40,
            enrolled: 28,
          },
          {
            id: 5,
            title: 'Handicraft Training',
            description: 'Learn traditional crafts and business skills',
            date: '2024-04-05',
            location: 'Workshop Hall',
            capacity: 25,
            enrolled: 20,
          },
          {
            id: 6,
            title: 'Self-Defense Training',
            description: 'Basic self-defense techniques for safety',
            date: '2024-04-10',
            location: 'Sports Complex',
            capacity: 35,
            enrolled: 30,
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching workshops:', error)
      // Use fallback data
      setWorkshops([
        {
          id: 1,
          title: 'Leadership Skills for Young Women',
          description: 'Learn essential leadership skills and build confidence',
          date: '2024-03-15',
          location: 'Online',
          capacity: 50,
          enrolled: 32,
        },
        {
          id: 2,
          title: 'Entrepreneurship Basics',
          description: 'Introduction to starting your own business',
          date: '2024-03-20',
          location: 'Conference Center',
          capacity: 30,
          enrolled: 15,
        },
        {
          id: 3,
          title: 'Digital Marketing Masterclass',
          description: 'Master social media and digital marketing strategies',
          date: '2024-03-25',
          location: 'Online',
          capacity: 100,
          enrolled: 67,
        },
        {
          id: 4,
          title: 'Financial Literacy Workshop',
          description: 'Understanding money management and investments',
          date: '2024-04-01',
          location: 'Community Center',
          capacity: 40,
          enrolled: 28,
        },
        {
          id: 5,
          title: 'Handicraft Training',
          description: 'Learn traditional crafts and business skills',
          date: '2024-04-05',
          location: 'Workshop Hall',
          capacity: 25,
          enrolled: 20,
        },
        {
          id: 6,
          title: 'Self-Defense Training',
          description: 'Basic self-defense techniques for safety',
          date: '2024-04-10',
          location: 'Sports Complex',
          capacity: 35,
          enrolled: 30,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const checkRegistrations = async () => {
    // Check localStorage for existing registrations
    const storedRegistrations = localStorage.getItem('workshopRegistrations')
    if (storedRegistrations) {
      try {
        const regs = JSON.parse(storedRegistrations)
        setRegistered(regs)
      } catch (error) {
        console.error('Error parsing stored registrations:', error)
      }
    }
  }

  const handleRegister = async (workshopId: number) => {
    // Check if user is logged in
    if (!user) {
      // Store the workshop ID in sessionStorage for after login
      sessionStorage.setItem('pendingWorkshopRegistration', workshopId.toString())
      alert('Please log in to register for workshops. Redirecting to login...')
      window.location.href = '/login?redirect=/workshops'
      return
    }

    // Check if already registered
    if (registered.includes(workshopId)) {
      alert('You are already registered for this workshop!')
      return
    }

    setRegistering(workshopId)

    try {
      // Get user details
      const name = user.name || 'User'
      const phone = user.phone || ''
      const email = user.email || ''

      // Call registration API
      const response = await fetch('/api/mock/workshops/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workshopId,
          userId: user.id,
          name,
          phone,
          email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add to registered list
        const newRegistered = [...registered, workshopId]
        setRegistered(newRegistered)
        
        // Save to localStorage
        localStorage.setItem('workshopRegistrations', JSON.stringify(newRegistered))

        // Update workshop enrolled count
        setWorkshops(prev =>
          prev.map(w =>
            w.id === workshopId ? { ...w, enrolled: w.enrolled + 1 } : w
          )
        )

        // Show success message
        alert(`Successfully registered for "${data.data.workshopTitle}"!\n\nRegistration ID: ${data.data.registrationId}\n\nYou will receive confirmation details shortly.`)
      } else {
        alert(`Registration failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error registering for workshop:', error)
      alert('Failed to register. Please try again later.')
    } finally {
      setRegistering(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 container mx-auto px-4 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4" role="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Workshops
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our workshops to learn new skills, network with peers, and grow your potential
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {workshops.map((workshop, index) => (
            <WorkshopCardWrapper
              key={workshop.id}
              workshop={workshop}
              index={index}
              onRegister={() => handleRegister(workshop.id)}
              isRegistered={registered.includes(workshop.id)}
              isRegistering={registering === workshop.id}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
