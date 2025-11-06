import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// POST - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, password, village } = body

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, phone, password)' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findFirst({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 409 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password, // In production, hash this password
        village: village || null,
        role: null,
        verified: false,
      },
      select: {
        id: true,
        name: true,
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
    }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    )
  }
}

