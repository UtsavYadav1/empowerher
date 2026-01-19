'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import SchemeForm from '../_components/SchemeForm'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaEdit } from 'react-icons/fa'

export default function EditSchemePage() {
    const params = useParams()
    const router = useRouter()
    const [scheme, setScheme] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchScheme(params.id as string)
        }
    }, [params.id])

    const fetchScheme = async (id: string) => {
        try {
            const response = await fetch(`/api/schemes/${id}`)
            const result = await response.json()

            if (result.success) {
                setScheme(result.data)
            } else {
                alert('Scheme not found')
                router.push('/admin/schemes')
            }
        } catch (error) {
            console.error('Error fetching scheme:', error)
            router.push('/admin/schemes')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute requireRole={true} allowedRoles={['admin']}>
            <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaEdit className="text-primary-600" /> Edit Scheme
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Update scheme details and deadlines</p>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 shadow-xl">
                        {loading ? (
                            <div className="space-y-4">
                                <CardSkeleton />
                                <CardSkeleton />
                            </div>
                        ) : (
                            <SchemeForm initialData={scheme} isEditing={true} />
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
