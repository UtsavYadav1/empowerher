'use client'

import { motion } from 'framer-motion'

interface CourseCardProps {
  course: {
    id: number
    title: string
    description: string
    category: string
    progress: number
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{course.title}</h3>
        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
          {course.category}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{course.description}</p>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span className="font-semibold">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 1 }}
            className="bg-primary-600 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

