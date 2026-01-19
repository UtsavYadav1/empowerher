'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import ImageCarousel from '@/components/ImageCarousel'
import { FaUsers, FaGraduationCap, FaHandHoldingHeart, FaChartLine, FaAward, FaLightbulb, FaRocket, FaHeart } from 'react-icons/fa'
import CountUp from 'react-countup'
import { useState, useEffect } from 'react'

const carouselItems = [
  {
    id: 1,
    image: '/images/hero.jpg',
    title: 'Our Team',
    description: 'Dedicated team members working together to empower women and girls',
  },
  {
    id: 2,
    image: '/images/team.jpg',
    title: 'Rural Outreach',
    description: 'Connecting with communities in rural areas to bring education and opportunities',
  },
  {
    id: 3,
    image: '/images/workshop.jpg',
    title: 'Workshops',
    description: 'Hands-on workshops teaching practical skills and knowledge',
  },
  {
    id: 4,
    image: '/images/community.jpg',
    title: 'Community Events',
    description: 'Building stronger communities through engagement and support',
  },
]

const initialStats = [
  { icon: FaUsers, label: 'Women Empowered', value: 0, suffix: '+' },
  { icon: FaGraduationCap, label: 'Girls Educated', value: 0, suffix: '+' },
  { icon: FaHandHoldingHeart, label: 'Workshops Conducted', value: 0, suffix: '+' },
  { icon: FaChartLine, label: 'Communities Reached', value: 0, suffix: '+' },
]

const timeline = [
  {
    year: '2023',
    title: 'Grassroots Beginning',
    description: 'Started our journey by physically visiting rural communities, helping poor girls and women learn essential skills through direct community engagement.',
    icon: FaHandHoldingHeart,
  },
  {
    year: '2024',
    title: 'Community Outreach',
    description: 'Continued our on-ground work, reaching more villages and building strong relationships with local communities across Uttar Pradesh.',
    icon: FaUsers,
  },
  {
    year: '2025',
    title: 'Digital Platform Launch',
    description: 'Launched our comprehensive online platform to scale our impact, bringing educational resources, business tools, and opportunities to women and girls digitally.',
    icon: FaRocket,
  },
]

const teamMembers = [
  {
    name: 'Utsav Yadav',
    role: 'Founder & Developer',
    image: '/images/team/utsav.jpg',
    description: 'Expert in curriculum development and mentorship programs for young girls.',
  },
  {
    name: 'Bhoomi Sharma',
    role: 'Co-Founder & Developer',
    image: '/images/team/bhoomi.jpg',
    description: 'Passionate about women empowerment with 5+ years of experience in social impact.',
  },
  {
    name: 'Mansi Singh',
    role: 'Business Development & Developer',
    image: '/images/team/mansi.jpg',
    description: 'Dedicated to helping women entrepreneurs build and grow their businesses.',
  },
  {
    name: 'Sameer Singh',
    role: 'Community Outreach & Developer',
    image: '/images/team/sameer.jpg',
    description: 'Connecting with rural communities and organizing impactful workshops.',
  },
]

const testimonials = [
  {
    name: 'Sunita Devi',
    role: 'Entrepreneur',
    image: '/images/hero.jpg',
    quote: 'EmpowerHer helped me start my pickle business. Now I earn ₹15,000 monthly and support my family!',
    rating: 5,
  },
  {
    name: 'Riya Sharma',
    role: 'Student',
    image: '/images/team.jpg',
    quote: 'The scholarship program enabled me to continue my education. I\'m now pursuing engineering!',
    rating: 5,
  },
  {
    name: 'Laxmi Devi',
    role: 'Artisan',
    image: '/images/workshop.jpg',
    quote: 'Through their workshops, I learned digital marketing. My handicraft sales increased by 300%!',
    rating: 5,
  },
]

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [impactStats, setImpactStats] = useState(initialStats)

  useEffect(() => {
    setIsVisible(true)
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/impact')
      const result = await response.json()
      if (result.success) {
        setImpactStats([
          { icon: FaUsers, label: 'Women Empowered', value: result.data.womenEmpowered, suffix: '+' },
          { icon: FaGraduationCap, label: 'Girls Educated', value: result.data.girlsEducated, suffix: '+' },
          { icon: FaHandHoldingHeart, label: 'Workshops Conducted', value: result.data.workshops, suffix: '+' },
          { icon: FaChartLine, label: 'Communities Reached', value: result.data.communities, suffix: '+' },
        ])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4" role="main">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
          About EmpowerHer
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Empowering women and girls at every stage of their journey with education, business tools, and social impact.
        </p>
      </motion.div>

      {/* Image Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <ImageCarousel items={carouselItems} />
      </motion.div>

      {/* Statistics Section */}
      <section className="mb-16 py-12 bg-gradient-to-br from-primary-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full mb-4">
                  <Icon className="text-4xl text-white" />
                </div>
                {isVisible && (
                  <h3 className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    <CountUp end={stat.value} duration={2.5} separator="," />
                    {stat.suffix}
                  </h3>
                )}
                <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card bg-gradient-to-br from-primary-500 to-pink-500 text-white hover:shadow-2xl transition-all"
        >
          <FaRocket className="text-5xl mb-4" />
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed opacity-90">
            To empower women and girls by providing accessible education, business opportunities, and a supportive community
            that helps them achieve their full potential and create lasting social impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-2xl transition-all"
        >
          <FaLightbulb className="text-5xl mb-4" />
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed opacity-90">
            A world where every woman and girl has equal access to education, economic opportunities, and the tools needed
            to build a prosperous future for themselves and their communities.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <section className="mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          Our Journey
        </motion.h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-pink-500 transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                      <Icon className="text-white text-xl" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ml-24 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                    }`}>
                    <div className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                          {item.year}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          Our Team
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="card bg-white dark:bg-gray-800 text-center hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          What People Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card bg-gradient-to-br from-primary-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaHeart key={i} className="text-red-500 text-sm" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card bg-gradient-to-br from-primary-500 to-pink-500 text-white text-center"
      >
        <FaAward className="text-6xl mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-2">Empowerment</h3>
            <p className="opacity-90">Enabling women and girls to realize their full potential</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Equality</h3>
            <p className="opacity-90">Promoting equal opportunities for all</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Community</h3>
            <p className="opacity-90">Building strong, supportive networks</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

