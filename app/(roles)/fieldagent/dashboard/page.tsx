'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

function FieldAgentDashboardContent() {
  const [stats] = useState({
    villages: 5,
    workshops: 12,
    users: 45,
    products: 28,
  })

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Field Agent Dashboard</h1>
          <Link href="/agent" className="btn-primary">
            Offline Registration
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Villages</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.villages}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Workshops</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.workshops}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Users</h3>
            <p className="text-3xl font-bold text-green-600">{stats.users}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Products</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.products}</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Field Operations</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full">Schedule Workshop</button>
              <button className="btn-secondary w-full">Visit Village</button>
              <button className="btn-secondary w-full">Register New User</button>
              <button className="btn-secondary w-full">Product Collection</button>
            </div>
          </div>
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Workshop conducted in Rampur</p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">New user registered in Devgaon</p>
                <p className="text-sm text-gray-600">5 days ago</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Product collection completed</p>
                <p className="text-sm text-gray-600">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function FieldAgentDashboardPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <FieldAgentDashboardContent />
    </ProtectedRoute>
  )
}

