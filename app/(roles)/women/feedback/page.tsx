'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { TableSkeleton } from '@/components/LoadingSkeleton'
import { FaStar, FaRegStar, FaBox, FaUser, FaRupeeSign, FaCheckCircle, FaTimes } from 'react-icons/fa'

interface Order {
  id: number
  customerId: number
  customerName?: string
  items: string
  total: number
  status: string
  createdAt: string
  feedbackGiven?: boolean
  rating?: number
  comment?: string
}

export default function FeedbackPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      if (data.success) {
        const ordersWithFeedback = data.data.map((order: Order, index: number) => ({
          ...order,
          customerName: `Customer #${order.customerId}`,
          feedbackGiven: index % 3 === 0, // Some orders have feedback
          rating: index % 3 === 0 ? (index % 5) + 1 : undefined,
          comment: index % 3 === 0 ? `Great buyer! Smooth transaction for order ${order.id}.` : undefined,
        }))
        setOrders(ordersWithFeedback.filter((o: Order) => o.status === 'delivered'))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async (orderId: number) => {
    if (!rating) {
      alert('Please provide a rating.')
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerRating: rating,
          feedback,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setOrders(orders.map(o => 
          o.id === orderId 
            ? { ...o, feedbackGiven: true, rating, comment: feedback } 
            : o
        ))
        setSelectedOrder(null)
        setRating(5)
        setFeedback('')
        alert('Feedback submitted successfully!')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback.')
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

  const pendingFeedback = orders.filter(o => !o.feedbackGiven)
  const completedFeedback = orders.filter(o => o.feedbackGiven)

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['woman']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              <FaStar className="text-yellow-500" /> Buyer Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Rate and provide feedback for buyers after order delivery</p>
          </div>

          {/* Pending Feedback */}
          {pendingFeedback.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FaBox className="text-orange-600" /> Pending Feedback ({pendingFeedback.length})
              </h2>
              <div className="space-y-4">
                {pendingFeedback.map((order) => {
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
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <FaUser /> {order.customerName}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Delivered on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
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

                      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Order Items:</h4>
                        <div className="space-y-2">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-gray-700 dark:text-gray-300">
                                {item.name || `Product ${item.productId}`} × {item.quantity}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <FaStar /> Provide Feedback
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Completed Feedback */}
          {completedFeedback.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> Past Feedback ({completedFeedback.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {completedFeedback.map((order) => {
                  const items = getOrderItems(order.items)
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="card bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={star <= (order.rating || 0) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
                            />
                          ))}
                        </div>
                      </div>
                      {order.comment && (
                        <p className="text-gray-700 dark:text-gray-300 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          "{order.comment}"
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>Total: ₹{order.total.toFixed(2)}</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <div className="card text-center py-12 bg-white dark:bg-gray-800">
              <FaBox className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">No delivered orders to provide feedback for yet.</p>
            </div>
          )}

          {/* Feedback Modal */}
          <AnimatePresence>
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card max-w-md w-full bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rate Buyer</h2>
                    <button
                      onClick={() => {
                        setSelectedOrder(null)
                        setRating(5)
                        setFeedback('')
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">Order #{selectedOrder.id} from {selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total: ₹{selectedOrder.total.toFixed(2)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block font-semibold mb-3 text-gray-900 dark:text-white">Rating</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-4xl transition-transform hover:scale-110"
                        >
                          {star <= rating ? (
                            <FaStar className="text-yellow-500" />
                          ) : (
                            <FaRegStar className="text-gray-300 dark:text-gray-600" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2 text-gray-900 dark:text-white">Feedback (Optional)</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Share your experience with this buyer..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(null)
                        setRating(5)
                        setFeedback('')
                      }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitFeedback(selectedOrder.id)}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Submit Feedback
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

