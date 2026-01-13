import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workshopId, userId } = body

    if (!workshopId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing workshopId or userId' },
        { status: 400 }
      )
    }

    // Check if workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id: parseInt(workshopId) },
    })

    if (!workshop) {
      return NextResponse.json(
        { success: false, error: 'Workshop not found' },
        { status: 404 }
      )
    }

    // Check if already registered
    const existing = await prisma.workshopRegistration.findFirst({
      where: {
        workshopId: parseInt(workshopId),
        userId: parseInt(userId),
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already registered' },
        { status: 400 }
      )
    }

    // Register
    const registration = await prisma.workshopRegistration.create({
      data: {
        workshopId: parseInt(workshopId),
        userId: parseInt(userId),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        registrationId: registration.id,
        workshopTitle: workshop.title,
      },
    })
  } catch (error) {
    console.error('Error registering for workshop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register' },
      { status: 500 }
    )
  }
}
