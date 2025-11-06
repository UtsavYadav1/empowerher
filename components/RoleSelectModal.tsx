'use client'

import { motion } from 'framer-motion'
import { FaUser, FaUserTie, FaShoppingCart, FaUserShield, FaUserCheck } from 'react-icons/fa'

interface RoleSelectModalProps {
  onSelect: (role: string) => void
}

export default function RoleSelectModal({ onSelect }: RoleSelectModalProps) {
  const roles = [
    { id: 'girl', name: 'Girl', icon: FaUser, description: 'Access educational resources and courses', color: 'from-pink-500 to-rose-500' },
    { id: 'woman', name: 'Woman', icon: FaUserTie, description: 'Business tools and professional development', color: 'from-purple-500 to-indigo-500' },
    { id: 'customer', name: 'Customer', icon: FaShoppingCart, description: 'Support women-owned businesses', color: 'from-green-500 to-emerald-500' },
    { id: 'admin', name: 'Admin', icon: FaUserShield, description: 'Platform management and analytics', color: 'from-gray-600 to-gray-800' },
    { id: 'fieldagent', name: 'Field Agent', icon: FaUserCheck, description: 'Field operations and community outreach', color: 'from-blue-500 to-cyan-500' },
  ]

  return (
    <div className="w-full max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Select Your Role</h1>
        <p className="text-gray-600 text-lg">Choose the role that best describes you</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => {
          const Icon = role.icon
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(role.id)}
              className={`card bg-gradient-to-br ${role.color} text-white text-left hover:shadow-2xl transition-all duration-300`}
            >
              <Icon size={48} className="mb-4" />
              <h3 className="text-2xl font-bold mb-2">{role.name}</h3>
              <p className="text-white/90">{role.description}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
