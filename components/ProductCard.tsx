'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaShoppingCart, FaBolt, FaCheckCircle } from 'react-icons/fa'

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    imageUrl?: string
  }
  showAddToCart?: boolean
  showBuyNow?: boolean
}

export default function ProductCard({ product, showAddToCart = true, showBuyNow = true }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  // Generate placeholder image URL based on product ID if no image provided
  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=400&h=400&fit=crop&q=80`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ 
        ...product, 
        quantity: 1,
        imageUrl 
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add to cart first
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ 
        ...product, 
        quantity: 1,
        imageUrl 
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Redirect to checkout
    router.push('/customer/checkout')
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card bg-white dark:bg-gray-800 hover:shadow-2xl transition-all overflow-hidden group"
    >
      <Link href={`/customer/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.src = `https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80`
            }}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ₹{product.price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showAddToCart && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {added ? (
                  <>
                    <FaCheckCircle /> Added!
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                )}
              </motion.button>
            )}
            
            {showBuyNow && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <FaBolt /> Buy Now
              </motion.button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
