import { NextRequest, NextResponse } from 'next/server'

// Mock events data
let events = [
  {
    id: 1,
    title: 'Scholarship Application Deadline',
    description: 'Beti Bachao Beti Padhao Scholarship deadline approaching',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'scholarship',
    category: 'education',
    reminderSet: false,
  },
  {
    id: 2,
    title: 'Digital Literacy Workshop',
    description: 'Learn basic computer skills and internet usage',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'workshop',
    category: 'skills',
    reminderSet: false,
  },
  {
    id: 3,
    title: 'Career Guidance Session',
    description: 'One-on-one career counseling session',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'session',
    category: 'career',
    reminderSet: false,
  },
]

// GET - List all events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    let filteredEvents = events
    if (type) filteredEvents = filteredEvents.filter(e => e.type === type)
    if (category) filteredEvents = filteredEvents.filter(e => e.category === category)

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      count: filteredEvents.length,
    })
  } catch (error) {
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

    const newEvent = {
      id: events.length + 1,
      title,
      description: description || '',
      date,
      type,
      category: category || 'general',
      reminderSet: false,
    }

    events.push(newEvent)

    return NextResponse.json({
      success: true,
      data: newEvent,
    }, { status: 201 })
  } catch (error) {
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

    const event = events.find(e => e.id === parseInt(eventId))
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    event.reminderSet = reminderSet

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

