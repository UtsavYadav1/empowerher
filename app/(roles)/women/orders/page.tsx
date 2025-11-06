'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { TableSkeleton } from '@/components/LoadingSkeleton'
import { FaBox, FaCheckCircle, FaClock, FaTruck, FaRupeeSign, FaFilter } from 'react-icons/fa'

interface Order {
  id: number
  customerId: number
  items: string
  total: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/mock/orders')
      const data = await response.json()
      if (data.success) {
        let filtered = data.data
        if (filter !== 'all') {
          filtered = data.data.filter((o: Order) => o.status.toLowerCase() === filter.toLowerCase())
        }
        setOrders(filtered)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />
      case 'shipped':
        return <FaTruck className="text-blue-600" />
      case 'pending':
        return <FaClock className="text-yellow-600" />
      default:
        return <FaBox className="text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'shipped':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getOrderItems = (items: string) => {
    try {
      const parsed = typeof items === 'string' ? JSON.parse(items) : items
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <TableSkeleton />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaBox className="text-orange-600" /> Orders Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your product orders</p>
          </div>

          {/* Filters */}
          <div className="card mb-6 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-gray-400" />
              <span className="font-semibold text-gray-900 dark:text-white">Filter by Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === status
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="card text-center py-12 bg-white dark:bg-gray-800">
              <FaBox className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">No orders found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const items = getOrderItems(order.items)
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order #{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                          <FaRupeeSign />{order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} item(s)</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Order Items:</h4>
                      <div className="space-y-2">
                        {items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {item.name || `Product ${item.productId}`}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

