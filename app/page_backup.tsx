'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import CountUp from 'react-countup'
import { FaUsers, FaGraduationCap, FaArrowRight, FaHandHoldingHeart, FaChartLine, FaRocket, FaHeart, FaAward, FaCheckCircle, FaStar } from 'react-icons/fa'

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
  { icon: FaGraduationCap, title: 'Education Programs', description: 'Access to quality education and scholarship opportunities' },
  { icon: FaRocket, title: 'Business Tools', description: 'Resources to start and grow your business' },
  { icon: FaHandHoldingHeart, title: 'Mentorship', description: 'Connect with experienced mentors and guides' },
  { icon: FaChartLine, title: 'Marketplace', description: 'Sell your products to a wider audience' },
  { icon: FaUsers, title: 'Community', description: 'Join a supportive network of women and girls' },
  { icon: FaAward, title: 'Skill Development', description: 'Workshops and training programs' },
]

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  useEffect(() => {
    setIsVisible(true)
    fetchStats()
  }, [])

  const [stats, setStats] = useState({
    womenEmpowered: 75,
    girlsEducated: 120,
    workshops: 25,
    communities: 8
  })

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

  return (
    <div className="min-h-screen" role="main">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/hero.jpg"
              alt="EmpowerHer team and community"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              aria-hidden="true"
            />
            {/* Professional overlay - clean dark gradient with vignette */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-gray-900/40 to-slate-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none">
              <span
                className="inline-block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 80px rgba(251, 146, 60, 0.5)',
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))'
                }}
              >
                EmpowerHer
              </span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-xl md:text-2xl lg:text-3xl mb-6 max-w-4xl mx-auto leading-relaxed font-normal text-white/95"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}
          >
            Empowering women and girls with education, business tools, and social impact
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="text-base md:text-lg lg:text-xl mb-12 max-w-3xl mx-auto text-white/85 font-light"
            style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)' }}
          >
            Join thousands of women and girls building brighter futures
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link
              href="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white text-lg px-12 py-4 rounded-full font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 focus:outline-none focus:ring-4 focus:ring-orange-400/50 flex items-center justify-center gap-3 min-w-[200px]"
              style={{
                backgroundSize: '200% 100%',
                backgroundPosition: '0% 0%'
              }}
              aria-label="Get started with EmpowerHer"
            >
              <span className="relative z-10">Get Started</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <Link
              href="/about"
              className="group relative bg-white/10 backdrop-blur-lg border-2 border-white/40 text-white hover:bg-white hover:text-gray-900 text-lg px-12 py-4 rounded-full font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 focus:outline-none focus:ring-4 focus:ring-white/40 min-w-[200px] flex items-center justify-center"
              aria-label="Learn more about EmpowerHer"
            >
              <span className="relative z-10 transition-colors duration-500">Learn More</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Counters Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" aria-label="Impact statistics">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-center mb-4 text-gray-900 dark:text-white"
          >
            Our Impact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Transforming lives through education, empowerment, and opportunity
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:shadow-orange-200 transition-all hover:scale-105 border border-orange-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-4 shadow-lg shadow-orange-300">
                <FaUsers className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Women Empowered</h3>
              {isVisible && (
                <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  <CountUp end={stats.womenEmpowered} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:shadow-orange-200 transition-all hover:scale-105 border border-orange-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-blue-300">
                <FaGraduationCap className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Girls Educated</h3>
              {isVisible && (
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <CountUp end={stats.girlsEducated} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:shadow-orange-200 transition-all hover:scale-105 border border-orange-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg shadow-pink-300">
                <FaHandHoldingHeart className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Workshops</h3>
              {isVisible && (
                <p className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  <CountUp end={stats.workshops} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:shadow-orange-200 transition-all hover:scale-105 border border-orange-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg shadow-emerald-300">
                <FaChartLine className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Communities</h3>
              {isVisible && (
                <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  <CountUp end={stats.communities} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 container mx-auto px-4" aria-label="Platform features">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-center mb-4 text-gray-900 dark:text-white"
        >
          Our Platform
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Everything you need to learn, grow, and succeed in one place
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center bg-white dark:from-gray-800 dark:to-gray-700 hover:shadow-2xl hover:shadow-orange-200 transition-all hover:scale-105 border border-orange-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-4 shadow-lg">
                  <Icon className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card text-center bg-gradient-to-br from-orange-500 to-amber-600 text-white hover:shadow-2xl hover:shadow-orange-400 transition-all hover:scale-105 hover:-translate-y-2"
          >
            <h3 className="text-2xl font-bold mb-4">For Girls</h3>
            <p className="text-lg mb-6 leading-relaxed opacity-90">
              Access educational resources, mentorship programs, and skill development courses designed for young minds.
            </p>
            <Link
              href="/girls/dashboard"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:gap-4 shadow-lg"
              aria-label="Explore Girls Section"
            >
              Explore Girls Section <FaArrowRight />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card text-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-2xl transition-all hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-4">For Women</h3>
            <p className="text-lg mb-6 leading-relaxed opacity-90">
              Business tools, networking opportunities, and professional development resources to advance your career.
            </p>
            <Link
              href="/women/dashboard"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:gap-4"
              aria-label="Explore Women Section"
            >
              Explore Women Section <FaArrowRight />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card text-center bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:shadow-2xl transition-all hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-4">For Customers</h3>
            <p className="text-lg mb-6 leading-relaxed opacity-90">
              Support women-owned businesses by purchasing products and services that make a difference.
            </p>
            <Link
              href="/customer/products"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:gap-4"
              aria-label="Browse Products"
            >
              Browse Products <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:from-gray-800 dark:to-gray-900" aria-label="Testimonials">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-center mb-4 text-gray-900 dark:text-white"
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Hear from women and girls whose lives have been transformed
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
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
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 text-white relative overflow-hidden" aria-label="Call to action">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90"
          >
            Join thousands of women and girls building brighter futures. Get started today!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="group bg-white text-orange-600 hover:bg-gray-100 text-lg px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
              aria-label="Get started with EmpowerHer"
            >
              Create Your Account
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/workshops"
              className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 text-lg px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
              aria-label="Browse workshops"
            >
              Browse Workshops
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

