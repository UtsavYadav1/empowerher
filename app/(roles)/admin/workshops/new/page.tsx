'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import WorkshopForm from '../_components/WorkshopForm'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'
import Link from 'next/link'

export default function NewWorkshopPage() {
    return (
        <ProtectedRoute requireRole={true} allowedRoles={['admin']}>
            <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <Link href="/admin/workshops" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-2">
                            <FaArrowLeft /> Back to Workshops
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary-600">
                                <FaPlus className="text-2xl" />
                            </span>
                            Create New Workshop
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Add a new workshop to the platform schedule
                        </p>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 p-8">
                        <WorkshopForm />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
