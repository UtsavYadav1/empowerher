'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import EventForm from '../_components/EventForm'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaEdit } from 'react-icons/fa'

export default function EditEventPage() {
    const params = useParams()
    const router = useRouter()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchEvent(params.id as string)
        }
    }, [params.id])

    const fetchEvent = async (id: string) => {
        try {
            const response = await fetch(`/api/events/${id}`)
            const result = await response.json()

            if (result.success) {
                setEvent(result.data)
            } else {
                alert('Event not found')
                router.push('/admin/events')
            }
        } catch (error) {
            console.error('Error fetching event:', error)
            router.push('/admin/events')
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
                            <FaEdit className="text-primary-600" /> Edit Event
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Update event details and information</p>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 shadow-xl">
                        {loading ? (
                            <div className="space-y-4">
                                <CardSkeleton />
                                <CardSkeleton />
                            </div>
                        ) : (
                            <EventForm initialData={event} isEditing={true} />
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
