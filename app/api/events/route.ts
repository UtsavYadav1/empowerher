import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const where: any = {}
    if (type) where.type = type
    if (category) where.category = category

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, type, category } = body

    if (!title || !date || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || '',
        date: new Date(date),
        type,
        category: category || 'general',
        reminderSet: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: newEvent,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// PATCH - Set reminder for event
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, reminderSet } = body

    if (eventId === undefined || reminderSet === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const event = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: { reminderSet },
    })

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    )
  }
}


