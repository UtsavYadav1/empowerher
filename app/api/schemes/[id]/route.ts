import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - Fetch single scheme
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

        const scheme = await prisma.scheme.findUnique({
            where: { id },
        })

        if (!scheme) {
            return NextResponse.json(
                { success: false, error: 'Scheme not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: scheme,
        })
    } catch (error) {
        console.error('Error fetching scheme:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch scheme' },
            { status: 500 }
        )
    }
}

// PATCH - Update scheme details
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
        const { title, description, eligibility, applyUrl, deadline } = body

        const scheme = await prisma.scheme.update({
            where: { id },
            data: {
                title,
                description,
                eligibility,
                applyUrl,
                deadline: deadline ? new Date(deadline) : undefined,
            },
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

// DELETE - Delete scheme
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

        await prisma.scheme.delete({
            where: { id },
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
