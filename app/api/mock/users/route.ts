import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const village = searchParams.get('village')
    const verified = searchParams.get('verified')

    const where: any = {}
    if (role) where.role = role
    if (village) where.village = village
    if (verified !== null) where.verified = verified === 'true'

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        village: true,
        verified: true,
        createdAt: true,
        // Don't return password
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, password, role, village, verified } = body

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, phone, password)' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password,
        role: role || null,
        village: village || null,
        verified: verified ?? false,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        village: true,
        verified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PATCH - Update a user
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Convert verified to boolean if provided
    if (updateData.verified !== undefined) {
      updateData.verified = updateData.verified === true || updateData.verified === 'true'
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        village: true,
        verified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// PUT - Update a user (same as PATCH)
export async function PUT(request: NextRequest) {
  return PATCH(request)
}

// DELETE - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

