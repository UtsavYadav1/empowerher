'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { FaSearch, FaFilter, FaShoppingCart, FaSortAmountDown } from 'react-icons/fa'

// Helper function to get product-specific images based on category and name
const getProductImage = (category: string, productName: string, productId: number) => {
  const name = productName.toLowerCase()
  
  // Match specific product names first
  if (name.includes('mango') || name.includes('aam')) {
    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop&q=80' // Mango
  }
  if (name.includes('spicy') || name.includes('chili') || name.includes('mirch')) {
    return 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop&q=80' // Red chili
  }
  if (name.includes('coconut') || name.includes('nariyal')) {
    return 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=400&fit=crop&q=80' // Coconut
  }
  if (name.includes('lemon') || name.includes('nimbu')) {
    return 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&q=80' // Lemon
  }
  if (name.includes('garlic') || name.includes('lahsun')) {
    return 'https://images.unsplash.com/photo-1580797542185-90ce4a22e7c4?w=400&h=400&fit=crop&q=80' // Garlic
  }
  
  // Category-specific diverse images
  const categoryImages: { [key: string]: string[] } = {
    pickles: [
      'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599909533650-d0dbde68a7b4?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=400&fit=crop&q=80',
    ],
    diya: [
      'https://images.unsplash.com/photo-1605815797511-d87b62d4c7eb?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578663248855-df9b85c039cd?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?w=400&h=400&fit=crop&q=80',
    ],
    crafts: [
      'https://images.unsplash.com/photo-1582547534946-b6d906a87e09?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611048269832-64f29e1e4fd6?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop&q=80',
    ],
    textiles: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea3c8bf5?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519057560463-2e2d5b61f099?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop&q=80',
    ],
    jewelry: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&q=80',
    ],
    home_decor: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&h=400&fit=crop&q=80',
    ],
    handmade: [
      'https://images.unsplash.com/photo-1582547534946-b6d906a87e09?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop&q=80',
    ],
  }

  const images = categoryImages[category.toLowerCase()] || [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&q=80',
  ]
  
  return images[productId % images.length]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name' | 'default'>('default')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [filter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = filter !== 'all' ? `/api/products?category=${filter}` : '/api/products'
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        let filteredProducts = data.data

        // Apply search filter
        if (searchQuery) {
          filteredProducts = filteredProducts.filter((p: any) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        // Apply sorting
        if (sortBy === 'price-low') {
          filteredProducts.sort((a: any, b: any) => a.price - b.price)
        } else if (sortBy === 'price-high') {
          filteredProducts.sort((a: any, b: any) => b.price - a.price)
        } else if (sortBy === 'name') {
          filteredProducts.sort((a: any, b: any) => a.title.localeCompare(b.title))
        }

        setProducts(filteredProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, sortBy])

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'pickles', name: 'Pickles' },
    { id: 'diyas', name: 'Diyas' },
    { id: 'crafts', name: 'Crafts' },
    { id: 'food', name: 'Food & Beverages' },
    { id: 'textiles', name: 'Textiles' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'home_decor', name: 'Home Decor' },
  ]

  return (
    <ProtectedRoute requireRole={true} allowedRoles={['customer']}>
      <div className="min-h-screen py-20 container mx-auto px-4 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  Browse Products
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Discover amazing products from women entrepreneurs
                </p>
              </div>
              <Link 
                href="/customer/cart" 
                className="btn-primary flex items-center gap-2 px-6 py-3"
              >
                <FaShoppingCart /> View Cart
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 flex-1">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(category.id)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                      filter === category.id
                        ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/50 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <FaSortAmountDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center py-16"
            >
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                No products found
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                // Get image URL with proper fallback - use product-specific images
                let imageUrl = getProductImage(product.category || 'handmade', product.title || '', product.id)
                
                // Only override if product has actual custom images
                if (Array.isArray(product.images) && product.images.length > 0 && product.images[0] && 
                    typeof product.images[0] === 'string' && product.images[0].startsWith('http')) {
                  imageUrl = product.images[0]
                }

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.title,
                        description: product.description,
                        price: product.price,
                        imageUrl: imageUrl,
                      }}
                      showAddToCart={true}
                      showBuyNow={true}
                    />
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Results Count */}
          {!loading && products.length > 0 && (
            <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

