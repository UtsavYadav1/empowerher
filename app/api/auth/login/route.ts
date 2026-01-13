import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { createSession } from '@/lib/auth-sessions'

const prisma = new PrismaClient()

// POST - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, email, password } = body

    // Check if at least one identifier (phone or email) and password are provided
    if ((!phone && !email) || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Phone and password are required' },
        { status: 400 }
      )
    }

    // Find user by phone or email
    const user = await prisma.user.findFirst({
      where: email ? { email } : { phone },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt to compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate session token
    const token = uuidv4()

    // Store session
    createSession(user.id, token)

    // Return user data (excluding password) and token
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          village: user.village,
          verified: user.verified,
        },
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
}


