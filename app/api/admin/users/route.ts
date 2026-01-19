import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all users
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const role = searchParams.get('role')

        const where: any = {}
        if (role && role !== 'all') {
            where.role = role
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                village: true,
                verified: true,
                createdAt: true,
            }
        })

        return NextResponse.json({
            success: true,
            data: users,
            count: users.length,
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}
