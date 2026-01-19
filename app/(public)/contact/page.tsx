'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCheckCircle, FaTimesCircle, FaWhatsapp, FaClock, FaQuestionCircle, FaYoutube } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How do I register for workshops?',
    answer: 'You can register for workshops by visiting the Workshops page and clicking the "Register Now" button on any available workshop. Make sure you are logged in to complete registration.',
  },
  {
    question: 'What services do you provide for girls?',
    answer: 'We offer educational resources, scholarships, career guidance, mentorship programs, community forums, and skill development workshops specifically designed for girls.',
  },
  {
    question: 'How can women start selling their products?',
    answer: 'Women can register on our platform, complete the seller onboarding process, and start listing their products in the "Sell" section. Our team will guide you through the entire process.',
  },
  {
    question: 'Are your services free?',
    answer: 'Most of our educational resources and workshops are free. Some premium workshops and courses may have a nominal fee to support our operations.',
  },
  {
    question: 'How do I apply for a scholarship?',
    answer: 'Visit the Girls Dashboard and navigate to the "Schemes & Scholarships" section. Browse available opportunities and click "Apply Now" to submit your application.',
  },
  {
    question: 'Can I contact a representative directly?',
    answer: 'Yes! You can call us at +91 9305376745, WhatsApp us at +91 9305376745, or fill out the contact form above. We typically respond within 24 hours.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real app, this would POST to /api/contact
      console.log('Contact form submitted:', formData)

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setErrors({})

      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Failed to send message. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen py-20 container mx-auto px-4 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
          Get In Touch
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We're here to help! Reach out to us with any questions, feedback, or inquiries.
        </p>
      </motion.div>

      {/* Contact Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card bg-gradient-to-br from-primary-500 to-pink-500 text-white hover:shadow-2xl transition-all cursor-pointer group"
          onClick={() => window.open('mailto:dsav2613@gmail.com', '_blank')}
        >
          <FaEnvelope className="text-5xl mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">Email Us</h3>
          <p className="text-lg opacity-90">dsav2613@gmail.com</p>
          <p className="text-sm opacity-75 mt-2">We reply within 24 hours</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:shadow-2xl transition-all cursor-pointer group"
          onClick={() => window.open('tel:+919305376745', '_blank')}
        >
          <FaPhone className="text-5xl mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">Call Us</h3>
          <p className="text-lg opacity-90">+91 9305376745</p>
          <p className="text-sm opacity-75 mt-2">Mon-Sat, 9 AM - 6 PM</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-2xl transition-all cursor-pointer group"
          onClick={() => window.open('https://wa.me/919305376745', '_blank')}
        >
          <FaWhatsapp className="text-5xl mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
          <p className="text-lg opacity-90">+91 9305376745</p>
          <p className="text-sm opacity-75 mt-2">Quick responses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card bg-gradient-to-br from-purple-500 to-indigo-500 text-white hover:shadow-2xl transition-all"
        >
          <FaMapMarkerAlt className="text-5xl mb-4" />
          <h3 className="text-2xl font-bold mb-2">Visit Us</h3>
          <p className="text-lg opacity-90">Muradnagar, Ghaziabad</p>
          <p className="text-sm opacity-75 mt-2">Uttar Pradesh, India</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card bg-white dark:bg-gray-800"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FaMessage className="text-primary-600" /> Send Us a Message
          </h2>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-2 border-green-400 dark:border-green-600 rounded-lg flex items-center gap-3"
                role="alert"
              >
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl flex-shrink-0" />
                <div>
                  <p className="text-green-800 dark:text-green-200 font-semibold">Message Sent Successfully!</p>
                  <p className="text-green-700 dark:text-green-300 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 rounded-lg flex items-center gap-3"
            >
              <FaTimesCircle className="text-red-600 dark:text-red-400 text-2xl" />
              <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" role="form" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                required
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                required
                aria-required="true"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="workshop">Workshop Registration</option>
                <option value="scholarship">Scholarship Application</option>
                <option value="business">Business Support</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                required
                aria-required="true"
                aria-invalid={!!errors.message}
                placeholder="Tell us how we can help you..."
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formData.message.length}/500 characters
              </p>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              aria-label="Send message"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <FaEnvelope /> Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Map & Social Media */}
        <div className="space-y-6">
          {/* Interactive Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card bg-white dark:bg-gray-800 overflow-hidden"
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <FaMapMarkerAlt className="text-primary-600" /> Our Location
            </h2>
            <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.4747885868686!2d77.4965!3d28.7742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf40a1b5b1b65%3A0xb5b1b65b1b65b1b6!2sMuradnagar%2C%20Ghaziabad%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="EmpowerHer Location"
              />
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              <strong>Address:</strong> Muradnagar, Ghaziabad, Uttar Pradesh, India
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Office Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST
            </p>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card bg-gradient-to-br from-primary-500 to-pink-500 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
            <p className="mb-6 opacity-90">Follow us on social media for updates and inspiration!</p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://www.linkedin.com/in/utsav-yadav01"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="https://x.com/UtsavyadavX"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-all"
                aria-label="Twitter"
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="https://youtube.com/@utsavyaduvanshi_2?si=c_AeOvWGKNgVa2KW"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-all text-red-100"
                aria-label="YouTube"
              >
                <FaYoutube />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/utsav.img/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-all"
                aria-label="Instagram"
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="https://wa.me/919305376745"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-all"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card bg-white dark:bg-gray-800"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FaQuestionCircle className="text-primary-600" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-expanded={openFAQ === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-primary-600 text-xl flex-shrink-0"
                >
                  ▼
                </motion.div>
              </button>
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

