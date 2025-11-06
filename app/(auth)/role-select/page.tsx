'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RoleSelectModal from '@/components/RoleSelectModal'
import { getCurrentUser, hasRole, getDashboardPath, isAuthenticated } from '@/utils/auth'

export default function RoleSelectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Check if user already has a role
    if (hasRole()) {
      const user = getCurrentUser()
      if (user) {
        router.push(getDashboardPath(user.role))
      }
    }
  }, [router])

  const handleRoleSelect = async (role: string) => {
    setLoading(true)
    const user = getCurrentUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error updating role:', data.error)
        setLoading(false)
        return
      }

      // Update user in localStorage
      const updatedUser = { ...user, role: data.data.role }
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))

      // Redirect to dashboard
      router.push(getDashboardPath(role))
    } catch (error) {
      console.error('Error selecting role:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Updating role...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <RoleSelectModal onSelect={handleRoleSelect} />
    </div>
  )
}
