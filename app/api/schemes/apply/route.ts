import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { schemeId, userId } = body

        if (!schemeId || !userId) {
            return NextResponse.json(
                { success: false, error: 'Scheme ID and User ID are required' },
                { status: 400 }
            )
        }

        const application = await prisma.userScheme.upsert({
            where: {
                userId_schemeId: {
                    userId: parseInt(userId),
                    schemeId: parseInt(schemeId)
                }
            },
            update: {}, // Already exists, do nothing
            create: {
                userId: parseInt(userId),
                schemeId: parseInt(schemeId),
                status: 'applied'
            }
        })

        return NextResponse.json({
            success: true,
            data: application,
            message: 'Application submitted successfully'
        })
    } catch (error) {
        console.error('Error applying for scheme:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to apply for scheme' },
            { status: 500 }
        )
    }
}
