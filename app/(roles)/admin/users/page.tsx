'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaUser, FaCheckCircle, FaTimesCircle, FaTrash, FaSearch, FaFilter, FaUserShield } from 'react-icons/fa'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  village: string
  verified: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      if (result.success) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id: number, currentStatus: boolean) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus })
      })
      const result = await response.json()

      if (result.success) {
        setUsers(users.map(u => u.id === id ? { ...u, verified: !currentStatus } : u))
      } else {
        alert('Failed to update user: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        setUsers(users.filter(u => u.id !== id))
        alert('User deleted successfully')
      } else {
        alert('Failed to delete user: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('An error occurred while deleting')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['admin']}>
      <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaUserShield className="text-primary-600" /> User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Verify, manage, and remove users</p>
          </div>

          <div className="card bg-white dark:bg-gray-800 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input-field md:w-48"
              >
                <option value="all">All Roles</option>
                <option value="girl">Girl</option>
                <option value="woman">Woman</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="fieldagent">Field Agent</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Name / Contact</th>
                      <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                      <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Location</th>
                      <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredUsers.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="p-4">
                            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <FaUser className="text-gray-400" /> {user.name}
                            </div>
                            <div className="text-xs text-gray-500">{user.phone}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 capitalize">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {user.village || 'N/A'}
                          </td>
                          <td className="p-4">
                            {user.verified ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <FaCheckCircle /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                                <FaTimesCircle /> Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleVerify(user.id, user.verified)}
                                disabled={actionLoading === user.id}
                                className={`p-2 rounded-lg transition-colors ${user.verified
                                    ? 'text-amber-600 hover:bg-amber-50'
                                    : 'text-green-600 hover:bg-green-50'
                                  }`}
                                title={user.verified ? 'Unverify' : 'Verify'}
                              >
                                {user.verified ? <FaTimesCircle /> : <FaCheckCircle />}
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete User"
                              >
                                {actionLoading === user.id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No users found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
