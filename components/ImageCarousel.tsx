'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

interface CarouselItem {
  id: number
  image: string
  title: string
  description: string
}

interface ImageCarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export default function ImageCarousel({ items, autoPlay = true, interval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full" role="region" aria-label="Image carousel">
      <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsFullscreen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsFullscreen(true)
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${items[currentIndex].title} in fullscreen`}
          >
            <Image
              src={items[currentIndex].image}
              alt={items[currentIndex].title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={currentIndex === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">{items[currentIndex].title}</h3>
              <p className="text-lg">{items[currentIndex].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-all z-10 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-xl text-gray-900 dark:text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-all z-10 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-xl text-gray-900 dark:text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen image view"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 focus:outline-none focus:ring-4 focus:ring-white/50 rounded"
              aria-label="Close fullscreen"
            >
              <FaTimes className="text-3xl" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[currentIndex].image}
                alt={items[currentIndex].title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 focus:outline-none focus:ring-4 focus:ring-white/50 rounded"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-4xl" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 focus:outline-none focus:ring-4 focus:ring-white/50 rounded"
              aria-label="Next image"
            >
              <FaChevronRight className="text-4xl" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

