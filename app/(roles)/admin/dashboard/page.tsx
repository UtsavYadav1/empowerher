'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AdminChart from '@/components/AdminChart'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaUsers, FaCheckCircle, FaTimesCircle, FaFileExport, FaCog } from 'react-icons/fa'

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    totalOrders: 0,
    revenue: 0,
    pendingSellers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch all data
      const [usersRes, productsRes, ordersRes, schemesRes] = await Promise.all([
        fetch('/api/mock/users'),
        fetch('/api/mock/products'),
        fetch('/api/mock/products'), // Mock orders
        fetch('/api/mock/schemes'),
      ])
      
      const usersData = await usersRes.json()
      const productsData = await productsRes.json()
      const schemesData = await schemesRes.json()
      
      setStats({
        totalUsers: usersData.success ? usersData.data.length : 0,
        activeCourses: schemesData.success ? schemesData.data.length : 0,
        totalOrders: 6, // Mock
        revenue: 125000,
        pendingSellers: usersData.success ? usersData.data.filter((u: any) => u.role === 'woman' && !u.verified).length : 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    // Mock CSV export
    const csvContent = 'data:text/csv;charset=utf-8,Name,Email,Role\nUser1,user1@example.com,admin\nUser2,user2@example.com,user'
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'users_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
          <FaFileExport />
          Export CSV
        </button>
      </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Total Users</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Active Courses</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.activeCourses}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>
        )}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>
            <AdminChart />
          </div>
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Management Tools</h2>
            <div className="space-y-3">
              <Link href="/admin/users" className="block btn-primary w-full text-center">
                Manage Users
              </Link>
              <Link href="/admin/schemes" className="block btn-secondary w-full text-center">
                Manage Schemes
              </Link>
              <Link href="/admin/workshops" className="block btn-secondary w-full text-center">
                Manage Workshops
              </Link>
              <Link href="/admin/products" className="block btn-secondary w-full text-center">
                Manage Products
              </Link>
              <Link href="/admin/sellers" className="block btn-secondary w-full text-center">
                Approve Sellers ({stats.pendingSellers})
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireRole={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}

