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
  }, [])

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
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-700/70 to-pink-900/80" />
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold mb-6 text-shadow-lg bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent"
          >
            EmpowerHer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl md:text-3xl mb-4 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Empowering women and girls with education, business tools, and social impact
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90"
          >
            Join thousands of women and girls building brighter futures
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/register" 
              className="group btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/50 flex items-center justify-center gap-2"
              aria-label="Get started with EmpowerHer"
            >
              Get Started
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/about" 
              className="group btn-secondary bg-transparent border-3 border-white text-white hover:bg-white/10 backdrop-blur-sm text-lg px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Learn more about EmpowerHer"
            >
              Learn More
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
      <section className="py-20 bg-gradient-to-br from-primary-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" aria-label="Impact statistics">
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
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl transition-all hover:scale-105 border-2 border-primary-200 dark:border-primary-800"
            >
              <FaUsers className="text-6xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Women Empowered</h3>
              {isVisible && (
                <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                  <CountUp end={1250} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl transition-all hover:scale-105 border-2 border-primary-200 dark:border-primary-800"
            >
              <FaGraduationCap className="text-6xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Girls Educated</h3>
              {isVisible && (
                <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                  <CountUp end={3200} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl transition-all hover:scale-105 border-2 border-primary-200 dark:border-primary-800"
            >
              <FaHandHoldingHeart className="text-6xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Workshops</h3>
              {isVisible && (
                <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                  <CountUp end={150} duration={2.5} separator="," />+
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl transition-all hover:scale-105 border-2 border-primary-200 dark:border-primary-800"
            >
              <FaChartLine className="text-6xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Communities</h3>
              {isVisible && (
                <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                  <CountUp end={85} duration={2.5} separator="," />+
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
                className="card text-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-2xl transition-all hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full mb-4">
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
            className="card text-center bg-gradient-to-br from-primary-500 to-pink-500 text-white hover:shadow-2xl transition-all hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-4">For Girls</h3>
            <p className="text-lg mb-6 leading-relaxed opacity-90">
              Access educational resources, mentorship programs, and skill development courses designed for young minds.
            </p>
            <Link
              href="/girls/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:gap-4"
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-800 dark:to-gray-900" aria-label="Testimonials">
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
      <section className="py-20 bg-gradient-to-br from-primary-600 to-pink-600 text-white" aria-label="Call to action">
        <div className="container mx-auto px-4 text-center">
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
              className="group bg-white text-primary-600 hover:bg-gray-100 text-lg px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
              aria-label="Get started with EmpowerHer"
            >
              Create Your Account
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/workshops" 
              className="bg-transparent border-3 border-white text-white hover:bg-white/10 backdrop-blur-sm text-lg px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
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
