import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// POST - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, village, role } = body

    // Validate required fields
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, phone, password)' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await prisma.user.findFirst({
      where: { phone },
    })

    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 409 }
      )
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email },
      })

      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 }
        )
      }
    }

    // Validate role if provided
    const validRoles = ['girl', 'woman', 'customer']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone,
        password, // In production, hash this password with bcrypt
        village: village || null,
        role: role || null,
        verified: true, // Auto-verified as per user request (removed dummy verification)
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        village: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Registration successful! Please login to continue.',
    }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    )
  }
}


