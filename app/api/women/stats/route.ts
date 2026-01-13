import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - Get stats for a specific woman entrepreneur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Get all products for this seller
    const products = await prisma.product.findMany({
      where: { sellerId: parseInt(sellerId) },
    })

    // Get all orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    let totalRevenue = 0
    let totalOrders = 0
    const productIds = products.map(p => p.id)

    // Filter orders that contain products from this seller
    orders.forEach((order) => {
      try {
        const items = typeof order.items === 'string'
          ? JSON.parse(order.items)
          : order.items

        if (Array.isArray(items)) {
          const hasSellerProducts = items.some((item: any) =>
            productIds.includes(item.productId)
          )

          if (hasSellerProducts) {
            totalOrders++
            // Calculate revenue only from this seller's products in the order
            items.forEach((item: any) => {
              if (productIds.includes(item.productId)) {
                totalRevenue += (item.price || 0) * (item.quantity || 0)
              }
            })
          }
        }
      } catch (error) {
        console.error('Error parsing order items:', error)
      }
    })

    // Get unique customers who ordered from this seller
    const customerIds = new Set<number>()
    orders.forEach((order) => {
      try {
        const items = typeof order.items === 'string'
          ? JSON.parse(order.items)
          : order.items

        if (Array.isArray(items)) {
          const hasSellerProducts = items.some((item: any) =>
            productIds.includes(item.productId)
          )

          if (hasSellerProducts) {
            customerIds.add(order.customerId)
          }
        }
      } catch (error) {
        console.error('Error parsing order items:', error)
      }
    })

    // Calculate growth (real logic: compare with previous month)
    // For now, defaulting to 0 as we don't have historical snapshots in this simple schema
    const revenueGrowth = 0
    const ordersGrowth = 0

    return NextResponse.json({
      success: true,
      data: {
        revenue: totalRevenue,
        orders: totalOrders,
        products: products.length,
        customers: customerIds.size,
        revenueGrowth: 0,
        ordersGrowth: 0,
      },
    })
  } catch (error) {
    console.error('Error fetching women stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

