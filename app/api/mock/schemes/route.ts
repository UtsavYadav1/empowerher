import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all schemes
export async function GET(request: NextRequest) {
  try {
    const schemes = await prisma.scheme.findMany({
      orderBy: { title: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: schemes,
      count: schemes.length,
    })
  } catch (error) {
    console.error('Error fetching schemes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schemes' },
      { status: 500 }
    )
  }
}

// POST - Create a new scheme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, eligibility, applyUrl, deadline } = body

    if (!title || !description || !eligibility || !applyUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const scheme = await prisma.scheme.create({
      data: {
        title,
        description,
        eligibility,
        applyUrl,
        deadline: deadline ? new Date(deadline) : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: scheme,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating scheme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create scheme' },
      { status: 500 }
    )
  }
}

// PATCH - Update a scheme
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Scheme ID is required' },
        { status: 400 }
      )
    }

    // Convert deadline to Date if provided
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline)
    }

    const scheme = await prisma.scheme.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: scheme,
    })
  } catch (error) {
    console.error('Error updating scheme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update scheme' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a scheme
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Scheme ID is required' },
        { status: 400 }
      )
    }

    await prisma.scheme.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({
      success: true,
      message: 'Scheme deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting scheme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete scheme' },
      { status: 500 }
    )
  }
}

