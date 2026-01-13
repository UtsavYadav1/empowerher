'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaSearch, FaImage, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const galleryItems = [
  { id: 1, title: 'Workshop 2024', description: 'Empowerment workshop for young women', category: 'Workshops', image: '/images/workshop.jpg' },
  { id: 2, title: 'Community Event', description: 'Building stronger communities together', category: 'Events', image: '/images/community.jpg' },
  { id: 3, title: 'Rural Outreach', description: 'Connecting with rural communities', category: 'Outreach', image: '/images/outreach.jpg' },
  { id: 4, title: 'School Visit', description: 'Educational programs in schools', category: 'Education', image: '/images/school.jpg' },
  { id: 5, title: 'Team Gathering', description: 'Our dedicated team members', category: 'Team', image: '/images/team.jpg' },
  { id: 6, title: 'Workshop Session', description: 'Hands-on learning experiences', category: 'Workshops', image: '/images/hero.jpg' },
  { id: 7, title: 'Community Impact', description: 'Making a difference together', category: 'Events', image: '/images/community.jpg' },
  { id: 8, title: 'Education Program', description: 'Empowering through education', category: 'Education', image: '/images/school.jpg' },
  { id: 9, title: 'Outreach Event', description: 'Reaching out to communities', category: 'Outreach', image: '/images/outreach.jpg' },
  { id: 10, title: 'Leadership Training', description: 'Developing leadership skills', category: 'Workshops', image: '/images/workshop.jpg' },
  { id: 11, title: 'Village Meeting', description: 'Engaging with local communities', category: 'Outreach', image: '/images/community.jpg' },
  { id: 12, title: 'Student Success', description: 'Celebrating achievements', category: 'Education', image: '/images/school.jpg' },
]

const categories = ['All', 'Workshops', 'Events', 'Outreach', 'Education', 'Team']

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen py-20 container mx-auto px-4 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 container mx-auto px-4" role="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our journey through photos and moments that capture our impact
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-primary-500/50 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gallery Grid - Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4" role="list">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="break-inside-avoid mb-4 group cursor-pointer"
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openLightbox(index)
                }
              }}
              tabIndex={0}
              role="listitem"
              aria-label={`View ${item.title} image`}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-64 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Gradient Overlay - Always visible for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FaImage className="text-white text-4xl transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>

                  {/* Text Content - Enhanced visibility */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-2xl">
                      {item.title}
                    </h3>
                    <p className="text-white/95 text-base drop-shadow-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FaImage className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No images found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
              aria-label="Close lightbox"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredItems[lightboxIndex] && (
                <>
                  <div className="relative w-full h-full">
                    <Image
                      src={filteredItems[lightboxIndex].image}
                      alt={filteredItems[lightboxIndex].title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>
                  
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 text-center">
                    <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-2xl">
                      {filteredItems[lightboxIndex].title}
                    </h3>
                    <p className="text-white/90 text-lg drop-shadow-lg mb-2">
                      {filteredItems[lightboxIndex].description}
                    </p>
                    <span className="inline-block px-4 py-2 bg-primary-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                      {filteredItems[lightboxIndex].category}
                    </span>
                    <p className="text-white/70 text-sm mt-4">
                      {lightboxIndex + 1} of {filteredItems.length}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

