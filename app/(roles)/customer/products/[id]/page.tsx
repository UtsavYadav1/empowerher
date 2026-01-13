'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaShoppingCart, FaBolt, FaStar, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        const found = data.data.find((p: any) => p.id === parseInt(params.id as string))
        setProduct(found)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const images = Array.isArray(product.images) ? product.images : []
      cart.push({
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: quantity,
        imageUrl: images[0] || `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=400&h=400&fit=crop&q=80`
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    // Add to cart first
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)

    const images = Array.isArray(product.images) ? product.images : []

    if (existingItem) {
      existingItem.quantity = quantity
    } else {
      cart.push({
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: quantity,
        imageUrl: images[0] || `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=400&h=400&fit=crop&q=80`
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // Redirect to checkout
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

  if (!product) {
    return (
      <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
        <div className="min-h-screen py-20 container mx-auto px-4">
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-xl">Product not found</p>
            <button onClick={() => router.push('/customer/products')} className="btn-primary mt-4">
              Browse Products
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const images = Array.isArray(product.images) ? product.images : []
  const defaultImage = `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=800&h=800&fit=crop&q=80`
  const mainImage = images[selectedImage] || defaultImage

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <FaArrowLeft /> Back to Products
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative h-96 md:h-[500px] w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&h=800&fit=crop&q=80'
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === index
                          ? 'border-primary-600 dark:border-primary-400 scale-105'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">(4.5) • 120 reviews</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    ₹{product.price}
                  </p>
                  <p className="text-green-600 dark:text-green-400 font-semibold">
                    Free delivery on orders above ₹500
                  </p>
                </div>

                {/* Product Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Category:</span>
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
                      {product.category || 'General'}
                    </span>
                  </div>
                  {product.stock !== undefined && (
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Stock:</span>
                      <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {product.stock} available
                      </span>
                    </div>
                  )}
                  {product.village && (
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Location:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.village}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${added
                        ? 'bg-green-600 text-white'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                  >
                    {added ? (
                      <>
                        <FaCheckCircle /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <FaShoppingCart /> Add to Cart
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                  >
                    <FaBolt /> Buy Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
