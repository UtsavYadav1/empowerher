'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { TableSkeleton } from '@/components/LoadingSkeleton'
import { getCurrentUser } from '@/utils/auth'
import { FaCheckCircle, FaClock, FaShippingFast, FaBox, FaMapMarkerAlt, FaPhone, FaTruck, FaTimesCircle, FaEye, FaCreditCard } from 'react-icons/fa'

interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerId: number
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  paymentStatus: string
  transactionId: string
  trackingNumber: string
  createdAt: string
  estimatedDelivery?: string
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showTracking, setShowTracking] = useState(false)
  const user = getCurrentUser()

  useEffect(() => {
    const success = searchParams.get('success')
    const txn = searchParams.get('txn')
    const ordId = searchParams.get('orderId')
    
    if (success === 'true' && txn) {
      setShowSuccess(true)
      setTransactionId(txn)
      if (ordId) setOrderId(ordId)
      setTimeout(() => setShowSuccess(false), 5000)
    }
    
    fetchOrders()
  }, [searchParams])

  const fetchOrders = async () => {
    try {
      // Fetch orders from localStorage (in real app, this would be from API)
      const ordersStr = localStorage.getItem('customerOrders')
      if (ordersStr) {
        const parsedOrders = JSON.parse(ordersStr)
        setOrders(parsedOrders)
      } else {
        // Fallback to mock data if no orders exist
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-400'
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-400'
      case 'shipped':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-400'
      case 'pending':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-400'
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-600 dark:text-green-400" />
      case 'processing':
        return <FaClock className="text-yellow-600 dark:text-yellow-400" />
      case 'shipped':
        return <FaShippingFast className="text-blue-600 dark:text-blue-400" />
      case 'pending':
        return <FaClock className="text-gray-600 dark:text-gray-400" />
      case 'cancelled':
        return <FaTimesCircle className="text-red-600 dark:text-red-400" />
      default:
        return <FaBox className="text-gray-600 dark:text-gray-400" />
    }
  }

  const getTrackingSteps = (status: string) => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: FaBox },
      { id: 'processing', label: 'Processing', icon: FaClock },
      { id: 'shipped', label: 'Shipped', icon: FaShippingFast },
      { id: 'delivered', label: 'Delivered', icon: FaCheckCircle },
    ]

    const statusIndex = steps.findIndex(s => s.id === status.toLowerCase())
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      current: index === statusIndex,
    }))
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <TableSkeleton />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Order History
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && transactionId && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-4 shadow-lg"
              role="alert"
            >
              <FaCheckCircle className="text-3xl flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-xl mb-1">Order placed successfully! 🎉</p>
                <p className="text-sm">Transaction ID: <span className="font-semibold">{transactionId}</span></p>
                {orderId && (
                  <p className="text-sm">Order ID: <span className="font-semibold">{orderId}</span></p>
                )}
              </div>
            </motion.div>
          )}

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-white dark:bg-gray-800 text-center py-16"
            >
              <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Start shopping to see your orders here
              </p>
              <a href="/customer/products" className="btn-primary inline-block">
                Browse Products
              </a>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Order #{order.id.slice(-8)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowTracking(true)
                        }}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <FaEye /> Track Order
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                            <Image
                              src={`https://images.unsplash.com/photo-${1500000000000 + item.productId}?w=200&h=200&fit=crop&q=80`}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="80px"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=200&h=200&fit=crop&q=80'
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{item.productName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                          <span>Subtotal:</span>
                          <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                          <span>Shipping:</span>
                          <span className="font-semibold">
                            {order.shipping === 0 ? (
                              <span className="text-green-600 dark:text-green-400">FREE</span>
                            ) : (
                              `₹${order.shipping}`
                            )}
                          </span>
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                          <span>Total Amount:</span>
                          <span className="text-primary-600 dark:text-primary-400">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaCreditCard className="text-primary-600 dark:text-primary-400" />
                        <span>Payment: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaTruck className="text-primary-600 dark:text-primary-400" />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tracking Modal */}
          {showTracking && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
              onClick={() => setShowTracking(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Track Order #{selectedOrder.id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setShowTracking(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Tracking Steps */}
                <div className="space-y-6">
                  {getTrackingSteps(selectedOrder.status).map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : step.current
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}>
                          <Icon className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-1 ${
                            step.current ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {step.label}
                          </h3>
                          {step.completed && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Completed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {index < getTrackingSteps(selectedOrder.status).length - 1 && (
                          <div className={`absolute left-6 mt-12 w-0.5 h-12 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Tracking Details */}
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaTruck className="text-primary-600 dark:text-primary-400" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Tracking Number</p>
                        <p className="text-gray-600 dark:text-gray-400">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex items-center gap-3">
                        <FaClock className="text-primary-600 dark:text-primary-400" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Expected Delivery</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-primary-600 dark:text-primary-400" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Delivery Address</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {user?.village || 'Address on file'} (Your saved address)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
