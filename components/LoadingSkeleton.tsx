'use client'

import React from 'react'

export default function LoadingSkeleton(): React.ReactElement {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-700"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6 dark:bg-gray-700"></div>
    </div>
  )
}

export function CardSkeleton(): React.ReactElement {
  return (
    <div className="card bg-white dark:bg-gray-800 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="card bg-white dark:bg-gray-800 animate-pulse flex items-center p-4">
      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="card bg-white dark:bg-gray-800 animate-pulse p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="card bg-white dark:bg-gray-800 animate-pulse p-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
