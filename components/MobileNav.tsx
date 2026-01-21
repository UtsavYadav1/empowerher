'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    FaHome, FaInfoCircle, FaImages, FaChalkboardTeacher, FaUser, FaSignInAlt,
    FaShoppingBag, FaBoxOpen, FaClipboardList, FaStore, FaGraduationCap, FaCalendarAlt, FaHandHoldingHeart
} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { isAuthenticated, getCurrentUser, getDashboardPath } from '@/utils/auth'

export default function MobileNav() {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)

    // Dashboard path logic can be kept for "Home" redirect or we can link directly to role-dashboard
    const [dashboardPath, setDashboardPath] = useState('/dashboard')

    useEffect(() => {
        const checkAuthStatus = () => {
            const authenticated = isAuthenticated()
            setIsLoggedIn(authenticated)
            if (authenticated) {
                const user = getCurrentUser()
                setUserRole(user?.role || null)
                if (user?.role) {
                    setDashboardLink(getDashboardPath(user.role))
                }
            } else {
                setUserRole(null)
            }
        }
        checkAuthStatus()
    }, [pathname])

    // Helper to set dashboard path
    // We can just use getDashboardPath directly in the object construction if userRole is available
    // But let's keep state simple
    const [dashboardLink, setDashboardLink] = useState('/dashboard')

    // Define menus based on role
    const getNavItems = () => {
        // Guest Menu
        if (!isLoggedIn || !userRole) {
            return [
                { label: 'Home', href: '/', icon: FaHome },
                { label: 'About', href: '/about', icon: FaInfoCircle },
                { label: 'Gallery', href: '/gallery', icon: FaImages },
                { label: 'Workshops', href: '/workshops', icon: FaChalkboardTeacher },
                { label: 'Login', href: '/login', icon: FaSignInAlt },
            ]
        }

        // Role-Based Menus
        switch (userRole.toLowerCase()) {
            case 'woman':
            case 'women':
                return [
                    { label: 'Home', href: dashboardLink, icon: FaHome },
                    { label: 'Sell', href: '/women/sell', icon: FaStore },       // "Sell"
                    { label: 'My Items', href: '/women/my-products', icon: FaBoxOpen }, // "My Products"
                    { label: 'Orders', href: '/women/orders', icon: FaClipboardList }, // "Orders"
                    { label: 'Profile', href: '/profile', icon: FaUser },
                ]

            case 'girl':
            case 'girls':
                return [
                    { label: 'Home', href: dashboardLink, icon: FaHome },
                    { label: 'Learn', href: '/girls/career', icon: FaGraduationCap }, // Career/Education
                    { label: 'Schemes', href: '/girls/schemes', icon: FaHandHoldingHeart },
                    { label: 'Events', href: '/girls/events', icon: FaCalendarAlt },
                    { label: 'Profile', href: '/profile', icon: FaUser },
                ]

            case 'customer':
                return [
                    { label: 'Home', href: dashboardLink, icon: FaHome },
                    { label: 'Shop', href: '/customer/products', icon: FaShoppingBag }, // "Shop"
                    { label: 'Orders', href: '/customer/orders', icon: FaClipboardList }, // "Orders"
                    { label: 'Cart', href: '/customer/cart', icon: FaShoppingBag }, // Optional: Cart
                    { label: 'Profile', href: '/profile', icon: FaUser },
                ]

            case 'admin':
                return [
                    { label: 'Home', href: dashboardLink, icon: FaHome },
                    { label: 'Users', href: '/admin/users', icon: FaUser },
                    { label: 'Events', href: '/admin/events', icon: FaCalendarAlt },
                    { label: 'Schemes', href: '/admin/schemes', icon: FaHandHoldingHeart },
                    { label: 'Profile', href: '/profile', icon: FaUser },
                ]

            default:
                // Fallback for unknown role
                return [
                    { label: 'Home', href: dashboardLink, icon: FaHome },
                    { label: 'About', href: '/about', icon: FaInfoCircle },
                    { label: 'Workshops', href: '/workshops', icon: FaChalkboardTeacher },
                    { label: 'Profile', href: '/profile', icon: FaUser },
                ]
        }
    }

    const navItems = getNavItems()

    // Guard: If customer has 5 items (Home, Shop, Orders, Cart, Profile) - that fits.
    // Ideally keep to 4-5 items.

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
            <div className="flex justify-around items-center h-14">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && item.href !== dashboardLink && pathname.startsWith(item.href))
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
