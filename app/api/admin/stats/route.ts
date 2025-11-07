import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get real data from database
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalSchemes,
      usersByRole,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.scheme.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          village: true,
          verified: true,
          createdAt: true,
        },
      }),
    ])

    // Calculate revenue from orders
    const orders = await prisma.order.findMany({
      select: { total: true },
    })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get products by category
    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      _count: true,
    })

    // Get orders trend by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const ordersByMonth = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: true,
      _sum: {
        total: true,
      },
    })

    // Process monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthOrders = ordersByMonth.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear()
      })

      const usersInMonth = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(date.getFullYear(), date.getMonth(), 1),
            lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
          },
        },
      })

      monthlyData.push({
        month: months[date.getMonth()],
        users: usersInMonth,
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, o) => sum + (o._sum.total || 0), 0),
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalSchemes,
          totalRevenue: Math.round(totalRevenue),
        },
        usersByRole: usersByRole.map(r => ({
          role: r.role,
          count: r._count,
        })),
        productsByCategory: productsByCategory.map(p => ({
          category: p.category,
          count: p._count,
        })),
        monthlyData,
        recentActivity: recentActivity.map(u => ({
          id: u.id,
          name: u.name,
          phone: u.phone,
          role: u.role,
          village: u.village,
          verified: u.verified,
          createdAt: u.createdAt.toISOString(),
        })),
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
