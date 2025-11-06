'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onNavigate: (index: number) => void
}

export default function Lightbox({ isOpen, onClose, images, currentIndex, onNavigate }: LightboxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length)
    if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 focus:outline-none focus:ring-4 focus:ring-white/50 rounded z-10"
            aria-label="Close lightbox"
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
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </motion.div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate((currentIndex - 1 + images.length) % images.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 focus:outline-none focus:ring-4 focus:ring-white/50 rounded z-10"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-4xl" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate((currentIndex + 1) % images.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 focus:outline-none focus:ring-4 focus:ring-white/50 rounded z-10"
                aria-label="Next image"
              >
                <FaChevronRight className="text-4xl" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg z-10">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

