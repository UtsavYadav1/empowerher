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
    const userId = searchParams.get('userId') // Optional: to check if reminder is set for this user

    const where: any = {}
    if (type) where.type = type
    if (category) where.category = category

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      include: {
        reminders: userId ? {
          where: { userId: parseInt(userId) }
        } : false
      }
    })

    // Map events to include reminderSet based on user specific data
    const enhancedEvents = events.map((event: any) => ({
      ...event,
      reminderSet: userId ? event.reminders.length > 0 : false, // True if user has a reminder set
      reminders: undefined // Remove internal relation data from response
    }))

    return NextResponse.json({
      success: true,
      data: enhancedEvents,
      count: enhancedEvents.length,
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
        // reminderSet removed - global state deprecated
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

// PATCH - Set reminder for event (User Specific)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, reminderSet, userId } = body

    if (!eventId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Event ID and User ID are required' },
        { status: 400 }
      )
    }

    if (reminderSet) {
      // Create reminder
      await prisma.eventReminder.upsert({
        where: {
          eventId_userId: {
            eventId: parseInt(eventId),
            userId: parseInt(userId)
          }
        },
        create: {
          eventId: parseInt(eventId),
          userId: parseInt(userId)
        },
        update: {}
      })
    } else {
      // Remove reminder
      try {
        await prisma.eventReminder.delete({
          where: {
            eventId_userId: {
              eventId: parseInt(eventId),
              userId: parseInt(userId)
            }
          }
        })
      } catch (e) {
        // Ignore if already deleted
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder updated successfully'
    })
  } catch (error) {
    console.error('Error updating event reminder:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update reminder' },
      { status: 500 }
    )
  }
}


