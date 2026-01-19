import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - Fetch current user profile
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                village: true,
                photoUrl: true,
                verified: true,
                createdAt: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: user,
        })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, name, phone, village, photoUrl } = body

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Check if phone is being changed and if it's already taken
        if (phone) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    phone,
                    NOT: { id: parseInt(userId) }
                }
            })

            if (existingUser) {
                return NextResponse.json(
                    { success: false, error: 'Phone number already in use' },
                    { status: 400 }
                )
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                name,
                phone,
                village,
                photoUrl
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                village: true,
                photoUrl: true,
                verified: true,
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully'
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
