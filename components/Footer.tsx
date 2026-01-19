'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer
      className="bg-gray-900 dark:bg-black text-white py-12 mt-20 transition-colors"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">EmpowerHer</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Empowering women and girls with education, business tools, and social impact.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400" role="list">
              <li><Link href="/about" className="hover:text-white transition-colors text-lg">About</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors text-lg">Gallery</Link></li>
              <li><Link href="/workshops" className="hover:text-white transition-colors text-lg">Workshops</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors text-lg">Contact</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400" role="list">
              <li><Link href="/girls/dashboard" className="hover:text-white transition-colors text-lg">For Girls</Link></li>
              <li><Link href="/women/dashboard" className="hover:text-white transition-colors text-lg">For Women</Link></li>
              <li><Link href="/customer/dashboard" className="hover:text-white transition-colors text-lg">For Customers</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4" role="list">
              <a
                href="https://www.linkedin.com/in/utsav-yadav01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:scale-110 transform"
                aria-label="Follow us on LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://x.com/UtsavyadavX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:scale-110 transform"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://youtube.com/@utsavyaduvanshi_2?si=c_AeOvWGKNgVa2KW"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:scale-110 transform"
                aria-label="Follow us on YouTube"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="https://www.instagram.com/utsav.img/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:scale-110 transform"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </motion.div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-lg">
          <p>&copy; 2024 EmpowerHer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

