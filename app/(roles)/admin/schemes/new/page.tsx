'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import SchemeForm from '../_components/SchemeForm'
import { FaPlusCircle } from 'react-icons/fa'

export default function NewSchemePage() {
    return (
        <ProtectedRoute requireRole={true} allowedRoles={['admin']}>
            <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaPlusCircle className="text-primary-600" /> Add New Scheme
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Post details about a new financial or educational scheme</p>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 shadow-xl">
                        <SchemeForm />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
