import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const searchParams = request.nextUrl.searchParams
        const userIdQuery = searchParams.get('userId')
        const userId = userIdQuery ? parseInt(userIdQuery) : undefined

        const tutorial = await prisma.tutorial.findUnique({
            where: { id },
            include: {
                progress: userId ? {
                    where: { userId }
                } : false
            }
        })

        if (!tutorial) {
            return NextResponse.json(
                { success: false, error: 'Tutorial not found' },
                { status: 404 }
            )
        }

        const progress = tutorial.progress?.[0]

        return NextResponse.json({
            success: true,
            data: {
                ...tutorial,
                // Add computed fields for the UI
                isCompleted: progress?.watched || false,
                lastAccessed: progress?.updatedAt || null,
                userProgress: progress?.watched ? 100 : (progress ? 45 : 0)
            }
        })
    } catch (error) {
        console.error('Error fetching tutorial:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tutorial' },
            { status: 500 }
        )
    }
}
