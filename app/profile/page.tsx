'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/utils/auth'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { FaUser, FaCamera, FaSave, FaArrowLeft, FaMobileAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'

interface UserProfile {
    id: number
    name: string
    email: string
    phone: string
    role: string | null
    village: string | null
    verified: boolean
    photoUrl: string | null
    createdAt: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        village: '',
        photoUrl: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const currentUser = getCurrentUser()
        if (!currentUser?.id) return

        try {
            const response = await fetch(`/api/profile?userId=${currentUser.id}`)
            const result = await response.json()

            if (result.success) {
                setUser(result.data)
                setFormData({
                    name: result.data.name || '',
                    phone: result.data.phone || '',
                    village: result.data.village || '',
                    photoUrl: result.data.photoUrl || ''
                })
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        if (!user?.id) return

        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                })
            })
            const result = await response.json()

            if (result.success) {
                // Update local storage if name changed
                const currentUser = getCurrentUser()
                if (currentUser) {
                    localStorage.setItem('user', JSON.stringify({
                        ...currentUser,
                        name: formData.name,
                        phone: formData.phone,
                        village: formData.village
                    }))
                }
                alert('Profile updated successfully!')
                setUser(result.data)
            } else {
                alert('Failed to update profile: ' + result.error)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    return (
        <ProtectedRoute requireRole={true}>
            <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaUser className="text-primary-600" /> My Profile
                        </h1>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
                        >
                            <FaArrowLeft /> Back
                        </button>
                    </div>

                    <div className="card bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                        {loading ? (
                            <div className="space-y-6">
                                <div className="flex justify-center"><div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" /></div>
                                <CardSkeleton />
                                <CardSkeleton />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Profile Header */}
                                <div className="flex flex-col items-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <div className="relative mb-4">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-primary-500 flex items-center justify-center">
                                            {formData.photoUrl ? (
                                                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUser className="text-4xl text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold dark:text-white">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'} Account</h2>
                                    <p className="text-gray-500 text-sm">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Profile Picture URL</label>
                                        <div className="relative">
                                            <FaCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="photoUrl"
                                                value={formData.photoUrl}
                                                onChange={handleChange}
                                                className="input-field w-full pl-10"
                                                placeholder="https://example.com/my-photo.jpg"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Enter a direct link to an image to update your profile picture.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input-field w-full pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone Number</label>
                                        <div className="relative">
                                            <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input-field w-full pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Village / Location</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="village"
                                                value={formData.village}
                                                onChange={handleChange}
                                                className="input-field w-full pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email (Read-only)</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="input-field w-full pl-10 bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <FaSave /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
