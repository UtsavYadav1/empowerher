import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// In-memory storage for workshop registrations (in a real app, this would be a database table)
// For now, we'll use a mock approach since we don't have a WorkshopRegistration model
const workshopRegistrations = new Map<string, Set<number>>()

// POST - Register for a workshop
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workshopId, userId, name, phone, email } = body

    if (!workshopId) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID is required' },
        { status: 400 }
      )
    }

    // Get workshop details from database
    const workshop = await prisma.workshop.findUnique({
      where: { id: parseInt(workshopId) },
    })

    if (!workshop) {
      return NextResponse.json(
        { success: false, error: 'Workshop not found' },
        { status: 404 }
      )
    }

    // Check if user is already registered
    const registrationKey = `workshop-${workshopId}`
    const registeredUsers = workshopRegistrations.get(registrationKey) || new Set<number>()
    
    // Use userId if provided, otherwise generate a temporary ID based on phone
    const userIdentifier = userId || (phone ? parseInt(phone.replace(/\D/g, '').slice(-8)) : Date.now())
    
    if (registeredUsers.has(userIdentifier)) {
      return NextResponse.json(
        { success: false, error: 'You are already registered for this workshop' },
        { status: 409 }
      )
    }

    // Add registration
    registeredUsers.add(userIdentifier)
    workshopRegistrations.set(registrationKey, registeredUsers)

    // In a real app, you would save this to a WorkshopRegistration table:
    // await prisma.workshopRegistration.create({
    //   data: {
    //     workshopId: parseInt(workshopId),
    //     userId: userId || null,
    //     name,
    //     phone,
    //     email,
    //     registeredAt: new Date(),
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for the workshop!',
      data: {
        workshopId: parseInt(workshopId),
        workshopTitle: workshop.title,
        registrationId: `REG-${Date.now()}-${workshopId}`,
        registeredAt: new Date().toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error registering for workshop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register for workshop' },
      { status: 500 }
    )
  }
}

// GET - Check if user is registered for a workshop
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workshopId = searchParams.get('workshopId')
    const userId = searchParams.get('userId')
    const phone = searchParams.get('phone')

    if (!workshopId) {
      return NextResponse.json(
        { success: false, error: 'Workshop ID is required' },
        { status: 400 }
      )
    }

    const registrationKey = `workshop-${workshopId}`
    const registeredUsers = workshopRegistrations.get(registrationKey) || new Set<number>()
    
    let userIdentifier: number | null = null
    if (userId) {
      userIdentifier = parseInt(userId)
    } else if (phone) {
      userIdentifier = parseInt(phone.replace(/\D/g, '').slice(-8))
    }

    const isRegistered = userIdentifier ? registeredUsers.has(userIdentifier) : false

    return NextResponse.json({
      success: true,
      data: {
        isRegistered,
        registeredCount: registeredUsers.size,
      },
    })
  } catch (error) {
    console.error('Error checking workshop registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check registration status' },
      { status: 500 }
    )
  }
}

