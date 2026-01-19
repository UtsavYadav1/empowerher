'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaArrowLeft, FaLink, FaClock } from 'react-icons/fa'

interface SchemeData {
    title: string
    description: string
    eligibility: string
    applyUrl: string
    deadline: string
}

interface SchemeFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function SchemeForm({ initialData, isEditing = false }: SchemeFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<SchemeData>({
        title: '',
        description: '',
        eligibility: '',
        applyUrl: '',
        deadline: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : ''
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEditing && initialData?.id ? `/api/schemes/${initialData.id}` : '/api/schemes'
            const method = isEditing ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (result.success) {
                alert(isEditing ? 'Scheme updated successfully!' : 'Scheme created successfully!')
                router.push('/admin/schemes')
            } else {
                alert('Failed to save scheme: ' + result.error)
            }
        } catch (error) {
            console.error('Error saving scheme:', error)
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
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Scheme Details</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Scheme Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
                        <textarea
                            name="eligibility"
                            rows={3}
                            required
                            value={formData.eligibility}
                            onChange={handleChange}
                            className="input-field w-full"
                        />
                    </div>
                </div>

                {/* Links & Dates */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Application & Timeline</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Application URL</label>
                        <div className="relative">
                            <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="applyUrl"
                                required
                                value={formData.applyUrl}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="input-field w-full pl-10"
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
                            <FaSave /> {isEditing ? 'Update Scheme' : 'Create Scheme'}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
