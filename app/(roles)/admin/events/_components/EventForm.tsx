'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaArrowLeft, FaCalendar, FaClock, FaMapMarkerAlt, FaLink, FaList } from 'react-icons/fa'

interface EventData {
    title: string
    description: string
    date: string
    type: string
    category: string
    location: string
    organizer: string
    registrationDeadline: string
    applyUrl: string
    eligibility: string
    benefits: string
}

interface EventFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function EventForm({ initialData, isEditing = false }: EventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<EventData>({
        title: '',
        description: '',
        date: '',
        type: 'workshop',
        category: 'general',
        location: '',
        organizer: '',
        registrationDeadline: '',
        applyUrl: '',
        eligibility: '',
        benefits: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
                registrationDeadline: initialData.registrationDeadline ? new Date(initialData.registrationDeadline).toISOString().slice(0, 16) : '',
                benefits: Array.isArray(initialData.benefits) ? initialData.benefits.join(', ') : initialData.benefits || ''
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b)
            }

            const url = isEditing && initialData?.id ? `/api/events/${initialData.id}` : '/api/events'
            const method = isEditing ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (result.success) {
                alert(isEditing ? 'Event updated successfully!' : 'Event created successfully!')
                router.push('/admin/events')
            } else {
                alert('Failed to save event: ' + result.error)
            }
        } catch (error) {
            console.error('Error saving event:', error)
            alert('An error occurred while saving')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="e.g., Women Leadership Summit"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Type *</label>
                        <select
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleChange}
                            className="input-field w-full"
                        >
                            <option value="scholarship">Scholarship</option>
                            <option value="workshop">Workshop</option>
                            <option value="session">Session</option>
                            <option value="webinar">Webinar</option>
                            <option value="competition">Competition</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="e.g., Technology, Business, Arts"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Detailed description of the event..."
                        />
                    </div>
                </div>

                {/* Date & Location */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Logistics</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date & Time *</label>
                        <div className="relative">
                            <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="datetime-local"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Deadline</label>
                        <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="datetime-local"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
                                placeholder="Online or Physical Address"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Organizer</label>
                        <input
                            type="text"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Organization Name"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Additional Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Additional Details</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
                        <textarea
                            name="eligibility"
                            rows={3}
                            value={formData.eligibility}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Who can apply?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Key Benefits (comma separated)</label>
                        <div className="relative">
                            <FaList className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                                name="benefits"
                                rows={3}
                                value={formData.benefits}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
                                placeholder="Certificate, Mentorship, Prize Money..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Application URL</label>
                        <div className="relative">
                            <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="applyUrl"
                                value={formData.applyUrl}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-secondary flex items-center gap-2"
                >
                    <FaArrowLeft /> Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 px-8"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <FaSave /> {isEditing ? 'Update Event' : 'Create Event'}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
