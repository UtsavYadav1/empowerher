'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, hasRole, getCurrentUser, getDashboardPath } from '@/utils/auth'
import LoadingSplash from './LoadingSplash'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: boolean
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, requireRole = false, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()

      if (!authenticated) {
        router.replace('/login')
        return
      }

      if (requireRole) {
        const userHasRole = hasRole()
        if (!userHasRole) {
          router.replace('/role-select')
          return
        }

        // Check if user has access to this route based on role
        const user = getCurrentUser()
        if (user?.role) {
          const userRole = user.role.toLowerCase()

          // If allowedRoles is specified, check against it
          if (allowedRoles && allowedRoles.length > 0) {
            if (!allowedRoles.includes(userRole)) {
              router.replace(getDashboardPath(userRole))
              return
            }
          } else {
            // Otherwise, check role-based route access by pathname
            if (pathname.startsWith('/girls') && userRole !== 'girl') {
              router.replace(getDashboardPath(userRole))
              return
            }
            if (pathname.startsWith('/women') && userRole !== 'woman') {
              router.replace(getDashboardPath(userRole))
              return
            }
            if (pathname.startsWith('/customer') && userRole !== 'customer') {
              router.replace(getDashboardPath(userRole))
              return
            }
            if (pathname.startsWith('/admin') && userRole !== 'admin') {
              router.replace(getDashboardPath(userRole))
              return
            }
            if (pathname.startsWith('/fieldagent') && userRole !== 'fieldagent') {
              router.replace(getDashboardPath(userRole))
              return
            }
          }
        }
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [router, pathname, requireRole])

  if (loading) {
    return <LoadingSplash />
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}

