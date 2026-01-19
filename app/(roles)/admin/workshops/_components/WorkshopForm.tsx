'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaGraduationCap, FaLayerGroup, FaTags, FaMoneyBillWave, FaInfoCircle, FaImage } from 'react-icons/fa'

interface WorkshopData {
    title: string
    description: string
    date: string
    village: string
    location: string
    instructor: string
    category: string
    capacity: string
    fee: string
    status: string
    image: string
}

interface WorkshopFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function WorkshopForm({ initialData, isEditing = false }: WorkshopFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<WorkshopData>({
        title: '',
        description: '',
        date: '',
        village: '',
        location: '',
        instructor: '',
        category: 'General',
        capacity: '30',
        fee: '0',
        status: 'upcoming',
        image: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
                village: initialData.village || '',
                location: initialData.location || initialData.village || '', // Fallback to village if location empty
                instructor: initialData.instructor || '',
                category: initialData.category || 'General',
                capacity: initialData.capacity ? initialData.capacity.toString() : '30',
                fee: initialData.fee ? initialData.fee.toString() : '0',
                status: initialData.status || 'upcoming',
                image: initialData.image || ''
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
                id: isEditing && initialData ? initialData.id : undefined,
                // Ensure merged location logic if needed, but API handles village fallback
            }

            const method = isEditing ? 'PATCH' : 'POST'
            const url = '/api/workshops'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (result.success) {
                alert(isEditing ? 'Workshop updated successfully!' : 'Workshop created successfully!')
                router.push('/admin/workshops')
            } else {
                alert('Failed to save workshop: ' + result.error)
            }
        } catch (error) {
            console.error('Error saving workshop:', error)
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
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800 dark:text-white">Basic Information</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Workshop Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="e.g., Digital Literacy Bootcamp"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="input-field w-full"
                            placeholder="Detailed description of the workshop..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-field w-full"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800 dark:text-white">Workshop Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date & Time *</label>
                            <div className="relative">
                                <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="datetime-local"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input-field pl-10 w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
                            <div className="relative">
                                <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input-field pl-10 w-full"
                                >
                                    <option value="General">General</option>
                                    <option value="Skill Development">Skill Development</option>
                                    <option value="Health">Health</option>
                                    <option value="Business">Business</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location/Village *</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field pl-10 w-full"
                                placeholder="Village or Address"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Instructor Name</label>
                        <div className="relative">
                            <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleChange}
                                className="input-field pl-10 w-full"
                                placeholder="e.g., Dr. Anjali"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Capacity</label>
                            <div className="relative">
                                <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="input-field pl-10 w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fee (₹)</label>
                            <div className="relative">
                                <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    className="input-field pl-10 w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image URL</label>
                        <div className="relative">
                            <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="input-field pl-10 w-full"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-secondary px-6"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8"
                >
                    {loading ? 'Saving...' : (isEditing ? 'Update Workshop' : 'Create Workshop')}
                </button>
            </div>
        </form>
    )
}
