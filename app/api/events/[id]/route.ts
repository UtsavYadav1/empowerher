import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - Fetch single event
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid ID' },
                { status: 400 }
            )
        }

        const event = await prisma.event.findUnique({
            where: { id },
        })

        if (!event) {
            return NextResponse.json(
                { success: false, error: 'Event not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: event,
        })
    } catch (error) {
        console.error('Error fetching event:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event' },
            { status: 500 }
        )
    }
}

// PATCH - Update event details
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid ID' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { title, description, date, type, category, location, registrationDeadline, organizer, applyUrl, eligibility, benefits } = body

        const event = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                date: date ? new Date(date) : undefined,
                type,
                category,
                location,
                registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
                organizer,
                applyUrl,
                eligibility,
                benefits
            },
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

// DELETE - Delete event
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid ID' },
                { status: 400 }
            )
        }

        await prisma.event.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete event' },
            { status: 500 }
        )
    }
}
