'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaCalendar, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

interface Event {
    id: number
    title: string
    date: string
    type: string
    category: string
    location?: string
    organizer?: string
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [deleting, setDeleting] = useState<number | null>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events')
            const result = await response.json()
            if (result.success) {
                setEvents(result.data)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return

        setDeleting(id)
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            })
            const result = await response.json()

            if (result.success) {
                setEvents(events.filter(e => e.id !== id))
                alert('Event deleted successfully')
            } else {
                alert('Failed to delete event: ' + result.error)
            }
        } catch (error) {
            console.error('Error deleting event:', error)
            alert('An error occurred while deleting the event')
        } finally {
            setDeleting(null)
        }
    }

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' || event.type === filter
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description?.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <ProtectedRoute requireRole={true} allowedRoles={['admin']}>
            <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FaCalendar className="text-primary-600" /> Manage Events
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Create, edit, and delete events, workshops, and schemes</p>
                        </div>
                        <Link
                            href="/admin/events/new"
                            className="btn-primary flex items-center gap-2"
                        >
                            <FaPlus /> Create New Event
                        </Link>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="input-field md:w-48"
                            >
                                <option value="all">All Types</option>
                                <option value="scholarship">Scholarship</option>
                                <option value="workshop">Workshop</option>
                                <option value="session">Session</option>
                                <option value="webinar">Webinar</option>
                                <option value="competition">Competition</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Location</th>
                                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filteredEvents.map((event) => (
                                                <motion.tr
                                                    key={event.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                >
                                                    <td className="p-4">
                                                        <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
                                                        <div className="text-xs text-gray-500">{event.organizer || 'No organizer'}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 capitalize">
                                                            {event.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                                        {event.location || 'Online'}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={`/admin/events/${event.id}`}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <FaEdit />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(event.id)}
                                                                disabled={deleting === event.id}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Delete"
                                                            >
                                                                {deleting === event.id ? (
                                                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <FaTrash />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            {filteredEvents.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    No events found matching your criteria.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
