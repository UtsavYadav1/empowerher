'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaInfoCircle, FaImages, FaChalkboardTeacher, FaUser, FaSignInAlt } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { isAuthenticated, getCurrentUser, getDashboardPath } from '@/utils/auth'

export default function MobileNav() {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [dashboardLink, setDashboardLink] = useState('/dashboard')

    useEffect(() => {
        const checkAuthStatus = () => {
            const authenticated = isAuthenticated()
            setIsLoggedIn(authenticated)
            if (authenticated) {
                const user = getCurrentUser()
                if (user?.role) {
                    setDashboardLink(getDashboardPath(user.role))
                }
            }
        }
        checkAuthStatus()
    }, [pathname])

    const navItems = [
        { label: 'Home', href: '/', icon: FaHome },
        { label: 'About', href: '/about', icon: FaInfoCircle },
        { label: 'Gallery', href: '/gallery', icon: FaImages },
        { label: 'Workshops', href: '/workshops', icon: FaChalkboardTeacher },
        {
            label: isLoggedIn ? 'Profile' : 'Login',
            href: isLoggedIn ? dashboardLink : '/login',
            icon: isLoggedIn ? FaUser : FaSignInAlt
        },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
            <div className="flex justify-around items-center h-14">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${isActive
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <Icon className={`text-lg ${isActive ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
