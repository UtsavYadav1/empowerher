import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tutorialId, userId, watched } = body

        if (!tutorialId || !userId) {
            return NextResponse.json(
                { success: false, error: 'Tutorial ID and User ID are required' },
                { status: 400 }
            )
        }

        // Upsert to ensure record exists. Update watched if provided.
        const progress = await prisma.tutorialProgress.upsert({
            where: {
                tutorialId_userId: {
                    tutorialId: parseInt(tutorialId),
                    userId: parseInt(userId)
                }
            },
            update: {
                updatedAt: new Date(),
                watched: watched !== undefined ? watched : undefined
            },
            create: {
                tutorialId: parseInt(tutorialId),
                userId: parseInt(userId),
                watched: watched || false
            }
        })

        return NextResponse.json({
            success: true,
            data: progress,
            message: 'Enrolled in tutorial successfully'
        })
    } catch (error) {
        console.error('Error enrolling in tutorial:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to enroll' },
            { status: 500 }
        )
    }
}
