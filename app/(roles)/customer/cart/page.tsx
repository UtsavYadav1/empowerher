'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowRight, FaShoppingBag } from 'react-icons/fa'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
      }
      return item
    })
    updateCart(updatedCart)
  }

  const removeItem = (id: number) => {
    updateCart(cart.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = total >= 500 ? 0 : 50
  const grandTotal = total + shipping

  const handleCheckout = () => {
    router.push('/customer/checkout')
  }

  if (loading) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <CardSkeleton />
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <Link href="/customer/products" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
              Continue Shopping <FaArrowRight />
            </Link>
          </div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-white dark:bg-gray-800 text-center py-16"
            >
              <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Add some products to get started!
              </p>
              <Link href="/customer/products" className="btn-primary inline-flex items-center gap-2">
                <FaShoppingBag /> Browse Products
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="card bg-white dark:bg-gray-800 flex flex-col md:flex-row items-center gap-4 p-4 hover:shadow-xl transition-all"
                    >
                      {/* Product Image */}
                      <Link href={`/customer/products/${item.id}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={item.imageUrl || `https://images.unsplash.com/photo-${1500000000000 + item.id}?w=200&h=200&fit=crop&q=80`}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=200&h=200&fit=crop&q=80'
                            }}
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/customer/products/${item.id}`}>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                          ₹{item.price}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Per item
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-2"
                          aria-label="Remove item"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
                    onClick={handleCheckout}
                    className="btn-primary w-full text-lg py-4 font-semibold flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <FaArrowRight />
                  </button>

                  <Link
                    href="/customer/products"
                    className="block text-center mt-4 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

