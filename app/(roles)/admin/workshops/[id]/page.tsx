'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import WorkshopForm from '../_components/WorkshopForm'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'
import Link from 'next/link'

export default function EditWorkshopPage() {
    const { id } = useParams()
    const [workshop, setWorkshop] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWorkshop()
    }, [])

    const fetchWorkshop = async () => {
        try {
            const response = await fetch(`/api/workshops?id=${id}`)
            const result = await response.json()

            if (result.success && result.data && result.data.length > 0) {
                setWorkshop(result.data[0]) // API returns array even for filter
            } else {
                console.error('Workshop not found')
            }
        } catch (error) {
            console.error('Error fetching workshop:', error)
        } finally {
            setLoading(false)
        }
    }

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
                                <FaEdit className="text-2xl" />
                            </span>
                            Edit Workshop
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Update workshop details and status
                        </p>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 p-8">
                        {loading ? (
                            <div className="text-center py-8">Loading workshop details...</div>
                        ) : workshop ? (
                            <WorkshopForm initialData={workshop} isEditing={true} />
                        ) : (
                            <div className="text-center py-8 text-red-500">Workshop not found</div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
