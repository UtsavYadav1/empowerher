import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        // Force dynamic usage (important trick)
        const { searchParams } = new URL(req.url)

        const [
            usersCount,
            productsCount,
            workshopsCount,
            eventsCount,
            postsCount,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.workshop.count(),
            prisma.event.count(),
            prisma.forumPost.count(),
        ])

        return NextResponse.json({
            success: true,
            data: {
                womenEmpowered: await prisma.user.count({ where: { role: 'woman' } }),
                girlsEducated: await prisma.user.count({ where: { role: 'girl' } }),
                workshops: workshopsCount + eventsCount,
                communities: postsCount,
            },
        })
    } catch (error) {
        console.error('Error fetching impact stats:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch impact stats' },
            { status: 500 }
        )
    }
}