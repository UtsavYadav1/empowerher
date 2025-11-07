import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get unique villages count from users
    const villages = await prisma.user.findMany({
      where: {
        village: {
          not: null,
        },
      },
      select: {
        village: true,
      },
      distinct: ['village'],
    })

    // Get workshops count
    const workshopsCount = await prisma.workshop.count()

    // Get users count (women and girls)
    const usersCount = await prisma.user.count({
      where: {
        OR: [
          { role: 'woman' },
          { role: 'girl' },
        ],
      },
    })

    // Get products count
    const productsCount = await prisma.product.count()

    // Get recent workshops with village
    const recentWorkshops = await prisma.workshop.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        village: true,
        date: true,
      },
    })

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      take: 5,
      where: {
        OR: [
          { role: 'woman' },
          { role: 'girl' },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        village: true,
        role: true,
        createdAt: true,
      },
    })

    // Get villages with user counts
    const villageStats = await prisma.user.groupBy({
      by: ['village'],
      where: {
        village: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get workshop participation stats
    const workshopStats = await prisma.workshop.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        village: true,
        date: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          villages: villages.length,
          workshops: workshopsCount,
          users: usersCount,
          products: productsCount,
        },
        recentActivities: {
          workshops: recentWorkshops,
          users: recentUsers,
        },
        villageStats: villageStats.map(v => ({
          village: v.village,
          userCount: v._count.id,
        })),
        workshopStats,
      },
    })
  } catch (error) {
    console.error('Error fetching field agent stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch field agent stats' },
      { status: 500 }
    )
  }
}
