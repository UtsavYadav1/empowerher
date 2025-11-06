'use client'

export interface User {
  id: number
  name: string
  phone: string
  role: string | null
  village: string | null
  verified: boolean
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// Get token from localStorage
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

// Set token in localStorage
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

// Remove token from localStorage
export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Set current user in localStorage
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getToken()
  return token !== null && token !== ''
}

// Check if user has a role
export function hasRole(): boolean {
  const user = getCurrentUser()
  return user !== null && user.role !== null && user.role !== ''
}

// Get user role
export function getUserRole(): string | null {
  const user = getCurrentUser()
  return user?.role || null
}

// Logout user
export function logout(): void {
  removeToken()
}

// Check auth and get user (for API calls)
export async function checkAuth(): Promise<{ user: User | null; isAuthenticated: boolean }> {
  const token = getToken()
  const user = getCurrentUser()

  if (!token || !user) {
    return { user: null, isAuthenticated: false }
  }

  // In a real app, you'd validate the token with the server
  // For now, we'll just check if it exists in localStorage
  return { user, isAuthenticated: true }
}

// Get dashboard path based on role
export function getDashboardPath(role: string | null): string {
  if (!role) return '/role-select'

  const roleMap: Record<string, string> = {
    girl: '/girls/dashboard',
    woman: '/women/dashboard',
    customer: '/customer/dashboard',
    admin: '/admin/dashboard',
    fieldagent: '/fieldagent/dashboard',
  }

  return roleMap[role.toLowerCase()] || '/role-select'
}

