'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import CountUp from 'react-countup'
import { FaUsers, FaGraduationCap, FaArrowRight, FaHandHoldingHeart, FaChartLine, FaRocket, FaHeart, FaAward, FaLightbulb, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const slides = [
  {
    id: 1,
    image: '/images/hero.jpg',
    subtitle: 'Welcome to EmpowerHer',
    title: 'Empowering Women,\nTransforming Lives',
    description: 'Join a global movement dedicated to providing education, business tools, and mentorship to women and girls.',
    ctaPrimary: { text: 'Get Started', href: '/register' },
    ctaSecondary: { text: 'Learn More', href: '/about' },
    color: 'from-orange-600 to-pink-600'
  },
  {
    id: 2,
    image: '/images/team.jpg',
    subtitle: 'Community Led Growth',
    title: 'Building Stronger\nCommunities Together',
    description: 'We believe in the power of community. Our grassroots programs are helping thousands of women achieve financial independence.',
    ctaPrimary: { text: 'Join Community', href: '/register' },
    ctaSecondary: { text: 'Our Team', href: '/about' },
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 3,
    image: '/images/workshop.jpg',
    subtitle: 'Skill Development',
    title: 'Learn Skills That\nShape The Future',
    description: 'Access hundreds of workshops, courses, and resources designed to help you succeed in the digital economy.',
    ctaPrimary: { text: 'Browse Workshops', href: '/workshops' },
    ctaSecondary: { text: 'View Courses', href: '/girls/courses' },
    color: 'from-green-600 to-teal-600'
  }
]

const testimonials = [
  {
    name: 'Sunita Devi',
    role: 'Entrepreneur',
    image: '/images/hero.jpg',
    quote: 'EmpowerHer helped me start my pickle business. Now I earn ₹15,000 monthly!',
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
    quote: 'Through their workshops, I learned digital marketing. My sales increased by 300%!',
    rating: 5,
  },
]

const features = [
  { icon: FaGraduationCap, title: 'Education Programs', description: 'Access to quality education and scholarship opportunities for girls.' },
  { icon: FaRocket, title: 'Business Tools', description: 'Resources to start, manage, and grow your own business successfully.' },
  { icon: FaHandHoldingHeart, title: 'Mentorship', description: 'Connect with experienced mentors who guide you every step of the way.' },
  { icon: FaChartLine, title: 'Marketplace', description: 'A dedicated platform to sell your handmade products to a wider audience.' },
  { icon: FaUsers, title: 'Community', description: 'Join a supportive network of like-minded women and girls.' },
  { icon: FaAward, title: 'Skill Development', description: 'Practical workshops and training programs for real-world skills.' },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState({
    womenEmpowered: 75,
    girlsEducated: 120,
    workshops: 25,
    communities: 8
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/impact')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="min-h-screen font-sans" role="main">
      {/* Hero Section with Dynamic Slider */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt="Hero Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-3xl text-white"
              >
                <motion.span
                  className={`inline-block py-1 px-3 rounded-full bg-gradient-to-r ${slides[currentSlide].color} text-sm font-bold tracking-wide mb-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.span>
                <motion.h1
                  className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {slides[currentSlide].title.split('\n').map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {slides[currentSlide].description}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    href={slides[currentSlide].ctaPrimary.href}
                    className={`bg-gradient-to-r ${slides[currentSlide].color} text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2`}
                  >
                    {slides[currentSlide].ctaPrimary.text} <FaArrowRight />
                  </Link>
                  <Link
                    href={slides[currentSlide].ctaSecondary.href}
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    {slides[currentSlide].ctaSecondary.text}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all border border-white/20 hidden md:flex"
          aria-label="Previous Slide"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all border border-white/20 hidden md:flex"
          aria-label="Next Slide"
        >
          <FaChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Impact Stats Section - Floating Cards */}
      <section className="relative bg-slate-50 dark:bg-gray-900 pt-0 pb-24">
        {/* Floating Grid Container - Uses negative margin to pull up into Hero, keeping flow intact */}
        <div className="container mx-auto px-4 relative z-20 -mt-20 md:-mt-32">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-500 mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                <FaUsers />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2"><CountUp end={stats.womenEmpowered} duration={2} />+</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Women Empowered</p>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                <FaGraduationCap />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2"><CountUp end={stats.girlsEducated} duration={2} />+</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Girls Educated</p>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-500 mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                <FaRocket />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2"><CountUp end={stats.workshops} duration={2} />+</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Workshops Held</p>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-500 mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                <FaHandHoldingHeart />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2"><CountUp end={stats.communities} duration={2} />+</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Communities</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 md:mt-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-orange-500 font-bold tracking-wider uppercase text-sm"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-6"
          >
            Building a Future of Equal Opportunity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            We provide a comprehensive ecosystem for women and girls to thrive. From education and mentorship to business funding and digital marketplaces.
          </motion.p>
        </div>
    </div>
      </section >

    {/* Modern Features Grid */ }
    < section className = "py-20 bg-white dark:bg-gray-900" >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors duration-300 border border-transparent hover:border-orange-100 dark:hover:border-gray-600"
              >
                <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center text-orange-500 dark:text-orange-400 text-2xl shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <Link href="/about" className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:gap-2 transition-all">
                  Learn more <FaArrowRight className="ml-1 text-sm" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
      </section >

    {/* Sections for Different User Roles */ }
    < section className = "py-20 bg-gray-900 text-white relative overflow-hidden" >
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero.jpg')] bg-cover bg-center fixed" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who We Serve</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Our platform is designed to support every stakeholder in the women empowerment ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-center shadow-lg hover:shadow-pink-500/30 transition-all border border-pink-400/30"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <FaGraduationCap className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Girls</h3>
              <p className="text-pink-100 mb-8 leading-relaxed">Access scholarships, join coding workshops, and find mentors to guide your career path.</p>
              <Link href="/girls/dashboard" className="bg-white text-pink-600 px-6 py-3 rounded-full font-bold hover:bg-pink-50 transition-colors w-full inline-block">
                Start Learning
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-center shadow-lg hover:shadow-purple-500/30 transition-all border border-purple-400/30"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <FaLightbulb className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Women</h3>
              <p className="text-purple-100 mb-8 leading-relaxed">Get business funding, access the marketplace, and connect with other entrepreneurs.</p>
              <Link href="/women/dashboard" className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors w-full inline-block">
                Grow Business
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 text-center shadow-lg hover:shadow-teal-500/30 transition-all border border-teal-400/30"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <FaHeart className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Customers</h3>
              <p className="text-teal-100 mb-8 leading-relaxed">Shop authentic handmade products and support women-led businesses directly.</p>
              <Link href="/customer/products" className="bg-white text-teal-600 px-6 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors w-full inline-block">
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section >

    {/* Quote/CTA with Parallax Feel */ }
    < section className = "py-24 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center relative overflow-hidden" >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <FaUsers className="text-6xl mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            "When women support each other,<br />incredible things happen."
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-transform"
            >
              Join the Movement
            </Link>
          </div>
        </div>
      </section >
    </div >
  )
}
