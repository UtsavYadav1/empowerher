'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { FaSearch, FaFilter, FaShoppingCart, FaSortAmountDown } from 'react-icons/fa'

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
      const url = filter !== 'all' ? `/api/mock/products?category=${filter}` : '/api/mock/products'
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
              {products.map((product, index) => (
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
                      imageUrl: Array.isArray(product.images) && product.images[0]
                        ? product.images[0]
                        : `https://images.unsplash.com/photo-${1500000000000 + product.id}?w=400&h=400&fit=crop&q=80`,
                    }}
                    showAddToCart={true}
                    showBuyNow={true}
                  />
                </motion.div>
              ))}
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
