import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all workshops
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const village = searchParams.get('village')
    const id = searchParams.get('id')

    const where: any = {}
    if (village) where.village = village
    if (id) where.id = parseInt(id)

    const workshops = await prisma.workshop.findMany({
      where,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: workshops,
      count: workshops.length,
    })
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workshops' },
      { status: 500 }
    )
  }
}

// POST - Create a new workshop
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, village, date, description, instructor, category, capacity, fee, status, location } = body

    if (!title || !date || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const workshop = await prisma.workshop.create({
      data: {
        title,
        village: village || location || 'Online', // Fallback or merge
        date: new Date(date),
        description,
        instructor: instructor || 'TBD',
        category: category || 'General',
        capacity: capacity ? parseInt(capacity) : 30,
        fee: fee ? parseFloat(fee) : 0,
        status: status || 'upcoming',
      },
    })

    return NextResponse.json({
      success: true,
      data: workshop,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating workshop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create workshop' },
      { status: 500 }
    )
  }
}

// PATCH - Update a workshop
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID is required' },
        { status: 400 }
      )
    }

    // Convert date to Date if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date)
    }

    const workshop = await prisma.workshop.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: workshop,
    })
  } catch (error) {
    console.error('Error updating workshop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update workshop' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a workshop
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID is required' },
        { status: 400 }
      )
    }

    await prisma.workshop.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({
      success: true,
      message: 'Workshop deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting workshop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete workshop' },
      { status: 500 }
    )
  }
}


