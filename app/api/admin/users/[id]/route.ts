import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// PATCH - Verify/Update user
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
        const { verified, role } = body

        const user = await prisma.user.update({
            where: { id },
            data: {
                verified: verified !== undefined ? verified : undefined,
                role: role !== undefined ? role : undefined
            },
            select: {
                id: true,
                name: true,
                verified: true,
                role: true
            }
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

// DELETE - Delete user
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

        await prisma.user.delete({
            where: { id },
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
