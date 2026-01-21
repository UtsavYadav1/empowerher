'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaUsers, FaGraduationCap, FaHandHoldingHeart, FaChartLine, FaRocket, FaLightbulb, FaHeart, FaArrowRight } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import CountUp from 'react-countup'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const teamMembers = [
  {
    name: 'Utsav Yadav',
    role: 'Founder & Tech Lead',
    image: '/images/team/utsav.jpg',
    description: 'Visionary leader driving the technical strategy and empowering communities through code.'
  },
  {
    name: 'Bhoomi Sharma',
    role: 'Co-Founder & Operations',
    image: '/images/team/bhoomi.jpg',
    description: 'Operational excellence expert ensuring our programs reach the most remote villages effectively.'
  },
  {
    name: 'Mansi Singh',
    role: 'Business Development',
    image: '/images/team/mansi.jpg',
    description: 'Bridging the gap between rural artisans and global markets through strategic partnerships.'
  },
  {
    name: 'Sameer Singh',
    role: 'Community Outreach',
    image: '/images/team/sameer.jpg',
    description: 'The heartbeat of our on-ground operations, building trust and connections daily.'
  },
]

const timeline = [
  { year: '2023', title: 'The Beginning', desc: 'Started with 2 villages, understanding the core problems.', icon: FaHandHoldingHeart },
  { year: '2024', title: 'Expansion Phase', desc: 'Scaled to 15+ villages, launched pilot mentorship programs.', icon: FaUsers },
  { year: '2025', title: 'Digital Revolution', desc: 'Launched EmpowerHer platform to bridge the digital divide.', icon: FaRocket },
]

export default function AboutPage() {
  const [stats, setStats] = useState([
    { label: 'Lives Impacted', value: 0, suffix: '+', icon: FaUsers },
    { label: 'Villages Reached', value: 0, suffix: '+', icon: FaChartLine },
    { label: 'Workshops Held', value: 0, suffix: '+', icon: FaGraduationCap },
    { label: 'Growth Rate', value: 0, suffix: '%', icon: FaRocket },
  ])

  useEffect(() => {
    // Fetch real stats or use simulation for "Pro" feel
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/impact')
        const data = await response.json()
        if (data.success) {
          setStats([
            { label: 'Lives Impacted', value: data.data.womenEmpowered + data.data.girlsEducated, suffix: '+', icon: FaUsers },
            { label: 'Villages Reached', value: data.data.communities, suffix: '+', icon: FaChartLine },
            { label: 'Workshops Held', value: data.data.workshops, suffix: '+', icon: FaGraduationCap },
            { label: 'Growth Rate', value: 300, suffix: '%', icon: FaRocket },
          ])
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="About EmpowerHer"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">EmpowerHer</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light"
            >
              Bridging the gap between ambition and opportunity. We are building a future where every woman has the tools to succeed.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Glassmorphism */}
      <section className="relative -mt-20 z-20 container mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-3xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] text-center hover:-translate-y-2 transition-all duration-300 group z-30 relative"
            >
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-900/60 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 text-xl mb-4 group-hover:scale-110 shadow-inner transition-transform">
                <stat.icon />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                <CountUp end={stat.value} duration={2.5} separator="," />{stat.suffix}
              </h3>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision - Modern Split Layout */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl opacity-20 blur-xl transform rotate-3" />
            <div className="relative bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
              <FaLightbulb className="text-5xl text-orange-500 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                To create a world where geography and gender do not define a person's destiny. We envision an ecosystem where rural women act as the pillars of economic growth for their communities.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-12 md:mt-0"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-xl transform -rotate-3" />
            <div className="relative bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
              <FaRocket className="text-5xl text-blue-500 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Empowering 1 million women by 2030 through accessible education, direct market access, and community-led mentorship programs. We turn "beneficiaries" into leaders.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Journey */}
      <section className="py-20 bg-white dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">From a small idea to a massive movement</p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 md:block hidden" />

            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`flex flex-col md:flex-row items-center justify-between mb-12 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                <div className="w-full md:w-5/12 mb-6 md:mb-0">
                  <div className={`p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all hover:-translate-y-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500 mb-2 block">{item.year}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div className="relative z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-4 border-orange-500 flex items-center justify-center shadow-lg md:mb-0 mb-6">
                  <item.icon className="text-orange-500 text-lg" />
                </div>

                <div className="w-full md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 container mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet The Minds</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">The passionate people behind the revolution</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 text-center border-t border-gray-50 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">{member.name}</h3>
                <p className="text-orange-500 font-semibold mb-4 text-sm tracking-wide uppercase">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-center">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            "Because when she rises, we all rise."
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Link href="/register" className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Join Our Mission
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
