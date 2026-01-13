'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaCreditCard, FaMoneyBillWave, FaUserTie, FaMobileAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { getCurrentUser } from '@/utils/auth'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: JSX.Element
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [upiId, setUpiId] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const user = getCurrentUser()

  useEffect(() => {
    loadCart()
    initializePaymentMethods()
  }, [])

  const initializePaymentMethods = () => {
    setPaymentMethods([
      {
        id: 'upi',
        name: 'UPI Payment',
        description: 'Pay via UPI ID (Google Pay, PhonePe, Paytm)',
        icon: <FaMobileAlt className="text-3xl text-green-600" />,
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay cash when you receive the order',
        icon: <FaMoneyBillWave className="text-3xl text-blue-600" />,
      },
      {
        id: 'agent',
        name: 'Cash to Agent',
        description: 'Pay cash to our field agent',
        icon: <FaUserTie className="text-3xl text-purple-600" />,
      },
    ])
    setSelectedMethod('upi')
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }

    if (selectedMethod === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID')
      return
    }

    if (selectedMethod === 'agent' && !phone.trim()) {
      setError('Please enter your phone number for agent contact')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shipping = total >= 500 ? 0 : 50
      const grandTotal = total + shipping
      const orderId = `ORD${Date.now()}`

      // Process payment
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          method: selectedMethod,
          orderId,
          upiId: selectedMethod === 'upi' ? upiId : undefined,
          agentPhone: selectedMethod === 'agent' ? phone : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Save order to database via API
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: user?.id || 1,
            items: cart.map(item => ({
              productId: item.id,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: grandTotal,
            status: 'pending',
          }),
        })

        const orderData = await orderResponse.json()

        if (orderData.success) {
          // Also save to localStorage for immediate access
          const order = {
            id: orderId,
            customerId: user?.id || 1,
            items: cart.map(item => ({
              productId: item.id,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: grandTotal,
            subtotal: total,
            shipping: shipping,
            status: 'pending',
            paymentMethod: selectedMethod,
            paymentStatus: 'completed',
            transactionId: data.transactionId || `TXN${Date.now()}`,
            createdAt: new Date().toISOString(),
            trackingNumber: `TRK${Date.now()}`,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }

          const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]')
          orders.unshift(order)
          localStorage.setItem('customerOrders', JSON.stringify(orders))

          // Clear cart
          localStorage.removeItem('cart')

          // Redirect to orders page
          router.push(`/customer/orders?success=true&txn=${order.transactionId}&orderId=${order.id}`)
        } else {
          throw new Error('Failed to save order')
        }
      } else {
        setError(data.error || 'Payment failed. Please try again.')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setError('An error occurred. Please try again.')
      setProcessing(false)
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = total >= 500 ? 0 : 50
  const grandTotal = total + shipping

  if (loading) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <CardSkeleton />
        </div>
      </ProtectedRoute>
    )
  }

  if (cart.length === 0) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Your cart is empty</p>
            <a href="/customer/products" className="btn-primary">
              Browse Products
            </a>
          </div>
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
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Methods */}
              <div className="card bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Payment Method
                </h2>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-100 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-lg"
                    role="alert"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedMethod(method.id)
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{method.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <input
                              type="radio"
                              name="paymentMethod"
                              id={method.id}
                              checked={selectedMethod === method.id}
                              onChange={() => setSelectedMethod(method.id)}
                              className="w-5 h-5 text-primary-600"
                            />
                            <label
                              htmlFor={method.id}
                              className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
                            >
                              {method.name}
                            </label>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-base">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Fields */}
                {selectedMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <label htmlFor="upiId" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </motion.div>
                )}

                {selectedMethod === 'agent' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <label htmlFor="phone" className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-primary-500/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Our field agent will contact you for delivery and payment
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Order Items */}
              <div className="card bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <Image
                          src={item.imageUrl || `https://images.unsplash.com/photo-${1500000000000 + item.id}?w=200&h=200&fit=crop&q=80`}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-white dark:bg-gray-800 sticky top-24"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                    <span className="font-semibold">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {total < 500 && (
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Add ₹{(500 - total).toLocaleString()} more for free shipping!
                    </p>
                  )}
                  <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3 flex justify-between font-bold text-2xl text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-primary-600 dark:text-primary-400">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing || !selectedMethod}
                  className="btn-primary w-full text-lg py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  aria-label="Complete payment"
                >
                  {processing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <FaSpinner />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Pay ₹{grandTotal.toLocaleString()}
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

